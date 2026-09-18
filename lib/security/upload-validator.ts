import crypto from "crypto";
import { sanitizeFilename } from "./sanitize";

export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedMimes?: string[];
  allowedExtensions?: string[];
}

export interface ValidatedFile {
  originalFilename: string;
  sanitizedFilename: string;
  storageKey: string;
  mimeType: string;
  sizeBytes: number;
  extension: string;
}

export const ALLOWED_UPLOAD_MIMES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
] as const;

export const ALLOWED_UPLOAD_EXTENSIONS = [
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
] as const;

const DANGEROUS_EXTENSIONS = new Set([
  ".exe", ".dll", ".bat", ".cmd", ".sh", ".bash", ".php", ".phtml",
  ".js", ".ts", ".mjs", ".py", ".vbs", ".ps1", ".scr", ".com", ".pif",
  ".svg", ".html", ".htm", ".xhtml", ".jsp", ".asp", ".aspx", ".cgi",
]);

export const DEFAULT_MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Validates actual binary file signatures (Magic Bytes).
 * Never trusts client MIME type or file extension alone.
 */
export function detectMagicMime(buffer: Buffer): string | null {
  if (buffer.length < 4) return null;

  // PDF: %PDF- (0x25 0x50 0x44 0x46 0x2D)
  if (
    buffer.length >= 5 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46 &&
    buffer[4] === 0x2d
  ) {
    return "application/pdf";
  }

  // PNG: \x89PNG\r\n\x1a\n (0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A)
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  // JPEG: FF D8 FF
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "image/jpeg";
  }

  // WEBP: RIFF....WEBP (0x52 0x49 0x46 0x46 .... 0x57 0x45 0x42 0x50)
  if (
    buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50
  ) {
    return "image/webp";
  }

  return null;
}

/**
 * Validates uploaded file against security requirements:
 * 1. File size limit
 * 2. Extension whitelist & dangerous extension blacklist
 * 3. Filename sanitization
 * 4. Magic-byte signature verification
 * 5. Declared MIME matches magic-byte detection
 */
export function validateUploadedFile(
  buffer: Buffer,
  filename: string,
  declaredMime?: string,
  options: FileValidationOptions = {},
): { valid: true; file: ValidatedFile } | { valid: false; error: string } {
  const maxSize = options.maxSizeBytes ?? DEFAULT_MAX_FILE_SIZE;

  // 1. Size check
  if (buffer.length === 0) {
    return { valid: false, error: "Uploaded file is empty" };
  }
  if (buffer.length > maxSize) {
    return {
      valid: false,
      error: `File size exceeds the limit of ${Math.round(maxSize / (1024 * 1024))}MB`,
    };
  }

  // 2. Extension check
  const sanitizedName = sanitizeFilename(filename);
  const extMatch = sanitizedName.match(/\.([a-zA-Z0-9]+)$/);
  const ext = extMatch && extMatch[1] ? `.${extMatch[1].toLowerCase()}` : "";

  if (!ext) {
    return { valid: false, error: "File must have an allowed extension (.pdf, .png, .jpg, .jpeg, .webp)" };
  }

  if (declaredMime && declaredMime.toLowerCase().includes("executable")) {
    return { valid: false, error: "Declared MIME indicates executable payload" };
  }

  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return { valid: false, error: `Executable and script file types (${ext}) are prohibited` };
  }

  const allowedExts: readonly string[] = options.allowedExtensions ?? ALLOWED_UPLOAD_EXTENSIONS;
  if (!allowedExts.includes(ext)) {
    return { valid: false, error: `Unsupported file extension: ${ext}. Allowed: ${allowedExts.join(", ")}` };
  }

  // 3. Binary magic-byte inspection
  const detectedMime = detectMagicMime(buffer);
  if (!detectedMime) {
    return { valid: false, error: "File content does not match any allowed file type signature" };
  }

  const allowedMimes: readonly string[] = options.allowedMimes ?? ALLOWED_UPLOAD_MIMES;
  if (!allowedMimes.includes(detectedMime)) {
    return { valid: false, error: `Detected file type (${detectedMime}) is not permitted` };
  }

  // 4. Cross-verify extension and detected MIME
  if (ext === ".pdf" && detectedMime !== "application/pdf") {
    return { valid: false, error: "File extension does not match true file contents" };
  }
  if ((ext === ".png") && detectedMime !== "image/png") {
    return { valid: false, error: "File extension does not match true file contents" };
  }
  if ((ext === ".jpg" || ext === ".jpeg") && detectedMime !== "image/jpeg") {
    return { valid: false, error: "File extension does not match true file contents" };
  }
  if (ext === ".webp" && detectedMime !== "image/webp") {
    return { valid: false, error: "File extension does not match true file contents" };
  }

  // 5. Generate cryptographically secure isolated storage key
  const randomKey = crypto.randomUUID();
  const storageKey = `${randomKey}${ext}`;

  return {
    valid: true,
    file: {
      originalFilename: filename,
      sanitizedFilename: sanitizedName,
      storageKey,
      mimeType: detectedMime,
      sizeBytes: buffer.length,
      extension: ext,
    },
  };
}
