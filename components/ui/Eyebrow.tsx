import React from "react";

export interface EyebrowProps extends React.HTMLAttributes<HTMLSpanElement> {
  withDot?: boolean;
  children: React.ReactNode;
}

/**
 * Eyebrow — Small uppercase contextual label for sections and feature headers.
 * Communicates technical rigor and category context.
 */
export function Eyebrow({
  withDot = true,
  className = "",
  children,
  ...props
}: EyebrowProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-mono font-medium uppercase tracking-widest text-[#63C7D9] ${className}`.trim()}
      {...props}
    >
      {withDot && (
        <span
          aria-hidden="true"
          className="inline-block h-1.5 w-1.5 rounded-full bg-[#63C7D9]"
        />
      )}
      {children}
    </span>
  );
}
