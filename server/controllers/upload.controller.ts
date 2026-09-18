import { NextRequest, NextResponse } from "next/server";
import {
  processSecureUpload,
  getSecureDownloadUrl,
  getSecureAttachmentBinary,
  getUploadMetadata,
} from "@/server/services/upload.service";
import { ServiceError } from "@/server/services/inquiry.service";
import { checkRateLimitAsync, RateLimitPolicies, getRateLimitHeaders } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/ip";
import { validateOrigin } from "@/lib/security/origin";
import { authenticateAdmin } from "@/server/auth/admin.auth";
import { SecureDiskStorageProvider } from "@/server/storage/storage.provider";
import { jsonSuccess, jsonError } from "@/types/api";
import { logger } from "@/lib/logger";

/**
 * Controller for handling POST /api/uploads
 *
 * Security controls:
 * 1. Origin / CSRF verification
 * 2. Upload rate limiting (10 uploads per 10 minutes per IP)
 * 3. MIME & Magic-byte validation
 * 4. Safe filename handling & random storage key generation
 */
export async function handleFileUpload(request: NextRequest) {
  // 1. Validate Origin / Referer
  const originCheck = validateOrigin(request);
  if (!originCheck.valid) {
    return jsonError("FORBIDDEN", originCheck.reason ?? "Forbidden origin", 403);
  }

  // 2. Enforce Rate Limiting
  const clientIp = getClientIp(request);
  const rateLimitStatus = await checkRateLimitAsync("upload", clientIp, RateLimitPolicies.FILE_UPLOAD);

  if (!rateLimitStatus.allowed) {
    const response = jsonError(
      "RATE_LIMITED",
      `Too many file uploads. Please retry after ${rateLimitStatus.retryAfterSeconds} seconds.`,
      429,
    );
    const headers = getRateLimitHeaders(rateLimitStatus);
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v);
    }
    return response;
  }

  // 3. Process multipart form
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
    const originalName = file.name || "upload";
    const declaredMime = file.type || "application/octet-stream";

    const result = await processSecureUpload(buffer, originalName, declaredMime);
    const response = jsonSuccess(result, 201);

    const headers = getRateLimitHeaders(rateLimitStatus);
    for (const [k, v] of Object.entries(headers)) {
      response.headers.set(k, v);
    }

    return response;
  } catch (err) {
    if (err instanceof ServiceError) {
      return jsonError(err.code, err.message, err.statusCode);
    }

    logger.error("Unexpected upload controller error", {
      error: err instanceof Error ? err.message : String(err),
    });

    return jsonError("INTERNAL_SERVER_ERROR", "An error occurred while uploading the file", 500);
  }
}

/**
 * Controller for handling GET /api/uploads/[id]
 *
 * Privacy & Access Control:
 * 1. Requires either:
 *    - Authenticated admin session (Bearer token)
 *    - Valid short-lived HMAC-signed download token
 * 2. Unauthenticated requests return 401/403.
 * 3. Enforces strict privacy headers: Content-Disposition, no-sniff, Cache-Control: private, no-store.
 */
export async function handleGetAttachment(
  request: NextRequest,
  attachmentId: string,
) {
  const url = request.nextUrl;
  const token = url.searchParams.get("token");
  const expiresStr = url.searchParams.get("expires");
  const fn = url.searchParams.get("fn") || "";

  let isAuthorized = false;

  // Check Option A: Signed download token
  if (token && expiresStr) {
    const expires = parseInt(expiresStr, 10);
    if (!isNaN(expires)) {
      if (Math.floor(Date.now() / 1000) > expires) {
        return jsonError("FORBIDDEN", "The secure download link has expired", 403);
      }
      const metadata = await getUploadMetadata(attachmentId);
      const matchGiven = SecureDiskStorageProvider.verifySignedToken(attachmentId, expires, fn, token);
      const matchKey = metadata ? SecureDiskStorageProvider.verifySignedToken(metadata.storageKey, expires, fn, token) : false;
      const matchId = metadata ? SecureDiskStorageProvider.verifySignedToken(metadata.id, expires, fn, token) : false;

      if (matchGiven || matchKey || matchId) {
        isAuthorized = true;
      } else {
        return jsonError("FORBIDDEN", "Invalid cryptographic signature for attachment access", 403);
      }
    }
  }

  // Check Option B: Admin Bearer token
  if (!isAuthorized) {
    const auth = authenticateAdmin(request);
    if (auth.authenticated) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return jsonError("UNAUTHORIZED", "Authentication or valid signed URL required to access project files", 401);
  }

  // Check if redirect to Cloudinary signed URL is preferred
  const redirectSigned = url.searchParams.get("redirect") === "true";
  if (redirectSigned) {
    try {
      const signedUrl = await getSecureDownloadUrl(attachmentId, 300);
      return NextResponse.redirect(signedUrl, 302);
    } catch (err) {
      if (err instanceof ServiceError) {
        return jsonError(err.code, err.message, err.statusCode);
      }
      return jsonError("INTERNAL_SERVER_ERROR", "Failed to generate signed download URL", 500);
    }
  }

  // Serve binary payload securely with defensive response headers
  try {
    const { buffer, mimeType, filename } = await getSecureAttachmentBinary(attachmentId);

    const safeFilename = filename.replace(/["\r\n\\]/g, "");
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (err) {
    if (err instanceof ServiceError) {
      return jsonError(err.code, err.message, err.statusCode);
    }
    return jsonError("INTERNAL_SERVER_ERROR", "Failed to retrieve attachment file", 500);
  }
}

/**
 * Controller for generating a short-lived signed URL for an attachment.
 * GET /api/uploads/[id]/signed-url
 * Requires Admin authentication.
 */
export async function handleGetSignedUrl(
  request: NextRequest,
  attachmentId: string,
) {
  const auth = authenticateAdmin(request);
  if (!auth.authenticated) {
    return jsonError("UNAUTHORIZED", "Admin authentication required to generate signed URLs", 401);
  }

  try {
    const signedUrl = await getSecureDownloadUrl(attachmentId, 300); // 5-minute TTL
    return jsonSuccess({
      attachmentId,
      signedUrl,
      expiresInSeconds: 300,
    });
  } catch (err) {
    if (err instanceof ServiceError) {
      return jsonError(err.code, err.message, err.statusCode);
    }
    return jsonError("INTERNAL_SERVER_ERROR", "Failed to generate signed URL", 500);
  }
}
