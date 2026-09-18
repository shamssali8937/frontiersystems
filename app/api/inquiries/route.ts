import { NextRequest } from "next/server";
import { handleCreateInquiry } from "@/server/controllers/inquiry.controller";

/**
 * POST /api/inquiries
 * HTTP entry point only. Delegates to controller.
 */
export async function POST(request: NextRequest) {
  return handleCreateInquiry(request);
}
