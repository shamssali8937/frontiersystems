import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Section 2: Mission
 * Articulates the agency mandate: eliminating operational entropy through mathematical engineering.
 */
export function CompanyMission() {
  return (
    <section
      id="mission"
      aria-labelledby="mission-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>INSTITUTIONAL PURPOSE</Eyebrow>
          <Heading id="mission-heading" as="h2" variant="h1">
            Our Mission: Eliminating Operational Entropy Through Mathematical Systems Engineering
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            Enterprise software frequently collapses under the weight of accumulated technical debt,
            unverified stochastic tools, and architectural drift. Our mission is to restore deterministic
            discipline to modern enterprise computing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="p-8 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
            <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
              01 {"//"} PREDICTABILITY
            </div>
            <Heading as="h3" variant="h3" className="text-xl font-semibold text-[#F5F5F3]">
              Deterministic Execution
            </Heading>
            <p className="text-sm text-[#A6AAAC] leading-relaxed">
              Every system state transition, API response, and agentic workflow must be mathematically predictable.
              We construct software where edge cases are isolated by typed schema boundaries rather than discovered in production.
            </p>
          </div>

          <div className="p-8 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
            <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
              02 {"//"} DATA SOVEREIGNTY
            </div>
            <Heading as="h3" variant="h3" className="text-xl font-semibold text-[#F5F5F3]">
              Architectural Independence
            </Heading>
            <p className="text-sm text-[#A6AAAC] leading-relaxed">
              Enterprises must own their computational infrastructure. We engineer portable, containerized architectures
              and private VPC inference clusters that eliminate proprietary vendor lock-in and safeguard corporate IP.
            </p>
          </div>

          <div className="p-8 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
            <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider">
              03 {"//"} LONGEVITY
            </div>
            <Heading as="h3" variant="h3" className="text-xl font-semibold text-[#F5F5F3]">
              Durable Capital Assets
            </Heading>
            <p className="text-sm text-[#A6AAAC] leading-relaxed">
              We build production software designed to outlast technology hype cycles. Every line of code is structured,
              documented, and verified to function as a durable, appreciating enterprise asset.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
