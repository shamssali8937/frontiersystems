import type { NextRequest } from "next/server";
import crypto from "crypto";
import { checkRateLimit, isRateLimited } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/ip";
import type { AuthenticatedUser, Role } from "./authorization";

export type AdminUser = AuthenticatedUser;

export interface AuthResult {
  authenticated: boolean;
  user?: AdminUser;
  error?: "UNAUTHORIZED" | "FORBIDDEN" | "RATE_LIMITED";
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf-8");
  const bufB = Buffer.from(b, "utf-8");

  if (bufA.length !== bufB.length) {
    // Run comparison on identical buffers to maintain constant execution duration
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }

  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates admin authentication from headers.
 * Never trusts client user ID or client role.
 * Protected by constant-time verification and brute-force rate-limiting.
 */
export function authenticateAdmin(request: NextRequest): AuthResult {
  const clientIp = getClientIp(request);

  // 1. Check if client IP is currently locked due to prior consecutive failures
  if (isRateLimited("admin_auth_failed", clientIp, { limit: 5, windowMs: 15 * 60 * 1000 })) {
    return { authenticated: false, error: "RATE_LIMITED" };
  }

  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-admin-key");

  let token: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.substring(7).trim();
  } else if (apiKeyHeader) {
    token = apiKeyHeader.trim();
  }

  if (!token) {
    return { authenticated: false, error: "UNAUTHORIZED" };
  }

  const expectedKey = process.env.ADMIN_API_KEY || "frontier-admin-secret-key";

  // Production check: disallow default insecure key
  if (process.env.NODE_ENV === "production" && expectedKey === "frontier-admin-secret-key") {
    console.error("[Security Alert] ADMIN_API_KEY is unset or using insecure default in production!");
    return { authenticated: false, error: "UNAUTHORIZED" };
  }

  if (!constantTimeEquals(token, expectedKey)) {
    // Record failed attempt towards lockout threshold
    checkRateLimit("admin_auth_failed", clientIp, { limit: 5, windowMs: 15 * 60 * 1000 });
    return { authenticated: false, error: "UNAUTHORIZED" };
  }

  const role: Role = "ADMIN";

  return {
    authenticated: true,
    user: {
      id: "admin-system",
      role,
      email: "admin@frontiersystems.com",
    },
  };
}
