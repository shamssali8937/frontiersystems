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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {TIMELINE_OPTIONS.map((timeline) => {
            const isSelected = selectedTimeline === timeline;

            return (
              <button
                key={timeline}
                type="button"
                role="radio"
                aria-checked={isSelected}
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
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9]`}
              >
                {timeline}
              </button>
            );
          })}
        </div>
        {errors.timeline && (
          <p role="alert" className="text-xs text-[#E85D5D] font-mono">
            {errors.timeline.message}
          </p>
        )}
      </div>

      {/* Budget Open-Text Field (SRS Mandate) */}
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
            className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus:outline-none focus:border-[#63C7D9] focus:ring-1 focus:ring-[#63C7D9] transition-colors"
          />
        </div>

        {errors.budget && (
          <p id="budget-error" role="alert" className="text-xs text-[#E85D5D] font-mono">
            {errors.budget.message}
          </p>
        )}
      </div>
    </div>
  );
}
