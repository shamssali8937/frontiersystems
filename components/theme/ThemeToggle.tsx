"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "md";
}

const emptySubscribe = () => () => {};

/**
 * ThemeToggle — Minimalist engineering control for switching between Dark and Light themes.
 *
 * Implements:
 * - WAI-ARIA accessible button with dynamic aria-label.
 * - Suppresses hydration mismatch via useSyncExternalStore.
 * - Keyboard accessible with visible focus ring.
 */
export function ThemeToggle({ className = "", size = "md" }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const isLight = mounted && resolvedTheme === "light";
  const buttonDimensions = size === "sm" ? "w-8 h-8" : "w-8.5 h-8.5";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      title={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`inline-flex items-center justify-center ${buttonDimensions} rounded-xs border border-[#292D30] bg-[#111416] text-[#A6AAAC] hover:text-[#F5F5F3] hover:border-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] ${className}`.trim()}
    >
      {!mounted ? (
        // Static neutral placeholder during SSR
        <span className="w-4 h-4 rounded-full bg-[#292D30]/50" aria-hidden="true" />
      ) : isLight ? (
        // Moon Icon (displayed in light mode to indicate switch to dark)
        <svg
          className="w-4 h-4 text-[#0F172A]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        // Sun Icon (displayed in dark mode to indicate switch to light)
        <svg
          className="w-4 h-4 text-[#F5F5F3] group-hover:text-[#63C7D9]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  );
}
