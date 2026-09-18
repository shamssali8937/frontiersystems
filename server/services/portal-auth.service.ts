import crypto from "crypto";
import { findCustomerByEmail, updateCustomer } from "@/server/repositories/customer.repository";
import {
  createMagicLinkToken,
  findMagicLinkTokenByHash,
  markMagicLinkTokenUsed,
} from "@/server/repositories/magic-link.repository";
import { sendMagicLinkEmail } from "@/server/services/email.service";
import { checkRateLimitAsync, RateLimitPolicies } from "@/lib/security/rate-limit";
import { logger } from "@/lib/logger";

export const CUSTOMER_COOKIE_NAME = "fs_customer_session";
const SESSION_TTL_SECONDS = 24 * 60 * 60; // 24 hours
const MAGIC_LINK_TTL_MINUTES = 15;

export interface CustomerSessionPayload {
  customerId: string;
  email: string;
  name: string;
  companyName?: string | null;
  type: "customer";
  iat: number;
  exp: number;
}

export interface CustomerAuthResult {
  success: boolean;
  customer?: {
    id: string;
    email: string;
    name: string;
    companyName: string | null;
  };
  error?: "UNAUTHORIZED" | "RATE_LIMITED" | "EXPIRED" | "REUSED" | "INVALID";
  message?: string;
}

function getCustomerSessionSecret(): string {
  return (
    process.env.CUSTOMER_SESSION_SECRET ||
    process.env.ADMIN_SESSION_SECRET ||
    "fs-customer-portal-secure-hmac-secret-key-2026"
  );
}

/**
 * Signs customer session token using HMAC-SHA256.
 */
export function signCustomerSession(payload: CustomerSessionPayload): string {
  const secret = getCustomerSessionSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = `${header}.${body}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Cryptographically verifies and extracts a customer session token.
 */
export function verifyCustomerSessionToken(token: string): CustomerSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    if (!header || !body || !signature) return null;

    const secret = getCustomerSessionSecret();
    const data = `${header}.${body}`;
    const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("base64url");

    const bufExpected = Buffer.from(expectedSig);
    const bufActual = Buffer.from(signature);

    if (bufExpected.length !== bufActual.length) return null;
    if (!crypto.timingSafeEqual(bufExpected, bufActual)) return null;

    const payload: CustomerSessionPayload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf-8"),
    );

    // Strict namespace guard: Reject admin tokens disguised as customer session
    if (payload.type !== "customer" || !payload.customerId) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Handles passwordless magic link request.
 *
 * Security requirements:
 * 1. Rate limited per IP (10 per 15 min).
 * 2. Rate limited per email (3 per 15 min).
 * 3. Constant response: Identical message whether email exists or not (zero enumeration).
 * 4. Token is 32-byte cryptographically secure random string; stored as SHA-256 hash.
 */
export async function requestCustomerMagicLink(
  emailInput: string,
  clientIp: string,
): Promise<{ success: boolean; rateLimited?: boolean; retryAfterSeconds?: number }> {
  const normalizedEmail = emailInput.trim().toLowerCase();

  // 1. IP rate limiting
  const ipLimit = await checkRateLimitAsync(
    "portal_req_ip",
    clientIp,
    RateLimitPolicies.PORTAL_MAGIC_LINK_IP,
  );
  if (!ipLimit.allowed) {
    return { success: false, rateLimited: true, retryAfterSeconds: ipLimit.retryAfterSeconds };
  }

  // 2. Email rate limiting
  const emailLimit = await checkRateLimitAsync(
    "portal_req_email",
    normalizedEmail,
    RateLimitPolicies.PORTAL_MAGIC_LINK_EMAIL,
  );
  if (!emailLimit.allowed) {
    return { success: false, rateLimited: true, retryAfterSeconds: emailLimit.retryAfterSeconds };
  }

  // 3. Customer existence check
  const customer = await findCustomerByEmail(normalizedEmail);

  if (customer) {
    // Generate secure random raw token (32 bytes = 64 hex chars)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    const expiresAt = new Date(Date.now() + MAGIC_LINK_TTL_MINUTES * 60 * 1000);

    await createMagicLinkToken({
      customerId: customer.id,
      tokenHash,
      expiresAt,
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const verifyUrl = `${siteUrl}/portal/verify?token=${rawToken}`;

    await sendMagicLinkEmail({
      email: customer.email,
      clientName: customer.name,
      verifyUrl,
      expiresInMinutes: MAGIC_LINK_TTL_MINUTES,
    });

    logger.info("Customer portal magic link issued", {
      customerId: customer.id,
      expiresAt: expiresAt.toISOString(),
    });
  } else {
    // Intentional silent no-op to prevent email enumeration
    logger.info("Customer portal magic link requested for unmapped email", {
      emailHash: crypto.createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 10),
    });
  }

  // Identical return value regardless of customer existence
  return { success: true };
}

/**
 * Verifies magic link token, marks it used, and creates session.
 *
 * Security controls:
 * 1. Rate limited per IP (10 verify attempts per 15 min).
 * 2. Compares SHA-256 hash in database.
 * 3. Rejects expired tokens.
 * 4. Rejects already used tokens (single-use invariant).
 * 5. Updates `lastLoginAt` and sets `usedAt = now()`.
 */
export async function verifyCustomerMagicLink(
  rawToken: string,
  clientIp: string,
): Promise<CustomerAuthResult & { sessionToken?: string }> {
  if (!rawToken || typeof rawToken !== "string") {
    return { success: false, error: "INVALID", message: "Missing or invalid token format" };
  }

  // 1. IP rate limiting on verification endpoint
  const rateLimit = await checkRateLimitAsync(
    "portal_verify_ip",
    clientIp,
    RateLimitPolicies.PORTAL_VERIFY,
  );
  if (!rateLimit.allowed) {
    return {
      success: false,
      error: "RATE_LIMITED",
      message: `Too many verification attempts. Please retry after ${rateLimit.retryAfterSeconds} seconds.`,
    };
  }

  const tokenHash = crypto.createHash("sha256").update(rawToken.trim()).digest("hex");
  const tokenRecord = await findMagicLinkTokenByHash(tokenHash);

  if (!tokenRecord) {
    return { success: false, error: "INVALID", message: "Invalid or unrecognized sign-in link" };
  }

  // 2. Single-use enforcement
  if (tokenRecord.usedAt !== null) {
    logger.warn("Attempt to reuse consumed magic link token", {
      tokenId: tokenRecord.id,
      customerId: tokenRecord.customerId,
    });
    return {
      success: false,
      error: "REUSED",
      message: "This sign-in link has already been used. Please request a new one.",
    };
  }

  // 3. Expiration enforcement
  const now = new Date();
  if (tokenRecord.expiresAt < now) {
    logger.warn("Attempt to use expired magic link token", {
      tokenId: tokenRecord.id,
      customerId: tokenRecord.customerId,
      expiredAt: tokenRecord.expiresAt.toISOString(),
    });
    return {
      success: false,
      error: "EXPIRED",
      message: "This sign-in link has expired. Sign-in links are valid for 15 minutes.",
    };
  }

  // 4. Mark token used and update customer login timestamp
  await Promise.all([
    markMagicLinkTokenUsed(tokenRecord.id),
    updateCustomer(tokenRecord.customerId, { lastLoginAt: now }),
  ]);

  // 5. Generate signed customer session JWT
  const nowSec = Math.floor(now.getTime() / 1000);
  const sessionPayload: CustomerSessionPayload = {
    customerId: tokenRecord.customer.id,
    email: tokenRecord.customer.email,
    name: tokenRecord.customer.name,
    companyName: tokenRecord.customer.companyName,
    type: "customer",
    iat: nowSec,
    exp: nowSec + SESSION_TTL_SECONDS,
  };

  const sessionToken = signCustomerSession(sessionPayload);

  logger.info("Customer successfully authenticated via magic link", {
    customerId: tokenRecord.customer.id,
  });

  return {
    success: true,
    customer: {
      id: tokenRecord.customer.id,
      email: tokenRecord.customer.email,
      name: tokenRecord.customer.name,
      companyName: tokenRecord.customer.companyName,
    },
    sessionToken,
  };
}

/**
 * Validates incoming Customer Portal session request.
 */
export async function verifyCustomerRequest(
  cookieToken?: string | null,
  headerToken?: string | null,
): Promise<CustomerAuthResult> {
  let token = cookieToken;

  if (!token && headerToken) {
    if (headerToken.startsWith("Bearer ")) {
      token = headerToken.substring(7).trim();
    } else {
      token = headerToken.trim();
    }
  }

  if (!token) {
    return { success: false, error: "UNAUTHORIZED", message: "No customer session active" };
  }

  const payload = verifyCustomerSessionToken(token);
  if (!payload) {
    return { success: false, error: "UNAUTHORIZED", message: "Invalid or expired session" };
  }

  return {
    success: true,
    customer: {
      id: payload.customerId,
      email: payload.email,
      name: payload.name,
      companyName: payload.companyName || null,
    },
  };
}
