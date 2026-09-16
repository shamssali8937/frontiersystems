import {
  createInquiry,
  findInquiryById,
  findInquiries,
  countInquiries,
  updateInquiry,
} from "@/server/repositories/inquiry.repository";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { verifyTurnstileToken } from "@/lib/security/turnstile";
import type {
  CreateInquiryInput,
  UpdateInquiryInput,
  InquiryQueryInput,
} from "@/lib/validation/inquiry.schema";
import type { Inquiry, Prisma } from "@prisma/client";

export class ServiceError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 400,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

/**
 * Public inquiry submission service.
 */
export async function submitInquiry(
  input: CreateInquiryInput,
  clientIp: string,
): Promise<{ id: string; createdAt: Date }> {
  // 1. Rate limiting check (5 submissions per 10 minutes per IP)
  const rateLimit = checkRateLimit("inquiries", clientIp, {
    limit: 5,
    windowMs: 10 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    throw new ServiceError(
      "RATE_LIMITED",
      "Too many inquiries submitted. Please try again later.",
      429,
    );
  }

  // 2. Cloudflare Turnstile token validation
  const turnstile = await verifyTurnstileToken(input.turnstileToken, clientIp);
  if (!turnstile.success) {
    throw new ServiceError(
      "TURNSTILE_FAILED",
      turnstile.error || "Security verification failed",
      400,
    );
  }

  // 3. Create database record via repository
  const record = await createInquiry({
    name: input.name,
    email: input.email,
    company: input.company || null,
    phone: input.phone || null,
    service: input.service || null,
    budget: input.budget || null,
    message: input.message,
    ipHash: clientIp ? `ip_${clientIp.slice(0, 8)}` : null,
  });

  return {
    id: record.id,
    createdAt: record.createdAt,
  };
}

/**
 * Get inquiry by ID.
 */
export async function getInquiry(id: string): Promise<Inquiry> {
  const record = await findInquiryById(id);
  if (!record) {
    throw new ServiceError("NOT_FOUND", "Inquiry record not found", 404);
  }
  return record;
}

/**
 * List paginated inquiries for admin.
 */
export async function listInquiries(query: InquiryQueryInput): Promise<{
  inquiries: Inquiry[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}> {
  const skip = (query.page - 1) * query.limit;
  const where: Prisma.InquiryWhereInput | undefined = query.status !== undefined ? { status: query.status } : undefined;

  const [inquiries, total] = await Promise.all([
    findInquiries({ where, skip, take: query.limit }),
    countInquiries(where),
  ]);

  return {
    inquiries,
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.ceil(total / query.limit) || 1,
    },
  };
}

/**
 * Update inquiry status & internal notes.
 */
export async function updateInquiryDetails(
  id: string,
  input: UpdateInquiryInput,
): Promise<Inquiry> {
  await getInquiry(id); // verify existence

  return updateInquiry(id, {
    ...(input.status ? { status: input.status } : {}),
    ...(input.internalNotes !== undefined ? { internalNotes: input.internalNotes } : {}),
  });
}
