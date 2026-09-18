import { prisma } from "@/lib/prisma";

/**
 * Portal Repository — Enforces strict server-side tenant isolation.
 *
 * CRITICAL IDOR PREVENTION:
 * Every single method requires and filters by `customerId`.
 * If a resource exists in the database but does not belong to the requested
 * customerId, the query returns null or empty set.
 */

export async function findCustomerDashboardData(customerId: string) {
  const [customer, projects, invoices] = await Promise.all([
    prisma.customer.findUnique({
      where: { id: customerId },
      select: { id: true, name: true, email: true, companyName: true, lastLoginAt: true },
    }),
    prisma.project.findMany({
      where: { customerId },
      orderBy: { createdAt: "desc" },
      include: {
        milestones: { orderBy: { createdAt: "asc" } },
        documents: { orderBy: { createdAt: "desc" } },
        invoices: { orderBy: { issuedAt: "desc" } },
      },
    }),
    prisma.invoice.findMany({
      where: { project: { customerId } },
      orderBy: { dueAt: "asc" },
      include: {
        project: {
          select: { id: true, name: true },
        },
      },
    }),
  ]);

  return { customer, projects, invoices };
}

export async function findCustomerProjects(customerId: string) {
  return prisma.project.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { milestones: true, documents: true, invoices: true },
      },
    },
  });
}

export async function findCustomerProjectById(customerId: string, projectId: string) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      customerId, // Strict IDOR defense
    },
    include: {
      customer: {
        select: { id: true, name: true, email: true, companyName: true },
      },
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

export async function findCustomerInvoices(customerId: string) {
  return prisma.invoice.findMany({
    where: {
      project: { customerId }, // Strict IDOR defense
    },
    orderBy: { issuedAt: "desc" },
    include: {
      project: {
        select: { id: true, name: true },
      },
    },
  });
}

export async function findCustomerInvoiceById(customerId: string, invoiceId: string) {
  return prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      project: { customerId }, // Strict IDOR defense
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          customer: {
            select: { id: true, name: true, email: true, companyName: true },
          },
        },
      },
    },
  });
}

export async function findCustomerDocumentById(customerId: string, documentId: string) {
  return prisma.projectDocument.findFirst({
    where: {
      id: documentId,
      project: { customerId }, // Strict IDOR defense
    },
    include: {
      project: {
        select: { id: true, name: true, customerId: true },
      },
    },
  });
}
