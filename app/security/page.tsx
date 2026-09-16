import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Security Posture & Assurance",
  description: "Frontier Systems high-assurance engineering, cryptography, and application security architecture.",
  path: "/security",
});

export default function SecurityPosturePage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="xl">
          <div className="max-w-3xl space-y-6">
            <Badge variant="accent">Information Security</Badge>
            <Heading as="h1" variant="h2">Security Posture & Architectural Assurance</Heading>
            <p className="text-sm text-[#A6AAAC] leading-relaxed">
              Frontier Systems treats security as an inviolable engineering primitive. Our applications, APIs,
              and infrastructure implement defense-in-depth principles across every layer of the compute stack.
            </p>
            <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm text-sm text-[#A6AAAC] space-y-3">
              <h2 className="text-base font-semibold text-[#F5F5F3]">Core Security Controls</h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#A6AAAC]">
                <li>Strict Content Security Policy (CSP), COOP, and CORP enforcement</li>
                <li>Zero-trust API layer with timing-safe authentication and token bucket rate limiting</li>
                <li>Binary magic-byte file signature validation and executable payload rejection</li>
                <li>Strict Zod server-side input sanitization and XSS neutralization</li>
                <li>Encrypted PostgreSQL data storage and TLS 1.3 in-transit communications</li>
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
