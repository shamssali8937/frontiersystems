import React from "react";
import NextLink from "next/link";

export type LinkVariant = "default" | "subtle" | "accent" | "nav";

export interface LinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: LinkVariant;
  external?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<LinkVariant, string> = {
  default:
    "text-[#F5F5F3] hover:text-[#63C7D9] underline-offset-4 hover:underline",
  subtle:
    "text-[#A6AAAC] hover:text-[#F5F5F3] transition-colors duration-150 motion-reduce:transition-none",
  accent:
    "text-[#63C7D9] hover:text-[#78D3E3] underline-offset-4 hover:underline",
  nav:
    "text-[#A6AAAC] hover:text-[#F5F5F3] font-medium text-sm transition-colors duration-150 motion-reduce:transition-none",
};

/**
 * Link — Accessible link supporting internal Next.js routing and external destinations.
 */
export function Link({
  href,
  variant = "default",
  external,
  className = "",
  children,
  ...props
}: LinkProps) {
  const isExternal =
    external !== undefined
      ? external
      : href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:");

  const baseClasses =
    "inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm transition-colors";
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`.trim();

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <NextLink href={href} className={combinedClasses} {...(props as any)}>
      {children}
    </NextLink>
  );
}
