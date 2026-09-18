import { z } from "zod";

// Admin Authentication Schemas
export const adminLoginSchema = z.object({
  email: z.string().trim().email("Valid engineering email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

// Customer Management Schemas
export const createCustomerSchema = z.object({
  name: z.string().trim().min(2, "Customer name must be at least 2 characters"),
  email: z.string().trim().email("Valid corporate email required"),
  companyName: z.string().trim().optional().nullable(),
});

export const updateCustomerSchema = z.object({
  name: z.string().trim().min(2).optional(),
  companyName: z.string().trim().optional().nullable(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

// Project Management Schemas
export const ProjectStatusEnum = z.enum([
  "ONBOARDING",
  "IN_PROGRESS",
  "REVIEW",
  "DELIVERED",
  "MAINTENANCE",
  "ARCHIVED",
]);

export const createProjectSchema = z.object({
  customerId: z.string().uuid("Valid customer ID required"),
  inquiryId: z.string().optional().nullable(),
  name: z.string().trim().min(2, "Project name must be at least 2 characters"),
  status: ProjectStatusEnum.default("ONBOARDING"),
  summary: z.string().trim().optional().nullable(),
});

export const updateProjectSchema = z.object({
  name: z.string().trim().min(2).optional(),
  status: ProjectStatusEnum.optional(),
  summary: z.string().trim().optional().nullable(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

// Milestone Schemas
export const MilestoneStatusEnum = z.enum(["PENDING", "IN_PROGRESS", "COMPLETE"]);

export const createMilestoneSchema = z.object({
  title: z.string().trim().min(2, "Milestone title required"),
  description: z.string().trim().optional().nullable(),
  status: MilestoneStatusEnum.default("PENDING"),
  dueDate: z.string().datetime({ offset: true }).or(z.string().datetime()).optional().nullable(),
});

export const updateMilestoneSchema = z.object({
  title: z.string().trim().min(2).optional(),
  description: z.string().trim().optional().nullable(),
  status: MilestoneStatusEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  completedAt: z.string().datetime().optional().nullable(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;

// Document Schemas
export const createProjectDocumentSchema = z.object({
  fileName: z.string().trim().min(1, "File name required"),
  storageKey: z.string().trim().min(1, "Storage key required"),
  mimeType: z.string().trim().min(1, "MIME type required"),
  fileSize: z.number().int().positive("File size must be positive"),
  uploadedBy: z.enum(["ADMIN", "CUSTOMER"]).default("ADMIN"),
});

export type CreateProjectDocumentInput = z.infer<typeof createProjectDocumentSchema>;

// Invoice Schemas
export const InvoiceStatusEnum = z.enum(["DRAFT", "SENT", "PAID", "OVERDUE", "VOID"]);

export const createInvoiceSchema = z.object({
  projectId: z.string().uuid("Valid project ID required"),
  invoiceNumber: z
    .string()
    .trim()
    .min(3, "Invoice number required (e.g. FS-2026-0001)")
    .regex(/^[A-Z0-9-]+$/, "Invoice number must contain uppercase letters, numbers, and hyphens only"),
  status: InvoiceStatusEnum.default("DRAFT"),
  amountDue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Amount must be a valid monetary decimal with up to 2 decimal places")
    .or(z.number().positive()),
  currency: z.string().trim().min(3).max(3).default("GBP"),
  issuedAt: z.string().datetime().optional().nullable(),
  dueAt: z.string().datetime("Valid due date required"),
  pdfStorageKey: z.string().trim().optional().nullable(),
});

export const updateInvoiceSchema = z.object({
  status: InvoiceStatusEnum.optional(),
  amountDue: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/)
    .or(z.number().positive())
    .optional(),
  currency: z.string().trim().min(3).max(3).optional(),
  dueAt: z.string().datetime().optional(),
  paidAt: z.string().datetime().optional().nullable(),
  pdfStorageKey: z.string().trim().optional().nullable(),
});

export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;

// Inquiry to Project Conversion Schema
export const convertInquirySchema = z.object({
  projectName: z.string().trim().min(2, "Project name required").optional(),
  projectSummary: z.string().trim().optional().nullable(),
  status: ProjectStatusEnum.default("ONBOARDING"),
});

export type ConvertInquiryInput = z.infer<typeof convertInquirySchema>;
