import React from "react";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

/**
 * Divider — Clean boundary line with standard border token (#292D30).
 */
export function Divider({
  orientation = "horizontal",
  label,
  className = "",
  ...props
}: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={`inline-block h-full min-h-[1em] w-[1px] self-stretch bg-[#292D30] ${className}`.trim()}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        role="separator"
        aria-orientation="horizontal"
        className={`flex items-center gap-4 my-6 ${className}`.trim()}
        {...props}
      >
        <div className="h-[1px] flex-grow bg-[#292D30]" />
        <span className="text-xs font-mono uppercase tracking-widest text-[#6E7376]">
          {label}
        </span>
        <div className="h-[1px] flex-grow bg-[#292D30]" />
      </div>
    );
  }

  return (
    <hr
      role="separator"
      className={`border-0 border-t border-[#292D30] my-6 w-full ${className}`.trim()}
      {...props}
    />
  );
}
