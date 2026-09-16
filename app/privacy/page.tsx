import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Frontier Systems data privacy and information handling standards.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="xl">
          <div className="max-w-3xl space-y-6">
            <Badge variant="neutral">Legal & Governance</Badge>
            <Heading as="h1" variant="h2">Privacy Policy</Heading>
            <p className="text-sm text-[#A6AAAC] leading-relaxed">
              Frontier Systems Ltd. is committed to protecting the privacy, confidentiality, and data sovereignty
              of our corporate clients and website visitors. This notice outlines how information is collected,
              processed, and secured in compliance with applicable UK GDPR regulations.
            </p>
            <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm text-sm text-[#A6AAAC] space-y-3">
              <h2 className="text-base font-semibold text-[#F5F5F3]">Information Collection & Use</h2>
              <p>
                We only collect information submitted voluntarily through our inquiry channels. We do not sell, rent,
                or trade client data with third parties. All lead details and inquiry materials are retained exclusively
                for professional communication and project scoping.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
