import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity";
import { createMetadata, getCaseStudyJsonLd, siteConfig } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return createMetadata({
      title: "Case Study Not Found",
      noIndex: true,
    });
  }

  const imageUrl = caseStudy.mainImage
    ? urlFor(caseStudy.mainImage).width(1200).height(630).url()
    : undefined;

  return createMetadata({
    title: caseStudy.seo?.metaTitle || `${caseStudy.title} — Technical Case Study`,
    description: caseStudy.seo?.metaDescription || caseStudy.problemStatement,
    path: `/work/${slug}`,
    image: imageUrl,
    type: "article",
    publishedTime: caseStudy.publishedAt,
    noIndex: caseStudy.seo?.noIndex,
  });
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const mainImageUrl = caseStudy.mainImage
    ? urlFor(caseStudy.mainImage).width(1400).height(780).url()
    : null;

  const jsonLdData = getCaseStudyJsonLd({
    title: caseStudy.title,
    description: caseStudy.problemStatement,
    url: `${siteConfig.url}/work/${slug}`,
    image: mainImageUrl || undefined,
    datePublished: caseStudy.publishedAt,
    dateModified: caseStudy._updatedAt || caseStudy.publishedAt,
  });

  return (
    <PageContainer>
      <JsonLd data={jsonLdData} />

      {/* 1. TITLE & INTRODUCTION HERO */}
      <section
        aria-label="Case Study Header"
        className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 border-b border-[#171A1C]"
      >
        <Container size="2xl">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>TECHNICAL DEPLOYMENT</Eyebrow>
              {caseStudy.clientIndustry && (
                <Badge variant="accent" size="sm">
                  {caseStudy.clientIndustry}
                </Badge>
              )}
              {caseStudy.publishedAt && (
                <span className="text-xs font-mono text-[#6E7376]">
                  PUBLISHED: {new Date(caseStudy.publishedAt).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "short",
                  })}
                </span>
              )}
            </div>

            {/* Sole Single H1 for the page */}
            <Heading
              as="h1"
              variant="display"
              className="tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F3]"
            >
              {caseStudy.title}
            </Heading>

            {/* Related Solution Pillar Breadcrumb */}
            {caseStudy.relatedSolution && (
              <div className="flex items-center gap-2 text-xs font-mono text-[#A6AAAC]">
                <span>CORE PILLAR:</span>
                <Link
                  href={`/solutions/${caseStudy.relatedSolution.slug.current}`}
                  className="text-[#63C7D9] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>{caseStudy.relatedSolution.title}</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* 2. MAIN IMAGE / ARCHITECTURAL HERO (Optimized Next.js Image) */}
      {mainImageUrl && (
        <section aria-label="Architecture Visualization" className="py-12 border-b border-[#171A1C] bg-[#0B0D0E]">
          <Container size="2xl">
            <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] rounded-sm overflow-hidden border border-[#292D30] bg-[#111416]">
              <Image
                src={mainImageUrl}
                alt={caseStudy.mainImage?.alt || `${caseStudy.title} Architecture Diagram`}
                fill
                priority
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
              />
            </div>
            {caseStudy.mainImage?.caption && (
              <p className="mt-3 text-xs font-mono text-[#6E7376]">
                FIGURE 1.0 // {caseStudy.mainImage.caption}
              </p>
            )}
          </Container>
        </section>
      )}

      {/* 3. PROBLEM & SOLUTION ARCHITECTURE NARRATIVE */}
      <section
        id="case-narrative"
        aria-labelledby="challenge-heading"
        className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
      >
        <Container size="2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Main Narrative (8 Cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Problem Section */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
                  01 // THE CHALLENGE
                </div>
                <Heading id="challenge-heading" as="h2" variant="h1" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
                  Operational Constraints & Bottlenecks
                </Heading>
                <div className="text-base text-[#A6AAAC] leading-relaxed whitespace-pre-line">
                  {caseStudy.problemStatement}
                </div>
              </div>

              {/* Solution Architecture Section */}
              <div className="space-y-4 pt-8 border-t border-[#171A1C]">
                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
                  02 // ARCHITECTURE & EXECUTION
                </div>
                <Heading as="h2" variant="h1" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
                  High-Assurance Engineering Architecture
                </Heading>
                <div className="text-base text-[#A6AAAC] leading-relaxed space-y-4">
                  {Array.isArray(caseStudy.solutionArchitecture) ? (
                    caseStudy.solutionArchitecture.map((block, idx) => {
                      if (typeof block === "string") {
                        return <p key={idx}>{block}</p>;
                      }
                      if (block && typeof block === "object" && "children" in block) {
                        const text = Array.isArray(block.children)
                          ? block.children.map((c: { text?: string }) => c.text || "").join("")
                          : "";
                        return <p key={idx}>{text}</p>;
                      }
                      return null;
                    })
                  ) : (
                    <p>
                      {String(caseStudy.solutionArchitecture || "Engineered with deterministic failover, resilient schema contracts, and strict security perimeters.")}
                    </p>
                  )}
                </div>
              </div>

              {/* Implementation Section */}
              <div className="space-y-4 pt-8 border-t border-[#171A1C]">
                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
                  03 // IMPLEMENTATION STANDARDS
                </div>
                <Heading as="h2" variant="h1" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
                  Technical Delivery & Reliability Verification
                </Heading>
                <p className="text-base text-[#A6AAAC] leading-relaxed">
                  Frontier Systems executed the deployment following our four-phase engineering lifecycle.
                  All components were verified against formal latency budgets, concurrency simulations, and zero-trust
                  security policies preceding production promotion.
                </p>
              </div>
            </div>

            {/* Sidebar (4 Cols): Business Impact & Related Pillar */}
            <aside aria-label="Case Study Specifications" className="lg:col-span-4 space-y-8">
              {/* Business Impact Card (Only rendered if genuinely available) */}
              {caseStudy.businessImpact && caseStudy.businessImpact.length > 0 && (
                <div className="p-6 sm:p-8 rounded-sm bg-[#111416] border border-[#292D30] space-y-6">
                  <div className="text-xs font-mono uppercase tracking-wider text-[#63C7D9]">
                    VERIFIED PRODUCTION IMPACT
                  </div>

                  <div className="space-y-6">
                    {caseStudy.businessImpact.map((metric, idx) => (
                      <div key={metric._key || idx} className="space-y-1">
                        <div className="text-3xl font-bold font-mono text-[#F5F5F3]">
                          {metric.metric}
                        </div>
                        <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
                          {metric.label}
                        </div>
                        {metric.description && (
                          <p className="text-xs text-[#A6AAAC] pt-1 leading-relaxed">
                            {metric.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#171A1C] text-[10px] font-mono text-[#6E7376]">
                    DATA VERIFIED VIA PRODUCTION TELEMETRY
                  </div>
                </div>
              )}

              {/* Related Solution Anchor */}
              {caseStudy.relatedSolution && (
                <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-3">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
                    CAPABILITY PILLAR
                  </div>
                  <h3 className="text-base font-semibold text-[#F5F5F3]">
                    {caseStudy.relatedSolution.title}
                  </h3>
                  <p className="text-xs text-[#A6AAAC] leading-relaxed">
                    Explore the complete technical architecture and capability matrix underpinning this deployment.
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/solutions/${caseStudy.relatedSolution.slug.current}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#63C7D9] hover:underline"
                    >
                      <span>Explore Pillar Capabilities</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Direct Engagement Anchor */}
              <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
                  ENTERPRISE CONSULTATION
                </div>
                <h3 className="text-base font-semibold text-[#F5F5F3]">
                  Request Technical Teardown
                </h3>
                <p className="text-xs text-[#A6AAAC] leading-relaxed">
                  Review complete architecture dossiers, benchmark telemetry, and code specifications under mutual NDA.
                </p>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-10 px-4 text-xs font-mono font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white rounded-sm transition-colors w-full"
                  >
                    Schedule Consultation
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {/* 4. MEDIA ASSETS GALLERY (if available) */}
      {caseStudy.mediaAssets && caseStudy.mediaAssets.length > 0 && (
        <section
          aria-labelledby="gallery-heading"
          className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
        >
          <Container size="2xl">
            <div className="max-w-3xl space-y-4 mb-12">
              <Eyebrow>ARCHITECTURE SCHEMATICS & TELEMETRY</Eyebrow>
              <Heading id="gallery-heading" as="h2" variant="h1">
                Technical Diagrams & Media Assets
              </Heading>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudy.mediaAssets.map((asset, idx) => {
                const assetUrl = urlFor(asset).width(900).height(550).url();
                return (
                  <Card key={idx} variant="default" padding="none" className="overflow-hidden">
                    <div className="relative w-full aspect-video bg-[#0B0D0E]">
                      <Image
                        src={assetUrl}
                        alt={asset.alt || `Architecture Diagram ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                    {asset.caption && (
                      <div className="p-4 border-t border-[#171A1C] text-xs font-mono text-[#A6AAAC]">
                        FIGURE {idx + 2}.0 // {asset.caption}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </Container>
        </section>
      )}

      {/* 5. CLOSING CONSULTATION CTA */}
      <section
        aria-labelledby="case-cta-heading"
        className="py-20 lg:py-32 bg-gradient-to-b from-[#0B0D0E] to-[#111416]"
      >
        <Container size="2xl">
          <div className="relative rounded-sm bg-[#111416] border border-[#292D30] p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#63C7D9]/5 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-3xl space-y-6">
              <Eyebrow>DIRECT ENGAGEMENT</Eyebrow>

              <Heading id="case-cta-heading" as="h2" variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Ready to Engineer Resilient Software for Your Enterprise?
              </Heading>

              <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
                Connect directly with our senior systems architects. We analyze your technical requirements,
                benchmark concurrency and latency targets, sign mutual NDAs, and build mission-critical solutions.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Schedule Technical Consultation
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#F5F5F3] bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  View All Case Studies
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#A6AAAC] hover:text-[#F5F5F3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Browse Capabilities &rarr;
                </Link>
              </div>

              {/* SLA Guarantee Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#171A1C] text-xs font-mono text-[#6E7376]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                  <span>48h Technical Scoping Turnaround</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9]" />
                  <span>Mutual NDA Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A6AAAC]" />
                  <span>Direct Access to Senior Staff</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
