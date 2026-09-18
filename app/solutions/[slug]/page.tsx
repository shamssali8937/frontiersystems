import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageContainer } from "@/components/layout";
import { createMetadata, getBreadcrumbJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCaseStudies } from "@/lib/sanity.queries";
import { SOLUTIONS_DATA } from "@/lib/solutionsData";
import { SolutionHero } from "@/components/solutions/SolutionHero";
import { SolutionServices } from "@/components/solutions/SolutionServices";
import { SolutionArchitecture } from "@/components/solutions/SolutionArchitecture";
import { SolutionApproach } from "@/components/solutions/SolutionApproach";
import { SolutionTechStack } from "@/components/solutions/SolutionTechStack";
import { SolutionRelatedWork } from "@/components/solutions/SolutionRelatedWork";
import { SolutionClosingCta } from "@/components/solutions/SolutionClosingCta";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(SOLUTIONS_DATA).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = SOLUTIONS_DATA[slug];

  if (!solution) {
    return createMetadata({
      title: "Solution Not Found",
      noIndex: true,
    });
  }

  return createMetadata({
    title: solution.metaTitle,
    description: solution.metaDescription,
    path: `/solutions/${slug}`,
  });
}

export default async function SolutionSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = SOLUTIONS_DATA[slug];

  if (!solution) {
    notFound();
  }

  // Fetch live Sanity case studies
  const allCaseStudies = await getCaseStudies();
  const relatedCaseStudies = allCaseStudies.filter(
    (cs) => cs.relatedSolution?.slug?.current === slug
  );

  const breadcrumbsJsonLd = getBreadcrumbJsonLd([
    { name: "Home", url: "/" },
    { name: "Solutions", url: "/solutions" },
    { name: solution.title, url: `/solutions/${slug}` },
  ]);

  return (
    <PageContainer>
      <JsonLd data={breadcrumbsJsonLd} />
      {/* 1. HERO SECTION (Unique Single H1, Eyebrow, Supporting Copy, Badges) */}
      <SolutionHero solution={solution} />

      {/* 2. CORE SERVICES SECTION (Exact Sub-Services Requested) */}
      <SolutionServices
        pillarTitle={solution.title}
        services={solution.services}
      />

      {/* 3. VISUAL ARCHITECTURE & SCHEMATIC (Unique Diagram Per Pillar) */}
      <SolutionArchitecture solution={solution} />

      {/* 4. ENGINEERING METHODOLOGY APPROACH (3 Structured Phases) */}
      <SolutionApproach
        pillarTitle={solution.title}
        approach={solution.approach}
      />

      {/* 5. TECH STACK & OPERATIONAL SPECIFICATIONS */}
      <SolutionTechStack solution={solution} />

      {/* 6. VERIFIED CASE EVIDENCE (Sanity Content / High-Trust Empty State) */}
      <SolutionRelatedWork
        pillarTitle={solution.title}
        caseStudies={relatedCaseStudies}
      />

      {/* 7. CLOSING CONSULTATION CTA (Direct Pathway to /contact with SLA) */}
      <SolutionClosingCta solution={solution} />
    </PageContainer>
  );
}
