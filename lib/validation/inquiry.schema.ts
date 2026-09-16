import { z } from "zod";

export const inquiryStatusEnum = z.enum([
  "NEW",
  "UNDER_REVIEW",
  "CONTACTED",
  "QUALIFIED",
  "ARCHIVED",
]);

export type InquiryStatusType = z.infer<typeof inquiryStatusEnum>;

/** Schema for public inquiry submissions */
export const createInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
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
  service: z
    .string()
    .trim()
    .max(100, "Service name must not exceed 100 characters")
    .optional(),
  budget: z
    .string()
    .trim()
    .max(50, "Budget range must not exceed 50 characters")
    .optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must not exceed 5000 characters"),
  turnstileToken: z.string().optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;

/** Schema for admin status / notes update */
export const updateInquirySchema = z.object({
  status: inquiryStatusEnum.optional(),
  internalNotes: z.string().trim().max(2000).optional(),
});

export type UpdateInquiryInput = z.infer<typeof updateInquirySchema>;

/** Schema for admin query pagination & filters */
export const inquiryQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: inquiryStatusEnum.optional(),
});

export type InquiryQueryInput = z.infer<typeof inquiryQuerySchema>;
