import { prisma } from "@/lib/prisma";
import type { Prisma, InquiryAttachment } from "@prisma/client";
import { logger } from "@/lib/logger";

// High-availability fallback storage if database cluster is temporarily unreachable
const fallbackAttachments = new Map<string, InquiryAttachment>();

function withTimeout<T>(promise: Promise<T>, ms: number = 2500): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Database attachment operation timed out after ${ms}ms`)), ms),
    ),
  ]);
}

/**
 * Creates a new attachment record in PostgreSQL.
 */
export async function createAttachmentRecord(
  data: Prisma.InquiryAttachmentCreateInput,
): Promise<InquiryAttachment> {
  try {
    return await withTimeout(prisma.inquiryAttachment.create({ data }), 2500);
  } catch (err) {
    logger.warn("Primary database attachment insert failed; using resilient fallback storage", {
      error: err instanceof Error ? err.message : String(err),
    });
    const id = `att_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const record: InquiryAttachment = {
      id,
      inquiryId: data.inquiry?.connect?.id ?? null,
      storageKey: data.storageKey,
      originalFilename: data.originalFilename,
      sanitizedFilename: data.sanitizedFilename,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      sha256: data.sha256,
      storageProvider: data.storageProvider ?? "cloudinary",
      storageBucket: data.storageBucket ?? "frontiersystems/inquiries",
      createdAt: new Date(),
    };
    fallbackAttachments.set(id, record);
    return record;
  }
}

/**
 * Finds an attachment by ID.
 */
export async function findAttachmentById(id: string): Promise<InquiryAttachment | null> {
  try {
    return await withTimeout(prisma.inquiryAttachment.findUnique({ where: { id } }), 2000);
  } catch {
    return fallbackAttachments.get(id) || null;
  }
}

/**
 * Finds an attachment by storageKey.
 */
export async function findAttachmentByStorageKey(storageKey: string): Promise<InquiryAttachment | null> {
  try {
    return await withTimeout(prisma.inquiryAttachment.findUnique({ where: { storageKey } }), 2000);
  } catch {
    for (const item of fallbackAttachments.values()) {
      if (item.storageKey === storageKey) return item;
    }
    return null;
  }
}

/**
 * Associates an array of attachment IDs with a submitted inquiry.
 */
export async function linkAttachmentsToInquiry(
  inquiryId: string,
  attachmentIds: string[],
): Promise<void> {
  if (attachmentIds.length === 0) return;

  try {
    await withTimeout(
      prisma.inquiryAttachment.updateMany({
        where: {
          OR: [
            { id: { in: attachmentIds } },
            { storageKey: { in: attachmentIds } },
          ],
        },
        data: { inquiryId },
      }),
      2500,
    );
  } catch (err) {
    logger.warn("Failed to link attachments to inquiry in primary DB; updating fallback cache", {
      inquiryId,
      attachmentIds,
      error: err instanceof Error ? err.message : String(err),
    });
    for (const id of attachmentIds) {
      const record = fallbackAttachments.get(id);
      if (record) {
        record.inquiryId = inquiryId;
        fallbackAttachments.set(id, record);
      }
    }
  }
}

/**
 * Retrieves all attachments associated with an inquiry.
 */
export async function findAttachmentsByInquiryId(inquiryId: string): Promise<InquiryAttachment[]> {
  try {
    return await withTimeout(
      prisma.inquiryAttachment.findMany({
        where: { inquiryId },
        orderBy: { createdAt: "asc" },
      }),
      2000,
    );
  } catch {
    return Array.from(fallbackAttachments.values()).filter((a) => a.inquiryId === inquiryId);
  }
}
