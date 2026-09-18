import { NextRequest } from "next/server";
import { handleListAdminInquiries } from "@/server/controllers/inquiry.controller";

/**
 * GET /api/admin/inquiries
 * HTTP entry point only. Delegates to controller.
 */
export async function GET(request: NextRequest) {
  return handleListAdminInquiries(request);
}
