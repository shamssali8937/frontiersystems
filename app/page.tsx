import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "B2B Technology & AI Partner",
  description:
    "Enterprise AI solutions, systems architecture, and mission-critical software engineering for global industry leaders.",
  path: "/",
});

export default function HomePage() {
  return (
    <main>
      <section aria-label="Overview" className="py-24">
        <h1 className="text-3xl font-semibold">Frontier Systems</h1>
        <p className="text-[#A6AAAC]">Architecture and SEO foundation established.</p>
      </section>
    </main>
  );
}
