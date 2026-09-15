import React, { forwardRef, useId } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Input — Accessible text input field with error states and focus styling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      id,
      className = "",
      disabled,
      required,
      leftIcon,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

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
            htmlFor={inputId}
            className="text-xs font-mono uppercase tracking-wider text-[#A6AAAC] flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-[#63C7D9] ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#6E7376] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full h-10 px-3 ${leftIcon ? "pl-9" : ""} ${rightIcon ? "pr-9" : ""} bg-[#111416] text-[#F5F5F3] text-sm placeholder-[#6E7376] border rounded-sm transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:border-[#63C7D9] focus:ring-1 focus:ring-[#63C7D9] disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? "border-[#E05D52] focus:border-[#E05D52] focus:ring-[#E05D52]"
                : "border-[#292D30] hover:border-[#3D4347]"
            } ${className}`.trim()}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 text-[#6E7376] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

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

Input.displayName = "Input";
