import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import type { SanityCaseStudy } from "@/types/sanity";

interface SolutionRelatedWorkProps {
  pillarTitle: string;
  caseStudies: SanityCaseStudy[];
}

export function SolutionRelatedWork({ pillarTitle, caseStudies }: SolutionRelatedWorkProps) {
  const hasStudies = caseStudies && caseStudies.length > 0;

  return (
    <section
      id="case-evidence"
      aria-labelledby="case-evidence-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <Eyebrow>VERIFIED CASE EVIDENCE</Eyebrow>
            <Heading id="case-evidence-heading" as="h2" variant="h1">
              Selected Deployments in {pillarTitle}
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              Real-world engineering case studies demonstrating measurable performance outcomes,
              concurrency scale, and systems resilience.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study) => {
              const slug = study.slug?.current || study._id;
              return (
                <article
                  key={study._id}
                  className="flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-mono text-[#6E7376]">
                      <span>{study.clientIndustry || "Enterprise Partner"}</span>
                      <span className="text-[#63C7D9]">{pillarTitle}</span>
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
                Technical Case Evidence Under Active Confidentiality Clearance
              </Heading>

              <p className="text-sm sm:text-base text-[#A6AAAC] leading-relaxed">
                Due to strict non-disclosure agreements and enterprise security postures, our production deployments
                in {pillarTitle} undergo rigorous multi-stage sanitization before public indexing.
              </p>

              <p className="text-sm text-[#A6AAAC] leading-relaxed">
                Prospective enterprise leadership can review sanitized architectural teardowns, system blueprints,
                and telemetry metrics directly through technical consultation under bilateral NDA.
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-10 px-5 text-xs font-mono font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Request Technical Dossier Under NDA
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center h-10 px-5 text-xs font-mono font-medium text-[#F5F5F3] bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  View General Case Archive
                </Link>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
