import { Prisma } from "@prisma/client";
import {
  findInvoices,
  countInvoices,
  findInvoiceById,
  findInvoiceByNumber,
  createInvoice,
  updateInvoice,
} from "@/server/repositories/invoice.repository";
import { findProjectById } from "@/server/repositories/project.repository";
import { ServiceError } from "@/server/services/inquiry.service";
import type { CreateInvoiceInput, UpdateInvoiceInput } from "@/lib/validation/admin.schema";
import type { InvoiceStatus } from "@prisma/client";

export async function listInvoices(params?: {
  page?: number | undefined;
  limit?: number | undefined;
  status?: InvoiceStatus | undefined;
  projectId?: string | undefined;
  search?: string | undefined;
}) {
  const page = Math.max(params?.page ?? 1, 1);
  const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
  const skip = (page - 1) * limit;

  const [invoices, total] = await Promise.all([
    findInvoices({
      skip,
      take: limit,
      status: params?.status,
      projectId: params?.projectId,
      search: params?.search,
    }),
    countInvoices({
      status: params?.status,
      projectId: params?.projectId,
      search: params?.search,
    }),
  ]);

  return {
    invoices,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getInvoiceDetails(id: string) {
  const invoice = await findInvoiceById(id);
  if (!invoice) {
    throw new ServiceError("NOT_FOUND", "Invoice not found", 404);
  }
  return invoice;
}

export async function createNewInvoice(input: CreateInvoiceInput) {
  const project = await findProjectById(input.projectId);
  if (!project) {
    throw new ServiceError("NOT_FOUND", "Specified project not found", 404);
  }

  const existing = await findInvoiceByNumber(input.invoiceNumber);
  if (existing) {
    throw new ServiceError("DUPLICATE_INVOICE", "Invoice number already exists", 409);
  }

  const amountDecimal = new Prisma.Decimal(String(input.amountDue));

  return createInvoice({
    projectId: input.projectId,
    invoiceNumber: input.invoiceNumber,
    status: input.status,
    amountDue: amountDecimal,
    currency: input.currency || "GBP",
    issuedAt: input.issuedAt ? new Date(input.issuedAt) : new Date(),
    dueAt: new Date(input.dueAt),
    pdfStorageKey: input.pdfStorageKey ?? null,
  });
}

export async function modifyInvoice(id: string, input: UpdateInvoiceInput) {
  await getInvoiceDetails(id);

  const updateData: Prisma.InvoiceUpdateInput = {};

  if (input.status) {
    updateData.status = input.status;
    if (input.status === "PAID" && !input.paidAt) {
      updateData.paidAt = new Date();
    }
  }

  if (input.amountDue !== undefined) {
    updateData.amountDue = new Prisma.Decimal(String(input.amountDue));
  }

  if (input.currency) {
    updateData.currency = input.currency;
  }

  if (input.dueAt) {
    updateData.dueAt = new Date(input.dueAt);
  }

  if (input.paidAt !== undefined) {
    updateData.paidAt = input.paidAt ? new Date(input.paidAt) : null;
  }

  if (input.pdfStorageKey !== undefined) {
    updateData.pdfStorageKey = input.pdfStorageKey;
  }

  return updateInvoice(id, updateData);
}

export async function markInvoiceAsPaid(id: string) {
  return modifyInvoice(id, {
    status: "PAID",
    paidAt: new Date().toISOString(),
  });
}
