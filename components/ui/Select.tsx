import React, { forwardRef, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options?: SelectOption[];
}

/**
 * Select — Accessible dropdown select with custom chevron and dark theme styling.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      hint,
      id,
      options,
      className = "",
      disabled,
      required,
      children,
      ...props
    },
    ref,
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const errorId = `${selectId}-error`;
    const hintId = `${selectId}-hint`;

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
            htmlFor={selectId}
            className="text-xs font-mono uppercase tracking-wider text-[#A6AAAC] flex items-center justify-between"
          >
            <span>
              {label}
              {required && <span className="text-[#63C7D9] ml-1" aria-hidden="true">*</span>}
            </span>
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={describedBy}
            className={`w-full h-10 pl-3 pr-9 bg-[#111416] text-[#F5F5F3] text-sm border rounded-sm appearance-none transition-colors duration-150 motion-reduce:transition-none focus:outline-none focus:border-[#63C7D9] focus:ring-1 focus:ring-[#63C7D9] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              error
                ? "border-[#E05D52] focus:border-[#E05D52] focus:ring-[#E05D52]"
                : "border-[#292D30] hover:border-[#3D4347]"
            } ${className}`.trim()}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    disabled={opt.disabled}
                    className="bg-[#111416] text-[#F5F5F3]"
                  >
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          {/* Accessible Custom Chevron */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-3 text-[#6E7376]"
          >
            <svg
              className="h-4 w-4 fill-none stroke-current"
              viewBox="0 0 24 24"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
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

Select.displayName = "Select";
