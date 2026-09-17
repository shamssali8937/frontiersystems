"use client";

import dynamic from "next/dynamic";
import { HeroFallback } from "@/components/three/HeroFallback";

const DynamicHeroScene = dynamic(
  () => import("@/components/three/SystemCoreScene").then((mod) => mod.SystemCoreScene),
  {
    ssr: false,
    loading: () => <HeroFallback />,
  }
);

/**
 * HeroVisual — SRS-compliant 3D Visual Architecture.
 *
 * Architecture:
 * Hero
 * ├── content
 * └── visual
 *     ├── WebGL (DynamicHeroScene)
 *     └── fallback (HeroFallback)
 *
 * Accessibility & Performance:
 * - aria-hidden="true" on canvas and visual container to prevent screen reader noise.
 * - Accessible text description explicitly exposed outside the canvas via sr-only.
 * - Non-blocking dynamic load with ssr: false keeps initial HTML and FCP lightning fast.
 */
export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Accessible Alternative Text Outside the Canvas */}
      <div className="sr-only">
        Interactive 3D technical visualization representing Frontier Systems&apos; high-assurance distributed systems topology, autonomous AI node orchestration, and real-time enterprise computing architecture.
      </div>

      {/* Visual Canvas Container with aria-hidden */}
      <div aria-hidden="true" className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[5/4]">
        <DynamicHeroScene />
      </div>
    </div>
  );
}
