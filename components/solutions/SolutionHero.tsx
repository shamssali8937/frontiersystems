import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import type { SolutionPillarData } from "@/lib/solutionsData";

interface SolutionHeroProps {
  solution: SolutionPillarData;
}

export function SolutionHero({ solution }: SolutionHeroProps) {
  return (
    <section aria-label={`${solution.title} Overview`} className="pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-24 border-b border-[#171A1C]">
      <Container size="2xl">
        <div className="max-w-4xl space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>{solution.eyebrow}</Eyebrow>
            <span className="text-xs font-mono text-[#6E7376]">
              ENGINEERING SPECIFICATION
            </span>
          </div>

          {/* Sole single H1 for the page */}
          <Heading
            as="h1"
            variant="display"
            className="tracking-tight text-3xl sm:text-5xl lg:text-6xl text-[#F5F5F3]"
          >
            {solution.headline}
          </Heading>

          <p className="text-[#A6AAAC] text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl">
            {solution.subhead}
          </p>

          <p className="text-sm sm:text-base text-[#6E7376] leading-relaxed max-w-3xl border-l-2 border-[#292D30] pl-4">
            {solution.introLong}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#0B0D0E] bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Schedule Technical Consultation
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center justify-center h-12 px-7 text-sm font-medium text-[#F5F5F3] bg-[#111416] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              View Related Case Evidence &rarr;
            </Link>
          </div>

          {/* Spec Badges Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <Badge variant="accent" size="sm">
              {solution.badge}
            </Badge>
            <Badge variant="neutral" dot size="sm">
              PRODUCTION GRADE
            </Badge>
            <Badge variant="neutral" dot size="sm">
              MATHEMATICAL ASSURANCE
            </Badge>
          </div>
        </div>
      </Container>
    </section>
  );
}
