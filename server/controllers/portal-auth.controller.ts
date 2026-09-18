import { NextRequest } from "next/server";
import { z } from "zod";
import {
  requestCustomerMagicLink,
  verifyCustomerMagicLink,
  verifyCustomerRequest,
  CUSTOMER_COOKIE_NAME,
} from "@/server/services/portal-auth.service";
import { getClientIp } from "@/lib/security/ip";
import { jsonSuccess, jsonError } from "@/types/api";

const requestLinkSchema = z.object({
  email: z.string().trim().email("Please provide a valid email address"),
});

const verifyLinkSchema = z.object({
  token: z.string().trim().min(10, "Invalid token format"),
});

/**
 * POST /api/portal/auth/request-link
 * Initiates magic link login. Never reveals whether email exists.
 */
export async function handleRequestMagicLink(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = requestLinkSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return jsonError("VALIDATION_ERROR", "Invalid email address format", 422, {
        issues: parseResult.error.issues,
      });
    }

    const { email } = parseResult.data;
    const clientIp = getClientIp(request);

    const result = await requestCustomerMagicLink(email, clientIp);

    if (result.rateLimited) {
      return jsonError(
        "RATE_LIMITED",
        `Too many requests. Please retry in ${result.retryAfterSeconds || 60} seconds.`,
        429,
      );
    }

    return jsonSuccess(
      {
        message: "If an active account exists for this email, a sign-in link has been dispatched.",
      },
      200,
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal authentication error";
    return jsonError("INTERNAL_ERROR", msg, 500);
  }
}

/**
 * POST /api/portal/auth/verify
 * Verifies magic link token and sets customer session cookie.
 */
export async function handleVerifyMagicLink(request: NextRequest) {
  try {
    let token = request.nextUrl.searchParams.get("token");

    if (!token && request.method === "POST") {
      const rawBody = await request.json().catch(() => ({}));
      const parseResult = verifyLinkSchema.safeParse(rawBody);
      if (parseResult.success) {
        token = parseResult.data.token;
      }
    }

    if (!token) {
      return jsonError("VALIDATION_ERROR", "Missing authentication token", 422);
    }

    const clientIp = getClientIp(request);
    const result = await verifyCustomerMagicLink(token, clientIp);

    if (!result.success || !result.sessionToken) {
      const status = result.error === "RATE_LIMITED" ? 429 : 401;
      return jsonError(result.error || "UNAUTHORIZED", result.message || "Invalid or expired link", status);
    }

    const response = jsonSuccess(
      {
        customer: result.customer,
        message: "Authentication successful",
      },
      200,
    );

    // Set secure customer session cookie (separate namespace from admin)
    response.cookies.set({
      name: CUSTOMER_COOKIE_NAME,
      value: result.sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal verification error";
    return jsonError("INTERNAL_ERROR", msg, 500);
  }
}

/**
 * POST /api/portal/auth/logout
 * Clears customer session cookie.
 */
export async function handleCustomerLogout(_request: NextRequest) {
  const response = jsonSuccess({ message: "Logged out successfully" }, 200);
  response.cookies.set({
    name: CUSTOMER_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

/**
 * GET /api/portal/auth/me
 * Retrieves current authenticated customer profile.
 */
export async function handleCustomerMe(request: NextRequest) {
  const cookie = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  const header = request.headers.get("authorization");

  const verification = await verifyCustomerRequest(cookie, header);

  if (!verification.success || !verification.customer) {
    return jsonError("UNAUTHORIZED", "Customer authorization required", 401);
  }

  return jsonSuccess({ customer: verification.customer }, 200);
}
