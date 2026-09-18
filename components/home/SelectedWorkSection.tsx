import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import type { SanityCaseStudy } from "@/types/sanity";

interface SelectedWorkSectionProps {
  caseStudies: SanityCaseStudy[];
}

export function SelectedWorkSection({ caseStudies }: SelectedWorkSectionProps) {
  const hasStudies = caseStudies && caseStudies.length > 0;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="py-20 lg:py-32 border-t border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <Eyebrow>CASE EVIDENCE</Eyebrow>
            <Heading id="work-heading" as="h2" variant="h1">
              Selected Technical Deployments & Systems Architecture
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              We engineer high-assurance systems where reliability, performance, and deterministic behavior
              are non-negotiable requirements.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#63C7D9] hover:text-[#78D3E3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] py-1"
            >
              <span>View All Technical Work</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {hasStudies ? (
          /* Real CMS Case Studies */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => {
              const slug = study.slug?.current || study._id;
              return (
                <article
                  key={study._id}
                  className="flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-all duration-200 reveal-on-scroll"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-[#6E7376]">
                      <span>{study.clientIndustry || "Enterprise System"}</span>
                      {study.relatedSolution && (
                        <span className="text-[#63C7D9]">{study.relatedSolution.title}</span>
                      )}
                    </div>

                    <Heading as="h3" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3]">
                      {study.title}
                    </Heading>

                    <p className="text-sm text-[#A6AAAC] leading-relaxed line-clamp-3">
                      {study.problemStatement}
                    </p>

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

                  <div className="pt-6 mt-8 border-t border-[#171A1C]">
                    <Link
                      href={`/work/${slug}`}
                      className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#F5F5F3] hover:text-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] py-1"
                    >
                      <span>Read Architectural Case Study</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
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
                Enterprise Case Evidence Under Active Confidentiality Protocols
              </Heading>

              <p className="text-sm sm:text-base text-[#A6AAAC] leading-relaxed">
                Due to binding non-disclosure agreements, defense-in-depth compliance, and proprietary architecture
                protection, our live client deployments undergo rigorous multi-stage sanitization before public indexing.
              </p>

              <p className="text-sm text-[#A6AAAC] leading-relaxed">
                Prospective enterprise leadership and engineering directors can review sanitized technical dossiers,
                including benchmark telemetry, system blueprints, and code metrics, during a direct architectural consultation.
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
                    Zero client data exposure. All case evidence is anonymized and compliance-audited.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-[#63C7D9] mb-1">
                    02 // ARCHITECTURAL DEPTH
                  </div>
                  <p className="text-xs text-[#6E7376] leading-relaxed">
                    Evaluated against real production constraints: concurrency, latency, and fault recovery.
                  </p>
                </div>
                <div>
                  <div className="text-xs font-mono font-semibold text-[#63C7D9] mb-1">
                    03 // EXECUTIVE VERIFICATION
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
  );
}
