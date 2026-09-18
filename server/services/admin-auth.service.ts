import crypto from "crypto";
import bcrypt from "bcryptjs";
import { findAdminByEmail, findAdminById, updateAdminLastLogin } from "@/server/repositories/admin.repository";
import { checkRateLimit, isRateLimited } from "@/lib/security/rate-limit";
import type { AdminUser } from "@prisma/client";

export const ADMIN_COOKIE_NAME = "fs_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60; // 8 hours

export interface AdminSessionPayload {
  adminId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface AdminAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  error?: "UNAUTHORIZED" | "FORBIDDEN" | "RATE_LIMITED";
  message?: string;
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_API_KEY ||
    "frontier-systems-admin-session-secure-key-2026"
  );
}

/**
 * Sign session data using HMAC-SHA256.
 */
export function signSessionToken(payload: AdminSessionPayload): string {
  const secret = getSessionSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const data = `${header}.${body}`;
  const signature = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verify and parse session token.
 */
export function verifySessionToken(token: string): AdminSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    if (!header || !body || !signature) return null;

    const secret = getSessionSecret();
    const data = `${header}.${body}`;
    const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("base64url");

    const bufExpected = Buffer.from(expectedSig);
    const bufActual = Buffer.from(signature);

    if (bufExpected.length !== bufActual.length) return null;
    if (!crypto.timingSafeEqual(bufExpected, bufActual)) return null;

    const payload: AdminSessionPayload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf-8"),
    );

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
 * Authenticate admin credentials with bcrypt and rate limiting.
 */
export async function authenticateAdminCredentials(
  email: string,
  passwordPlain: string,
  clientIp: string,
): Promise<{ user: AdminUser; token: string } | null> {
  // Check rate limit on failed login attempts
  if (isRateLimited("admin_login_ip", clientIp, { limit: 5, windowMs: 15 * 60 * 1000 })) {
    return null;
  }

  const admin = await findAdminByEmail(email);
  if (!admin) {
    checkRateLimit("admin_login_ip", clientIp, { limit: 5, windowMs: 15 * 60 * 1000 });
    return null;
  }

  const passwordMatches = bcrypt.compareSync(passwordPlain, admin.passwordHash);
  if (!passwordMatches) {
    checkRateLimit("admin_login_ip", clientIp, { limit: 5, windowMs: 15 * 60 * 1000 });
    return null;
  }

  // Update last login timestamp
  await updateAdminLastLogin(admin.id);

  // Generate signed session token
  const now = Math.floor(Date.now() / 1000);
  const sessionPayload: AdminSessionPayload = {
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };

  const token = signSessionToken(sessionPayload);
  return { user: admin, token };
}

/**
 * Validate incoming request for Admin API and Admin routes.
 * Checks session cookie or Authorization Bearer header.
 */
export async function verifyAdminRequest(
  cookieToken?: string | null,
  headerToken?: string | null,
): Promise<AdminAuthResult> {
  let token = cookieToken;

  if (!token && headerToken) {
    if (headerToken.startsWith("Bearer ")) {
      token = headerToken.substring(7).trim();
    } else {
      token = headerToken.trim();
    }
  }

  if (!token) {
    return { success: false, error: "UNAUTHORIZED", message: "Missing session or admin token" };
  }

  // First verify if it's a signed session token
  const session = verifySessionToken(token);
  if (session) {
    const admin = await findAdminById(session.adminId);
    if (!admin) {
      return { success: false, error: "UNAUTHORIZED", message: "Admin account no longer exists" };
    }
    return {
      success: true,
      user: {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
    };
  }

  // Alternatively check if it's the ADMIN_API_KEY (backward compatibility for system automation)
  const systemKey = process.env.ADMIN_API_KEY || "frontier-admin-secret-key";
  if (token.length === systemKey.length && crypto.timingSafeEqual(Buffer.from(token), Buffer.from(systemKey))) {
    return {
      success: true,
      user: {
        id: "admin-system",
        email: "admin@frontiersystems.co",
        role: "SUPERADMIN",
      },
    };
  }

  return { success: false, error: "UNAUTHORIZED", message: "Invalid or expired session" };
}
