import {
  findCustomerDashboardData,
  findCustomerProjects,
  findCustomerProjectById,
  findCustomerInvoices,
  findCustomerInvoiceById,
  findCustomerDocumentById,
} from "@/server/repositories/portal.repository";
import { createProjectDocument } from "@/server/repositories/project.repository";
import { validateUploadedFile } from "@/lib/security/upload-validator";
import { getStorageProvider } from "@/server/storage/storage.provider";
import { ServiceError } from "@/server/services/inquiry.service";
import { logger } from "@/lib/logger";

export async function getCustomerDashboard(customerId: string) {
  const data = await findCustomerDashboardData(customerId);
  if (!data.customer) {
    throw new ServiceError("UNAUTHORIZED", "Customer profile not found", 401);
  }

  // Calculate high-assurance overview metrics
  const activeProjects = data.projects.filter((p) => p.status !== "ARCHIVED" && p.status !== "DELIVERED");
  const outstandingInvoices = data.invoices.filter((i) => i.status === "SENT" || i.status === "OVERDUE");

  return {
    customer: data.customer,
    activeProjectsCount: activeProjects.length,
    totalProjectsCount: data.projects.length,
    outstandingInvoicesCount: outstandingInvoices.length,
    recentProjects: data.projects.slice(0, 5),
    recentInvoices: data.invoices.slice(0, 5),
  };
}

export async function getCustomerProjectsList(customerId: string) {
  return findCustomerProjects(customerId);
}

export async function getCustomerProjectDetails(customerId: string, projectId: string) {
  const project = await findCustomerProjectById(customerId, projectId);
  if (!project) {
    throw new ServiceError("NOT_FOUND", "Project not found or unauthorized", 404);
  }
  return project;
}

export async function uploadCustomerProjectDoc(
  customerId: string,
  projectId: string,
  buffer: Buffer,
  filename: string,
  declaredMime: string,
) {
  // 1. Verify project belongs to authenticated customer
  const project = await findCustomerProjectById(customerId, projectId);
  if (!project) {
    throw new ServiceError("NOT_FOUND", "Project not found or unauthorized", 404);
  }

  // 2. Validate file with strict allowlist and magic bytes
  const validation = validateUploadedFile(buffer, filename, declaredMime);
  if (!validation.valid) {
    throw new ServiceError("UNPROCESSABLE_ENTITY", validation.error, 422);
  }

  const { file } = validation;

  // 3. Upload binary to object storage
  const storageProvider = getStorageProvider();
  const uploadResult = await storageProvider.uploadFile(
    file.storageKey,
    buffer,
    file.mimeType,
    file.sanitizedFilename,
  );

  // 4. Save ProjectDocument record in DB
  const doc = await createProjectDocument({
    projectId: project.id,
    fileName: file.sanitizedFilename,
    storageKey: uploadResult.storageKey,
    mimeType: file.mimeType,
    fileSize: uploadResult.sizeBytes,
    uploadedBy: "CUSTOMER",
  });

  logger.info("Customer uploaded project document", {
    customerId,
    projectId: project.id,
    documentId: doc.id,
    fileName: doc.fileName,
  });

  return doc;
}

export async function getCustomerInvoicesList(customerId: string) {
  return findCustomerInvoices(customerId);
}

export async function getCustomerInvoiceDetails(customerId: string, invoiceId: string) {
  const invoice = await findCustomerInvoiceById(customerId, invoiceId);
  if (!invoice) {
    throw new ServiceError("NOT_FOUND", "Invoice not found or unauthorized", 404);
  }
  return invoice;
}

export async function getCustomerDocumentSignedUrl(customerId: string, documentId: string) {
  const doc = await findCustomerDocumentById(customerId, documentId);
  if (!doc) {
    throw new ServiceError("NOT_FOUND", "Document not found or unauthorized", 404);
  }

  const storageProvider = getStorageProvider();
  const signedUrl = await storageProvider.getSignedDownloadUrl(
    doc.storageKey,
    doc.fileName,
    300, // 5 minutes TTL
  );

  return {
    documentId: doc.id,
    fileName: doc.fileName,
    mimeType: doc.mimeType,
    signedUrl,
    expiresInSeconds: 300,
  };
}

export async function getCustomerInvoicePdfSignedUrl(customerId: string, invoiceId: string) {
  const invoice = await findCustomerInvoiceById(customerId, invoiceId);
  if (!invoice) {
    throw new ServiceError("NOT_FOUND", "Invoice not found or unauthorized", 404);
  }

  if (!invoice.pdfStorageKey) {
    throw new ServiceError("NOT_FOUND", "PDF has not yet been generated for this invoice", 404);
  }

  const storageProvider = getStorageProvider();
  const signedUrl = await storageProvider.getSignedDownloadUrl(
    invoice.pdfStorageKey,
    `Invoice_${invoice.invoiceNumber}.pdf`,
    300, // 5 minutes TTL
  );

  return {
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    signedUrl,
    expiresInSeconds: 300,
  };
}
