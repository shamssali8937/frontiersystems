import { NextRequest } from "next/server";
import {
  getCustomerDashboard,
  getCustomerProjectsList,
  getCustomerProjectDetails,
  uploadCustomerProjectDoc,
  getCustomerInvoicesList,
  getCustomerInvoiceDetails,
  getCustomerDocumentSignedUrl,
  getCustomerInvoicePdfSignedUrl,
} from "@/server/services/portal.service";
import {
  verifyCustomerRequest,
  CUSTOMER_COOKIE_NAME,
} from "@/server/services/portal-auth.service";
import { ServiceError } from "@/server/services/inquiry.service";
import { jsonSuccess, jsonError } from "@/types/api";
import { logger } from "@/lib/logger";

/**
 * Helper to authenticate customer and obtain customerId.
 */
export async function getAuthenticatedCustomerId(request: NextRequest): Promise<string | null> {
  const headerCustomerId = request.headers.get("x-customer-id");
  if (headerCustomerId) {
    return headerCustomerId;
  }

  const cookie = request.cookies.get(CUSTOMER_COOKIE_NAME)?.value;
  const header = request.headers.get("authorization");

  const verification = await verifyCustomerRequest(cookie, header);
  if (verification.success && verification.customer) {
    return verification.customer.id;
  }

  return null;
}

export function handlePortalError(err: unknown) {
  if (err instanceof ServiceError) {
    return jsonError(err.code, err.message, err.statusCode, err.details);
  }

  logger.error("Unhandled portal controller error", {
    error: err instanceof Error ? err.message : String(err),
  });

  return jsonError(
    "INTERNAL_SERVER_ERROR",
    "An unexpected error occurred while processing your request.",
    500,
  );
}

export async function handleGetPortalDashboard(request: NextRequest) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const dashboard = await getCustomerDashboard(customerId);
    return jsonSuccess(dashboard, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handleGetPortalProjects(request: NextRequest) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const projects = await getCustomerProjectsList(customerId);
    return jsonSuccess({ projects }, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handleGetPortalProject(
  request: NextRequest,
  params: { id: string },
) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const project = await getCustomerProjectDetails(customerId, params.id);
    return jsonSuccess({ project }, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handlePortalDocumentUpload(
  request: NextRequest,
  params: { id: string },
) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("BAD_REQUEST", "Expected multipart/form-data payload with attached file", 400);
  }

  try {
    const file = formData.get("file");
    if (!file || typeof file === "string" || !(file instanceof Blob)) {
      return jsonError("BAD_REQUEST", "No valid file attached to 'file' field", 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const originalName = file.name || "document";
    const declaredMime = file.type || "application/octet-stream";

    const document = await uploadCustomerProjectDoc(
      customerId,
      params.id,
      buffer,
      originalName,
      declaredMime,
    );

    return jsonSuccess({ document }, 201);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handleGetPortalDocumentDownloadUrl(
  request: NextRequest,
  params: { docId: string },
) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const result = await getCustomerDocumentSignedUrl(customerId, params.docId);
    return jsonSuccess(result, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handleGetPortalInvoices(request: NextRequest) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const invoices = await getCustomerInvoicesList(customerId);
    return jsonSuccess({ invoices }, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handleGetPortalInvoice(
  request: NextRequest,
  params: { id: string },
) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const invoice = await getCustomerInvoiceDetails(customerId, params.id);
    return jsonSuccess({ invoice }, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}

export async function handleGetPortalInvoicePdfDownloadUrl(
  request: NextRequest,
  params: { id: string },
) {
  const customerId = await getAuthenticatedCustomerId(request);
  if (!customerId) {
    return jsonError("UNAUTHORIZED", "Client authentication required", 401);
  }

  try {
    const result = await getCustomerInvoicePdfSignedUrl(customerId, params.id);
    return jsonSuccess(result, 200);
  } catch (err) {
    return handlePortalError(err);
  }
}
