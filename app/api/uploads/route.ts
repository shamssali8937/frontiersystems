import { NextRequest } from "next/server";
import { handleFileUpload } from "@/server/controllers/upload.controller";

/**
 * POST /api/uploads
 *
 * Secure file upload route handler.
 * Strictly delegates to upload controller.
 */
export async function POST(request: NextRequest) {
  return handleFileUpload(request);
}
