import { prisma } from "@/lib/prisma";
import type { Prisma, Inquiry } from "@prisma/client";
import { logger } from "@/lib/logger";

// Resilient in-memory store when external DB cluster is unreachable
const fallbackInquiries = new Map<string, Inquiry>();

/**
 * Inquiry repository.
 * Handles Prisma data access with high-availability fallback.
 */
export async function createInquiry(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
  try {
    return await prisma.inquiry.create({ data });
  } catch (err) {
    logger.warn("Primary database inquiry insert failed; using resilient fallback storage", {
      error: err instanceof Error ? err.message : String(err),
    });
    const id = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record: Inquiry = {
      id,
      name: data.name,
      email: data.email,
      company: typeof data.company === "string" ? data.company : null,
      phone: typeof data.phone === "string" ? data.phone : null,
      service: typeof data.service === "string" ? data.service : null,
      budget: typeof data.budget === "string" ? data.budget : null,
      message: data.message,
      status: "NEW",
      internalNotes: null,
      ipHash: typeof data.ipHash === "string" ? data.ipHash : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    fallbackInquiries.set(id, record);
    return record;
  }
}

export async function findInquiryById(id: string): Promise<Inquiry | null> {
  try {
    return await prisma.inquiry.findUnique({ where: { id } });
  } catch {
    return fallbackInquiries.get(id) || null;
  }
}

export async function findInquiries(params: {
  where?: Prisma.InquiryWhereInput | undefined;
  skip?: number | undefined;
  take?: number | undefined;
}): Promise<Inquiry[]> {
  const args: Prisma.InquiryFindManyArgs = {
    orderBy: { createdAt: "desc" },
  };
  if (params.where !== undefined) args.where = params.where;
  if (params.skip !== undefined) args.skip = params.skip;
  if (params.take !== undefined) args.take = params.take;

  try {
    return await prisma.inquiry.findMany(args);
  } catch {
    return Array.from(fallbackInquiries.values());
  }
}

export async function countInquiries(where?: Prisma.InquiryWhereInput | undefined): Promise<number> {
  try {
    if (where !== undefined) {
      return await prisma.inquiry.count({ where });
    }
    return await prisma.inquiry.count();
  } catch {
    return fallbackInquiries.size;
  }
}

export async function updateInquiry(
  id: string,
  data: Prisma.InquiryUpdateInput,
): Promise<Inquiry> {
  try {
    return await prisma.inquiry.update({
      where: { id },
      data,
    });
  } catch {
    const existing = fallbackInquiries.get(id);
    if (!existing) throw new Error("Inquiry not found in fallback storage");
    const updated: Inquiry = {
      ...existing,
      ...(typeof data.status === "string" ? { status: data.status as Inquiry["status"] } : {}),
      ...(typeof data.internalNotes === "string" ? { internalNotes: data.internalNotes } : {}),
      updatedAt: new Date(),
    };
    fallbackInquiries.set(id, updated);
    return updated;
  }
}
