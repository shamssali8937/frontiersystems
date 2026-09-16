import { validateUploadedFile, ValidatedFile } from "@/lib/security/upload-validator";
import { ServiceError } from "./inquiry.service";
import { logger } from "@/lib/logger";

export interface StoredUploadResult {
  id: string;
  originalFilename: string;
  sanitizedFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

// In-memory upload registry for secure storage mapping
const uploadRegistry = new Map<string, StoredUploadResult>();

/**
 * Validates, registers, and securely stores an uploaded file buffer.
 */
export async function processSecureUpload(
  buffer: Buffer,
  filename: string,
  declaredMime: string,
): Promise<StoredUploadResult> {
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

  const record: StoredUploadResult = {
    id: file.storageKey.split(".")[0] ?? file.storageKey,
    originalFilename: file.originalFilename,
    sanitizedFilename: file.sanitizedFilename,
    storageKey: file.storageKey,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    uploadedAt: new Date().toISOString(),
  };

  uploadRegistry.set(record.id, record);

  logger.info("File securely accepted and registered", {
    storageKey: record.storageKey,
    mimeType: record.mimeType,
    sizeBytes: record.sizeBytes,
  });

  return record;
}

/**
 * Retrieves safe metadata for a registered upload.
 */
export async function getUploadMetadata(id: string): Promise<StoredUploadResult | null> {
  return uploadRegistry.get(id) ?? null;
}
