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
import { enforcePermission } from "@/server/auth/authorization";
import { getClientIp } from "@/lib/security/ip";
import { validateOrigin } from "@/lib/security/origin";
import { checkRateLimit, RateLimitPolicies, getRateLimitHeaders } from "@/lib/security/rate-limit";
import { jsonSuccess, jsonError } from "@/types/api";
import { logger } from "@/lib/logger";

/**
 * Maps any error into a safe standardized JSON error response.
 * Never exposes stack traces or sensitive database details to clients.
 */
export function handleControllerError(err: unknown) {
  if (err instanceof ZodError) {
    return jsonError(
      "VALIDATION_ERROR",
      "Invalid request parameters",
      422,
      err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    );
  }

  if (err instanceof ServiceError) {
    return jsonError(err.code, err.message, err.statusCode, err.details);
  }

  logger.error("Unhandled controller error", {
    error: err instanceof Error ? err.message : String(err),
  });

  return jsonError(
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred. Please try again later.",
    500,
  );
}

/**
 * POST /api/inquiries
 * Public inquiry submission.
 * Protected by Origin validation, Rate limiting, Turnstile CAPTCHA, and XSS sanitization.
 */
export async function handleCreateInquiry(request: NextRequest) {
  // 1. Origin / CSRF check
  const originCheck = validateOrigin(request);
  if (!originCheck.valid) {
    return jsonError("FORBIDDEN", originCheck.reason ?? "Forbidden origin", 403);
  }

  // 2. Rate limiting check (5 submissions per 15 minutes)
  const clientIp = getClientIp(request);
  const rateLimitStatus = checkRateLimit("inquiry", clientIp, RateLimitPolicies.INQUIRY_SUBMISSION);

  if (!rateLimitStatus.allowed) {
    const response = jsonError(
      "RATE_LIMITED",
      `Too many inquiry submissions. Please try again in ${rateLimitStatus.retryAfterSeconds} seconds.`,
      429,
    );
    const headers = getRateLimitHeaders(rateLimitStatus);
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v);
    }
    return response;
  }

  try {
    const rawBody = await request.json().catch(() => ({}));
    const validatedData = createInquirySchema.parse(rawBody);

    const result = await submitInquiry(validatedData, clientIp);
    const response = jsonSuccess(result, 201);

    const headers = getRateLimitHeaders(rateLimitStatus);
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v);
    }

    return response;
  } catch (err) {
    return handleControllerError(err);
  }
}

/**
 * GET /api/inquiries/[id]
 * Public / client status lookup. Exposes sanitized status only.
 */
export async function handleGetInquiry(
  _request: NextRequest,
  params: { id: string },
) {
  try {
    const inquiry = await getInquiry(params.id);
    return jsonSuccess(
      {
        id: inquiry.id,
        status: inquiry.status,
        service: inquiry.service,
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
 * Public / client status update if authorized.
 */
export async function handleUpdateInquiry(
  request: NextRequest,
  params: { id: string },
) {
  const originCheck = validateOrigin(request);
  if (!originCheck.valid) {
    return jsonError("FORBIDDEN", originCheck.reason ?? "Forbidden origin", 403);
  }

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
  if (!auth.authenticated || !auth.user) {
    if (auth.error === "RATE_LIMITED") {
      return jsonError("RATE_LIMITED", "Too many failed authentication attempts. Access locked.", 429);
    }
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  const permCheck = enforcePermission(auth.user, "inquiries:read");
  if (!permCheck.authorized) {
    return jsonError("FORBIDDEN", permCheck.reason ?? "Forbidden", 403);
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
  if (!auth.authenticated || !auth.user) {
    if (auth.error === "RATE_LIMITED") {
      return jsonError("RATE_LIMITED", "Too many failed authentication attempts. Access locked.", 429);
    }
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  const permCheck = enforcePermission(auth.user, "inquiries:read");
  if (!permCheck.authorized) {
    return jsonError("FORBIDDEN", permCheck.reason ?? "Forbidden", 403);
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
  const originCheck = validateOrigin(request);
  if (!originCheck.valid) {
    return jsonError("FORBIDDEN", originCheck.reason ?? "Forbidden origin", 403);
  }

  const auth = authenticateAdmin(request);
  if (!auth.authenticated || !auth.user) {
    if (auth.error === "RATE_LIMITED") {
      return jsonError("RATE_LIMITED", "Too many failed authentication attempts. Access locked.", 429);
    }
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  const permCheck = enforcePermission(auth.user, "inquiries:write");
  if (!permCheck.authorized) {
    return jsonError("FORBIDDEN", permCheck.reason ?? "Forbidden", 403);
  }

  // Rate limit admin write operations: 30 per minute
  const clientIp = getClientIp(request);
  const rateLimitStatus = checkRateLimit("admin_write", clientIp, RateLimitPolicies.ADMIN_WRITE);
  if (!rateLimitStatus.allowed) {
    return jsonError("RATE_LIMITED", "Admin write rate limit exceeded", 429);
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
