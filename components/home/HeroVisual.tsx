"use client";

import { InteractivePillarsVisualizer } from "./InteractivePillarsVisualizer";

/**
 * HeroVisual — Interactive Architecture & Four-Pillar Visualizer.
 *
 * Implements:
 * - Dynamic interactive visualizer showcasing Frontier Systems' 4 engineering pillars.
 * - Accessible screen-reader description explaining active pillar architecture.
 * - Keyboard accessible tabs (<Tab>, <ArrowRight>, <ArrowLeft>).
 * - Full light & dark theme compatibility with animated SVG topologies and real-time metrics.
 */
export function HeroVisual() {
  return (
    <div className="relative w-full max-w-lg lg:max-w-none mx-auto">
      {/* Accessible Alternative Text for Assistive Tech */}
      <div className="sr-only">
        Interactive system architecture visualizer demonstrating Frontier Systems&apos; four engineering pillars:
        01 AI &amp; Autonomous Automation, 02 High-Assurance Digital Products, 03 Mission-Critical Business Systems,
        and 04 Resilient Cloud &amp; Security. Use arrow keys to explore each pillar&apos;s topology and telemetry metrics.
      </div>

      <InteractivePillarsVisualizer />
    </div>
  );
}
