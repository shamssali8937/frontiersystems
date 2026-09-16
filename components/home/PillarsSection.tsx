import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";

interface PillarData {
  id: string;
  index: string;
  slug: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  specBadge: string;
  capabilities: string[];
}

const PILLARS: PillarData[] = [
  {
    id: "ai-automation",
    index: "01",
    slug: "ai-automation",
    title: "AI & Automation",
    category: "Intelligence & Agents",
    tagline: "Autonomous Agent Systems & Deterministic Workflows",
    description:
      "We build production-grade agentic architectures, custom inference pipelines, and deterministic automation loops that eliminate operational bottlenecks with mathematical repeatability.",
    specBadge: "AUDITED_DETERMINISM",
    capabilities: [
      "Custom LLM & Agentic Workflows",
      "Deterministic Decision Pipelines",
      "Predictive Analytics & Forecasting",
      "Automated Operational Telemetry",
    ],
  },
  {
    id: "digital-products",
    index: "02",
    slug: "digital-products",
    title: "Digital Products",
    category: "Platforms & Systems",
    tagline: "Mission-Critical Platforms & Enterprise Interfaces",
    description:
      "Modern web and multi-device platforms built with high-throughput architectures, sub-second response profiles, and resilient state synchronization for global enterprise users.",
    specBadge: "SUB_100MS_TTFB",
    capabilities: [
      "Next.js High-Throughput Applications",
      "Real-Time Telemetry & Dashboards",
      "Interactive WebGL / 3D Interfaces",
      "Multi-Tenant SaaS Architecture",
    ],
  },
  {
    id: "business-systems",
    index: "03",
    slug: "business-systems",
    title: "Business Systems",
    category: "Operations & Middleware",
    tagline: "Unified Enterprise Architecture & Middleware",
    description:
      "Bespoke ERP, CRM, and operational middleware engineered to dissolve enterprise silos, synchronize legacy systems, and automate mission-critical transactional lifecycles.",
    specBadge: "EVENT_DRIVEN_SYNC",
    capabilities: [
      "Custom Internal Portals & Tooling",
      "Legacy Migration & DB Refactoring",
      "Distributed Event Streaming",
      "Compliance & Audit Engines",
    ],
  },
  {
    id: "infrastructure-security",
    index: "04",
    slug: "infrastructure-security",
    title: "Infrastructure & Security",
    category: "Resilience & Security",
    tagline: "Zero-Trust Cloud & Cyber-Resilient Foundations",
    description:
      "Zero-trust cloud topology, multi-region Kubernetes clusters, and hardened PostgreSQL data layers engineered for 99.99% availability under adverse operating conditions.",
    specBadge: "ZERO_TRUST_VERIFIED",
    capabilities: [
      "Zero-Trust Cloud Architecture",
      "PostgreSQL Clustering & Durability",
      "Automated CI/CD Verification",
      "99.99% High Availability Failover",
    ],
  },
];

export function PillarsSection() {
  return (
    <section
      id="solutions"
      aria-labelledby="pillars-heading"
      className="py-20 lg:py-32 border-t border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl space-y-4">
            <Eyebrow>CAPABILITY MATRIX</Eyebrow>
            <Heading id="pillars-heading" as="h2" variant="h1">
              Engineered Across Four Core Architectural Pillars
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              Every enterprise system we engineer balances deterministic intelligence, resilient infrastructure,
              and strict security compliance. We do not build throwaway prototypes; we deliver lasting software assets.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/solutions"
              className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#63C7D9] hover:text-[#78D3E3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] py-1"
            >
              <span>Explore Complete Solution Catalog</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="group relative flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors duration-200"
            >
              <div>
                {/* Card Top Metadata Bar */}
                <div className="flex items-center justify-between gap-4 pb-6 mb-6 border-b border-[#171A1C]">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-semibold text-[#63C7D9]">
                      {pillar.index}
                    </span>
                    <span className="text-xs font-mono text-[#6E7376]">
                      {"//"}
                    </span>
                    <span className="text-xs font-mono text-[#A6AAAC] uppercase tracking-wider">
                      {pillar.category}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    {pillar.specBadge}
                  </Badge>
                </div>

                {/* Title & Tagline */}
                <Heading as="h3" variant="h2" className="text-xl sm:text-2xl font-semibold mb-2 text-[#F5F5F3] group-hover:text-white transition-colors">
                  {pillar.title}
                </Heading>
                <div className="text-xs font-mono text-[#63C7D9] mb-4">
                  {pillar.tagline}
                </div>

                {/* Description */}
                <p className="text-sm text-[#A6AAAC] leading-relaxed mb-8">
                  {pillar.description}
                </p>

                {/* Capabilities List */}
                <div className="space-y-2.5 mb-8">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
                    Core Deliverables
                  </div>
                  <ul className="space-y-2 text-xs text-[#F5F5F3]" role="list">
                    {pillar.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#63C7D9] mt-1.5 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="pt-6 border-t border-[#171A1C] flex items-center justify-between">
                <Link
                  href={`/solutions/${pillar.slug}`}
                  className="inline-flex items-center gap-2 text-xs font-mono font-medium text-[#F5F5F3] group-hover:text-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-1"
                >
                  <span>Architecture & Technical Specifications</span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1 duration-150 motion-reduce:transform-none">
                    &rarr;
                  </span>
                </Link>
                <span className="text-[11px] font-mono text-[#6E7376]">
                  SPEC_DOC
                </span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
