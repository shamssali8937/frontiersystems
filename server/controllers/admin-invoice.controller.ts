import { NextRequest } from "next/server";
import {
  listInvoices,
  getInvoiceDetails,
  createNewInvoice,
  modifyInvoice,
  markInvoiceAsPaid,
} from "@/server/services/invoice.service";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "@/lib/validation/admin.schema";
import { jsonSuccess, jsonError } from "@/types/api";
import { handleControllerError } from "@/server/controllers/inquiry.controller";
import { verifyAdminRequest, ADMIN_COOKIE_NAME } from "@/server/services/admin-auth.service";
import type { InvoiceStatus } from "@prisma/client";

async function requireAdmin(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const header = request.headers.get("authorization");
  return verifyAdminRequest(cookie, header);
}

export async function handleListInvoices(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = (searchParams.get("status") as InvoiceStatus) || undefined;
    const projectId = searchParams.get("projectId") || undefined;
    const search = searchParams.get("search") || undefined;

    const data = await listInvoices({ page, limit, status, projectId, search });
    return jsonSuccess(data, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleGetInvoice(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const invoice = await getInvoiceDetails(params.id);
    return jsonSuccess({ invoice }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleCreateInvoice(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = createInvoiceSchema.parse(raw);
    const invoice = await createNewInvoice(validated);
    return jsonSuccess({ invoice }, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleUpdateInvoice(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = updateInvoiceSchema.parse(raw);
    const invoice = await modifyInvoice(params.id, validated);
    return jsonSuccess({ invoice }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleMarkInvoicePaidAction(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const invoice = await markInvoiceAsPaid(params.id);
    return jsonSuccess({ invoice }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}
