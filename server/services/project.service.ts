import {
  findProjects,
  countProjects,
  findProjectById,
  createProject,
  updateProject,
  createMilestone,
  updateMilestone,
  createProjectDocument,
} from "@/server/repositories/project.repository";
import { findCustomerById, findCustomerByEmail, createCustomer } from "@/server/repositories/customer.repository";
import { findInquiryById, updateInquiry } from "@/server/repositories/inquiry.repository";
import { createLeadActivity } from "@/server/repositories/activity.repository";
import { ServiceError } from "@/server/services/inquiry.service";
import type {
  CreateProjectInput,
  UpdateProjectInput,
  CreateMilestoneInput,
  UpdateMilestoneInput,
  CreateProjectDocumentInput,
  ConvertInquiryInput,
} from "@/lib/validation/admin.schema";
import type { ProjectStatus } from "@prisma/client";

export async function listProjects(params?: {
  page?: number | undefined;
  limit?: number | undefined;
  status?: ProjectStatus | undefined;
  customerId?: string | undefined;
  search?: string | undefined;
}) {
  const page = Math.max(params?.page ?? 1, 1);
  const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
  const skip = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    findProjects({
      skip,
      take: limit,
      status: params?.status,
      customerId: params?.customerId,
      search: params?.search,
    }),
    countProjects({
      status: params?.status,
      customerId: params?.customerId,
      search: params?.search,
    }),
  ]);

  return {
    projects,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getProjectDetails(id: string) {
  const project = await findProjectById(id);
  if (!project) {
    throw new ServiceError("NOT_FOUND", "Project not found", 404);
  }
  return project;
}

export async function createNewProject(input: CreateProjectInput) {
  const customer = await findCustomerById(input.customerId);
  if (!customer) {
    throw new ServiceError("NOT_FOUND", "Specified customer not found", 404);
  }

  if (input.inquiryId) {
    const inquiry = await findInquiryById(input.inquiryId);
    if (!inquiry) {
      throw new ServiceError("NOT_FOUND", "Specified inquiry not found", 404);
    }
  }

  return createProject({
    customerId: input.customerId,
    inquiryId: input.inquiryId ?? null,
    name: input.name,
    status: input.status,
    summary: input.summary ?? null,
  });
}

export async function modifyProject(id: string, input: UpdateProjectInput) {
  await getProjectDetails(id);

  return updateProject(id, {
    ...(input.name ? { name: input.name.trim() } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.summary !== undefined ? { summary: input.summary } : {}),
  });
}

export async function addProjectMilestone(projectId: string, input: CreateMilestoneInput) {
  await getProjectDetails(projectId);

  return createMilestone({
    projectId,
    title: input.title,
    description: input.description ?? null,
    status: input.status,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
  });
}

export async function modifyProjectMilestone(
  milestoneId: string,
  input: UpdateMilestoneInput,
) {
  return updateMilestone(milestoneId, {
    ...(input.title ? { title: input.title.trim() } : {}),
    ...(input.description !== undefined ? { description: input.description } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.dueDate !== undefined ? { dueDate: input.dueDate ? new Date(input.dueDate) : null } : {}),
    ...(input.completedAt !== undefined ? { completedAt: input.completedAt ? new Date(input.completedAt) : null } : {}),
  });
}

export async function attachProjectDocument(
  projectId: string,
  input: CreateProjectDocumentInput,
) {
  await getProjectDetails(projectId);

  return createProjectDocument({
    projectId,
    fileName: input.fileName,
    storageKey: input.storageKey,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    uploadedBy: input.uploadedBy,
  });
}

/**
 * Converts an Inquiry to a Project:
 * 1. Checks inquiry existence and sets status to WON.
 * 2. Matches existing Customer by email or creates a new Customer.
 * 3. Creates the Project linked to Customer and Inquiry.
 * 4. Records a LeadActivity entry.
 */
export async function convertWonInquiryToProject(
  inquiryId: string,
  input: ConvertInquiryInput,
) {
  const inquiry = await findInquiryById(inquiryId);
  if (!inquiry) {
    throw new ServiceError("NOT_FOUND", "Inquiry not found", 404);
  }

  // Set inquiry to WON if not already WON
  if (inquiry.status !== "WON") {
    await updateInquiry(inquiry.id, { status: "WON" });
  }

  // Find or create customer
  let customer = await findCustomerByEmail(inquiry.email);
  if (!customer) {
    customer = await createCustomer({
      name: inquiry.name,
      email: inquiry.email,
      companyName: inquiry.company,
    });
  }

  // Create project
  const projectName =
    input.projectName ||
    `${inquiry.company || inquiry.name} — ${inquiry.service || "Systems Architecture"}`;

  const project = await createProject({
    customerId: customer.id,
    inquiryId: inquiry.id,
    name: projectName,
    status: input.status || "ONBOARDING",
    summary:
      input.projectSummary ||
      `Project originated from inquiry ${inquiry.id}. Original brief: ${inquiry.message.slice(0, 300)}...`,
  });

  // Record LeadActivity entry
  await createLeadActivity({
    inquiryId: inquiry.id,
    type: "CONVERTED_TO_PROJECT",
    description: `Inquiry converted to Project "${project.name}" (Customer: ${customer.name})`,
    metadata: {
      projectId: project.id,
      customerId: customer.id,
      projectName: project.name,
      convertedAt: new Date().toISOString(),
    },
  });

  return {
    customer,
    project,
    inquiryId: inquiry.id,
  };
}
