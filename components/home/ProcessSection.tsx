import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Understand",
    phase: "DISCOVERY & AUDIT",
    description:
      "We dissect existing architecture, analyse domain constraints, map operational threat vectors, and benchmark baseline latency and throughput metrics.",
    deliverable: "System Feasibility & Threat Assessment",
  },
  {
    step: "02",
    title: "Plan",
    phase: "DETERMINISTIC BLUEPRINT",
    description:
      "We architect high-assurance data topologies, define immutable interface contracts, specify strict latency budgets, and model zero-trust security perimeters.",
    deliverable: "Architecture Blueprint & SLA Contract",
  },
  {
    step: "03",
    title: "Build",
    phase: "HIGH-ASSURANCE DELIVERY",
    description:
      "We engineer production code with mathematical rigor, end-to-end type safety, automated verification suites, and zero-trust authentication pipelines.",
    deliverable: "Production Engine & Staging Audit",
  },
  {
    step: "04",
    title: "Evolve",
    phase: "TELEMETRY & REFINEMENT",
    description:
      "We instrument sub-millisecond telemetry, observe AI agent convergence, monitor distributed state consistency, and continually optimise performance under load. Once your project is underway, you'll have direct visibility into progress and documentation through your client portal.",
    deliverable: "Real-Time Observability & Optimisation",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="py-20 lg:py-32 border-t border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>ENGINEERING LIFECYCLE</Eyebrow>
          <Heading id="process-heading" as="h2" variant="h1">
            Deterministic Delivery: From Problem Discovery to Systems Evolution
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            Our 4-stage engineering lifecycle guarantees project predictability, eliminates architectural drift,
            and ensures enterprise systems remain resilient long after initial deployment.
          </p>
        </div>

        {/* 4 Process Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step) => (
            <article
              key={step.step}
              className="relative flex flex-col justify-between p-7 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors"
            >
              <div>
                {/* Step Index Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#171A1C]">
                  <span className="text-2xl font-bold font-mono text-[#63C7D9]">
                    {step.step}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-[#6E7376] uppercase">
                    PHASE {step.step}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider mb-2">
                  {step.phase}
                </div>

                <Heading as="h3" variant="h3" className="text-xl font-semibold mb-3 text-[#F5F5F3]">
                  {step.title}
                </Heading>

                <p className="text-xs sm:text-sm text-[#A6AAAC] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Bottom Deliverable Callout */}
              <div className="pt-4 border-t border-[#171A1C]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6E7376] mb-1">
                  Deliverable Spec
                </div>
                <div className="text-xs font-mono text-[#F5F5F3] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                  <span>{step.deliverable}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
