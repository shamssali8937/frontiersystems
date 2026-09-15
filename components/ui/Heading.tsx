import React from "react";

export type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
export type HeadingVariant = "display" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "subheading";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingLevel;
  variant?: HeadingVariant;
  children: React.ReactNode;
}

const variantClasses: Record<HeadingVariant, string> = {
  display: "text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-[#F5F5F3]",
  h1: "text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.15] text-[#F5F5F3]",
  h2: "text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight leading-[1.2] text-[#F5F5F3]",
  h3: "text-xl sm:text-2xl font-medium tracking-tight leading-[1.3] text-[#F5F5F3]",
  h4: "text-lg sm:text-xl font-medium tracking-normal leading-[1.4] text-[#F5F5F3]",
  h5: "text-base sm:text-lg font-medium tracking-normal leading-[1.4] text-[#F5F5F3]",
  h6: "text-sm sm:text-base font-medium tracking-normal leading-[1.4] text-[#F5F5F3]",
  subheading: "text-base sm:text-lg text-[#A6AAAC] font-normal leading-relaxed",
};

/**
 * Heading — Semantic heading component with crisp typography hierarchy.
 * Enforces restrained, engineering-grade type sizing without oversized display excess.
 */
export function Heading({
  as: Component = "h2",
  variant,
  className = "",
  children,
  ...props
}: HeadingProps) {
  const chosenVariant = variant ?? (Component as HeadingVariant);
  const classes = variantClasses[chosenVariant] || variantClasses.h2;

  return (
    <Component className={`${classes} ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
}
