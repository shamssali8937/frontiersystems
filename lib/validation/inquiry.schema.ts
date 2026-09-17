import { z } from "zod";
import { sanitizeText } from "@/lib/security/sanitize";

export const inquiryStatusEnum = z.enum([
  "NEW",
  "UNDER_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "ARCHIVED",
]);

export type InquiryStatusType = z.infer<typeof inquiryStatusEnum>;

export const ALLOWED_PROJECT_TYPES = [
  "Build",
  "Automate",
  "Scale",
  "Modernize",
  "AI & Automation",
  "Digital Products",
  "Business Systems",
  "Infrastructure & Security",
  "AI Systems Engineering",
] as const;

export type AllowedProjectType = (typeof ALLOWED_PROJECT_TYPES)[number];

/**
 * Production schema for public inquiry submissions.
 * Normalizes input keys (client_name/name, technical_details/message, etc.),
 * sanitizes strings against XSS, and enforces strict boundary rules.
 */
export const createInquirySchema = z.preprocess(
  (raw: unknown) => {
    if (typeof raw !== "object" || raw === null) return {};
    const r = raw as Record<string, unknown>;

    return {
      client_name: r.client_name ?? r.name,
      email: r.email,
      project_type: r.project_type ?? r.service ?? r.serviceOfInterest,
      timeline: r.timeline,
      custom_budget: r.custom_budget ?? r.budget,
      technical_details: r.technical_details ?? r.message,
      company: r.company,
      phone: r.phone,
      attachment_references:
        r.attachment_references ?? r.attachments ?? r.attachment_ids ?? r.attachedFiles,
      turnstile_token: r.turnstile_token ?? r.turnstileToken,
    };
  },
  z.object({
    client_name: z
      .string()
      .trim()
      .transform(sanitizeText)
      .pipe(
        z
          .string()
          .min(2, "Client name must be at least 2 characters")
          .max(100, "Client name must not exceed 100 characters"),
      ),
    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .max(255, "Email must not exceed 255 characters")
      .toLowerCase(),
    project_type: z
      .enum(ALLOWED_PROJECT_TYPES, {
        message: "Invalid project type. Untrusted project categories are rejected.",
      })
      .optional(),
    timeline: z
      .string()
      .trim()
      .transform(sanitizeText)
      .pipe(z.string().max(100, "Timeline must not exceed 100 characters"))
      .optional(),
    custom_budget: z
      .string()
      .trim()
      .transform(sanitizeText)
      .pipe(z.string().max(100, "Budget specification must not exceed 100 characters"))
      .optional(),
    technical_details: z
      .string()
      .trim()
      .transform(sanitizeText)
      .pipe(
        z
          .string()
          .min(10, "Technical details must be at least 10 characters")
          .max(5000, "Technical details must not exceed 5,000 characters"),
      ),
    company: z
      .string()
      .trim()
      .transform(sanitizeText)
      .pipe(z.string().max(100, "Company name must not exceed 100 characters"))
      .optional(),
    phone: z
      .string()
      .trim()
      .transform(sanitizeText)
      .pipe(z.string().max(30, "Phone number must not exceed 30 characters"))
      .optional(),
    attachment_references: z
      .array(
        z.union([
          z.string().trim().max(100),
          z.object({ id: z.string().trim().max(100) }).transform((obj) => obj.id),
        ]),
      )
      .max(5, "A maximum of 5 specification attachments are permitted")
      .default([]),
    turnstile_token: z.string().optional(),
  }),
);

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

/** Schema for admin status / notes update with automatic sanitization */
export const updateInquirySchema = z.object({
  status: inquiryStatusEnum.optional(),
  internalNotes: z
    .string()
    .trim()
    .transform(sanitizeText)
    .pipe(z.string().max(2000, "Internal notes must not exceed 2000 characters"))
    .optional(),
});

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;

/** Schema for admin query pagination & filters */
export const inquiryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: inquiryStatusEnum.optional(),
});

export type InquiryQueryInput = z.infer<typeof inquiryQuerySchema>;
