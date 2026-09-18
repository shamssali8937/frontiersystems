import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

const ADMIN_COOKIE_NAME = "fs_admin_session";

async function verifyToken(token: string, secret: string): Promise<boolean> {
  // 1. Check if token matches static ADMIN_API_KEY (for automated runners / testing)
  const systemKey = process.env.ADMIN_API_KEY || "frontier-admin-secret-key";
  if (token === systemKey) {
    return true;
  }

  // 2. Verify HMAC-SHA256 signed session token
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const [header, body, signature] = parts;
    if (!header || !body || !signature) return false;

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const base64 = signature.replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
    const binary = atob(padded);
    const sigBytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      sigBytes[i] = binary.charCodeAt(i);
    }

    const data = `${header}.${body}`;
    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes,
      encoder.encode(data),
    );

    if (!isValid) return false;

    // Check expiration
    const bodyBase64 = body.replace(/-/g, "+").replace(/_/g, "/");
    const bodyPad = bodyBase64.length % 4;
    const bodyPadded = bodyPad ? bodyBase64 + "=".repeat(4 - bodyPad) : bodyBase64;
    const payload = JSON.parse(atob(bodyPadded));

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Unauthenticated routes:
  // /admin/login is public
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // /api/admin/auth/login is public
  if (pathname === "/api/admin/auth/login") {
    return NextResponse.next();
  }

  // Extract session cookie or Authorization header
  const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const authHeader = request.headers.get("authorization");
  const apiKeyHeader = request.headers.get("x-admin-key");

  let token = sessionCookie;
  if (!token && authHeader) {
    token = authHeader.startsWith("Bearer ")
      ? authHeader.substring(7).trim()
      : authHeader.trim();
  } else if (!token && apiKeyHeader) {
    token = apiKeyHeader.trim();
  }

  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_API_KEY ||
    "frontier-systems-admin-session-secure-key-2026";

  const isAuthenticated = token ? await verifyToken(token, secret) : false;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  // Unauthenticated API request -> return 401 with standard error shape
  if (pathname.startsWith("/api/admin")) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Admin authorization required",
        },
      },
      { status: 401 },
    );
  }

  // Unauthenticated page request -> redirect to /admin/login
  if (pathname.startsWith("/admin")) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
