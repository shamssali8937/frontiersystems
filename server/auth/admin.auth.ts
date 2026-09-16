import type { NextRequest } from "next/server";

export interface AdminUser {
  id: string;
  role: "ADMIN";
  email: string;
}

export interface AuthResult {
  authenticated: boolean;
  user?: AdminUser;
  error?: "UNAUTHORIZED" | "FORBIDDEN";
}

/**
 * Validates admin authentication from headers.
 * Never trusts client user ID or client role.
 */
export function authenticateAdmin(request: NextRequest): AuthResult {
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

  if (token !== expectedKey) {
    return { authenticated: false, error: "UNAUTHORIZED" };
  }

  return {
    authenticated: true,
    user: {
      id: "admin-system",
      role: "ADMIN",
      email: "admin@frontiersystems.com",
    },
  };
}
