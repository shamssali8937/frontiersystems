import { NextRequest } from "next/server";
import { handleGetPortalDocumentDownloadUrl } from "@/server/controllers/portal.controller";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; docId: string }> },
) {
  const params = await context.params;
  return handleGetPortalDocumentDownloadUrl(request, { docId: params.docId });
}
