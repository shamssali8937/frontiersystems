import React from "react";

export type CardVariant = "default" | "secondary" | "outline" | "interactive";
export type CardPadding = "none" | "sm" | "md" | "lg";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  variant?: CardVariant;
  padding?: CardPadding;
  children: React.ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: "bg-[#111416] border border-[#292D30] text-[#F5F5F3]",
  secondary: "bg-[#171A1C] border border-[#292D30] text-[#F5F5F3]",
  outline: "bg-transparent border border-[#292D30] text-[#F5F5F3]",
  interactive:
    "bg-[#111416] border border-[#292D30] text-[#F5F5F3] hover:border-[#3D4347] hover:bg-[#15191B] transition-colors duration-150 motion-reduce:transition-none cursor-pointer",
};

const paddingClasses: Record<CardPadding, string> = {
  none: "p-0",
  sm: "p-4 sm:p-5",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10 lg:p-12",
};

/**
 * Card — Minimal surface container for technical data, features, and cards.
 * Avoids decorative glow/gradients in favor of crisp engineering boundaries.
 */
export function Card({
  as: Component = "div",
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <Component
      className={`rounded-sm relative ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`.trim()}
      {...props}
    >
      {children}
    </Component>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardHeader({ className = "", children, ...props }: CardHeaderProps) {
  return (
    <div className={`mb-4 flex flex-col gap-1.5 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardContent({ className = "", children, ...props }: CardContentProps) {
  return (
    <div className={`text-sm text-[#A6AAAC] leading-relaxed ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CardFooter({ className = "", children, ...props }: CardFooterProps) {
  return (
    <div className={`mt-6 pt-4 border-t border-[#292D30] flex items-center justify-between ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}
