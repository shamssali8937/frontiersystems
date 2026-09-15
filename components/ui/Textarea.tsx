import React, { forwardRef, useId } from "react";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Textarea — Accessible multi-line input matching engineering dark theme.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      id,
      className = "",
      disabled,
      required,
      rows = 4,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const describedBy = [
      error ? errorId : null,
      hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-xs font-mono uppercase tracking-wider text-[#A6AAAC] flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-[#63C7D9] ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          rows={rows}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={`w-full p-3 bg-[#111416] text-[#F5F5F3] text-sm placeholder-[#6E7376] border rounded-sm transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:border-[#63C7D9] focus:ring-1 focus:ring-[#63C7D9] disabled:opacity-50 disabled:cursor-not-allowed ${
            error
              ? "border-[#E05D52] focus:border-[#E05D52] focus:ring-[#E05D52]"
              : "border-[#292D30] hover:border-[#3D4347]"
          } ${className}`.trim()}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-xs text-[#6E7376]">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} role="alert" className="text-xs text-[#E05D52]">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
