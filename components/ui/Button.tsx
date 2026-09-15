import React, { forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "accent" | "outline" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#F5F5F3] text-[#0B0D0E] font-medium hover:bg-white active:bg-[#E5E5E3] border border-transparent shadow-none",
  accent:
    "bg-[#63C7D9] text-[#0B0D0E] font-medium hover:bg-[#78D3E3] active:bg-[#52B8CA] border border-transparent shadow-none",
  secondary:
    "bg-[#171A1C] text-[#F5F5F3] border border-[#292D30] hover:border-[#3D4347] hover:bg-[#1E2225] active:bg-[#151719]",
  outline:
    "bg-transparent text-[#F5F5F3] border border-[#292D30] hover:border-[#63C7D9] hover:text-[#63C7D9] active:bg-[rgba(99,199,217,0.06)]",
  ghost:
    "bg-transparent text-[#A6AAAC] border border-transparent hover:text-[#F5F5F3] hover:bg-[#171A1C] active:bg-[#1F2326]",
  danger:
    "bg-[#E05D52] text-white border border-transparent hover:bg-[#EB6E63] active:bg-[#D44E43]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-sm",
  md: "h-10 px-4 text-sm gap-2 rounded-sm",
  lg: "h-12 px-6 text-base gap-2.5 rounded-sm",
};

/**
 * Button — Core interactive button with accessible states and restrained engineering aesthetic.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`inline-flex items-center justify-center font-sans tracking-normal select-none transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] disabled:pointer-events-none disabled:opacity-50 cursor-pointer ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()}
        {...props}
      >
        {isLoading ? (
          <span
            aria-hidden="true"
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          />
        ) : (
          leftIcon
        )}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  },
);

Button.displayName = "Button";
