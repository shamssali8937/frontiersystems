import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Terms of Engagement",
  description: "Frontier Systems terms of engagement and website usage guidelines.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="xl">
          <div className="max-w-3xl space-y-6">
            <Badge variant="neutral">Legal & Governance</Badge>
            <Heading as="h1" variant="h2">Terms of Engagement</Heading>
            <p className="text-sm text-[#A6AAAC] leading-relaxed">
              These terms govern the use of this website and establish the foundational terms under which Frontier Systems Ltd.
              communicates with enterprise partners and prospects.
            </p>
            <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm text-sm text-[#A6AAAC] space-y-3">
              <h2 className="text-base font-semibold text-[#F5F5F3]">Intellectual Property & Professional Services</h2>
              <p>
                All content, architecture diagrams, and design assets published on this website are the proprietary property of Frontier Systems Ltd.
                Formal technology engagements, code delivery, and architecture deliverables are governed by separate Master Services Agreements (MSA) and Statements of Work (SOW).
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
