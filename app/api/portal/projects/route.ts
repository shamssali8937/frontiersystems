import { NextRequest } from "next/server";
import { handleGetPortalProjects } from "@/server/controllers/portal.controller";

export async function GET(request: NextRequest) {
  return handleGetPortalProjects(request);
}
