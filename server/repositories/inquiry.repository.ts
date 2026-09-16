import { prisma } from "@/lib/prisma";
import type { Prisma, Inquiry } from "@prisma/client";

/**
 * Inquiry repository.
 * Strictly handles Prisma data access only.
 */
export async function createInquiry(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
  return prisma.inquiry.create({ data });
}

export async function findInquiryById(id: string): Promise<Inquiry | null> {
  return prisma.inquiry.findUnique({ where: { id } });
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

  return prisma.inquiry.findMany(args);
}

export async function countInquiries(where?: Prisma.InquiryWhereInput | undefined): Promise<number> {
  if (where !== undefined) {
    return prisma.inquiry.count({ where });
  }
  return prisma.inquiry.count();
}

export async function updateInquiry(
  id: string,
  data: Prisma.InquiryUpdateInput,
): Promise<Inquiry> {
  return prisma.inquiry.update({
    where: { id },
    data,
  });
}
