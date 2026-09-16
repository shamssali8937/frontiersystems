import { NextRequest } from "next/server";
import { ZodError } from "zod";
import {
  createInquirySchema,
  updateInquirySchema,
  inquiryQuerySchema,
} from "@/lib/validation/inquiry.schema";
import {
  submitInquiry,
  getInquiry,
  listInquiries,
  updateInquiryDetails,
  ServiceError,
} from "@/server/services/inquiry.service";
import { authenticateAdmin } from "@/server/auth/admin.auth";
import { getClientIp } from "@/lib/security/ip";
import { jsonSuccess, jsonError } from "@/types/api";

/**
 * Maps any error into a safe standardized JSON error response.
 */
function handleControllerError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError(
      "VALIDATION_ERROR",
      "Invalid request parameters",
      422,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (err as any).issues?.map((e: any) => ({
        path: Array.isArray(e.path) ? e.path.join(".") : String(e.path),
        message: e.message,
      })) ?? [],
    );
  }

  if (err instanceof ServiceError) {
    return jsonError(err.code, err.message, err.statusCode, err.details);
  }

  console.error("[Controller] Unexpected Error:", err);
  return jsonError(
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred. Please try again later.",
    500,
  );
}

/**
 * POST /api/inquiries
 * Public inquiry submission.
 */
export async function handleCreateInquiry(request: NextRequest) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const validatedData = createInquirySchema.parse(rawBody);
    const clientIp = getClientIp(request);

    const result = await submitInquiry(validatedData, clientIp);
    return jsonSuccess(result, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}

/**
 * GET /api/inquiries/[id]
 * Public / token check for inquiry status.
 */
export async function handleGetInquiry(
  _request: NextRequest,
  params: { id: string },
) {
  try {
    const inquiry = await getInquiry(params.id);
    // Public view only exposes non-sensitive status info
    return jsonSuccess(
      {
        id: inquiry.id,
        status: inquiry.status,
        createdAt: inquiry.createdAt,
      },
      200,
    );
  } catch (err) {
    return handleControllerError(err);
  }
}

/**
 * PATCH /api/inquiries/[id]
 * Public / user update if authorized.
 */
export async function handleUpdateInquiry(
  request: NextRequest,
  params: { id: string },
) {
  try {
    const rawBody = await request.json().catch(() => ({}));
    const validatedData = updateInquirySchema.parse(rawBody);

    const updated = await updateInquiryDetails(params.id, validatedData);
    return jsonSuccess({ id: updated.id, status: updated.status }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

/**
 * GET /api/admin/inquiries
 * Admin-authenticated list with pagination.
 */
export async function handleListAdminInquiries(request: NextRequest) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = inquiryQuerySchema.parse(searchParams);

    const result = await listInquiries(query);
    return jsonSuccess(result.inquiries, 200, result.meta);
  } catch (err) {
    return handleControllerError(err);
  }
}

/**
 * GET /api/admin/inquiries/[id]
 * Admin-authenticated detail view.
 */
export async function handleGetAdminInquiry(
  request: NextRequest,
  params: { id: string },
) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const inquiry = await getInquiry(params.id);
    return jsonSuccess(inquiry, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

/**
 * PATCH /api/admin/inquiries/[id]
 * Admin-authenticated update.
 */
export async function handleUpdateAdminInquiry(
  request: NextRequest,
  params: { id: string },
) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const validatedData = updateInquirySchema.parse(rawBody);

    const updated = await updateInquiryDetails(params.id, validatedData);
    return jsonSuccess(updated, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}
