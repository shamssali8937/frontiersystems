import crypto from "crypto";
import { validateUploadedFile, ValidatedFile } from "@/lib/security/upload-validator";
import { ServiceError } from "./inquiry.service";
import { getStorageProvider } from "@/server/storage/storage.provider";
import {
  createAttachmentRecord,
  findAttachmentById,
  findAttachmentByStorageKey,
} from "@/server/repositories/attachment.repository";
import { logger } from "@/lib/logger";

export interface StoredUploadResult {
  id: string;
  originalFilename: string;
  sanitizedFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  sha256: string;
  uploadedAt: string;
}

/**
 * Validates, uploads, and registers a client-uploaded document.
 * Enforces:
 * 1. Strict binary magic-byte verification (PDF, PNG, JPEG, WEBP)
 * 2. Extension & MIME allowlists
 * 3. Max size limit (5MB)
 * 4. SHA-256 integrity digest computation
 * 5. Private object storage upload (Cloudinary or local secure disk)
 * 6. PostgreSQL metadata persistence
 */
export async function processSecureUpload(
  buffer: Buffer,
  filename: string,
  declaredMime: string,
): Promise<StoredUploadResult> {
  // 1. Rigorous content & binary inspection
  const validation = validateUploadedFile(buffer, filename, declaredMime);

  if (!validation.valid) {
    logger.warn("File upload validation rejected", {
      filename,
      declaredMime,
      reason: validation.error,
    });
    throw new ServiceError("UNPROCESSABLE_ENTITY", validation.error, 422);
  }

  const { file }: { file: ValidatedFile } = validation;

  // 2. Cryptographic checksum for integrity & tamper-proofing
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

  // 3. Store binary in isolated object storage provider
  const storageProvider = getStorageProvider();
  const uploadResult = await storageProvider.uploadFile(
    file.storageKey,
    buffer,
    file.mimeType,
    file.sanitizedFilename,
  );

  // 4. Record metadata in PostgreSQL
  const dbRecord = await createAttachmentRecord({
    storageKey: uploadResult.storageKey,
    originalFilename: file.originalFilename,
    sanitizedFilename: file.sanitizedFilename,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    sha256,
    storageProvider: uploadResult.storageProvider,
    storageBucket: uploadResult.storageBucket,
  });

  const result: StoredUploadResult = {
    id: dbRecord.id,
    originalFilename: dbRecord.originalFilename,
    sanitizedFilename: dbRecord.sanitizedFilename,
    storageKey: dbRecord.storageKey,
    mimeType: dbRecord.mimeType,
    sizeBytes: dbRecord.sizeBytes,
    sha256: dbRecord.sha256,
    uploadedAt: dbRecord.createdAt.toISOString(),
  };

  logger.info("Inquiry attachment securely uploaded and recorded", {
    attachmentId: result.id,
    storageKey: result.storageKey,
    storageProvider: uploadResult.storageProvider,
    mimeType: result.mimeType,
    sizeBytes: result.sizeBytes,
  });

  return result;
}

/**
 * Generates a short-lived, cryptographically signed URL for accessing an attachment.
 * Default expiration is 5 minutes (300 seconds).
 */
export async function getSecureDownloadUrl(
  attachmentIdentifier: string,
  expiresInSeconds: number = 300,
): Promise<string> {
  const attachment =
    (await findAttachmentById(attachmentIdentifier)) ||
    (await findAttachmentByStorageKey(attachmentIdentifier));

  if (!attachment) {
    throw new ServiceError("NOT_FOUND", "Requested attachment not found", 404);
  }

  const storageProvider = getStorageProvider();
  return storageProvider.getSignedDownloadUrl(
    attachment.storageKey,
    attachment.sanitizedFilename,
    expiresInSeconds,
  );
}

/**
 * Downloads the binary file buffer directly from storage provider.
 */
export async function getSecureAttachmentBinary(
  attachmentIdentifier: string,
): Promise<{ buffer: Buffer; mimeType: string; filename: string }> {
  const attachment =
    (await findAttachmentById(attachmentIdentifier)) ||
    (await findAttachmentByStorageKey(attachmentIdentifier));

  if (!attachment) {
    throw new ServiceError("NOT_FOUND", "Requested attachment not found", 404);
  }

  const storageProvider = getStorageProvider();
  const fileData = await storageProvider.downloadFile(attachment.storageKey);

  if (!fileData) {
    throw new ServiceError("NOT_FOUND", "Attachment file not found in storage provider", 404);
  }

  return {
    buffer: fileData.buffer,
    mimeType: attachment.mimeType,
    filename: attachment.sanitizedFilename,
  };
}

/**
 * Retrieves safe metadata for a registered upload.
 */
export async function getUploadMetadata(
  attachmentIdentifier: string,
): Promise<StoredUploadResult | null> {
  const attachment =
    (await findAttachmentById(attachmentIdentifier)) ||
    (await findAttachmentByStorageKey(attachmentIdentifier));

  if (!attachment) return null;

  return {
    id: attachment.id,
    originalFilename: attachment.originalFilename,
    sanitizedFilename: attachment.sanitizedFilename,
    storageKey: attachment.storageKey,
    mimeType: attachment.mimeType,
    sizeBytes: attachment.sizeBytes,
    sha256: attachment.sha256,
    uploadedAt: attachment.createdAt.toISOString(),
  };
}
