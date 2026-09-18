import { prisma } from "@/lib/prisma";
import type { Invoice, InvoiceStatus, Prisma } from "@prisma/client";

export async function findInvoices(params?: {
  skip?: number | undefined;
  take?: number | undefined;
  status?: InvoiceStatus | undefined;
  projectId?: string | undefined;
  search?: string | undefined;
}) {
  const where: Prisma.InvoiceWhereInput = {
    ...(params?.status ? { status: params.status } : {}),
    ...(params?.projectId ? { projectId: params.projectId } : {}),
    ...(params?.search
      ? {
          OR: [
            { invoiceNumber: { contains: params.search, mode: "insensitive" } },
            { project: { name: { contains: params.search, mode: "insensitive" } } },
            { project: { customer: { name: { contains: params.search, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  return prisma.invoice.findMany({
    where,
    skip: params?.skip ?? 0,
    take: params?.take ?? 50,
    orderBy: { issuedAt: "desc" },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          customer: {
            select: { id: true, name: true, email: true, companyName: true },
          },
        },
      },
    },
  });
}

export async function countInvoices(params?: {
  status?: InvoiceStatus | undefined;
  projectId?: string | undefined;
  search?: string | undefined;
}): Promise<number> {
  const where: Prisma.InvoiceWhereInput = {
    ...(params?.status ? { status: params.status } : {}),
    ...(params?.projectId ? { projectId: params.projectId } : {}),
    ...(params?.search
      ? {
          OR: [
            { invoiceNumber: { contains: params.search, mode: "insensitive" } },
            { project: { name: { contains: params.search, mode: "insensitive" } } },
            { project: { customer: { name: { contains: params.search, mode: "insensitive" } } } },
          ],
        }
      : {}),
  };

  return prisma.invoice.count({ where });
}

export async function findInvoiceById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          customer: true,
        },
      },
    },
  });
}

export async function findInvoiceByNumber(invoiceNumber: string): Promise<Invoice | null> {
  return prisma.invoice.findUnique({
    where: { invoiceNumber },
  });
}

export async function createInvoice(data: {
  projectId: string;
  invoiceNumber: string;
  status?: InvoiceStatus | undefined;
  amountDue: Prisma.Decimal;
  currency?: string | undefined;
  issuedAt?: Date | undefined;
  dueAt: Date;
  pdfStorageKey?: string | null | undefined;
}): Promise<Invoice> {
  return prisma.invoice.create({
    data: {
      projectId: data.projectId,
      invoiceNumber: data.invoiceNumber.trim(),
      status: data.status ?? "DRAFT",
      amountDue: data.amountDue,
      currency: data.currency ?? "GBP",
      issuedAt: data.issuedAt ?? new Date(),
      dueAt: data.dueAt,
      pdfStorageKey: data.pdfStorageKey ?? null,
    },
    include: {
      project: {
        include: { customer: true },
      },
    },
  });
}

export async function updateInvoice(
  id: string,
  data: Prisma.InvoiceUpdateInput,
): Promise<Invoice> {
  return prisma.invoice.update({
    where: { id },
    data,
    include: {
      project: {
        include: { customer: true },
      },
    },
  });
}
