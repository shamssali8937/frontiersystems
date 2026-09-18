import { NextRequest } from "next/server";
import { handleGetPortalProject } from "@/server/controllers/portal.controller";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const params = await context.params;
  return handleGetPortalProject(request, params);
}
