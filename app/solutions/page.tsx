import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { SOLUTIONS_DATA } from "@/lib/solutionsData";

export const metadata: Metadata = createMetadata({
  title: "Solutions Catalog & Capability Matrix",
  description:
    "Explore Frontier Systems' four engineering pillars: AI & Automation, Digital Products, Business Systems, and Infrastructure & Security for mission-critical enterprise environments.",
  path: "/solutions",
});

const PILLARS_LIST = Object.values(SOLUTIONS_DATA);

export default function SolutionsHubPage() {
  return (
    <PageContainer>
      {/* 1. HERO SECTION */}
      <section
        aria-label="Solutions Overview"
        className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 border-b border-[#171A1C]"
      >
        <Container size="2xl">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow>ENTERPRISE CAPABILITY MATRIX</Eyebrow>
              <span className="text-xs font-mono text-[#6E7376]">
                Four Engineering Pillars &bull; Global Operations
              </span>
            </div>

            {/* Single H1 on the page */}
            <Heading
              as="h1"
              variant="display"
              className="tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F3]"
            >
              Enterprise Engineering Solutions for High-Assurance Environments
            </Heading>

            <p className="text-[#A6AAAC] text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
              Frontier Systems designs, builds, and deploys mission-critical technology platforms.
              Every solution is grounded in deterministic architecture, strict security baselines, and
              mathematically verified business outcomes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Schedule Architecture Consultation
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#F5F5F3] bg-[#111416] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                View Technical Deployments
              </Link>
            </div>

            {/* Quality Baseline Badges */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Badge variant="accent" size="sm">
                4 CORE PILLARS
              </Badge>
              <Badge variant="neutral" dot size="sm">
                ZERO-TRUST BY DEFAULT
              </Badge>
              <Badge variant="neutral" dot size="sm">
                DETERMINISTIC SLA
              </Badge>
              <Badge variant="neutral" size="sm">
                ISO/IEC 27001 ALIGNED
              </Badge>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. THE FOUR PILLARS EXPANDED CATALOG */}
      <section
        id="pillar-catalog"
        aria-labelledby="pillar-catalog-heading"
        className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
      >
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Eyebrow>COMPREHENSIVE TAXONOMY</Eyebrow>
            <Heading id="pillar-catalog-heading" as="h2" variant="h1">
              Engineered Across Four Interconnected Domains
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              We do not build isolated point solutions. Each pillar is architected to seamlessly integrate with
              our broader enterprise stack, ensuring data consistency, strict security posture, and sub-second execution.
            </p>
          </div>

          <div className="space-y-12">
            {PILLARS_LIST.map((pillar, pillarIdx) => (
              <article
                key={pillar.slug}
                className="rounded-sm bg-[#111416] border border-[#292D30] p-8 sm:p-10 lg:p-12 hover:border-[#3D4347] transition-colors"
              >
                {/* Pillar Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#171A1C]">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono font-semibold text-[#63C7D9]">
                        0{pillarIdx + 1}
                      </span>
                      <span className="text-xs font-mono text-[#6E7376]">{"//"}</span>
                      <span className="text-xs font-mono text-[#A6AAAC] uppercase tracking-wider">
                        {pillar.badge}
                      </span>
                    </div>
                    <Heading as="h3" variant="h2" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
                      {pillar.title}
                    </Heading>
                  </div>

                  <Link
                    href={`/solutions/${pillar.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] h-10 px-5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] self-start lg:self-center shrink-0"
                  >
                    <span>View Pillar Architecture</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>

                <p className="text-sm sm:text-base text-[#A6AAAC] leading-relaxed max-w-4xl mb-8">
                  {pillar.subhead}
                </p>

                {/* Sub-Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#171A1C]">
                  {pillar.services.map((service, sIdx) => (
                    <div
                      key={service.id}
                      className="p-5 rounded-sm bg-[#0B0D0E]/60 border border-[#292D30] flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[10px] font-mono text-[#63C7D9] mb-1">
                          0{sIdx + 1} {"//"} {service.badge}
                        </div>
                        <div className="text-sm font-semibold text-[#F5F5F3] mb-1">
                          {service.name}
                        </div>
                        <p className="text-xs text-[#A6AAAC] leading-relaxed">
                          {service.tagline}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#171A1C]">
                        <span className="text-[10px] font-mono text-[#6E7376] uppercase">
                          PRODUCTION VERIFIED
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* 3. UNIFIED ARCHITECTURE BLUEPRINT */}
      <section
        id="unified-architecture"
        aria-labelledby="unified-architecture-heading"
        className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
      >
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Eyebrow>SYSTEMS INTEGRATION</Eyebrow>
            <Heading id="unified-architecture-heading" as="h2" variant="h1">
              How Our Four Pillars Unify Into an Enterprise Technology Fabric
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              No single technology exists in isolation. Our four pillars interlock to form an end-to-end,
              high-assurance enterprise software stack from edge client to private cloud cluster.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-xs font-mono text-[#63C7D9] mb-2">LAYER 01 // INTERFACE</div>
              <h3 className="text-lg font-semibold text-[#F5F5F3] mb-2">Digital Products</h3>
              <p className="text-xs text-[#A6AAAC] leading-relaxed mb-4">
                Delivers sub-100ms user interfaces across web, mobile, e-commerce, and multi-tenant SaaS.
              </p>
              <div className="text-[11px] font-mono text-[#6E7376] border-t border-[#171A1C] pt-2">
                DOWNSTREAM: &rarr; BUSINESS SYSTEMS
              </div>
            </div>

            <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-xs font-mono text-[#63C7D9] mb-2">LAYER 02 // OPERATIONS</div>
              <h3 className="text-lg font-semibold text-[#F5F5F3] mb-2">Business Systems</h3>
              <p className="text-xs text-[#A6AAAC] leading-relaxed mb-4">
                Executes transactional business logic, orchestrates APIs, and ensures ACID database consistency.
              </p>
              <div className="text-[11px] font-mono text-[#6E7376] border-t border-[#171A1C] pt-2">
                BIDIRECTIONAL: &harr; AI & AUTOMATION
              </div>
            </div>

            <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-xs font-mono text-[#63C7D9] mb-2">LAYER 03 // INTELLIGENCE</div>
              <h3 className="text-lg font-semibold text-[#F5F5F3] mb-2">AI & Automation</h3>
              <p className="text-xs text-[#A6AAAC] leading-relaxed mb-4">
                Automates complex business decisions with deterministic multi-agent state machines and custom RAG.
              </p>
              <div className="text-[11px] font-mono text-[#6E7376] border-t border-[#171A1C] pt-2">
                HOSTED ON: &rarr; CLOUD INFRASTRUCTURE
              </div>
            </div>

            <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-xs font-mono text-[#63C7D9] mb-2">LAYER 04 // FOUNDATION</div>
              <h3 className="text-lg font-semibold text-[#F5F5F3] mb-2">Infrastructure & Security</h3>
              <p className="text-xs text-[#A6AAAC] leading-relaxed mb-4">
                Hardens every tier with zero-trust mTLS, multi-AZ cloud clusters, and 24/7 mission-critical SRE support.
              </p>
              <div className="text-[11px] font-mono text-[#6E7376] border-t border-[#171A1C] pt-2">
                SLA BASELINE: 99.99% PLATFORM UPTIME
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. CLOSING CONSULTATION CTA */}
      <section
        aria-labelledby="hub-cta-heading"
        className="py-20 lg:py-32 bg-gradient-to-b from-[#0B0D0E] to-[#111416]"
      >
        <Container size="2xl">
          <div className="relative rounded-sm bg-[#111416] border border-[#292D30] p-8 sm:p-12 lg:p-16 overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#63C7D9]/5 blur-3xl pointer-events-none"
            />

            <div className="relative z-10 max-w-3xl space-y-6">
              <Eyebrow>INITIATE ARCHITECTURAL REVIEW</Eyebrow>

              <Heading id="hub-cta-heading" as="h2" variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
                Engage Our Principal Systems Engineers
              </Heading>

              <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
                Whether you require custom agentic AI pipelines, modern reactive web platforms, legacy system
                consolidation, or zero-trust cloud hardening, we begin with rigorous technical scoping under mutual NDA.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Schedule Architecture Consultation
                </Link>
                <Link
                  href="/company"
                  className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#F5F5F3] bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Our Engineering Principles
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#A6AAAC] hover:text-[#F5F5F3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  View Case Evidence &rarr;
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
