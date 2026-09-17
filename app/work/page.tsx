import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { getCaseStudies } from "@/lib/sanity.queries";
import { urlFor } from "@/lib/sanity";

export const metadata: Metadata = createMetadata({
  title: "Case Evidence & Technical Deployments",
  description:
    "Review technical case studies demonstrating real-world systems architecture, AI automation, and measurable enterprise value delivered by Frontier Systems.",
  path: "/work",
});

export default async function WorkPage() {
  const caseStudies = await getCaseStudies();
  const hasStudies = caseStudies && caseStudies.length > 0;

  return (
    <PageContainer>
      {/* 1. HERO SECTION */}
      <section
        aria-label="Case Evidence Overview"
        className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 border-b border-[#171A1C]"
      >
        <Container size="2xl">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>VERIFIED CASE EVIDENCE</Eyebrow>
              <span className="text-xs font-mono text-[#6E7376]">
                Production Systems &bull; Architectural Teardowns
              </span>
            </div>

            {/* Single H1 on the page */}
            <Heading
              as="h1"
              variant="display"
              className="tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F3]"
            >
              Technical Deployments & Systems Architecture
            </Heading>

            <p className="text-[#A6AAAC] text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
              We engineer high-assurance systems where reliability, performance, and deterministic behavior
              are non-negotiable requirements. Review our real-world systems architecture, data pipeline engineering,
              and verifiable production outcomes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Request Technical Scoping Under NDA
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#F5F5F3] bg-[#111416] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Explore Capability Matrix &rarr;
              </Link>
            </div>

            {/* Quality Baseline Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Badge variant="accent" size="sm">
                AUDITED EVIDENCE
              </Badge>
              <Badge variant="neutral" dot size="sm">
                ZERO FABRICATION
              </Badge>
              <Badge variant="neutral" dot size="sm">
                SANITY CMS MANAGED
              </Badge>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. CASE STUDIES CATALOG OR INTENTIONAL EMPTY STATE */}
      <section
        id="case-studies-catalog"
        aria-labelledby="catalog-heading"
        className="py-20 lg:py-28 bg-[#0B0D0E]"
      >
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Eyebrow>ARCHITECTURAL PORTFOLIO</Eyebrow>
            <Heading id="catalog-heading" as="h2" variant="h1">
              Published Technical Case Studies
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              Every case study published here reflects genuine production architecture, verified constraints,
              and measurable operational value without fabricated statistics or unsupported claims.
            </p>
          </div>

          {hasStudies ? (
            /* Live Sanity Case Studies */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {caseStudies.map((study) => {
                const slug = study.slug?.current || study._id;
                const imageUrl = study.mainImage
                  ? urlFor(study.mainImage).width(800).height(450).url()
                  : null;

                return (
                  <article
                    key={study._id}
                    className="flex flex-col justify-between rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors overflow-hidden group"
                  >
                    {/* Media Asset (if available) */}
                    {imageUrl && (
                      <div className="relative w-full aspect-video border-b border-[#171A1C] overflow-hidden bg-[#0B0D0E]">
                        <Image
                          src={imageUrl}
                          alt={study.mainImage?.alt || study.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-8 sm:p-10 flex flex-col justify-between flex-1">
                      <div className="space-y-4">
                        {/* Top Metadata */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#6E7376]">
                          <span>{study.clientIndustry || "Enterprise System"}</span>
                          {study.relatedSolution && (
                            <Link
                              href={`/solutions/${study.relatedSolution.slug.current}`}
                              className="text-[#63C7D9] hover:underline"
                            >
                              {study.relatedSolution.title}
                            </Link>
                          )}
                        </div>

                        <Heading as="h3" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3] group-hover:text-white transition-colors">
                          {study.title}
                        </Heading>

                        <p className="text-sm text-[#A6AAAC] leading-relaxed line-clamp-3">
                          {study.problemStatement}
                        </p>

                        {/* Business Impact Metrics (Genuinely supported only) */}
                        {study.businessImpact && study.businessImpact.length > 0 && (
                          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#171A1C]">
                            {study.businessImpact.slice(0, 2).map((metric, idx) => (
                              <div key={metric._key || idx}>
                                <div className="text-lg font-bold font-mono text-[#63C7D9]">
                                  {metric.metric}
                                </div>
                                <div className="text-[11px] font-mono text-[#A6AAAC]">
                                  {metric.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="pt-6 mt-8 border-t border-[#171A1C] flex items-center justify-between">
                        <Link
                          href={`/work/${slug}`}
                          className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#F5F5F3] group-hover:text-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] py-1"
                        >
                          <span>Read Full Architectural Breakdown</span>
                          <span aria-hidden="true">&rarr;</span>
                        </Link>
                        <span className="text-[11px] font-mono text-[#6E7376]">
                          CASE_STUDY
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Intentional High-Trust B2B Empty State */
            <div className="rounded-sm bg-[#111416] border border-[#292D30] p-8 sm:p-12 lg:p-16">
              <div className="max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="neutral" dot size="sm">
                    SECURITY CLEARANCE ACTIVE
                  </Badge>
                  <span className="text-xs font-mono text-[#6E7376]">
                    REF: SEC_PROTOCOL_NDA
                  </span>
                </div>

                <Heading as="h3" variant="h2" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
                  Enterprise Case Evidence Under Active Confidentiality Clearance
                </Heading>

                <p className="text-sm sm:text-base text-[#A6AAAC] leading-relaxed">
                  Frontier Systems does not publish fabricated case studies or simulated client names. Due to
                  strict non-disclosure agreements, defense-in-depth security postures, and proprietary algorithm
                  protection, our live enterprise deployments undergo comprehensive sanitization before public indexing.
                </p>

                <p className="text-sm text-[#A6AAAC] leading-relaxed">
                  Prospective enterprise leadership, VP of Engineering, and Chief Technology Officers can review
                  sanitized architectural teardowns, production benchmarks, and system schematics directly during a
                  technical consultation under bilateral NDA.
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-10 px-5 text-xs font-mono font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                  >
                    Request Technical Dossier Under NDA
                  </Link>
                  <Link
                    href="/solutions"
                    className="inline-flex items-center justify-center h-10 px-5 text-xs font-mono font-medium text-[#F5F5F3] bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                  >
                    Review Capability Matrix
                  </Link>
                </div>

                {/* High-Assurance Trust Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-10 border-t border-[#171A1C]">
                  <div>
                    <div className="text-xs font-mono font-semibold text-[#63C7D9] mb-1">
                      01 // ZERO DATA LEAKS
                    </div>
                    <p className="text-xs text-[#6E7376] leading-relaxed">
                      Zero client exposure. All production case evidence is sanitized and audited.
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold text-[#63C7D9] mb-1">
                      02 // ARCHITECTURAL RIGOR
                    </div>
                    <p className="text-xs text-[#6E7376] leading-relaxed">
                      Evaluated against real production constraints: concurrency, latency, and fault recovery.
                    </p>
                  </div>
                  <div>
                    <div className="text-xs font-mono font-semibold text-[#63C7D9] mb-1">
                      03 // EXECUTIVE CONSULTATION
                    </div>
                    <p className="text-xs text-[#6E7376] leading-relaxed">
                      Direct technical consultation with principal systems architects on our senior staff.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Container>
      </section>

      {/* 3. CLOSING CONSULTATION CTA */}
      <section
        aria-labelledby="work-cta-heading"
        className="py-20 lg:py-32 border-t border-[#171A1C] bg-gradient-to-b from-[#0B0D0E] to-[#111416]"
      >
        <Container size="2xl">
          <div className="relative rounded-sm bg-[#111416] border border-[#292D30] p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#63C7D9]/5 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-3xl space-y-6">
              <Eyebrow>DIRECT TECHNICAL CONSULTATION</Eyebrow>

              <Heading id="work-cta-heading" as="h2" variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Require Case Evidence in Your Specific Industry Domain?
              </Heading>

              <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
                Connect directly with our senior systems architects. We provide domain-relevant architectural briefs,
                evaluate feasibility against your enterprise constraints, and sign reciprocal NDAs prior to technical scoping.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Schedule Technical Consultation
                </Link>
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#F5F5F3] bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Explore Capability Matrix
                </Link>
              </div>

              {/* SLA & Assurance Metadata Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#171A1C] text-xs font-mono text-[#6E7376]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                  <span>48h Technical Scoping Response</span>
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
