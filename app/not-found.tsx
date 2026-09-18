import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Link } from "@/components/ui/Link";

export const metadata = {
  title: "404 - Page Not Found",
  robots: {
    index: false,
    follow: true,
  },
};

/**
 * 404 Page — Accessible error state with crawlable navigation.
 */
export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center py-24">
      <Container size="md" className="text-center flex flex-col items-center">
        <Eyebrow className="mb-4">Error 404</Eyebrow>
        <Heading as="h1" variant="h1" className="mb-4">
          System Route Not Found
        </Heading>
        <p className="text-base text-[#A6AAAC] max-w-md mb-8">
          The requested path does not exist or has been relocated to another service.
        </p>

        <nav aria-label="Quick links" className="flex flex-wrap gap-4 justify-center mb-8">
          <Link href="/" variant="default" className="text-sm font-medium">
            Home
          </Link>
          <span className="text-[#292D30]" aria-hidden="true">•</span>
          <Link href="/solutions" variant="subtle" className="text-sm">
            Solutions
          </Link>
          <span className="text-[#292D30]" aria-hidden="true">•</span>
          <Link href="/work" variant="subtle" className="text-sm">
            Work
          </Link>
          <span className="text-[#292D30]" aria-hidden="true">•</span>
          <Link href="/company" variant="subtle" className="text-sm">
            Company
          </Link>
          <span className="text-[#292D30]" aria-hidden="true">•</span>
          <Link href="/contact" variant="subtle" className="text-sm">
            Contact
          </Link>
        </nav>
      </Container>
    </main>
  );
}
