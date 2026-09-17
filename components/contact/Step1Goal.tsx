import { UseFormReturn } from "react-hook-form";
import { ContactFormValues, GoalOption } from "@/lib/validation/contact-form.schema";
import { Heading } from "@/components/ui/Heading";

interface Step1GoalProps {
  form: UseFormReturn<ContactFormValues>;
}

const GOALS: Array<{
  id: GoalOption;
  title: string;
  badge: string;
  description: string;
}> = [
  {
    id: "Build",
    title: "Build",
    badge: "01 // GREENFIELD",
    description:
      "Design and engineer mission-critical digital products, high-throughput web applications, and enterprise SaaS platforms from the ground up.",
  },
  {
    id: "Automate",
    title: "Automate",
    badge: "02 // AI & WORKFLOWS",
    description:
      "Deploy deterministic autonomous AI agents, intelligent pipelines, and robust robotic business process automation that eliminate manual latency.",
  },
  {
    id: "Scale",
    title: "Scale",
    badge: "03 // HIGH CONCURRENCY",
    description:
      "Optimize distributed infrastructure, refactor multi-tenant database clusters, and maximize computational throughput under severe production loads.",
  },
  {
    id: "Modernize",
    title: "Modernize",
    badge: "04 // LEGACY TO CLOUD",
    description:
      "Migrate monolithic legacy architectures to zero-trust cloud infrastructure, containerized microservices, and hardened security perimeters.",
  },
];

export function Step1Goal({ form }: Step1GoalProps) {
  const selectedGoal = form.watch("goal");
  const error = form.formState.errors.goal;

  return (
    <div className="space-y-6">
      <div>
        <Heading as="h2" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3]">
          What is the primary objective of your engagement?
        </Heading>
        <p className="mt-1 text-sm text-[#A6AAAC]">
          Select the strategic goal that best matches your engineering or transformation initiative.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Engagement Goal Selection"
        aria-describedby={error ? "goal-error" : undefined}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {GOALS.map((goal) => {
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => {
                form.setValue("goal", goal.id, { shouldValidate: true, shouldDirty: true });
              }}
              className={`p-6 rounded-sm text-left transition-all relative border flex flex-col justify-between ${
                isSelected
                  ? "bg-[#171A1C] border-[#63C7D9] shadow-[0_0_20px_rgba(99,199,217,0.1)] ring-1 ring-[#63C7D9]"
                  : "bg-[#111416] border-[#292D30] hover:border-[#3D4347] hover:bg-[#14171A]"
              } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9]`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#63C7D9] tracking-wider">
                    {goal.badge}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-[#63C7D9] bg-[#63C7D9]"
                        : "border-[#3D4347] bg-transparent"
                    }`}
                  >
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B0D0E]" />
                    )}
                  </div>
                </div>

                <div className="text-lg font-semibold text-[#F5F5F3]">
                  {goal.title}
                </div>

                <p className="text-xs sm:text-sm text-[#A6AAAC] leading-relaxed">
                  {goal.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <p id="goal-error" role="alert" className="text-xs text-[#E85D5D] font-mono">
          {error.message}
        </p>
      )}
    </div>
  );
}
