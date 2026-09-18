import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ClosingCtaSection() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-20 lg:py-32 border-t border-[#171A1C] bg-gradient-to-b from-[#0B0D0E] to-[#111416]"
    >
      <Container size="2xl">
        <div className="relative rounded-sm bg-[#111416] border border-[#292D30] p-8 sm:p-12 lg:p-16 overflow-hidden reveal-on-scroll">
          {/* Subtle Background Accent Glow */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#63C7D9]/5 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 max-w-3xl space-y-6">
            <Eyebrow>DIRECT ENGAGEMENT</Eyebrow>

            <Heading id="cta-heading" as="h2" variant="h1" className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
              Ready to Engineer Mission-Critical Software and Autonomous AI?
            </Heading>

            <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
              Connect directly with our senior systems architects. We conduct comprehensive technical scoping,
              sign bilateral NDAs, and evaluate system feasibility with mathematical discipline before any commercial commitment.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Schedule Technical Consultation
              </Link>
              <Link
                href="/company"
                className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#F5F5F3] bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Our Engineering Philosophy
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center justify-center h-12 px-6 text-sm font-medium text-[#A6AAAC] hover:text-[#F5F5F3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Explore Capability Matrix &rarr;
              </Link>
            </div>

            {/* SLA & Assurance Metadata Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 mt-8 border-t border-[#171A1C] text-xs font-mono text-[#6E7376]">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                <span>48h Technical Scoping Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9]" />
                <span>Mutual Non-Disclosure Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A6AAAC]" />
                <span>Direct Access to Senior Staff</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
