export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  alt?: string;
  caption?: string;
}

export interface SanitySeo {
  metaTitle?: string;
  metaDescription?: string;
  openGraphImage?: SanityImage;
  noIndex?: boolean;
}

export interface SanitySlug {
  current: string;
  _type: "slug";
}

export interface SanitySolution {
  _id: string;
  _type: "solution";
  title: string;
  slug: SanitySlug;
  category: "ai-automation" | "digital-products" | "business-systems" | "infrastructure-security";
  shortDescription: string;
  hero?: {
    headline?: string;
    subhead?: string;
    ctaText?: string;
  };
  services?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  longDescription?: any[];
  media?: SanityImage;
  seo?: SanitySeo;
  _updatedAt?: string;
}

export interface BusinessImpactMetric {
  _key?: string;
  metric: string;
  label: string;
  description?: string;
}

export interface SanityCaseStudy {
  _id: string;
  _type: "caseStudy";
  title: string;
  slug: SanitySlug;
  clientIndustry?: string;
  relatedSolution?: {
    _id: string;
    title: string;
    slug: SanitySlug;
  };
  problemStatement: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  solutionArchitecture: any[];
  businessImpact?: BusinessImpactMetric[];
  mainImage?: SanityImage;
  mediaAssets?: SanityImage[];
  publishedAt?: string;
  seo?: SanitySeo;
  _updatedAt?: string;
}
