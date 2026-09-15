import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCaseStudyBySlug, getAllCaseStudySlugs } from "@/lib/sanity.queries";
import { createMetadata, getCaseStudyJsonLd, siteConfig } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Link } from "@/components/ui/Link";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllCaseStudySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    return createMetadata({
      title: "Case Study Not Found",
      noIndex: true,
    });
  }

  return createMetadata({
    title: caseStudy.seo?.metaTitle || `${caseStudy.title} — Case Study`,
    description: caseStudy.seo?.metaDescription || caseStudy.problemStatement,
    path: `/work/${slug}`,
    type: "article",
    publishedTime: caseStudy.publishedAt,
    noIndex: caseStudy.seo?.noIndex,
  });
}

export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const caseStudy = await getCaseStudyBySlug(slug);

  if (!caseStudy) {
    notFound();
  }

  const jsonLdData = getCaseStudyJsonLd({
    title: caseStudy.title,
    description: caseStudy.problemStatement,
    url: `${siteConfig.url}/work/${slug}`,
    datePublished: caseStudy.publishedAt,
  });

  return (
    <main>
      <JsonLd data={jsonLdData} />

      {/* Hero Header */}
      <Section spacing="lg" className="border-b border-[#292D30]">
        <Container size="xl">
          <div className="flex flex-col gap-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <Eyebrow>Case Study</Eyebrow>
              {caseStudy.clientIndustry && (
                <Badge variant="neutral">{caseStudy.clientIndustry}</Badge>
              )}
            </div>
            <Heading as="h1" variant="display">
              {caseStudy.title}
            </Heading>
            {caseStudy.relatedSolution && (
              <p className="text-sm text-[#63C7D9]">
                Pillar: <Link href={`/solutions/${caseStudy.relatedSolution.slug.current}`} variant="accent">{caseStudy.relatedSolution.title}</Link>
              </p>
            )}
          </div>
        </Container>
      </Section>

      {/* Problem Statement & Architecture */}
      <Section spacing="md">
        <Container size="xl" className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Narrative */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <section aria-labelledby="problem-heading">
              <Heading as="h2" variant="h3" id="problem-heading" className="mb-4">
                The Engineering Challenge
              </Heading>
              <p className="text-base text-[#A6AAAC] leading-relaxed">
                {caseStudy.problemStatement}
              </p>
            </section>

            <section aria-labelledby="architecture-heading">
              <Heading as="h2" variant="h3" id="architecture-heading" className="mb-4">
                Solution Architecture & Execution
              </Heading>
              <p className="text-base text-[#A6AAAC] leading-relaxed">
                Engineered with high-availability systems, resilient data contracts, and strict security boundaries.
              </p>
            </section>
          </div>

          {/* Business Impact Sidebar */}
          {caseStudy.businessImpact && caseStudy.businessImpact.length > 0 && (
            <aside aria-label="Business Impact" className="flex flex-col gap-4">
              <Heading as="h3" variant="h4" className="mb-2">
                Verified Production Impact
              </Heading>
              {caseStudy.businessImpact.map((metric, idx) => (
                <Card key={idx} variant="default" padding="sm" className="border-l-2 border-l-[#63C7D9]">
                  <div className="text-2xl font-semibold text-[#F5F5F3] font-mono">
                    {metric.metric}
                  </div>
                  <div className="text-xs font-mono uppercase text-[#63C7D9] mt-1">
                    {metric.label}
                  </div>
                  {metric.description && (
                    <p className="text-xs text-[#A6AAAC] mt-2 leading-normal">
                      {metric.description}
                    </p>
                  )}
                </Card>
              ))}
            </aside>
          )}
        </Container>
      </Section>
    </main>
  );
}
