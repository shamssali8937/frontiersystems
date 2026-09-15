import React from "react";

export type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "error" | "outline";
export type BadgeSize = "sm" | "md";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]",
  accent: "bg-[rgba(99,199,217,0.1)] text-[#63C7D9] border border-[rgba(99,199,217,0.3)]",
  success: "bg-[rgba(78,186,135,0.1)] text-[#4EBA87] border border-[rgba(78,186,135,0.3)]",
  warning: "bg-[rgba(229,168,75,0.1)] text-[#E5A84B] border border-[rgba(229,168,75,0.3)]",
  error: "bg-[rgba(224,93,82,0.1)] text-[#E05D52] border border-[rgba(224,93,82,0.3)]",
  outline: "bg-transparent text-[#A6AAAC] border border-[#292D30]",
};

const dotColors: Record<BadgeVariant, string> = {
  neutral: "bg-[#A6AAAC]",
  accent: "bg-[#63C7D9]",
  success: "bg-[#4EBA87]",
  warning: "bg-[#E5A84B]",
  error: "bg-[#E05D52]",
  outline: "bg-[#6E7376]",
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px] gap-1.5",
  md: "px-2.5 py-1 text-xs gap-2",
};

/**
 * Badge — Status indicator and metadata tag with restrained contrast.
 */
export function Badge({
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-mono font-medium rounded-xs select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`inline-block h-1.5 w-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
