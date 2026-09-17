import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { CompanyHero } from "@/components/company/CompanyHero";
import { CompanyMission } from "@/components/company/CompanyMission";
import { CompanyPhilosophy } from "@/components/company/CompanyPhilosophy";
import { CompanyHowWeWork } from "@/components/company/CompanyHowWeWork";
import { CompanyLifecycle } from "@/components/company/CompanyLifecycle";
import { CompanyWhyUs } from "@/components/company/CompanyWhyUs";
import { CompanyCta } from "@/components/company/CompanyCta";

export const metadata: Metadata = createMetadata({
  title: "Company & Engineering Philosophy",
  description:
    "Learn about Frontier Systems, a London-headquartered technology partner dedicated to high-assurance systems, autonomous AI, and mission-critical enterprise software.",
  path: "/company",
});

export default function CompanyPage() {
  return (
    <PageContainer>
      {/* 1. Who Frontier Systems is */}
      <CompanyHero />

      {/* 2. Mission */}
      <CompanyMission />

      {/* 3. Technology philosophy */}
      <CompanyPhilosophy />

      {/* 4. How we work */}
      <CompanyHowWeWork />

      {/* 5, 6, 7, 8. Understand, Plan, Build, Evolve */}
      <CompanyLifecycle />

      {/* 9. Why Frontier Systems */}
      <CompanyWhyUs />

      {/* 10. CTA */}
      <CompanyCta />
    </PageContainer>
  );
}
