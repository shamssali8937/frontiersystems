import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Work & Case Studies — Proven Engineering Impact",
  description:
    "Review technical case studies demonstrating real-world systems architecture, AI automation, and measurable enterprise value delivered by Frontier Systems.",
  path: "/work",
});

const CASE_STUDIES = [
  {
    slug: "autonomous-logistics-dispatch",
    client: "Global Logistics Leader",
    sector: "Supply Chain & Freight",
    title: "Autonomous Logistics Dispatch & Fleet Routing Engine",
    impact: "34% reduction in dispatch latency; 99.98% platform reliability during peak seasonal volumes.",
    summary:
      "Engineered an event-driven telemetry and route optimization engine processing millions of geospatial data points per minute with deterministic failover.",
  },
  {
    slug: "high-throughput-risk-platform",
    client: "Tier-1 Financial Institution",
    sector: "Fintech & Capital Markets",
    title: "Real-Time Counterparty Risk Calculation Engine",
    impact: "Sub-millisecond trade verification with mathematical compliance verification.",
    summary:
      "Constructed a high-throughput computational pipeline replacing legacy batch processing with low-latency in-memory valuation clusters.",
  },
];

export default function WorkPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Badge variant="accent">Case Evidence</Badge>
            <Heading as="h1" variant="h1" className="tracking-tight">
              Selected Technical Deployments & Systems Architecture
            </Heading>
            <p className="text-[#A6AAAC] text-lg leading-relaxed">
              We engineer mission-critical systems where failure is not an option. Here is how
              our architecture, AI engineering, and delivery practices solve complex enterprise challenges.
            </p>
          </div>

          <div className="space-y-8">
            {CASE_STUDIES.map((study) => (
              <div
                key={study.slug}
                className="p-8 lg:p-10 bg-[#111416] border border-[#292D30] rounded-sm hover:border-[#3D4347] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 text-xs font-mono text-[#6E7376] mb-4">
                  <span>{study.sector}</span>
                  <span className="text-[#63C7D9]">{study.client}</span>
                </div>
                <h2 className="text-2xl font-semibold text-[#F5F5F3] mb-4">
                  {study.title}
                </h2>
                <p className="text-sm text-[#A6AAAC] leading-relaxed mb-6 max-w-2xl">
                  {study.summary}
                </p>
                <div className="p-4 bg-[#171A1C] border-l-2 border-[#63C7D9] rounded-r-sm text-xs text-[#F5F5F3] mb-6">
                  <span className="font-semibold text-[#63C7D9]">Business Impact: </span>
                  {study.impact}
                </div>
                <Link
                  href={`/work/${study.slug}`}
                  className="text-xs font-medium text-[#F5F5F3] hover:text-[#63C7D9] inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-1"
                >
                  Read Technical Architecture Breakdown &rarr;
                </Link>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
