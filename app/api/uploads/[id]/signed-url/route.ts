import { NextRequest } from "next/server";
import { handleGetSignedUrl } from "@/server/controllers/upload.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/uploads/[id]/signed-url
 *
 * Generates a short-lived signed URL for an attachment (300s TTL).
 * Requires admin authentication.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  return handleGetSignedUrl(request, id);
}
