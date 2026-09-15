/**
 * Home page — Server Component.
 *
 * RULES:
 * - No business logic here.
 * - No database queries here.
 * - Compose Server Components and lazy-load Client Components.
 * - 3D sections must be dynamically imported with { ssr: false }.
 *
 * This is a placeholder stub. Visual implementation comes in a later phase.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Frontier Systems — enterprise-grade technology and AI solutions for forward-thinking businesses.",
};

export default function HomePage() {
  return (
    <main>
      {/*
       * Phase 1 stub.
       * Visual website components will be assembled here in a later phase.
       */}
      <section aria-label="Coming soon">
        <h1>Frontier Systems</h1>
        <p>Architecture scaffold complete. Visual implementation pending.</p>
      </section>
    </main>
  );
}
