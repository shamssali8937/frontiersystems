import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import type { SolutionPillarData } from "@/lib/solutionsData";

interface SolutionTechStackProps {
  solution: SolutionPillarData;
}

export function SolutionTechStack({ solution }: SolutionTechStackProps) {
  return (
    <section
      id="tech-stack"
      aria-labelledby="tech-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>CORE TECHNOLOGIES & METRICS</Eyebrow>
          <Heading id="tech-heading" as="h2" variant="h1">
            Production Technology Stack & Operational Parameters
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            We build exclusively with proven, enterprise-hardened technologies and maintain measurable
            operational parameters across all client deployments.
          </p>
        </div>

        {/* Tech Stack Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {solution.techStack.map((category) => (
            <div
              key={category.category}
              className="p-6 rounded-sm bg-[#111416] border border-[#292D30]"
            >
              <div className="text-xs font-mono font-medium text-[#63C7D9] uppercase tracking-wider mb-4 pb-3 border-b border-[#171A1C]">
                {category.category}
              </div>
              <ul className="space-y-2 text-xs font-mono text-[#F5F5F3]" role="list">
                {category.technologies.map((tech) => (
                  <li key={tech} className="flex items-center gap-2">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#292D30]" />
                    <span>{tech}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Concrete Operational Specifications Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-12 border-t border-[#171A1C]">
          {solution.specifications.map((spec) => (
            <div key={spec.label} className="p-6 rounded-sm bg-[#111416] border border-[#292D30]">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3] mb-1">
                {spec.value}
              </div>
              <div className="text-xs font-mono text-[#63C7D9] uppercase tracking-wider mb-2">
                {spec.label}
              </div>
              <p className="text-xs text-[#A6AAAC] leading-relaxed">
                {spec.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
