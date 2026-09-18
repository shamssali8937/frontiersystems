import React from "react";
import { Container, type ContainerSize } from "./Container";

export type SectionSpacing = "none" | "sm" | "md" | "lg" | "xl";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  spacing?: SectionSpacing;
  contain?: boolean;
  containerSize?: ContainerSize;
  children: React.ReactNode;
}

const spacingClasses: Record<SectionSpacing, string> = {
  none: "py-0",
  sm: "py-8 sm:py-12",
  md: "py-12 sm:py-16 lg:py-20",
  lg: "py-16 sm:py-24 lg:py-32",
  xl: "py-24 sm:py-32 lg:py-40",
};

/**
 * Section — Semantic layout block providing consistent vertical rhythm.
 */
export function Section({
  as: Component = "section",
  spacing = "lg",
  contain = false,
  containerSize = "2xl",
  className = "",
  children,
  ...props
}: SectionProps) {
  const verticalSpacing = spacingClasses[spacing];
  const Comp = Component as React.ComponentType<React.HTMLAttributes<HTMLElement>>;

  const content = contain ? (
    <Container size={containerSize}>{children}</Container>
  ) : (
    children
  );

  return (
    <Comp
      className={`relative w-full ${verticalSpacing} ${className}`.trim()}
      {...props}
    >
      {content}
    </Comp>
  );
}
