import { NextRequest } from "next/server";
import { handleGetAttachment } from "@/server/controllers/upload.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/uploads/[id]
 *
 * Secure private file retrieval endpoint.
 * Requires:
 * 1. Admin authorization header (Bearer token with inquiries:read), OR
 * 2. Cryptographic short-lived signed URL token (?token=...&expires=...)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return handleGetAttachment(request, id);
}
