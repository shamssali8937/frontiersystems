import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo";
import { sanityClient } from "@/lib/sanity";

/**
 * Dynamic sitemap generation.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteConfig.url}/solutions`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/solutions/ai-automation`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/solutions/digital-products`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/solutions/business-systems`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/solutions/infrastructure-security`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/work`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/company`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteConfig.url}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/terms`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  let caseStudyRoutes: MetadataRoute.Sitemap = [];
  if (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "frontiersystems"
  ) {
    try {
      const caseStudies = await sanityClient.fetch<
        Array<{ slug: { current: string }; _updatedAt?: string }>
      >(`*[_type == "caseStudy" && defined(slug.current)]{ slug, _updatedAt }`);

      caseStudyRoutes = caseStudies.map((study) => ({
        url: `${siteConfig.url}/work/${study.slug.current}`,
        lastModified: study._updatedAt || currentDate,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    } catch {
      // Fall back to static routes if Sanity dataset query fails
    }
  }

  return [...staticRoutes, ...caseStudyRoutes];
}
