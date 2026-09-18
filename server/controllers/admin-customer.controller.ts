import { NextRequest } from "next/server";
import {
  listCustomers,
  getCustomerDetails,
  registerCustomer,
  modifyCustomer,
} from "@/server/services/customer.service";
import {
  createCustomerSchema,
  updateCustomerSchema,
} from "@/lib/validation/admin.schema";
import { jsonSuccess, jsonError } from "@/types/api";
import { handleControllerError } from "@/server/controllers/inquiry.controller";
import { verifyAdminRequest, ADMIN_COOKIE_NAME } from "@/server/services/admin-auth.service";

async function requireAdmin(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const header = request.headers.get("authorization");
  return verifyAdminRequest(cookie, header);
}

export async function handleListCustomers(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || undefined;

    const data = await listCustomers({ page, limit, search });
    return jsonSuccess(data, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleGetCustomer(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const customer = await getCustomerDetails(params.id);
    return jsonSuccess({ customer }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleCreateCustomer(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = createCustomerSchema.parse(raw);
    const customer = await registerCustomer(validated);
    return jsonSuccess({ customer }, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleUpdateCustomer(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = updateCustomerSchema.parse(raw);
    const customer = await modifyCustomer(params.id, validated);
    return jsonSuccess({ customer }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}
