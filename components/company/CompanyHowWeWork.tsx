import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Section 4: How we work
 * Articulates the operational engagement model: direct access to senior staff,
 * mutual NDA by default, milestone-gated sprints, and full IP transfer.
 */
export function CompanyHowWeWork() {
  const WORK_PRINCIPLES = [
    {
      num: "01",
      title: "Direct Access to Principal Architects",
      tag: "NO INTERMEDIARY LAYERS",
      description:
        "You engage directly with senior systems architects and principal engineers who write production code. We do not use account managers, offshore junior delegation, or non-technical intermediaries.",
    },
    {
      num: "02",
      title: "Bilateral NDA by Default",
      tag: "COMPLIANCE & CONFIDENTIALITY",
      description:
        "Every engagement begins with mutual non-disclosure protection. We review internal codebases, proprietary schemas, and infrastructure topologies within secure, clearance-controlled boundaries.",
    },
    {
      num: "03",
      title: "Milestone-Gated Engineering Sprints",
      tag: "EMPIRICAL ACCEPTANCE CRITERIA",
      description:
        "We structure delivery into transparent two-week sprints governed by mathematical acceptance criteria (e.g. latency budgets, test coverage, zero CVEs) rather than subjective progress decks.",
    },
    {
      num: "04",
      title: "Complete Code & Infrastructure Ownership",
      tag: "ZERO VENDOR LOCK-IN",
      description:
        "All code, Terraform scripts, Docker configurations, and documentation are committed directly to your enterprise Git repositories. You retain complete ownership of all created assets.",
    },
  ];

  return (
    <section
      id="how-we-work"
      aria-labelledby="how-we-work-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>OPERATIONAL ENGAGEMENT MODEL</Eyebrow>
          <Heading id="how-we-work-heading" as="h2" variant="h1">
            How We Work: Direct Access, Transparent Telemetry, and Executive Accountability
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            We operate as an extension of your technical leadership team, removing organizational friction
            and aligning completely with your performance, security, and business objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {WORK_PRINCIPLES.map((principle) => (
            <div
              key={principle.num}
              className="p-8 sm:p-10 rounded-sm bg-[#111416] border border-[#292D30] space-y-4"
            >
              <div className="flex items-center justify-between pb-4 border-b border-[#171A1C]">
                <span className="text-xs font-mono font-semibold text-[#63C7D9]">
                  {principle.num}
                </span>
                <span className="text-[10px] font-mono tracking-wider text-[#A6AAAC] uppercase">
                  {principle.tag}
                </span>
              </div>

              <Heading as="h3" variant="h3" className="text-xl font-semibold text-[#F5F5F3]">
                {principle.title}
              </Heading>

              <p className="text-sm text-[#A6AAAC] leading-relaxed">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
