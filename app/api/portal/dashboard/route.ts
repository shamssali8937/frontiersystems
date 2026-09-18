import { NextRequest } from "next/server";
import { handleGetPortalDashboard } from "@/server/controllers/portal.controller";

export async function GET(request: NextRequest) {
  return handleGetPortalDashboard(request);
}
