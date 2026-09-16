import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Company — Engineering Philosophy & Leadership",
  description:
    "Learn about Frontier Systems, a UK-based global technology and AI partner founded on engineering discipline, architectural integrity, and enterprise trust.",
  path: "/company",
});

const PILLARS = [
  {
    title: "Engineering First",
    description:
      "We do not build prototypes that fail in production. Every architecture is engineered from first principles with strict type-safety, resilience, and operational observability.",
  },
  {
    title: "Deterministic AI",
    description:
      "We treat artificial intelligence as a software component requiring verification, deterministic guardrails, and auditability — never a black-box mystery.",
  },
  {
    title: "High-Assurance Security",
    description:
      "Security is treated as a structural requirement from day zero. Defense-in-depth, zero-trust patterns, and cryptographic verification are native to everything we ship.",
  },
];

export default function CompanyPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Badge variant="neutral">Organization</Badge>
            <Heading as="h1" variant="h1" className="tracking-tight">
              A Technology Partner Built on Engineering Rigor & Enterprise Trust
            </Heading>
            <p className="text-[#A6AAAC] text-lg leading-relaxed">
              Frontier Systems is headquartered in London, partnering with visionary enterprises worldwide
              to solve complex computing, automation, and AI challenges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="p-8 bg-[#111416] border border-[#292D30] rounded-sm space-y-3"
              >
                <h2 className="text-lg font-semibold text-[#F5F5F3]">
                  {pillar.title}
                </h2>
                <p className="text-sm text-[#A6AAAC] leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 lg:p-10 bg-[#111416] border border-[#292D30] rounded-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-[#F5F5F3]">
                Looking to discuss an upcoming architecture or AI initiative?
              </h2>
              <p className="text-sm text-[#A6AAAC]">
                Connect directly with our senior technology team in London.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 px-5 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Initiate Consultation
            </Link>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
