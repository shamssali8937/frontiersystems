"use client";

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from "react";
import Link from "next/link";
import { useTheme } from "@/components/theme/ThemeProvider";

const emptySubscribe = () => () => {};

interface Pillar {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  slug: string;
  tagline: string;
  metrics: { label: string; value: string; status: "good" | "nominal" }[];
  nodes: { id: string; label: string; x: number; y: number }[];
  description: string;
}

const PILLARS: Pillar[] = [
  {
    id: "ai-automation",
    index: "01",
    title: "AI & Autonomous Automation",
    shortTitle: "AI & Agents",
    category: "Deterministic Intelligence",
    slug: "ai-automation",
    tagline: "Autonomous Agent Swarms & Low-Latency LLM Orchestration",
    description: "Production agent pipelines with continuous guardrail verification and sub-millisecond execution loops.",
    metrics: [
      { label: "Inference Latency", value: "< 0.8ms", status: "good" },
      { label: "Pipeline Determinism", value: "99.98%", status: "good" },
      { label: "Agent Convergence", value: "Autonomous", status: "nominal" },
    ],
    nodes: [
      { id: "n1", label: "LLM Orchestrator", x: 200, y: 140 },
      { id: "n2", label: "Agent Swarm", x: 90, y: 70 },
      { id: "n3", label: "Vector Index", x: 310, y: 70 },
      { id: "n4", label: "Guardrail Gateway", x: 90, y: 210 },
      { id: "n5", label: "Execution Sandbox", x: 310, y: 210 },
    ],
  },
  {
    id: "digital-products",
    index: "02",
    title: "High-Assurance Digital Products",
    shortTitle: "Digital Products",
    category: "Platforms & Interfaces",
    slug: "digital-products",
    tagline: "Ultra-Responsive Enterprise SaaS & Mathematical UI",
    description: "Multi-tenant platforms engineered for mathematical rendering precision, 60fps fluidity, and zero client drift.",
    metrics: [
      { label: "Time-to-First-Byte", value: "38ms", status: "good" },
      { label: "Frame Budget", value: "16.6ms (60fps)", status: "good" },
      { label: "Hydration Stability", value: "100%", status: "nominal" },
    ],
    nodes: [
      { id: "n1", label: "Render Core", x: 200, y: 140 },
      { id: "n2", label: "Edge Cache", x: 100, y: 80 },
      { id: "n3", label: "State Syncer", x: 300, y: 80 },
      { id: "n4", label: "Telemetry HUD", x: 100, y: 200 },
      { id: "n5", label: "Virtual DOM", x: 300, y: 200 },
    ],
  },
  {
    id: "business-systems",
    index: "03",
    title: "Mission-Critical Business Systems",
    shortTitle: "Business Systems",
    category: "Distributed Architecture",
    slug: "business-systems",
    tagline: "Fault-Tolerant Transaction Meshes & Event Infrastructure",
    description: "Distributed transactional backbones guaranteeing zero data loss, ACID consistency, and seamless ERP/CRM meshes.",
    metrics: [
      { label: "Peak Throughput", value: "148k op/s", status: "good" },
      { label: "Consensus Model", value: "Raft Zero-Loss", status: "good" },
      { label: "Failover RTO", value: "< 250ms", status: "nominal" },
    ],
    nodes: [
      { id: "n1", label: "Event Backbone", x: 200, y: 140 },
      { id: "n2", label: "Node Cluster A", x: 110, y: 65 },
      { id: "n3", label: "Node Cluster B", x: 290, y: 65 },
      { id: "n4", label: "ACID Ledger", x: 110, y: 215 },
      { id: "n5", label: "Kafka Event Mesh", x: 290, y: 215 },
    ],
  },
  {
    id: "infrastructure-security",
    index: "04",
    title: "Resilient Cloud & Security",
    shortTitle: "Cloud & Security",
    category: "Zero-Trust Infrastructure",
    slug: "infrastructure-security",
    tagline: "Zero-Trust Cloud & Multi-Region Resilient Perimeters",
    description: "Cryptographically hardened cloud topology with multi-region automatic failover and sovereign data isolation.",
    metrics: [
      { label: "Zero-Trust Posture", value: "Enforced", status: "good" },
      { label: "Multi-Region SLA", value: "99.999%", status: "good" },
      { label: "Perimeter Shield", value: "Air-Gapped", status: "nominal" },
    ],
    nodes: [
      { id: "n1", label: "Security Gateway", x: 200, y: 140 },
      { id: "n2", label: "LDN-01 Region", x: 95, y: 75 },
      { id: "n3", label: "FRA-02 Region", x: 305, y: 75 },
      { id: "n4", label: "NYC-03 Region", x: 95, y: 205 },
      { id: "n5", label: "Crypto Boundary", x: 305, y: 205 },
    ],
  },
];

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds per pillar

export function InteractivePillarsVisualizer() {
  const { resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const isLight = mounted && resolvedTheme === "light";

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pulseWave, setPulseWave] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const activePillar: Pillar = (PILLARS[activeIdx] ?? PILLARS[0]) as Pillar;

  // Advance to next pillar
  const nextPillar = useCallback(() => {
    setActiveIdx((prev) => (prev + 1) % PILLARS.length);
    setProgress(0);
  }, []);

  // Select specific pillar
  const selectPillar = (idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
    triggerPulse();
  };

  const triggerPulse = () => {
    setPulseWave(true);
    setTimeout(() => setPulseWave(false), 800);
  };

  // Auto rotation timer with progress tracking
  useEffect(() => {
    if (isPaused) return;

    const stepMs = 50;
    const progressStep = (stepMs / AUTO_ROTATE_INTERVAL) * 100;

    progressIntervalRef.current = setInterval(() => {
      setProgress((old) => {
        if (old >= 100) {
          nextPillar();
          return 0;
        }
        return old + progressStep;
      });
    }, stepMs);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPaused, nextPillar]);

  // Keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      selectPillar((index + 1) % PILLARS.length);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      selectPillar((index - 1 + PILLARS.length) % PILLARS.length);
    }
  };

  // Dynamic Theme Palette for SVG & Canvas Elements
  const palette = {
    accentCyan: isLight ? "#0891B2" : "#63C7D9",
    orbitalRings: isLight ? "#E2E8F0" : "#292D30",
    satelliteFill: isLight ? "#FFFFFF" : "#171A1C",
    satelliteStroke: isLight ? "#CBD5E1" : "#292D30",
    satelliteText: isLight ? "#334155" : "#A6AAAC",
    centerFill: isLight ? "#FFFFFF" : "#111416",
    centerTextTitle: isLight ? "#0F172A" : "#F5F5F3",
    gridStroke: isLight ? "rgba(203, 213, 225, 0.6)" : "rgba(41, 45, 48, 0.4)",
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full max-w-lg lg:max-w-none mx-auto rounded-sm border border-slate-200 dark:border-[#292D30] bg-white dark:bg-[#111416]/95 backdrop-blur-md overflow-hidden transition-all duration-300 shadow-xl shadow-slate-200/50 dark:shadow-black/40"
      aria-label="Interactive Four Pillars System Visualizer"
    >
      {/* Top Telemetry & Auto-Rotation Progress Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-[#1E2225] bg-slate-50/90 dark:bg-[#0B0D0E]/60 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isPaused ? "bg-[#E5A84B]" : "bg-[#4EBA87] animate-pulse"
            }`}
            aria-hidden="true"
          />
          <span className="text-slate-600 dark:text-[#A6AAAC] tracking-wider uppercase text-[10px]">
            {isPaused ? "INSPECTION PAUSED" : "CORE TELEMETRY // LIVE"}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-slate-500 dark:text-[#6E7376]">
            PILLAR {activePillar.index} OF 04
          </span>
          <button
            type="button"
            onClick={triggerPulse}
            className="px-2 py-0.5 text-[10px] rounded-xs border border-slate-300 dark:border-[#292D30] text-slate-600 dark:text-[#A6AAAC] hover:text-slate-900 dark:hover:text-[#F5F5F3] hover:border-[#0891B2] dark:hover:border-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0891B2] dark:focus-visible:ring-[#63C7D9]"
            title="Trigger network diagnostic pulse"
          >
            Pulse Test
          </button>
        </div>
      </div>

      {/* Pillar Selection Tabs */}
      <div
        role="tablist"
        aria-label="Frontier Systems 4 Core Engineering Pillars"
        className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-200 dark:border-[#1E2225] bg-slate-100/70 dark:bg-[#171A1C]/50"
      >
        {PILLARS.map((pillar, idx) => {
          const isSelected = activeIdx === idx;
          return (
            <button
              key={pillar.id}
              role="tab"
              id={`pillar-tab-${pillar.id}`}
              aria-selected={isSelected}
              aria-controls={`pillar-panel-${pillar.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => selectPillar(idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative px-3 py-2.5 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0891B2] dark:focus-visible:ring-[#63C7D9] border-r last:border-r-0 border-slate-200 dark:border-[#1E2225] ${
                isSelected
                  ? "bg-white dark:bg-[#111416] text-slate-900 dark:text-[#F5F5F3] shadow-xs"
                  : "text-slate-600 dark:text-[#A6AAAC] hover:text-slate-900 dark:hover:text-[#F5F5F3] hover:bg-white/60 dark:hover:bg-[#111416]/50"
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <span
                  className={`text-[10px] font-mono font-semibold ${
                    isSelected
                      ? "text-[#0891B2] dark:text-[#63C7D9]"
                      : "text-slate-400 dark:text-[#6E7376]"
                  }`}
                >
                  {pillar.index}
                </span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0891B2] dark:bg-[#63C7D9] animate-ping" />
                )}
              </div>
              <p className="text-xs font-semibold truncate">
                {pillar.shortTitle}
              </p>

              {/* Progress indicator underline for active pillar */}
              {isSelected && (
                <div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#0891B2] dark:bg-[#63C7D9] transition-all duration-75"
                  style={{ width: isPaused ? "100%" : `${progress}%` }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Topology Visualizer Stage */}
      <div
        id={`pillar-panel-${activePillar.id}`}
        role="tabpanel"
        aria-labelledby={`pillar-tab-${activePillar.id}`}
        className="relative p-5 sm:p-6"
      >
        {/* Dynamic Topology Schematic Container */}
        <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] rounded-xs border border-slate-200 dark:border-[#292D30]/80 bg-slate-50/80 dark:bg-[#0B0D0E]/80 overflow-hidden flex items-center justify-center">
          {/* Subtle Grid Matrix Background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-75"
            style={{ stroke: palette.gridStroke }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="pillar-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path d="M 24 0 L 0 0 0 24" fill="none" strokeWidth="0.75" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pillar-grid)" />
          </svg>

          {/* Diagnostic Pulse Wave Ripple */}
          {pulseWave && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="w-24 h-24 rounded-full border animate-[ping_0.8s_ease-out_1]"
                style={{ borderColor: palette.accentCyan }}
              />
              <span
                className="w-48 h-48 rounded-full border opacity-40 animate-[ping_1.2s_ease-out_1]"
                style={{ borderColor: palette.accentCyan }}
              />
            </div>
          )}

          {/* SVG Animated Topology Connections */}
          <svg
            viewBox="0 0 400 280"
            className="relative z-10 w-full h-full max-w-[420px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Orbital Rings */}
            <circle
              cx="200"
              cy="140"
              r="115"
              stroke={palette.orbitalRings}
              strokeDasharray="4 6"
              className="animate-[spin_90s_linear_infinite]"
            />
            <circle
              cx="200"
              cy="140"
              r="75"
              stroke={palette.orbitalRings}
              strokeDasharray="3 3"
              className="animate-[spin_45s_linear_infinite_reverse]"
            />

            {/* Dynamic Mesh Connection Vectors */}
            {activePillar.nodes
              .filter((n) => n.id !== "n1")
              .map((node) => (
                <g key={node.id}>
                  <line
                    x1="200"
                    y1="140"
                    x2={node.x}
                    y2={node.y}
                    stroke={palette.accentCyan}
                    strokeWidth="1.25"
                    strokeOpacity={isLight ? 0.6 : 0.4}
                    strokeDasharray="5 5"
                  />
                  {/* Flowing animated particle along connection */}
                  <circle
                    r="2.5"
                    fill={palette.accentCyan}
                    className="animate-pulse"
                  >
                    <animateMotion
                      path={`M 200,140 L ${node.x},${node.y}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              ))}

            {/* Satellite Nodes */}
            {activePillar.nodes
              .filter((n) => n.id !== "n1")
              .map((node) => (
                <g key={node.id} className="cursor-pointer group">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="16"
                    fill={palette.satelliteFill}
                    stroke={palette.satelliteStroke}
                    strokeWidth="1.5"
                    className="group-hover:stroke-[#0891B2] dark:group-hover:stroke-[#63C7D9] transition-colors"
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="4"
                    fill={palette.accentCyan}
                  />
                  <text
                    x={node.x}
                    y={node.y + 26}
                    textAnchor="middle"
                    fill={palette.satelliteText}
                    fontSize="9"
                    fontWeight="500"
                    fontFamily="monospace"
                    className="select-none group-hover:fill-slate-900 dark:group-hover:fill-[#F5F5F3] transition-colors"
                  >
                    {node.label}
                  </text>
                </g>
              ))}

            {/* Center Master Core Node */}
            <g className="cursor-pointer">
              <circle
                cx="200"
                cy="140"
                r="30"
                fill={palette.centerFill}
                stroke={palette.accentCyan}
                strokeWidth="2"
                className="shadow-lg"
              />
              <circle
                cx="200"
                cy="140"
                r="8"
                fill={palette.accentCyan}
                className="animate-pulse"
              />
              <text
                x="200"
                y="144"
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="8"
                fontWeight="bold"
                fontFamily="monospace"
              >
                SYS
              </text>
              <text
                x="200"
                y="182"
                textAnchor="middle"
                fill={palette.centerTextTitle}
                fontSize="10"
                fontWeight="600"
                fontFamily="monospace"
                className="select-none tracking-wider"
              >
                {(activePillar.nodes[0] ?? { label: "System Core" }).label}
              </text>
            </g>
          </svg>

          {/* Floating Diagnostic Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-xs bg-white/95 dark:bg-[#111416]/90 border border-slate-200 dark:border-[#292D30] text-[9px] font-mono text-[#0891B2] dark:text-[#63C7D9] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
            <span>ACTIVE TOPO: {activePillar.index}</span>
          </div>

          <div className="absolute bottom-3 right-3 hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xs bg-white/95 dark:bg-[#111416]/90 border border-slate-200 dark:border-[#292D30] text-[9px] font-mono text-slate-600 dark:text-[#A6AAAC] shadow-xs">
            <span>ENGINE: DETERMINISTIC V4.2</span>
          </div>
        </div>

        {/* Pillar Header & Description */}
        <div className="pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold text-[#0891B2] dark:text-[#63C7D9] uppercase tracking-wider">
              {activePillar.category}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-[#6E7376]">
              {activePillar.tagline}
            </span>
          </div>

          <p className="text-xs text-slate-600 dark:text-[#A6AAAC] leading-relaxed">
            {activePillar.description}
          </p>
        </div>

        {/* Live Pillar Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 my-4 border-t border-slate-200 dark:border-[#1E2225]">
          {activePillar.metrics.map((metric) => (
            <div
              key={metric.label}
              className="p-2.5 rounded-xs bg-slate-100/80 dark:bg-[#0B0D0E]/60 border border-slate-200/80 dark:border-[#292D30]/60 space-y-1"
            >
              <div className="text-[10px] font-mono text-slate-500 dark:text-[#6E7376] truncate">
                {metric.label}
              </div>
              <div className="text-xs sm:text-sm font-mono font-bold text-[#0891B2] dark:text-[#63C7D9]">
                {metric.value}
              </div>
            </div>
          ))}
        </div>

        {/* Action Link to Full Solution Architecture */}
        <div className="pt-3 border-t border-slate-200 dark:border-[#1E2225] flex items-center justify-between">
          <Link
            href={`/solutions/${activePillar.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#0891B2] dark:text-[#63C7D9] hover:text-[#0E7490] dark:hover:text-[#78D3E3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#0891B2] dark:focus-visible:ring-[#63C7D9]"
          >
            <span>Explore {activePillar.shortTitle} Architecture</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>

          <span className="text-[10px] font-mono text-slate-500 dark:text-[#6E7376]">
            Interactive SLA Spec
          </span>
        </div>
      </div>
    </div>
  );
}
