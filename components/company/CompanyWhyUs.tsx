import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Section 9: Why Frontier Systems
 * Articulates competitive differentiators grounded in technical discipline:
 * audited determinism, direct principal access, zero-trust posture, full IP ownership, and 48h turnaround.
 */
export function CompanyWhyUs() {
  const DIFFERENTIATORS = [
    {
      num: "01",
      title: "Audited Determinism",
      description:
        "We do not deliver black-box mysteries or stochastic guesswork. Every generative workflow, data transformation, and API route is bounded by typed schema validation and regression benchmarks.",
    },
    {
      num: "02",
      title: "Senior Engineering Staff Only",
      description:
        "Your technical initiatives are scoped, architected, and executed exclusively by senior systems engineers. We eliminate junior delegation layers and non-technical account management.",
    },
    {
      num: "03",
      title: "Default Zero-Trust Security",
      description:
        "Every network zone, microservice endpoint, and data cluster is hardened with mutual TLS, encrypted secret leasing, and automated vulnerability scanning aligned with ISO/IEC 27001 baselines.",
    },
    {
      num: "04",
      title: "Zero Vendor Lock-In",
      description:
        "All code, Docker containers, and Terraform scripts belong to you. We build on open, standardized runtimes and commit directly to your enterprise source control repositories.",
    },
    {
      num: "05",
      title: "48-Hour Scoping Turnaround",
      description:
        "We respect enterprise urgency. Following bilateral NDA execution, our senior architects deliver an initial technical feasibility review and architectural roadmap within 48 hours.",
    },
    {
      num: "06",
      title: "Production Longevity",
      description:
        "We engineer systems designed to operate stably for years under intense concurrency, complete with automated self-healing, observability dashboards, and clear documentation.",
    },
  ];

  return (
    <section
      id="why-frontier-systems"
      aria-labelledby="why-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>WHY FRONTIER SYSTEMS</Eyebrow>
          <Heading id="why-heading" as="h2" variant="h1">
            Why Enterprise Leaders Choose Frontier Systems
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            We operate with the discipline of a mission-critical engineering department rather than
            a marketing-driven agency. Here is what sets our delivery apart.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {DIFFERENTIATORS.map((item) => (
            <div
              key={item.num}
              className="p-8 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors space-y-3"
            >
              <div className="text-xs font-mono font-semibold text-[#63C7D9]">
                {item.num} {"//"} PRINCIPLE
              </div>
              <Heading as="h3" variant="h3" className="text-xl font-semibold text-[#F5F5F3]">
                {item.title}
              </Heading>
              <p className="text-sm text-[#A6AAAC] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
