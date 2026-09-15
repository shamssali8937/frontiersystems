import type { NextConfig } from "next";

/**
 * Next.js configuration.
 *
 * Security headers are applied to all routes via the headers() function.
 * See: https://nextjs.org/docs/app/api-reference/next-config-js/headers
 *
 * serverExternalPackages: Ensures Prisma and other Node-only packages are
 * never bundled into the client bundle.
 */

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  // Prevent MIME type sniffing
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Prevent clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Enforce HTTPS for 1 year, include subdomains
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  // Control referrer info
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  // Cross-origin policies
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Content Security Policy
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Sanity CDN
      "img-src 'self' data: blob: https://cdn.sanity.io",
      // Allow inline styles (Tailwind CSS) and required script sources
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Cloudflare Turnstile + development eval support for Next.js Fast Refresh & React devtools
      `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://challenges.cloudflare.com`.trim(),
      "frame-src https://challenges.cloudflare.com",
      // WebGL for Three.js
      "worker-src 'self' blob:",
      `connect-src 'self' ${isDev ? "ws: wss: http: https:" : "https://api.sanity.io https://cdn.sanity.io"}`.trim(),
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Keep Prisma and other Node-only packages out of client bundle
  serverExternalPackages: ["@prisma/client", "prisma"],

  // Apply security headers to all routes
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Image optimization — allow Sanity CDN as a trusted source
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  // Strict mode for React
  reactStrictMode: true,
};

export default nextConfig;
