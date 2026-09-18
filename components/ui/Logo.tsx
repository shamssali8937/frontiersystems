"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  asLink?: boolean;
}

/**
 * Logo — British high-assurance engineering mark for Frontier Systems.
 *
 * Design Architecture:
 * - Sovereign Geometric Monogram: Precision Prime Meridian diamond/hexagonal nexus with converging dual-vector blades.
 * - Represents: Deterministic convergence, distributed topological nodes, and British engineering precision (London HQ).
 * - Typography: Sharp architectural lettering with high-contrast dual-tone tracking.
 * - Theme Reactive: Effortlessly transitions between obsidian/cyan in dark mode and royal navy/cyan in light mode.
 */
export function Logo({
  className = "",
  size = "md",
  showTagline = true,
  asLink = true,
}: LogoProps) {
  const iconDimensions = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
  }[size];

  const titleSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  }[size];

  const content = (
    <span className={`inline-flex items-center gap-3 select-none group ${className}`.trim()}>
      {/* Precision Meridian Geometric Mark */}
      <span
        className={`relative ${iconDimensions} rounded-xs flex items-center justify-center border border-[#292D30] dark:border-[#292D30] border-slate-300 bg-[#111416] dark:bg-[#111416] bg-white shadow-xs group-hover:border-[#63C7D9] dark:group-hover:border-[#63C7D9] group-hover:border-[#0891B2] transition-colors duration-200 shrink-0`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-[#63C7D9] dark:text-[#63C7D9] text-[#0891B2] transition-transform duration-300 group-hover:scale-105"
        >
          {/* Outer Precision Meridian Diamond */}
          <path
            d="M14 3L23 14L14 25L5 14L14 3Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Inner Converging Coordinate Vector */}
          <path
            d="M14 7V21M7 14H21"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeOpacity="0.45"
            strokeLinecap="round"
          />
          {/* Central Meridian Core Node */}
          <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        </svg>
      </span>

      {/* Typography: UK Enterprise Precision Lockup */}
      <span className="flex flex-col text-left">
        <span
          className={`font-semibold ${titleSizes} tracking-tight text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 group-hover:text-white dark:group-hover:text-white group-hover:text-[#0891B2] transition-colors duration-150 leading-tight`}
        >
          <span>Frontier</span>
          <span className="font-light text-[#A6AAAC] dark:text-[#A6AAAC] text-slate-500 ml-1.5">Systems</span>
        </span>

        {showTagline && (
          <span className="text-[9px] font-mono tracking-widest uppercase text-[#6E7376] dark:text-[#6E7376] text-slate-400 mt-0.5">
            London &bull; High Assurance
          </span>
        )}
      </span>
    </span>
  );

  if (!asLink) {
    return content;
  }

  return (
    <Link
      href="/"
      aria-label="Frontier Systems — Enterprise AI & Systems Engineering Home"
      className="inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] dark:focus-visible:ring-offset-[#0B0D0E] focus-visible:ring-offset-white rounded-xs py-0.5"
    >
      {content}
    </Link>
  );
}
