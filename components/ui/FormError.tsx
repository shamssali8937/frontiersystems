import React from "react";

export interface FormErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  message?: string;
  children?: React.ReactNode;
}

/**
 * FormError — Accessible form-level error banner with alert role.
 */
export function FormError({
  title = "Submission Error",
  message,
  children,
  className = "",
  ...props
}: FormErrorProps) {
  if (!message && !children) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`p-3.5 bg-[rgba(224,93,82,0.08)] border border-[rgba(224,93,82,0.3)] rounded-sm text-[#E05D52] flex flex-col gap-1 text-xs ${className}`.trim()}
      {...props}
    >
      {title && <span className="font-semibold tracking-wide uppercase font-mono">{title}</span>}
      {message && <p className="text-[#F5F5F3] leading-relaxed">{message}</p>}
      {children}
    </div>
  );
}
