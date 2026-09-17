import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Sections 5, 6, 7, 8:
 * - Understand (Phase 01)
 * - Plan (Phase 02)
 * - Build (Phase 03)
 * - Evolve (Phase 04)
 */
export function CompanyLifecycle() {
  const LIFECYCLE_STAGES = [
    {
      num: "01",
      name: "Understand",
      eyebrow: "SECTION 05 // SYSTEM DISCOVERY & DOMAIN AUDIT",
      title: "Deconstruct Systems & Quantify Operational Constraints",
      description:
        "Before writing code, we dissect your current systems architecture, analyze legacy dependencies, benchmark baseline throughput and latency, and map potential security vulnerabilities across all trust boundaries.",
      deliverable: "System Feasibility & Threat Assessment",
      activities: [
        "Infrastructure topology analysis and CVE vulnerability scan",
        "Legacy database schema normalization and bottleneck profiling",
        "Deterministic latency and concurrency baseline benchmarking",
        "Stakeholder domain modeling and SLA target definition",
      ],
    },
    {
      num: "02",
      name: "Plan",
      eyebrow: "SECTION 06 // DETERMINISTIC BLUEPRINT & SLA CONTRACT",
      title: "Architect Immutable Schemas & Technical Specifications",
      description:
        "We construct formal interface contracts, define data schemas, model state machine transitions, and design zero-trust network perimeters. Every technical deliverable is tied to measurable acceptance gates.",
      deliverable: "Architecture Blueprint & SLA Contract",
      activities: [
        "Formal typed schema contracts (Zod / Pydantic / Prisma)",
        "Zero-trust network architecture and mTLS boundary design",
        "Component design system and accessibility token specification",
        "Milestone-gated execution roadmap with latency budgets",
      ],
    },
    {
      num: "03",
      name: "Build",
      eyebrow: "SECTION 07 // HIGH-ASSURANCE DELIVERY & VERIFICATION",
      title: "Engineer Production Code with End-to-End Type Safety",
      description:
        "Our senior systems engineers implement the platform using proven, enterprise-grade technologies. Every component passes rigorous automated unit tests, integration test harnesses, and security pipeline checks.",
      deliverable: "Hardened Production Engine & Staging Audit",
      activities: [
        "Clean, fully typed implementation across all layers",
        "Automated CI/CD validation suites with zero CVE policy",
        "Deterministic agent state machine and tool-execution guards",
        "Shadow pipeline deployment and data parity verification",
      ],
    },
    {
      num: "04",
      name: "Evolve",
      eyebrow: "SECTION 08 // OBSERVABILITY & CONTINUOUS REFINEMENT",
      title: "Instrument Telemetry & Proactively Optimize Performance",
      description:
        "Post-deployment, we instrument sub-millisecond telemetry, observe AI agent convergence, monitor distributed state consistency, and continually optimize performance under adverse operational loads.",
      deliverable: "Real-Time Observability & Optimization Loops",
      activities: [
        "OpenTelemetry distributed tracing and Prometheus alerting",
        "Continuous AI model drift and hallucination monitoring",
        "Automated horizontal auto-scaling and resource tuning",
        "Quarterly chaos testing and disaster recovery validation",
      ],
    },
  ];

  return (
    <section
      id="lifecycle"
      aria-labelledby="lifecycle-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>FOUR-PHASE LIFECYCLE</Eyebrow>
          <Heading id="lifecycle-heading" as="h2" variant="h1">
            Deterministic Delivery: Understand, Plan, Build, and Evolve
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            Our disciplined four-phase engineering lifecycle eliminates architectural drift, guarantees
            predictability, and ensures software assets remain resilient long after initial deployment.
          </p>
        </div>

        <div className="space-y-12">
          {LIFECYCLE_STAGES.map((stage) => (
            <article
              key={stage.num}
              className="p-8 sm:p-10 lg:p-12 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#171A1C]">
                <div>
                  <div className="text-xs font-mono text-[#63C7D9] mb-1">
                    {stage.eyebrow}
                  </div>
                  <Heading as="h3" variant="h2" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
                    Phase {stage.num}: {stage.name}
                  </Heading>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#4EBA87] bg-[#171A1C] px-3.5 py-1.5 rounded-sm border border-[#292D30] self-start lg:self-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                  <span>GATE: {stage.deliverable}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-4">
                  <h4 className="text-lg font-medium text-[#F5F5F3]">
                    {stage.title}
                  </h4>
                  <p className="text-sm sm:text-base text-[#A6AAAC] leading-relaxed">
                    {stage.description}
                  </p>
                </div>

                <div className="lg:col-span-5 p-6 rounded-sm bg-[#0B0D0E]/60 border border-[#292D30] space-y-3">
                  <div className="text-[11px] font-mono text-[#6E7376] uppercase tracking-wider">
                    Core Technical Activities
                  </div>
                  <ul className="space-y-2 text-xs text-[#F5F5F3]" role="list">
                    {stage.activities.map((activity, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#63C7D9] mt-1.5 shrink-0" />
                        <span>{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
