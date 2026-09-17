import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SolutionApproachPhase } from "@/lib/solutionsData";

interface SolutionApproachProps {
  pillarTitle: string;
  approach: SolutionApproachPhase[];
}

export function SolutionApproach({ pillarTitle, approach }: SolutionApproachProps) {
  return (
    <section
      id="approach"
      aria-labelledby="approach-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>ENGINEERING METHODOLOGY</Eyebrow>
          <Heading id="approach-heading" as="h2" variant="h1">
            Our Architectural Delivery Approach for {pillarTitle}
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            Every phase has an explicit mathematical or architectural verification gate. We eliminate
            speculative assumptions early, verifying requirements against empirical performance benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {approach.map((phase) => (
            <article
              key={phase.phase}
              className="flex flex-col justify-between p-8 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#171A1C]">
                  <span className="text-2xl font-bold font-mono text-[#63C7D9]">
                    {phase.phase}
                  </span>
                  <span className="text-[10px] font-mono tracking-wider text-[#6E7376] uppercase">
                    PHASE {phase.phase}
                  </span>
                </div>

                <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider mb-2">
                  {phase.focus}
                </div>

                <Heading as="h3" variant="h3" className="text-xl font-semibold mb-3 text-[#F5F5F3]">
                  {phase.name}
                </Heading>

                <p className="text-xs sm:text-sm text-[#A6AAAC] leading-relaxed mb-6">
                  {phase.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#171A1C]">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#6E7376] mb-1">
                  Verification Gate
                </div>
                <div className="text-xs font-mono text-[#F5F5F3] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                  <span>{phase.validationCheck}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
