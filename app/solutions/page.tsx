import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Solutions — Enterprise AI & Systems Engineering",
  description:
    "Explore Frontier Systems capabilities across AI automation, high-performance digital products, enterprise business systems, and cyber-resilient infrastructure.",
  path: "/solutions",
});

const SOLUTIONS = [
  {
    slug: "ai-automation",
    title: "AI Systems & Automation",
    badge: "Intelligence",
    description:
      "Autonomous agent workflows, deterministic LLM orchestration, and enterprise decision automation engineered for scale and auditability.",
  },
  {
    slug: "digital-products",
    title: "Digital Products & Platforms",
    badge: "Engineering",
    description:
      "Mission-critical web applications, high-throughput APIs, and responsive enterprise interfaces built with modern reactive architectures.",
  },
  {
    slug: "business-systems",
    title: "Enterprise Business Systems",
    badge: "Operations",
    description:
      "Bespoke ERP, CRM, and operational middleware designed to unify fragmented data pipelines and legacy enterprise infrastructure.",
  },
  {
    slug: "infrastructure-security",
    title: "Infrastructure & Security",
    badge: "Assurance",
    description:
      "Zero-trust cloud architecture, defense-in-depth security hardening, and resilient PostgreSQL data clusters built for high availability.",
  },
];

export default function SolutionsPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Badge variant="accent">Capability Matrix</Badge>
            <Heading as="h1" variant="h1" className="tracking-tight">
              Enterprise Solutions Engineered for High-Assurance Environments
            </Heading>
            <p className="text-[#A6AAAC] text-lg leading-relaxed">
              We design, build, and deploy production-grade technology platforms. Every solution
              is grounded in rigorous architectural discipline, strict security baselines, and measurable business outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {SOLUTIONS.map((sol) => (
              <div
                key={sol.slug}
                className="p-8 bg-[#111416] border border-[#292D30] rounded-sm hover:border-[#3D4347] transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <span className="text-xs font-mono font-medium text-[#63C7D9] uppercase tracking-wider">
                    {sol.badge}
                  </span>
                  <h2 className="text-xl font-semibold text-[#F5F5F3]">
                    {sol.title}
                  </h2>
                  <p className="text-sm text-[#A6AAAC] leading-relaxed">
                    {sol.description}
                  </p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#171A1C]">
                  <Link
                    href={`/solutions/${sol.slug}`}
                    className="text-xs font-medium text-[#F5F5F3] hover:text-[#63C7D9] inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-1"
                  >
                    View Architecture & Case Evidence &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
