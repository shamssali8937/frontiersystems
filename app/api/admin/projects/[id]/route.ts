import { NextRequest } from "next/server";
import {
  handleGetProject,
  handleUpdateProject,
} from "@/server/controllers/admin-project.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleGetProject(request, resolved);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleUpdateProject(request, resolved);
}
