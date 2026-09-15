import type { Metadata } from "next";

/**
 * Central site SEO configuration.
 */
export const siteConfig = {
  name: "Frontier Systems",
  shortName: "Frontier",
  legalName: "Frontier Systems Ltd",
  description:
    "Premium UK-based global technology and AI partner engineering enterprise systems, automation, and digital products.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://frontiersystems.com",
  ogImage: "/og/default.png",
  twitterHandle: "@frontiersystems",
  locale: "en_GB",
  address: {
    addressCountry: "GB",
    addressLocality: "London",
  },
};

export interface PageSeoProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

/**
 * Builds standard, type-safe Next.js page metadata.
 */
export function createMetadata({
  title,
  description = siteConfig.description,
  path = "",
  image = siteConfig.ogImage,
  noIndex = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: PageSeoProps = {}): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteConfig.url}${cleanPath === "/" ? "" : cleanPath}`;
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;

  return {
    title,
    description,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: image.startsWith("http") ? image : `${siteConfig.url}${image}`,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      creator: siteConfig.twitterHandle,
      images: [image.startsWith("http") ? image : `${siteConfig.url}${image}`],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

/**
 * Schema.org Organization JSON-LD.
 */
export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.address.addressCountry,
      addressLocality: siteConfig.address.addressLocality,
    },
    sameAs: [
      `https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`,
      "https://www.linkedin.com/company/frontier-systems",
      "https://github.com/frontiersystems",
    ],
  };
}

/**
 * Schema.org WebSite JSON-LD.
 */
export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
  };
}

/**
 * Schema.org BreadcrumbList JSON-LD.
 */
export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${siteConfig.url}${item.url}`,
    })),
  };
}

/**
 * Schema.org Case Study (Article / CreativeWork) JSON-LD.
 */
export function getCaseStudyJsonLd({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
}: {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: url.startsWith("http") ? url : `${siteConfig.url}${url}`,
    image: image ? (image.startsWith("http") ? image : `${siteConfig.url}${image}`) : undefined,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    datePublished,
    dateModified: dateModified || datePublished,
  };
}
