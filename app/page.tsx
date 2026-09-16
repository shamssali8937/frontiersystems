import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Frontier Systems — B2B Technology & AI Partner",
  description:
    "Enterprise AI solutions, systems architecture, and mission-critical software engineering for global industry leaders.",
  path: "/",
});

export default function HomePage() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <section aria-label="Hero" className="pt-24 pb-20 lg:pt-32 lg:pb-28">
        <Container size="2xl">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              <Badge variant="accent">Enterprise Technology & AI</Badge>
              <span className="text-xs font-mono text-[#6E7376]">London &bull; Global Operations</span>
            </div>

            <Heading as="h1" variant="display" className="tracking-tight leading-tight text-[#F5F5F3]">
              Engineering High-Assurance Systems, Autonomous AI, and Critical Software
            </Heading>

            <p className="text-[#A6AAAC] text-lg lg:text-xl leading-relaxed max-w-3xl">
              Frontier Systems is the technology partner for forward-looking enterprises.
              We build resilient platform architecture, deterministic AI agents, and mission-critical
              software where reliability, security, and precision are absolute requirements.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Explore Capability Matrix
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center h-11 px-6 text-sm font-medium text-[#F5F5F3] bg-[#111416] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                View Technical Deployments
              </Link>
            </div>
          </div>

          {/* Key Architectural Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-16 mt-16 border-t border-[#171A1C]">
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F5F3]">99.99%</div>
              <div className="text-xs text-[#A6AAAC] pt-1">Target Platform Availability</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#63C7D9]">Zero Trust</div>
              <div className="text-xs text-[#A6AAAC] pt-1">Default Security Architecture</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F5F3]">Deterministic</div>
              <div className="text-xs text-[#A6AAAC] pt-1">Audited AI Workflows</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#F5F5F3]">UK Headquartered</div>
              <div className="text-xs text-[#A6AAAC] pt-1">Global Enterprise Delivery</div>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
