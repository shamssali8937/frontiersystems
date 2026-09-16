import { NextRequest } from "next/server";
import {
  handleGetAdminInquiry,
  handleUpdateAdminInquiry,
} from "@/server/controllers/inquiry.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/inquiries/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleGetAdminInquiry(request, resolved);
}

/**
 * PATCH /api/admin/inquiries/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleUpdateAdminInquiry(request, resolved);
}
