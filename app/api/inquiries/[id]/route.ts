import { NextRequest } from "next/server";
import {
  handleGetInquiry,
  handleUpdateInquiry,
} from "@/server/controllers/inquiry.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/inquiries/[id]
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleGetInquiry(request, resolved);
}

/**
 * PATCH /api/inquiries/[id]
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleUpdateInquiry(request, resolved);
}
