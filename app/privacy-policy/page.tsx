import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "Frontier Systems data protection standards, UK GDPR disclosures, and information handling practices.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="xl">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-4">
              <Badge variant="neutral">Legal &amp; Regulatory Compliance</Badge>
              <Heading as="h1" variant="display" className="text-3xl sm:text-4xl text-[#F5F5F3]">
                Privacy Policy &amp; Data Governance
              </Heading>
              <p className="text-sm font-mono text-[#6E7376]">
                Effective Date: September 2026 &bull; Frontier Systems Ltd
              </p>
            </div>

            <div className="space-y-8 text-sm text-[#A6AAAC] leading-relaxed">
              <p>
                Frontier Systems Ltd (&ldquo;Frontier Systems&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) provides high-assurance systems engineering, computational architectures, and deterministic AI solutions for corporate clients. We are registered in the United Kingdom under company registration number <strong className="text-[#F5F5F3] font-mono">[COMPANIES_HOUSE_NUMBER: Pending Filing]</strong> with our registered office at <strong className="text-[#F5F5F3] font-mono">[REGISTERED_OFFICE_ADDRESS: London, United Kingdom]</strong>.
              </p>
              <p>
                This Privacy Policy provides a transparent, factual statement of how personal and corporate data is collected, processed, stored, and protected in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
              </p>

              {/* Section 1 */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  1. Information Collected Through Public Inquiry Channels
                </h2>
                <p>
                  When prospective clients or technical partners submit an engineering consultation inquiry through our public website form, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#A6AAAC]">
                  <li><strong className="text-[#F5F5F3]">Contact Details:</strong> Full name, corporate email address, organization name, and optional telephone number.</li>
                  <li><strong className="text-[#F5F5F3]">Project Scope:</strong> Target engineering service pillar, project timeline, budget range, and technical specifications submitted in the message body.</li>
                  <li><strong className="text-[#F5F5F3]">Architecture Attachments:</strong> Binary documents and technical briefs uploaded directly (restricted to PDF, PNG, JPEG, and WEBP formats; up to 5MB per file).</li>
                  <li><strong className="text-[#F5F5F3]">Security &amp; Abuse Metadata:</strong> Anonymized SHA-256 IP hash and submission timestamp to enforce rate limiting and detect automated DDoS threats.</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  2. Client Portal Account &amp; Engagement Data
                </h2>
                <p>
                  For clients with active engineering contracts, access to the client portal is provisioned directly by our engineering administration. We collect and store:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#A6AAAC]">
                  <li><strong className="text-[#F5F5F3]">Portal Account Identity:</strong> Client name, authorized corporate email, organization name, and last authenticated login timestamp.</li>
                  <li><strong className="text-[#F5F5F3]">Passwordless Authentication Records:</strong> SHA-256 hashed single-use magic link tokens with a 15-minute expiry window. We never store customer passwords.</li>
                  <li><strong className="text-[#F5F5F3]">Project Records:</strong> Milestone progress updates, contractual deliverables, and client-uploaded specification files.</li>
                  <li><strong className="text-[#F5F5F3]">Financial Records:</strong> Invoice numbers, statement issue dates, due dates, billing amounts, settlement timestamps, and signed PDF document references.</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  3. Spam Prevention &amp; Infrastructure Providers
                </h2>
                <p>
                  To protect our public endpoints from brute-force attacks and abuse without invasive user tracking, we implement:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#A6AAAC]">
                  <li><strong className="text-[#F5F5F3]">Cloudflare Turnstile:</strong> We use Cloudflare Turnstile on our public consultation form for automated spam and bot detection. Turnstile verifies legitimate human interaction using privacy-preserving cryptographic challenges without reading or tracking personal browser history across sites.</li>
                  <li><strong className="text-[#F5F5F3]">Isolated Object Storage:</strong> Private attachments are encrypted at rest and delivered exclusively through short-lived (5-minute TTL) cryptographically signed URLs.</li>
                  <li><strong className="text-[#F5F5F3]">Durable Rate Limiting:</strong> Serverless sliding-window counters track request frequency per IP to prevent credential stuffing and resource exhaustion.</li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  4. Data Retention Policy
                </h2>
                <p>
                  We adhere to strict purpose-limitation data retention principles:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#A6AAAC]">
                  <li><strong className="text-[#F5F5F3]">Inquiry Submissions:</strong> General scoping inquiries not progressing to contractual engagements are retained for a maximum of 24 months for relationship history, or deleted promptly upon request.</li>
                  <li><strong className="text-[#F5F5F3]">Magic Link Tokens:</strong> Single-use authentication tokens expire after 15 minutes and expired records are purged automatically.</li>
                  <li><strong className="text-[#F5F5F3]">Project &amp; Financial Records:</strong> Contractual deliverables and invoice statements are retained for 7 years in compliance with UK statutory company and tax record retention requirements (HMRC compliance).</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  5. Your Rights Under UK GDPR
                </h2>
                <p>
                  Under UK data protection legislation, you possess clear rights regarding your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#A6AAAC]">
                  <li><strong className="text-[#F5F5F3]">Right of Access:</strong> You may request confirmation and copies of personal data held about you.</li>
                  <li><strong className="text-[#F5F5F3]">Right to Rectification:</strong> You may request correction of inaccurate or incomplete records.</li>
                  <li><strong className="text-[#F5F5F3]">Right to Erasure:</strong> You may request erasure of personal data where retention is no longer legally required.</li>
                  <li><strong className="text-[#F5F5F3]">Right to Restriction &amp; Objection:</strong> You may object to processing or request restriction under specified statutory circumstances.</li>
                  <li><strong className="text-[#F5F5F3]">Right to Data Portability:</strong> You may request structured, machine-readable export of data provided to us.</li>
                </ul>
              </div>

              {/* Section 6 */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  6. Contact Details &amp; Data Protection Officer
                </h2>
                <p>
                  To exercise any statutory data rights, or if you have questions regarding our privacy architecture, please contact our data governance team:
                </p>
                <div className="text-xs font-mono text-[#F5F5F3] space-y-1 pt-1">
                  <p>Data Protection Officer: <span className="text-[#63C7D9]">[DPO_NAME: Appointed Governance Lead]</span></p>
                  <p>ICO Registration Number: <span className="text-[#63C7D9]">[ICO_REGISTRATION_NUMBER: Pending Allocation]</span></p>
                  <p>Email: <a href="mailto:privacy@frontiersystems.co" className="text-[#63C7D9] hover:underline">privacy@frontiersystems.co</a></p>
                  <p>Postal Address: Frontier Systems Ltd, London, United Kingdom</p>
                </div>
                <p className="pt-2 text-xs text-[#6E7376]">
                  You also have the right to lodge a complaint with the UK Information Commissioner&rsquo;s Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#63C7D9] hover:underline">ico.org.uk</a> if you believe your data has been handled unlawfully.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#6E7376] border-t border-[#171A1C]">
                <Link href="/cookie-policy" className="text-[#63C7D9] hover:underline">
                  View Cookie Policy &rarr;
                </Link>
                <Link href="/terms" className="text-[#63C7D9] hover:underline">
                  View Terms of Engagement &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
