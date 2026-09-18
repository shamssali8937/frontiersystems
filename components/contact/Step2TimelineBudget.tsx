import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  ContactFormValues,
  TIMELINE_OPTIONS,
  TimelineOption,
} from "@/lib/validation/contact-form.schema";
import { Heading } from "@/components/ui/Heading";

interface Step2TimelineBudgetProps {
  form: UseFormReturn<ContactFormValues>;
}

export function Step2TimelineBudget({ form }: Step2TimelineBudgetProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const selectedTimeline = watch("timeline");
  const timelineRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleTimelineKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (index + 1) % TIMELINE_OPTIONS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (index - 1 + TIMELINE_OPTIONS.length) % TIMELINE_OPTIONS.length;
    } else {
      return;
    }

    const nextTimeline = TIMELINE_OPTIONS[nextIndex] as TimelineOption;
    setValue("timeline", nextTimeline, { shouldValidate: true, shouldDirty: true });
    timelineRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="space-y-8">
      <div>
        <Heading as="h2" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3]">
          Delivery Timeline & Capital Allocation
        </Heading>
        <p className="mt-1 text-sm text-[#A6AAAC]">
          Define your operational delivery urgency and anticipated investment allocation.
        </p>
      </div>

      {/* Timeline Selection */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-[#F5F5F3]">
          Expected Delivery Horizon <span className="text-[#63C7D9]">*</span>
        </label>
        <div
          role="radiogroup"
          aria-label="Expected Delivery Horizon"
          aria-describedby={errors.timeline ? "timeline-error" : undefined}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {TIMELINE_OPTIONS.map((timeline, index) => {
            const isSelected = selectedTimeline === timeline;
            const isFocusable = isSelected || (!selectedTimeline && index === 0);

            return (
              <button
                key={timeline}
                ref={(el) => {
                  timelineRefs.current[index] = el;
                }}
                type="button"
                role="radio"
                tabIndex={isFocusable ? 0 : -1}
                aria-checked={isSelected}
                onKeyDown={(e) => handleTimelineKeyDown(e, index)}
                onClick={() => {
                  setValue("timeline", timeline as TimelineOption, {
                    shouldValidate: true,
                    shouldDirty: true,
                  });
                }}
                className={`p-4 rounded-sm text-center border text-sm font-medium transition-all ${
                  isSelected
                    ? "bg-[#171A1C] border-[#63C7D9] text-[#63C7D9] ring-1 ring-[#63C7D9]"
                    : "bg-[#111416] border-[#292D30] text-[#A6AAAC] hover:border-[#3D4347] hover:text-[#F5F5F3]"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E]`}
              >
                {timeline}
              </button>
            );
          })}
        </div>
        {errors.timeline && (
          <p id="timeline-error" role="alert" className="text-xs text-[#E85D5D] font-mono flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0 text-[#E85D5D]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{errors.timeline.message}</span>
          </p>
        )}
      </div>

      {/* Budget Open-Text Field */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="budget-field" className="block text-sm font-medium text-[#F5F5F3]">
            Estimated Budget / Allocation <span className="text-[#63C7D9]">*</span>
          </label>
          <span className="text-xs font-mono text-[#6E7376]">
            OPEN SPECIFICATION
          </span>
        </div>

        <p className="text-xs text-[#A6AAAC] leading-relaxed">
          As specified by our engagement model, budget is an open-text specification. You can state a precise currency figure, threshold range (e.g., &ldquo;£40k–£75k&rdquo; or &ldquo;$150k+&rdquo;), or specify an exploratory discovery allocation.
        </p>

        <div className="relative">
          <input
            id="budget-field"
            type="text"
            placeholder="e.g. £50,000 – £100,000 or $120k allocated"
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={errors.budget ? "budget-error" : undefined}
            {...register("budget")}
            className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] transition-colors"
          />
        </div>

        {errors.budget && (
          <p id="budget-error" role="alert" className="text-xs text-[#E85D5D] font-mono flex items-center gap-1.5">
            <svg className="w-4 h-4 shrink-0 text-[#E85D5D]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{errors.budget.message}</span>
          </p>
        )}
      </div>
    </div>
  );
}
