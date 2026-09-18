import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Terms of Engagement",
  description: "Terms and conditions governing Frontier Systems enterprise engineering contracts, consultancy, and client portal use.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="xl">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-4">
              <Badge variant="neutral">Legal &amp; Commercial Terms</Badge>
              <Heading as="h1" variant="display" className="text-3xl sm:text-4xl text-[#F5F5F3]">
                Terms of Engagement
              </Heading>
              <p className="text-sm font-mono text-[#6E7376]">
                Governing Law: England and Wales &bull; Frontier Systems Ltd
              </p>
            </div>

            <div className="space-y-8 text-sm text-[#A6AAAC] leading-relaxed">
              <p>
                These Terms of Engagement (&ldquo;Terms&rdquo;) govern the professional relationship between Frontier Systems Ltd (&ldquo;Frontier Systems&rdquo;) and enterprise clients accessing our website, client portal, or engaging our engineering teams for software architecture, automation platforms, or critical AI systems.
              </p>

              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  1. Scoping &amp; Statements of Work
                </h2>
                <p>
                  Specific engineering deliverables, milestones, resource commitments, and service level targets are formalized through mutually executed Statements of Work (SOW) or master services agreements. In the event of any conflict between these general Terms and an active SOW, the terms of the specific SOW shall prevail.
                </p>
              </div>

              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  2. Client Portal Access &amp; Security Obligations
                </h2>
                <p>
                  Access credentials for the Frontier Systems Client Portal are strictly personal to authorized enterprise personnel. Clients agree to maintain the confidentiality of magic links and session cookies. Any suspected breach or unauthorized access must be notified immediately to our engineering security desk.
                </p>
              </div>

              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  3. Intellectual Property &amp; Deliverables
                </h2>
                <p>
                  Unless otherwise specified in an applicable SOW, upon full settlement of associated milestone invoices, all bespoke code, architecture diagrams, and custom artifacts developed specifically for the client shall become the client&rsquo;s intellectual property. Frontier Systems retains full ownership of its pre-existing core libraries, tooling, algorithms, and general engineering methodologies.
                </p>
              </div>

              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  4. Commercial Fees, Billing &amp; Taxes
                </h2>
                <p>
                  Invoices are issued in British Pounds Sterling (GBP) or the contractual currency specified in the relevant agreement. All professional fees are exclusive of Value Added Tax (VAT) and any applicable local withholding taxes, which shall be charged at the prevailing statutory rate where required by UK law. Payment terms are net 30 days from date of invoice unless otherwise agreed in writing.
                </p>
              </div>

              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  5. Confidentiality &amp; Non-Disclosure
                </h2>
                <p>
                  Both parties agree to hold all proprietary software architectures, business strategies, and technical specifications exchanged during consultations or active engagements in strict confidence, implementing security controls no less stringent than those utilized for their own sensitive operational data.
                </p>
              </div>

              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  6. Governing Law &amp; Jurisdiction
                </h2>
                <p>
                  These Terms, all Statements of Work, and any non-contractual obligations arising out of or in connection with them shall be governed by and construed in accordance with the laws of England and Wales. The courts of England and Wales shall have exclusive jurisdiction to settle any dispute or claim.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#6E7376] border-t border-[#171A1C]">
                <Link href="/privacy-policy" className="text-[#63C7D9] hover:underline">
                  View Privacy Policy &rarr;
                </Link>
                <Link href="/cookie-policy" className="text-[#63C7D9] hover:underline">
                  View Cookie Policy &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
