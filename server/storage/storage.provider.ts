import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "@/lib/logger";

export interface StorageUploadResult {
  storageKey: string;
  storageProvider: "cloudinary" | "disk";
  storageBucket: string;
  sizeBytes: number;
  mimeType: string;
}

export interface StorageProvider {
  readonly name: "cloudinary" | "disk";
  uploadFile(
    storageKey: string,
    buffer: Buffer,
    mimeType: string,
    sanitizedFilename: string,
  ): Promise<StorageUploadResult>;
  getSignedDownloadUrl(storageKey: string, originalFilename?: string, expiresInSeconds?: number): Promise<string>;
  downloadFile(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null>;
  deleteFile(storageKey: string): Promise<void>;
  isAvailable(): boolean;
}

const SIGNING_SECRET =
  process.env.STORAGE_SIGNING_SECRET ||
  process.env.TURNSTILE_SECRET_KEY ||
  "fs-enterprise-storage-signing-secret-default";

// ---------------------------------------------------------------------------
// 1. Cloudinary Secure Storage Provider
// ---------------------------------------------------------------------------
export class CloudinaryStorageProvider implements StorageProvider {
  public readonly name = "cloudinary" as const;
  private readonly folder = "frontiersystems/inquiries";
  private isConfigured = false;

  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    const cloudinaryUrl = process.env.CLOUDINARY_URL;

    if (cloudinaryUrl) {
      cloudinary.config({ secure: true });
      this.isConfigured = true;
    } else if (cloudName && apiKey && apiSecret) {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });
      this.isConfigured = true;
    }
  }

  public isAvailable(): boolean {
    return this.isConfigured;
  }

  public async uploadFile(
    storageKey: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<StorageUploadResult> {
    if (!this.isConfigured) {
      throw new Error("CloudinaryStorageProvider is not configured with credentials");
    }

    const isImage = mimeType.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: this.folder,
          public_id: storageKey,
          resource_type: resourceType,
          type: "authenticated", // Strictly private / authenticated; not accessible publicly
          overwrite: true,
        },
        (error, result) => {
          if (error || !result) {
            logger.error("Cloudinary upload failed", { error: error?.message || "Unknown error" });
            return reject(new Error(`Cloudinary upload failed: ${error?.message || "Unknown error"}`));
          }

          logger.info("Cloudinary upload succeeded with authenticated delivery type", {
            publicId: result.public_id,
            bytes: result.bytes,
            format: result.format,
          });

          resolve({
            storageKey: result.public_id,
            storageProvider: "cloudinary",
            storageBucket: this.folder,
            sizeBytes: result.bytes || buffer.length,
            mimeType,
          });
        },
      );

      uploadStream.end(buffer);
    });
  }

  public async getSignedDownloadUrl(
    storageKey: string,
    originalFilename: string = "document",
    expiresInSeconds: number = 300,
  ): Promise<string> {
    if (!this.isConfigured) {
      throw new Error("CloudinaryStorageProvider is not configured with credentials");
    }

    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const ext = path.extname(originalFilename || storageKey).toLowerCase();
    const isImage = [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
    const resourceType = isImage ? "image" : "raw";
    const format = isImage ? ext.replace(".", "") : "";

    // Generate short-lived authenticated download URL
    const signedUrl = cloudinary.utils.private_download_url(storageKey, format, {
      resource_type: resourceType,
      type: "authenticated",
      expires_at: expiresAt,
      attachment: true,
    });

    return signedUrl;
  }

  public async downloadFile(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    try {
      const ext = path.extname(storageKey).toLowerCase();
      const signedUrl = await this.getSignedDownloadUrl(storageKey, `download${ext}`, 60);
      const res = await fetch(signedUrl);
      if (!res.ok) return null;
      const arrayBuffer = await res.arrayBuffer();
      const mime = res.headers.get("content-type") || "application/octet-stream";
      return { buffer: Buffer.from(arrayBuffer), mimeType: mime };
    } catch (err) {
      logger.error("Failed to download file from Cloudinary", {
        storageKey,
        error: err instanceof Error ? err.message : String(err),
      });
      return null;
    }
  }

  public async deleteFile(storageKey: string): Promise<void> {
    if (!this.isConfigured) return;
    try {
      const ext = path.extname(storageKey).toLowerCase();
      const isImage = [".png", ".jpg", ".jpeg", ".webp"].includes(ext);
      const resourceType = isImage ? "image" : "raw";
      await cloudinary.uploader.destroy(storageKey, {
        type: "authenticated",
        resource_type: resourceType,
        invalidate: true,
      });
    } catch (err) {
      logger.warn("Failed to delete file from Cloudinary", {
        storageKey,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Secure Local Disk Storage Provider (Private Directory Outside Web Root)
// ---------------------------------------------------------------------------
export class SecureDiskStorageProvider implements StorageProvider {
  public readonly name = "disk" as const;
  private readonly storageDir: string;

  constructor(customDir?: string) {
    this.storageDir = customDir ?? path.resolve(process.cwd(), "storage", "private_uploads");
  }

  public isAvailable(): boolean {
    return true;
  }

  private async ensureStorageDir(): Promise<void> {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (err) {
      logger.error("Failed to create secure storage directory", {
        dir: this.storageDir,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  private resolveSafePath(storageKey: string): string {
    const base = path.resolve(this.storageDir);
    const resolved = path.resolve(base, path.basename(storageKey));
    if (!resolved.startsWith(base)) {
      throw new Error("Directory traversal attack detected in storage key");
    }
    return resolved;
  }

  public async uploadFile(
    storageKey: string,
    buffer: Buffer,
    mimeType: string,
  ): Promise<StorageUploadResult> {
    await this.ensureStorageDir();
    const filePath = this.resolveSafePath(storageKey);

    await fs.writeFile(filePath, buffer, { mode: 0o600 }); // Read/write only by owner process

    logger.info("Secure disk storage written to private directory", {
      storageKey,
      bytes: buffer.length,
    });

    return {
      storageKey,
      storageProvider: "disk",
      storageBucket: "private_uploads",
      sizeBytes: buffer.length,
      mimeType,
    };
  }

  public async getSignedDownloadUrl(
    storageKey: string,
    originalFilename: string = "document",
    expiresInSeconds: number = 300,
  ): Promise<string> {
    const expires = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const dataToSign = `${storageKey}:${expires}:${originalFilename}`;
    const signature = crypto.createHmac("sha256", SIGNING_SECRET).update(dataToSign).digest("hex");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return `${siteUrl}/api/uploads/${encodeURIComponent(storageKey)}?token=${signature}&expires=${expires}&fn=${encodeURIComponent(originalFilename)}`;
  }

  public async downloadFile(storageKey: string): Promise<{ buffer: Buffer; mimeType: string } | null> {
    try {
      const filePath = this.resolveSafePath(storageKey);
      const buffer = await fs.readFile(filePath);
      const ext = path.extname(storageKey).toLowerCase();
      let mime = "application/octet-stream";
      if (ext === ".pdf") mime = "application/pdf";
      else if (ext === ".png") mime = "image/png";
      else if (ext === ".jpg" || ext === ".jpeg") mime = "image/jpeg";
      else if (ext === ".webp") mime = "image/webp";

      return { buffer, mimeType: mime };
    } catch {
      return null;
    }
  }

  public async deleteFile(storageKey: string): Promise<void> {
    try {
      const filePath = this.resolveSafePath(storageKey);
      await fs.unlink(filePath);
    } catch {
      // ignore
    }
  }

  public static verifySignedToken(
    storageKey: string,
    expires: number,
    filename: string,
    token: string,
  ): boolean {
    if (Math.floor(Date.now() / 1000) > expires) {
      return false;
    }
    const dataToSign = `${storageKey}:${expires}:${filename}`;
    const expected = crypto.createHmac("sha256", SIGNING_SECRET).update(dataToSign).digest("hex");
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  }
}

// ---------------------------------------------------------------------------
// 3. Storage Provider Factory
// ---------------------------------------------------------------------------
let cachedProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (cachedProvider) return cachedProvider;

  const cloudinaryProvider = new CloudinaryStorageProvider();
  if (cloudinaryProvider.isAvailable()) {
    logger.info("Storage provider initialized: Cloudinary (Authenticated Object Storage)");
    cachedProvider = cloudinaryProvider;
    return cachedProvider;
  }

  logger.info("Storage provider initialized: SecureDiskStorageProvider (Private Directory Outside Web Root)");
  cachedProvider = new SecureDiskStorageProvider();
  return cachedProvider;
}

export function resetStorageProvider(): void {
  cachedProvider = null;
}
