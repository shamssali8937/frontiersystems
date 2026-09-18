import { NextRequest } from "next/server";
import { handleConvertInquiry } from "@/server/controllers/admin-project.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleConvertInquiry(request, resolved);
}
