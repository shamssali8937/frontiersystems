import { NextRequest } from "next/server";
import {
  handleCreateMilestone,
  handleUpdateMilestone,
} from "@/server/controllers/admin-project.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleCreateMilestone(request, resolved);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  const { searchParams } = new URL(request.url);
  const milestoneId = searchParams.get("milestoneId");

  if (!milestoneId) {
    return new Response(JSON.stringify({ error: "Missing milestoneId parameter" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return handleUpdateMilestone(request, { id: resolved.id, milestoneId });
}
