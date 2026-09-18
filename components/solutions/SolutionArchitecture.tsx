import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { AiTopologyDiagram } from "./diagrams/AiTopologyDiagram";
import { DigitalProductsDiagram } from "./diagrams/DigitalProductsDiagram";
import { BusinessSystemsDiagram } from "./diagrams/BusinessSystemsDiagram";
import { InfrastructureSecurityDiagram } from "./diagrams/InfrastructureSecurityDiagram";
import type { SolutionPillarData } from "@/lib/solutionsData";

interface SolutionArchitectureProps {
  solution: SolutionPillarData;
}

export function SolutionArchitecture({ solution }: SolutionArchitectureProps) {
  const renderDiagram = () => {
    switch (solution.diagramType) {
      case "ai":
        return <AiTopologyDiagram />;
      case "digital-products":
        return <DigitalProductsDiagram />;
      case "business-systems":
        return <BusinessSystemsDiagram />;
      case "infrastructure":
        return <InfrastructureSecurityDiagram />;
    }
  };

  return (
    <section
      id="architecture"
      aria-labelledby="architecture-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-12">
          <Eyebrow>SYSTEMS TOPOLOGY & SCHEMATIC</Eyebrow>
          <Heading id="architecture-heading" as="h2" variant="h1">
            {solution.architectureOverview.title}
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            {solution.architectureOverview.description}
          </p>
        </div>

        {/* Distinct Visual Diagram for this Pillar */}
        <div className="mb-12">
          {renderDiagram()}
        </div>

        {/* Architectural Principles Grid */}
        <div className="rounded-sm bg-[#111416] border border-[#292D30] p-6 sm:p-8">
          <div className="text-xs font-mono uppercase tracking-wider text-[#63C7D9] mb-4">
            Architectural Guarantees & Enforcement Constraints
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {solution.architectureOverview.keyPrinciples.map((principle, index) => (
              <div key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#F5F5F3]">
                <span className="font-mono text-[#63C7D9] mt-0.5 shrink-0">
                  [0{index + 1}]
                </span>
                <span className="leading-relaxed">{principle}</span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
