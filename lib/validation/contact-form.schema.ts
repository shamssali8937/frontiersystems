import { z } from "zod";

export const GOAL_OPTIONS = ["Build", "Automate", "Scale", "Modernize"] as const;
export type GoalOption = (typeof GOAL_OPTIONS)[number];

export const TIMELINE_OPTIONS = [
  "Immediate (< 1 month)",
  "1–3 months",
  "3–6 months",
  "Flexible / Discovery",
] as const;
export type TimelineOption = (typeof TIMELINE_OPTIONS)[number];

export interface AttachedFileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
}

/** Step 1: Goal Selection */
export const step1GoalSchema = z.object({
  goal: z.enum(GOAL_OPTIONS, {
    message: "Please select an engagement goal",
  }),
});

/** Step 2: Timeline & Open-Text Budget (SRS Requirement: Budget must remain an open-text field) */
export const step2TimelineBudgetSchema = z.object({
  timeline: z.enum(TIMELINE_OPTIONS, {
    message: "Please select your target timeline",
  }),
  budget: z
    .string()
    .trim()
    .min(1, "Please specify an estimated budget or capital allocation")
    .max(100, "Budget specification must not exceed 100 characters"),
});

/** Step 3: Technical Details & File Upload Metadata */
export const step3TechDetailsSchema = z.object({
  technicalDetails: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters detailing your technical requirements")
    .max(5000, "Technical details must not exceed 5,000 characters"),
  attachedFiles: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      size: z.number(),
      type: z.string(),
    }),
  ),
});

/** Step 4: Contact Information */
export const step4ContactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid work email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase(),
  company: z
    .string()
    .trim()
    .max(100, "Company name must not exceed 100 characters")
    .optional(),
  phone: z
    .string()
    .trim()
    .max(30, "Phone number must not exceed 30 characters")
    .optional(),
});

/** Full Aggregate Form Schema */
export const contactFormSchema = step1GoalSchema
  .merge(step2TimelineBudgetSchema)
  .merge(step3TechDetailsSchema)
  .merge(step4ContactSchema);

export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const DEFAULT_FORM_VALUES: ContactFormValues = {
  goal: "Build",
  timeline: "1–3 months",
  budget: "",
  technicalDetails: "",
  attachedFiles: [],
  name: "",
  email: "",
  company: "",
  phone: "",
};
