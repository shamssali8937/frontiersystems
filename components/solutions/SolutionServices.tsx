import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import type { SolutionServiceItem } from "@/lib/solutionsData";

interface SolutionServicesProps {
  pillarTitle: string;
  services: SolutionServiceItem[];
}

export function SolutionServices({ pillarTitle, services }: SolutionServicesProps) {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="py-20 lg:py-28 border-b border-[#171A1C] bg-[#0B0D0E]"
    >
      <Container size="2xl">
        <div className="max-w-3xl space-y-4 mb-16">
          <Eyebrow>CORE SERVICES & SPECIALISATIONS</Eyebrow>
          <Heading id="services-heading" as="h2" variant="h1">
            Engineered Sub-Offerings for {pillarTitle}
          </Heading>
          <p className="text-[#A6AAAC] text-base lg:text-lg leading-relaxed">
            Every capability is executed with engineering rigour, deterministic schemas, and continuous
            validation against enterprise performance metrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <article
              key={service.id}
              className="flex flex-col justify-between p-8 sm:p-10 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-[#171A1C]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-semibold text-[#63C7D9]">
                      0{index + 1}
                    </span>
                    <span className="text-xs font-mono text-[#6E7376]">{"//"}</span>
                    <span className="text-xs font-mono text-[#A6AAAC] uppercase tracking-wider">
                      {service.badge}
                    </span>
                  </div>
                  <Badge variant="neutral" size="sm">
                    DELIVERABLE_SPEC
                  </Badge>
                </div>

                <Heading as="h3" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3] mb-2">
                  {service.name}
                </Heading>

                <div className="text-xs font-mono text-[#63C7D9] mb-4">
                  {service.tagline}
                </div>

                <p className="text-sm text-[#A6AAAC] leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Deliverables List */}
                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
                    Primary Deliverables
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#F5F5F3]" role="list">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#63C7D9] mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Capabilities List */}
                <div className="space-y-2">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
                    Technical Guarantees
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#A6AAAC]" role="list">
                    {service.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2">
                        <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-[#4EBA87] mt-1.5 shrink-0" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-8 border-t border-[#171A1C] flex items-center justify-between text-[11px] font-mono text-[#6E7376]">
                <span>STATUS: PRODUCTION_READY</span>
                <span className="text-[#63C7D9]">ZERO_DRIFT</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
