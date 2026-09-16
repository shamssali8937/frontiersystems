import type { NextRequest } from "next/server";

/**
 * Cross-Origin Request & CSRF Protection
 *
 * Enforces origin verification for state-changing HTTP methods
 * (POST, PUT, PATCH, DELETE) to protect against CSRF attacks.
 */

export function validateOrigin(request: NextRequest): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();

  // Safe HTTP methods do not require origin check
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { valid: true };
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  // If neither origin nor referer is present (e.g. server-to-server curl / backend webhook with auth),
  // allow if authorized by API key or if strict origin header is optional
  if (!origin && !referer) {
    return { valid: true };
  }

  const allowedHosts = new Set<string>();

  if (host) {
    allowedHosts.add(host.toLowerCase());
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      const parsed = new URL(siteUrl);
      allowedHosts.add(parsed.host.toLowerCase());
    } catch {
      // ignore invalid siteUrl format
    }
  }

  // Development fallbacks
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    allowedHosts.add("localhost:3000");
    allowedHosts.add("localhost:3001");
    allowedHosts.add("localhost:3002");
    allowedHosts.add("127.0.0.1:3000");
  }

  if (origin) {
    try {
      const parsedOrigin = new URL(origin);
      if (!allowedHosts.has(parsedOrigin.host.toLowerCase())) {
        return {
          valid: false,
          reason: `Untrusted Origin header: "${origin}". Request origin does not match allowed application hosts.`,
        };
      }
    } catch {
      return { valid: false, reason: "Malformed Origin header" };
    }
  } else if (referer) {
    try {
      const parsedReferer = new URL(referer);
      if (!allowedHosts.has(parsedReferer.host.toLowerCase())) {
        return {
          valid: false,
          reason: `Untrusted Referer header: "${referer}". Request referer does not match allowed application hosts.`,
        };
      }
    } catch {
      return { valid: false, reason: "Malformed Referer header" };
    }
  }

  return { valid: true };
}
