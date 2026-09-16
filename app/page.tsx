import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroVisual } from "@/components/home/HeroVisual";
import { PillarsSection } from "@/components/home/PillarsSection";
import { SelectedWorkSection } from "@/components/home/SelectedWorkSection";
import { ProcessSection } from "@/components/home/ProcessSection";
import { ClosingCtaSection } from "@/components/home/ClosingCtaSection";
import { getCaseStudies } from "@/lib/sanity.queries";

export const metadata: Metadata = createMetadata({
  title: "Frontier Systems — Enterprise AI & Systems Engineering Partner",
  description:
    "Engineering high-assurance systems, deterministic AI automation, and mission-critical software for global enterprise leaders.",
  path: "/",
});

export default async function HomePage() {
  const caseStudies = await getCaseStudies();

  return (
    <PageContainer>
      {/* 1. HERO SECTION */}
      <section
        aria-label="Hero"
        className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28 overflow-hidden"
      >
        <Container size="2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="flex flex-wrap items-center gap-3">
                <Eyebrow>ENTERPRISE ENGINEERING & AI</Eyebrow>
                <span className="text-xs font-mono text-[#6E7376]">
                  London HQ &bull; Global Operations
                </span>
              </div>

              {/* Sole Single H1 on the page */}
              <Heading
                as="h1"
                variant="display"
                className="tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F3]"
              >
                Engineering Autonomous AI, Resilient Systems, and Critical Software
              </Heading>

              <p className="text-[#A6AAAC] text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl">
                Frontier Systems is the technology partner for forward-looking enterprises navigating computational
                scale. We build deterministic AI workflows, fault-tolerant platform architectures, and mission-critical
                software where reliability, security, and precision are absolute requirements.
              </p>

              {/* Hero Call to Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  href="/solutions"
                  className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Explore Solutions
                </Link>
                <Link
                  href="/work"
                  className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#F5F5F3] bg-[#111416] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  View Case Evidence
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center h-12 px-5 text-sm font-mono text-[#63C7D9] hover:text-[#78D3E3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Consult an Engineer &rarr;
                </Link>
              </div>

              {/* Enterprise Security & Trust Tags */}
              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Badge variant="neutral" dot size="sm">
                  ISO/IEC 27001 ALIGNED
                </Badge>
                <Badge variant="neutral" dot size="sm">
                  ZERO-TRUST BY DEFAULT
                </Badge>
                <Badge variant="accent" size="sm">
                  DETERMINISTIC SLA
                </Badge>
              </div>
            </div>

            {/* Hero Visual Column (WebGL + SVG Fallback + Screen Reader Text) */}
            <div className="lg:col-span-5 flex justify-center">
              <HeroVisual />
            </div>
          </div>

          {/* Key Architectural Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-[#171A1C]">
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3]">
                99.99%
              </div>
              <div className="text-xs text-[#A6AAAC] pt-1">Target Platform Availability</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#63C7D9]">
                Zero Trust
              </div>
              <div className="text-xs text-[#A6AAAC] pt-1">Default Security Posture</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3]">
                Deterministic
              </div>
              <div className="text-xs text-[#A6AAAC] pt-1">Audited AI Model Execution</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3]">
                Global Delivery
              </div>
              <div className="text-xs text-[#A6AAAC] pt-1">London HQ &bull; Global Deployments</div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. FOUR PILLARS SECTION */}
      <PillarsSection />

      {/* 3. SELECTED WORK SECTION (Sanity Content / Intentional Empty State) */}
      <SelectedWorkSection caseStudies={caseStudies} />

      {/* 4. PROCESS SECTION (Understand -> Plan -> Build -> Evolve) */}
      <ProcessSection />

      {/* 5. CLOSING CTA SECTION */}
      <ClosingCtaSection />
    </PageContainer>
  );
}
