import { prisma } from "@/lib/prisma";
import type {
  Project,
  ProjectMilestone,
  ProjectDocument,
  ProjectStatus,
  Prisma,
} from "@prisma/client";

export async function findProjects(params?: {
  skip?: number | undefined;
  take?: number | undefined;
  status?: ProjectStatus | undefined;
  customerId?: string | undefined;
  search?: string | undefined;
}) {
  const where: Prisma.ProjectWhereInput = {
    ...(params?.status ? { status: params.status } : {}),
    ...(params?.customerId ? { customerId: params.customerId } : {}),
    ...(params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { summary: { contains: params.search, mode: "insensitive" } },
            { customer: { name: { contains: params.search, mode: "insensitive" } } },
            { customer: { companyName: { contains: params.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  return prisma.project.findMany({
    where,
    skip: params?.skip ?? 0,
    take: params?.take ?? 50,
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, email: true, companyName: true },
      },
      inquiry: {
        select: { id: true, service: true, status: true, budget: true },
      },
      _count: {
        select: { milestones: true, documents: true, invoices: true },
      },
    },
  });
}

export async function countProjects(params?: {
  status?: ProjectStatus | undefined;
  customerId?: string | undefined;
  search?: string | undefined;
}): Promise<number> {
  const where: Prisma.ProjectWhereInput = {
    ...(params?.status ? { status: params.status } : {}),
    ...(params?.customerId ? { customerId: params.customerId } : {}),
    ...(params?.search
      ? {
          OR: [
            { name: { contains: params.search, mode: "insensitive" } },
            { summary: { contains: params.search, mode: "insensitive" } },
            { customer: { name: { contains: params.search, mode: "insensitive" } } },
            { customer: { companyName: { contains: params.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  return prisma.project.count({ where });
}

export async function findProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      inquiry: true,
      milestones: {
        orderBy: { createdAt: "asc" },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        orderBy: { issuedAt: "desc" },
      },
    },
  });
}

export async function createProject(data: {
  customerId: string;
  inquiryId?: string | null | undefined;
  name: string;
  status?: ProjectStatus | undefined;
  summary?: string | null | undefined;
}): Promise<Project> {
  return prisma.project.create({
    data: {
      customerId: data.customerId,
      inquiryId: data.inquiryId ?? null,
      name: data.name.trim(),
      status: data.status ?? "ONBOARDING",
      summary: data.summary ?? null,
    },
    include: {
      customer: true,
    },
  });
}

export async function updateProject(
  id: string,
  data: Prisma.ProjectUpdateInput,
): Promise<Project> {
  return prisma.project.update({
    where: { id },
    data,
  });
}

// Milestone Repositories
export async function createMilestone(data: {
  projectId: string;
  title: string;
  description?: string | null | undefined;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETE" | undefined;
  dueDate?: Date | null | undefined;
}): Promise<ProjectMilestone> {
  return prisma.projectMilestone.create({
    data: {
      projectId: data.projectId,
      title: data.title.trim(),
      description: data.description ?? null,
      status: data.status ?? "PENDING",
      dueDate: data.dueDate ?? null,
    },
  });
}

export async function updateMilestone(
  id: string,
  data: Prisma.ProjectMilestoneUpdateInput,
): Promise<ProjectMilestone> {
  return prisma.projectMilestone.update({
    where: { id },
    data,
  });
}

// Document Repositories
export async function createProjectDocument(data: {
  projectId: string;
  fileName: string;
  storageKey: string;
  mimeType: string;
  fileSize: number;
  uploadedBy?: "ADMIN" | "CUSTOMER";
}): Promise<ProjectDocument> {
  return prisma.projectDocument.create({
    data: {
      projectId: data.projectId,
      fileName: data.fileName.trim(),
      storageKey: data.storageKey,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      uploadedBy: data.uploadedBy ?? "ADMIN",
    },
  });
}
