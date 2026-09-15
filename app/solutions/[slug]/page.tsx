import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSolutionBySlug, getAllSolutionSlugs } from "@/lib/sanity.queries";
import { createMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getAllSolutionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    return createMetadata({
      title: "Solution Not Found",
      noIndex: true,
    });
  }

  return createMetadata({
    title: solution.seo?.metaTitle || solution.title,
    description: solution.seo?.metaDescription || solution.shortDescription,
    path: `/solutions/${slug}`,
    noIndex: solution.seo?.noIndex,
  });
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const solution = await getSolutionBySlug(slug);

  if (!solution) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <Section spacing="lg" className="border-b border-[#292D30]">
        <Container size="xl">
          <div className="flex flex-col gap-4 max-w-3xl">
            <Eyebrow>{solution.category.replace("-", " & ")}</Eyebrow>
            <Heading as="h1" variant="display">
              {solution.hero?.headline || solution.title}
            </Heading>
            <p className="text-lg text-[#A6AAAC] leading-relaxed">
              {solution.hero?.subhead || solution.shortDescription}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Button variant="accent">
                {solution.hero?.ctaText || "Request Technical Consultation"}
              </Button>
              <Link href="/work" variant="subtle" className="self-center text-sm">
                View Related Case Studies →
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Capabilities / Services */}
      {solution.services && solution.services.length > 0 && (
        <Section spacing="md">
          <Container size="xl">
            <Heading as="h2" variant="h3" className="mb-6">
              Core Capabilities & Deliverables
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {solution.services.map((service, index) => (
                <Card key={index} variant="default" padding="md">
                  <CardHeader>
                    <span className="text-xs font-mono text-[#63C7D9]">0{index + 1}</span>
                    <h3 className="text-base font-medium text-[#F5F5F3]">{service}</h3>
                  </CardHeader>
                  <CardContent>
                    Enterprise-grade architecture, implementation, and operational integration.
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </Section>
      )}
    </main>
  );
}
