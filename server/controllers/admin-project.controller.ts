import { NextRequest } from "next/server";
import {
  listProjects,
  getProjectDetails,
  createNewProject,
  modifyProject,
  addProjectMilestone,
  modifyProjectMilestone,
  attachProjectDocument,
  convertWonInquiryToProject,
} from "@/server/services/project.service";
import {
  createProjectSchema,
  updateProjectSchema,
  createMilestoneSchema,
  updateMilestoneSchema,
  createProjectDocumentSchema,
  convertInquirySchema,
} from "@/lib/validation/admin.schema";
import { jsonSuccess, jsonError } from "@/types/api";
import { handleControllerError } from "@/server/controllers/inquiry.controller";
import { verifyAdminRequest, ADMIN_COOKIE_NAME } from "@/server/services/admin-auth.service";
import type { ProjectStatus } from "@prisma/client";

async function requireAdmin(request: NextRequest) {
  const cookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const header = request.headers.get("authorization");
  return verifyAdminRequest(cookie, header);
}

export async function handleListProjects(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = (searchParams.get("status") as ProjectStatus) || undefined;
    const customerId = searchParams.get("customerId") || undefined;
    const search = searchParams.get("search") || undefined;

    const data = await listProjects({ page, limit, status, customerId, search });
    return jsonSuccess(data, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleGetProject(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const project = await getProjectDetails(params.id);
    return jsonSuccess({ project }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleCreateProject(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = createProjectSchema.parse(raw);
    const project = await createNewProject(validated);
    return jsonSuccess({ project }, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleUpdateProject(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = updateProjectSchema.parse(raw);
    const project = await modifyProject(params.id, validated);
    return jsonSuccess({ project }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleCreateMilestone(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = createMilestoneSchema.parse(raw);
    const milestone = await addProjectMilestone(params.id, validated);
    return jsonSuccess({ milestone }, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleUpdateMilestone(request: NextRequest, params: { id: string; milestoneId: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = updateMilestoneSchema.parse(raw);
    const milestone = await modifyProjectMilestone(params.milestoneId, validated);
    return jsonSuccess({ milestone }, 200);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleCreateDocument(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = createProjectDocumentSchema.parse(raw);
    const document = await attachProjectDocument(params.id, validated);
    return jsonSuccess({ document }, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}

export async function handleConvertInquiry(request: NextRequest, params: { id: string }) {
  const auth = await requireAdmin(request);
  if (!auth.success) {
    return jsonError("UNAUTHORIZED", "Admin authorization required", 401);
  }

  try {
    const raw = await request.json().catch(() => ({}));
    const validated = convertInquirySchema.parse(raw);
    const result = await convertWonInquiryToProject(params.id, validated);
    return jsonSuccess(result, 201);
  } catch (err) {
    return handleControllerError(err);
  }
}
