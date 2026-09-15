import { sanityClient } from "./sanity";
import type { SanitySolution, SanityCaseStudy } from "@/types/sanity";

/** Fallback static pillars */
const fallbackSolutions: Record<string, SanitySolution> = {
  "ai-automation": {
    _id: "static-ai-automation",
    _type: "solution",
    title: "AI & Automation",
    slug: { current: "ai-automation", _type: "slug" },
    category: "ai-automation",
    shortDescription:
      "Custom machine learning models, autonomous workflows, and intelligent agent systems designed for enterprise automation.",
    hero: {
      headline: "Autonomous Intelligence & Workflow Automation",
      subhead: "Transform complex operational processes with bespoke AI models and enterprise automation pipelines.",
      ctaText: "Explore AI Solutions",
    },
    services: [
      "Custom LLM & Agentic Systems",
      "Process Automation & Orchestration",
      "Computer Vision & Predictive Analytics",
      "Enterprise Data Pipelines",
    ],
  },
  "digital-products": {
    _id: "static-digital-products",
    _type: "solution",
    title: "Digital Products",
    slug: { current: "digital-products", _type: "slug" },
    category: "digital-products",
    shortDescription:
      "High-performance web applications, mobile platforms, and modern B2B SaaS engineering.",
    hero: {
      headline: "Mission-Critical Digital Products",
      subhead: "Engineered for speed, scale, and uncompromising reliability.",
      ctaText: "Discuss Your Product",
    },
    services: [
      "Modern Web Applications (Next.js)",
      "Cross-Platform Mobile Apps",
      "B2B SaaS Architecture",
      "Interactive 3D / WebGL Interfaces",
    ],
  },
  "business-systems": {
    _id: "static-business-systems",
    _type: "solution",
    title: "Business Systems",
    slug: { current: "business-systems", _type: "slug" },
    category: "business-systems",
    shortDescription:
      "Custom ERP, CRM, and mission-critical internal tooling unifying distributed enterprise workflows.",
    hero: {
      headline: "Unified Enterprise Architecture",
      subhead: "Replace fragmented spreadsheets and legacy software with bespoke, resilient business systems.",
      ctaText: "Modernize Your Systems",
    },
    services: [
      "Custom Internal Tools & Portals",
      "ERP / CRM Integration",
      "Legacy System Migration",
      "Real-time Analytics Dashboards",
    ],
  },
  "infrastructure-security": {
    _id: "static-infrastructure-security",
    _type: "solution",
    title: "Infrastructure & Security",
    slug: { current: "infrastructure-security", _type: "slug" },
    category: "infrastructure-security",
    shortDescription:
      "Cloud architecture, zero-trust security postures, and scalable DevOps infrastructure.",
    hero: {
      headline: "Resilient Cloud & Security Infrastructure",
      subhead: "Enterprise-grade reliability, compliance, and disaster recovery architectures.",
      ctaText: "Review Infrastructure",
    },
    services: [
      "Cloud Architecture (AWS / GCP / Azure)",
      "Zero-Trust Security & Turnstile Integration",
      "CI/CD Pipelines & Kubernetes Orchestration",
      "High Availability & Disaster Recovery",
    ],
  },
};

export const SOLUTIONS_QUERY = `*[_type == "solution"] | order(title asc) {
  _id,
  _type,
  title,
  slug,
  category,
  shortDescription,
  hero,
  services,
  media,
  seo,
  _updatedAt
}`;

export const SOLUTION_BY_SLUG_QUERY = `*[_type == "solution" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  category,
  shortDescription,
  hero,
  services,
  longDescription,
  media,
  seo,
  _updatedAt
}`;

export const CASE_STUDIES_QUERY = `*[_type == "caseStudy" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  _type,
  title,
  slug,
  clientIndustry,
  relatedSolution->{ _id, title, slug },
  problemStatement,
  businessImpact,
  mainImage,
  publishedAt,
  seo,
  _updatedAt
}`;

export const CASE_STUDY_BY_SLUG_QUERY = `*[_type == "caseStudy" && slug.current == $slug][0] {
  _id,
  _type,
  title,
  slug,
  clientIndustry,
  relatedSolution->{ _id, title, slug },
  problemStatement,
  solutionArchitecture,
  businessImpact,
  mainImage,
  mediaAssets,
  publishedAt,
  seo,
  _updatedAt
}`;

const isSanityConfigured = Boolean(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID !== "frontiersystems"
);

/**
 * Fetch all published solutions.
 */
export async function getSolutions(): Promise<SanitySolution[]> {
  if (!isSanityConfigured) {
    return Object.values(fallbackSolutions);
  }
  try {
    const data = await sanityClient.fetch<SanitySolution[]>(SOLUTIONS_QUERY);
    return data && data.length > 0 ? data : Object.values(fallbackSolutions);
  } catch {
    return Object.values(fallbackSolutions);
  }
}

/**
 * Fetch single solution by slug.
 */
export async function getSolutionBySlug(slug: string): Promise<SanitySolution | null> {
  if (!isSanityConfigured) {
    return fallbackSolutions[slug] ?? null;
  }
  try {
    const data = await sanityClient.fetch<SanitySolution | null>(SOLUTION_BY_SLUG_QUERY, { slug });
    return data ?? fallbackSolutions[slug] ?? null;
  } catch {
    return fallbackSolutions[slug] ?? null;
  }
}

/**
 * Fetch all solution slugs for static params.
 */
export async function getAllSolutionSlugs(): Promise<string[]> {
  if (!isSanityConfigured) {
    return Object.keys(fallbackSolutions);
  }
  try {
    const data = await sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "solution" && defined(slug.current)]{ slug }`
    );
    const slugs = data.map((item) => item.slug.current);
    return slugs.length > 0 ? slugs : Object.keys(fallbackSolutions);
  } catch {
    return Object.keys(fallbackSolutions);
  }
}

/**
 * Fetch all published case studies.
 */
export async function getCaseStudies(): Promise<SanityCaseStudy[]> {
  if (!isSanityConfigured) {
    return [];
  }
  try {
    return await sanityClient.fetch<SanityCaseStudy[]>(CASE_STUDIES_QUERY);
  } catch {
    return [];
  }
}

/**
 * Fetch single case study by slug.
 */
export async function getCaseStudyBySlug(slug: string): Promise<SanityCaseStudy | null> {
  if (!isSanityConfigured) {
    return null;
  }
  try {
    return await sanityClient.fetch<SanityCaseStudy | null>(CASE_STUDY_BY_SLUG_QUERY, { slug });
  } catch {
    return null;
  }
}

/**
 * Fetch all case study slugs for static params.
 */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  if (!isSanityConfigured) {
    return [];
  }
  try {
    const data = await sanityClient.fetch<Array<{ slug: { current: string } }>>(
      `*[_type == "caseStudy" && defined(slug.current)]{ slug }`
    );
    return data.map((item) => item.slug.current);
  } catch {
    return [];
  }
}
