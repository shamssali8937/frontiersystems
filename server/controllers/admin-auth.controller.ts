import { NextRequest } from "next/server";
import {
  adminLoginSchema,
} from "@/lib/validation/admin.schema";
import {
  authenticateAdminCredentials,
  verifyAdminRequest,
  ADMIN_COOKIE_NAME,
} from "@/server/services/admin-auth.service";
import { getClientIp } from "@/lib/security/ip";
import { jsonSuccess, jsonError } from "@/types/api";

export async function handleAdminLogin(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const parseResult = adminLoginSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return jsonError("VALIDATION_ERROR", "Invalid login credentials format", 422, {
        issues: parseResult.error.issues,
      });
    }

    const { email, password } = parseResult.data;
    const clientIp = getClientIp(request);

    const authResult = await authenticateAdminCredentials(email, password, clientIp);

    if (!authResult) {
      return jsonError("UNAUTHORIZED", "Invalid engineering email or credentials", 401);
    }

    const response = jsonSuccess(
      {
        user: {
          id: authResult.user.id,
          email: authResult.user.email,
          role: authResult.user.role,
        },
        message: "Authentication successful",
      },
      200,
    );

    // Set secure, httpOnly, sameSite cookie
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: authResult.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours
    });

    return response;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal authentication error";
    return jsonError("INTERNAL_ERROR", msg, 500);
  }
}

export async function handleAdminLogout(_request: NextRequest) {
  const response = jsonSuccess({ message: "Logged out successfully" }, 200);
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function handleAdminMe(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const header = request.headers.get("authorization");

  const verification = await verifyAdminRequest(cookie, header);

  if (!verification.success || !verification.user) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  return jsonSuccess({ user: verification.user }, 200);
}
