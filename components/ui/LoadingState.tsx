import React from "react";

export type SpinnerSize = "sm" | "md" | "lg";

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  label?: string;
}

const spinnerSizes: Record<SpinnerSize, string> = {
  sm: "h-3.5 w-3.5 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-8 w-8 border-[3px]",
};

/**
 * Spinner — Minimal rotating loader for inline operations.
 */
export function Spinner({
  size = "md",
  label = "Loading...",
  className = "",
  ...props
}: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`inline-block animate-spin rounded-full border-current border-t-transparent text-[#63C7D9] ${spinnerSizes[size]} ${className}`.trim()}
      {...props}
    >
      <span className="sr-only">{label}</span>
    </span>
  );
}

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
}

/**
 * Skeleton — Pulse placeholder for loading content blocks.
 */
export function Skeleton({
  width,
  height,
  className = "",
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-[#171A1C] border border-[#292D30] rounded-xs ${className}`.trim()}
      style={{
        width: width ?? style?.width,
        height: height ?? style?.height,
        ...style,
      }}
      {...props}
    />
  );
}

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

/**
 * LoadingState — Centered container loading block.
 */
export function LoadingState({
  message = "Loading data...",
  className = "",
  ...props
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={`flex flex-col items-center justify-center p-12 gap-3 text-[#A6AAAC] ${className}`.trim()}
      {...props}
    >
      <Spinner size="lg" />
      <span className="text-xs font-mono tracking-wider uppercase">{message}</span>
    </div>
  );
}
