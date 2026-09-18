import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Section 1: Who Frontier Systems is
 * Articulates the agency narrative: a London-headquartered technology partner
 * dedicated to high-assurance systems, autonomous AI, and mission-critical software.
 */
export function CompanyHero() {
  return (
    <section
      aria-label="Who Frontier Systems Is"
      className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 border-b border-[#171A1C]"
    >
      <Container size="2xl">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>INSTITUTIONAL PROFILE</Eyebrow>
            <span className="text-xs font-mono text-[#6E7376]">
              London HQ &bull; Global Enterprise Delivery
            </span>
          </div>

          {/* Sole single H1 for the page */}
          <Heading
            as="h1"
            variant="display"
            className="tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F3]"
          >
            Engineering High-Assurance Systems, Autonomous AI, and Critical Software
          </Heading>

          <p className="text-[#A6AAAC] text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
            Frontier Systems is a specialised engineering consultancy headquartered in London.
            We partner with forward-looking enterprise leadership to design, build, and deploy
            deterministic technology platforms where reliability, security, and precision are absolute requirements.
          </p>

          <p className="text-sm sm:text-base text-[#6E7376] leading-relaxed max-w-3xl border-l-2 border-[#292D30] pl-4">
            We reject the disposable prototype model common in tech consulting. Instead, we operate as a dedicated
            systems engineering partner, taking direct responsibility for architectural integrity, production resilience,
            and measurable enterprise value.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Schedule Architecture Consultation
            </Link>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#F5F5F3] bg-[#111416] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Explore Solutions &rarr;
            </Link>
          </div>

          {/* Institutional Telemetry Baseline Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 mt-8 border-t border-[#171A1C]">
            <div className="p-4 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-2xl font-bold font-mono text-[#F5F5F3]">99.99%</div>
              <div className="text-[11px] font-mono text-[#63C7D9] uppercase pt-1">Availability SLA</div>
            </div>
            <div className="p-4 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-2xl font-bold font-mono text-[#4EBA87]">Zero Trust</div>
              <div className="text-[11px] font-mono text-[#A6AAAC] uppercase pt-1">Security Posture</div>
            </div>
            <div className="p-4 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-2xl font-bold font-mono text-[#F5F5F3]">Deterministic</div>
              <div className="text-[11px] font-mono text-[#63C7D9] uppercase pt-1">AI Execution</div>
            </div>
            <div className="p-4 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-2xl font-bold font-mono text-[#F5F5F3]">London HQ</div>
              <div className="text-[11px] font-mono text-[#A6AAAC] uppercase pt-1">Global Delivery</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
