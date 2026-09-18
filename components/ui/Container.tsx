import React from "react";

export type ContainerSize = "sm" | "md" | "lg" | "xl" | "2xl" | "full";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: ContainerSize;
  children: React.ReactNode;
}

const sizeClasses: Record<ContainerSize, string> = {
  sm: "max-w-screen-sm",
  md: "max-w-screen-md",
  lg: "max-w-screen-lg",
  xl: "max-w-screen-xl",
  "2xl": "max-w-[1440px]",
  full: "max-w-full",
};

/**
 * Container — Standard responsive centered content wrapper.
 * Enforces uniform horizontal gutters across all breakpoints.
 */
export function Container({
  as: Component = "div",
  size = "2xl",
  className = "",
  children,
  ...props
}: ContainerProps) {
  const sizeClass = sizeClasses[size];
  const Comp = Component as React.ComponentType<React.HTMLAttributes<HTMLElement>>;

  return (
    <Comp
      className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </Comp>
  );
}
