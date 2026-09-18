interface InquiryFormProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function InquiryFormProgress({
  currentStep,
  totalSteps,
  stepLabels,
}: InquiryFormProgressProps) {
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <nav
      aria-label="Progress"
      className="mb-10 pb-6 border-b border-[#171A1C]"
    >
      {/* Visual step indicator bar */}
      <div className="relative mb-6">
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 h-[2px] bg-[#171A1C]"
        />
        <div
          aria-hidden="true"
          className="absolute top-1/2 left-0 -translate-y-1/2 h-[2px] bg-[#63C7D9] transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
        />
        <ol className="relative flex justify-between">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <li
                key={label}
                aria-current={isCurrent ? "step" : undefined}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-semibold transition-all duration-200 ${
                    isCompleted
                      ? "bg-[#63C7D9] text-[#0B0D0E]"
                      : isCurrent
                        ? "bg-[#111416] text-[#63C7D9] border-2 border-[#63C7D9] ring-4 ring-[#63C7D9]/10"
                        : "bg-[#111416] text-[#6E7376] border border-[#292D30]"
                  }`}
                >
                  {isCompleted ? (
                    <span aria-hidden="true">✓</span>
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                  <span className="sr-only">
                    {`Step ${stepNumber}: ${label} ${isCompleted ? "(Completed)" : isCurrent ? "(Current)" : ""}`}
                  </span>
                </div>
                <span
                  className={`mt-2 text-[11px] font-mono hidden sm:block ${
                    isCurrent
                      ? "text-[#F5F5F3] font-medium"
                      : isCompleted
                        ? "text-[#A6AAAC]"
                        : "text-[#6E7376]"
                  }`}
                >
                  {label}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Mobile Step Header */}
      <div className="flex items-center justify-between sm:hidden text-xs font-mono text-[#A6AAAC]">
        <span>
          STEP {currentStep} OF {totalSteps}
        </span>
        <span className="text-[#63C7D9]">{stepLabels[currentStep - 1]}</span>
      </div>
    </nav>
  );
}
