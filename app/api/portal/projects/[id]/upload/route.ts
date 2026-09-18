import { NextRequest } from "next/server";
import { handlePortalDocumentUpload } from "@/server/controllers/portal.controller";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return handlePortalDocumentUpload(request, params);
}
