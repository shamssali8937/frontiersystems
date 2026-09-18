import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";

/**
 * Section 3: Technology philosophy
 * Articulates the engineering tenets: First principles, deterministic AI, zero-trust, and type-safety.
 */
export function CompanyPhilosophy() {
  const PHILOSOPHY_TENETS = [
    {
      num: "01",
      title: "Architecture from First Principles",
      subtitle: "SYSTEMIC MODELING OVER TEMPLATES",
      description:
        "We reject commodity boilerplate and speculative abstractions. Every system design begins with a rigorous audit of domain constraints, peak concurrency requirements, and hardware limits.",
      axiom: "Axiom: Software must reflect physical operational realities, not framework conventions.",
    },
    {
      num: "02",
      title: "Deterministic AI Over Stochastic Guesswork",
      subtitle: "TYPED SCHEMAS & ISOLATION GATES",
      description:
        "We treat artificial intelligence models as untrusted, stochastic input streams. Generative models are wrapped in strict typed validation gates, deterministic graph orchestrators, and automated regression monitors.",
      axiom: "Axiom: Untrusted model output never writes directly to transactional production databases.",
    },
    {
      num: "03",
      title: "Defense-in-Depth Zero-Trust Security",
      subtitle: "DEFAULT-DENY NETWORK ARCHITECTURE",
      description:
        "Security is an immutable architectural boundary, not an afterthought. We implement mutual TLS between microservices, ephemeral secret leasing, and automated vulnerability scanning across all layers.",
      axiom: "Axiom: Every request is untrusted until verified by cryptographic identity claims.",
    },
    {
      num: "04",
      title: "Radical Type-Safety & Durability",
      subtitle: "END-TO-END SCHEMA CONTRACTS",
      description:
        "From relational database tables through message queues to edge React components, our codebases enforce complete type safety. We eliminate entire classes of runtime errors before code reaches staging.",
      axiom: "Axiom: Schema divergence is a critical defect prevented by automated contract compilation.",
    },
  ];

  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>TECHNOLOGY PHILOSOPHY</Eyebrow>
          <Heading id="philosophy-heading" as="h2" variant="h1">
            First Principles, Mathematical Verification, and Zero-Trust Defense
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            Our engineering tenets govern every technical decision, pull request, and deployment architecture
            executed by Frontier Systems.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PHILOSOPHY_TENETS.map((tenet) => (
            <article
              key={tenet.num}
              className="flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#171A1C]">
                  <span className="text-xl font-bold font-mono text-[#63C7D9]">
                    {tenet.num}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-[#6E7376] uppercase">
                    {tenet.subtitle}
                  </span>
                </div>

                <Heading as="h3" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3] mb-3">
                  {tenet.title}
                </Heading>

                <p className="text-sm text-[#A6AAAC] leading-relaxed mb-6">
                  {tenet.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#171A1C] text-xs font-mono text-[#63C7D9]">
                {tenet.axiom}
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
