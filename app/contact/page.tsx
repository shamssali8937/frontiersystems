import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = createMetadata({
  title: "Enterprise Contact & Consultation",
  description:
    "Initiate an enterprise architecture consultation with Frontier Systems. Connect directly with our London engineering leadership or submit your technical specifications.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28 bg-[#0B0D0E]">
        <Container size="2xl">
          {/* Header */}
          <div className="max-w-3xl space-y-4 mb-14">
            <Eyebrow>ENTERPRISE INQUIRIES // ARCHITECTURAL CONSULTATION</Eyebrow>
            <Heading as="h1" variant="h1" className="tracking-tight text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Initiate an Enterprise Architecture Consultation
            </Heading>
            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              We collaborate with enterprise executives, technical founders, and systems leaders.
              Complete our structured inquiry form below, or contact our London engineering office directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: Progressive 4-Step Form */}
            <div className="lg:col-span-8">
              <ContactForm />
            </div>

            {/* Right: Direct Channels & Engineering Assurance */}
            <aside className="lg:col-span-4 space-y-6" aria-label="Direct Contact and Credentials">
              {/* Direct Mailto Channel (SRS Mandatory Requirement: hello@frontiersystems.co) */}
              <div className="p-8 bg-[#111416] border border-[#292D30] rounded-sm space-y-4">
                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
                  Direct Inquiries Channel
                </div>
                <div>
                  <a
                    href="mailto:hello@frontiersystems.co"
                    className="text-lg font-mono font-medium text-[#F5F5F3] hover:text-[#63C7D9] underline underline-offset-4 decoration-[#63C7D9]/40 hover:decoration-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                  >
                    hello@frontiersystems.co
                  </a>
                </div>
                <p className="text-xs text-[#A6AAAC] leading-relaxed">
                  Encrypted technical briefs, bilateral non-disclosure requests, and formal RFPs can be transmitted directly to our inbox.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#6E7376]">
                  Visible direct contact channel &bull; Never concealed
                </div>
              </div>

              {/* London Engineering Office */}
              <div className="p-8 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <div className="text-xs font-mono text-[#A6AAAC] uppercase tracking-wider">
                  Engineering Headquarters
                </div>
                <div className="text-sm font-medium text-[#F5F5F3]">
                  Frontier Systems Ltd.
                </div>
                <address className="not-italic text-xs text-[#A6AAAC] leading-relaxed">
                  London, United Kingdom<br />
                  Global Delivery Across UK, EMEA, and North America
                </address>
              </div>

              {/* Engagement Assurance */}
              <div className="p-8 bg-[#111416] border border-[#292D30] rounded-sm space-y-4 text-xs font-mono">
                <div className="text-[#63C7D9] uppercase tracking-wider">
                  Engagement Guarantees
                </div>
                <ul className="space-y-3 text-[#A6AAAC]" role="list">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87] mt-1.5 shrink-0" />
                    <span>24–48 hour technical review turnaround SLA</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9] mt-1.5 shrink-0" />
                    <span>Standard bilateral NDA protection before code audit</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A6AAAC] mt-1.5 shrink-0" />
                    <span>Direct access to senior systems architects</span>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
