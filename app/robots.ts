import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";

/**
 * Dynamic robots.txt generation.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
