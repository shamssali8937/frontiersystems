import { NextRequest } from "next/server";
import {
  handleListProjects,
  handleCreateProject,
} from "@/server/controllers/admin-project.controller";

export async function GET(request: NextRequest) {
  return handleListProjects(request);
}

export async function POST(request: NextRequest) {
  return handleCreateProject(request);
}
