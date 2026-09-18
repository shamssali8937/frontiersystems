import { prisma } from "@/lib/prisma";
import type { LeadActivity } from "@prisma/client";

export async function createLeadActivity(data: {
  inquiryId?: string | null;
  type: string;
  description: string;
  metadata?: Record<string, unknown> | null;
}): Promise<LeadActivity> {
  return prisma.leadActivity.create({
    data: {
      inquiryId: data.inquiryId ?? null,
      type: data.type,
      description: data.description,
      metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    },
  });
}

export async function findRecentActivities(limit: number = 20): Promise<LeadActivity[]> {
  return prisma.leadActivity.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      inquiry: {
        select: { id: true, name: true, email: true, status: true },
      },
    },
  });
}

export async function findActivitiesByInquiryId(inquiryId: string): Promise<LeadActivity[]> {
  return prisma.leadActivity.findMany({
    where: { inquiryId },
    orderBy: { createdAt: "desc" },
  });
}
