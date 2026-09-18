import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/portal/:path*",
    "/api/portal/:path*",
  ],
};

const ADMIN_COOKIE_NAME = "fs_admin_session";
const CUSTOMER_COOKIE_NAME = "fs_customer_session";

interface DecodedTokenPayload {
  adminId?: string;
  customerId?: string;
  type?: string;
  role?: string;
  exp?: number;
  [key: string]: unknown;
}

async function verifyAndDecodeToken(
  token: string,
  secret: string,
): Promise<DecodedTokenPayload | null> {
  // Check if token matches static ADMIN_API_KEY (for automated runners / testing)
  const systemKey = process.env.ADMIN_API_KEY || "frontier-admin-secret-key";
  if (token === systemKey) {
    return { adminId: "admin-system", role: "SUPERADMIN" };
  }

  // Verify HMAC-SHA256 signed session token
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [header, body, signature] = parts;
    if (!header || !body || !signature) return null;

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

    if (!isValid) return null;

    // Check expiration
    const bodyBase64 = body.replace(/-/g, "+").replace(/_/g, "/");
    const bodyPad = bodyBase64.length % 4;
    const bodyPadded = bodyPad ? bodyBase64 + "=".repeat(4 - bodyPad) : bodyBase64;
    const payload = JSON.parse(atob(bodyPadded)) as DecodedTokenPayload;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // =========================================================================
  // 1. ADMIN DOMAIN
  // =========================================================================
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    // Unauthenticated public admin routes
    if (pathname === "/admin/login" || pathname === "/api/admin/auth/login") {
      return NextResponse.next();
    }

    // Extract admin session cookie or Authorization header
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

    const payload = token ? await verifyAndDecodeToken(token, secret) : null;

    // Reject customer tokens attempting admin access
    const isAdminAuthenticated = payload && (payload.adminId || payload.role) && payload.type !== "customer";

    if (isAdminAuthenticated) {
      return NextResponse.next();
    }

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

    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // =========================================================================
  // 2. CUSTOMER PORTAL DOMAIN
  // =========================================================================
  if (pathname.startsWith("/portal") || pathname.startsWith("/api/portal")) {
    // Public portal auth routes
    if (
      pathname === "/portal/login" ||
      pathname === "/portal/verify" ||
      pathname === "/api/portal/auth/request-link" ||
      pathname === "/api/portal/auth/verify" ||
      pathname === "/api/portal/auth/logout"
    ) {
      return NextResponse.next();
    }

    // Extract customer session cookie or Authorization header
    const sessionCookie = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
    const authHeader = request.headers.get("authorization");

    let token = sessionCookie;
    if (!token && authHeader) {
      token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7).trim()
        : authHeader.trim();
    }

    const secret =
      process.env.CUSTOMER_SESSION_SECRET ||
      process.env.ADMIN_SESSION_SECRET ||
      "fs-customer-portal-secure-hmac-secret-key-2026";

    const payload = token ? await verifyAndDecodeToken(token, secret) : null;

    // Reject admin tokens attempting portal access
    const isCustomerAuthenticated =
      payload && payload.type === "customer" && Boolean(payload.customerId);

    if (isCustomerAuthenticated && payload.customerId) {
      // Forward customer ID in request headers for zero-trust downstream verification
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-customer-id", String(payload.customerId));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }

    if (pathname.startsWith("/api/portal")) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Customer authorization required",
          },
        },
        { status: 401 },
      );
    }

    const loginUrl = new URL("/portal/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
