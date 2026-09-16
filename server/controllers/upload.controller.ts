import { NextRequest } from "next/server";
import { processSecureUpload } from "@/server/services/upload.service";
import { ServiceError } from "@/server/services/inquiry.service";
import { checkRateLimit, RateLimitPolicies, getRateLimitHeaders } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/ip";
import { validateOrigin } from "@/lib/security/origin";
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
  const rateLimitStatus = checkRateLimit("upload", clientIp, RateLimitPolicies.FILE_UPLOAD);

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
