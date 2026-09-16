import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Contact — Initiate Enterprise Consultation",
  description:
    "Get in touch with Frontier Systems to discuss technology consulting, AI architecture, bespoke software engineering, or enterprise automation programs.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="2xl">
          <div className="max-w-3xl space-y-4 mb-16">
            <Badge variant="accent">Inquiries</Badge>
            <Heading as="h1" variant="h1" className="tracking-tight">
              Initiate an Enterprise Architecture Consultation
            </Heading>
            <p className="text-[#A6AAAC] text-lg leading-relaxed">
              We collaborate with enterprise executives, technical leaders, and innovative organizations.
              Submit your project objectives or reach out to our London team directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 p-8 lg:p-10 bg-[#111416] border border-[#292D30] rounded-sm space-y-6">
              <h2 className="text-xl font-semibold text-[#F5F5F3]">
                Project Consultation Request
              </h2>
              <p className="text-sm text-[#A6AAAC] leading-relaxed">
                Our team reviews project inquiries within one business day. All discussions
                are held under mutual non-disclosure and architectural evaluation standards.
              </p>

              <div className="p-6 bg-[#171A1C] border border-[#292D30] rounded-sm space-y-4">
                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
                  Direct Inquiries Channel
                </div>
                <div className="text-sm text-[#F5F5F3] font-mono">
                  inquiries@frontiersystems.com
                </div>
                <p className="text-xs text-[#6E7376]">
                  Encrypted communications, RFP documentation, and architectural briefs welcome.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-8 bg-[#111416] border border-[#292D30] rounded-sm space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F5F3]">
                  London Headquarters
                </h3>
                <p className="text-sm text-[#A6AAAC]">
                  Frontier Systems Ltd.<br />
                  London, United Kingdom
                </p>
                <div className="pt-2 text-xs text-[#6E7376]">
                  Global delivery across UK, EMEA, and North America.
                </div>
              </div>

              <div className="p-8 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#F5F5F3]">
                  Security & Assurance
                </h3>
                <p className="text-xs text-[#A6AAAC] leading-relaxed">
                  Enterprise-grade data isolation, encrypted transit, and role-based access control standard across all engagements.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
