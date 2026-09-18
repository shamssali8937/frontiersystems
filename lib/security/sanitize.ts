/**
 * Security Sanitization Utilities
 *
 * Provides defense-in-depth protection against Cross-Site Scripting (XSS),
 * HTML injection, and Path Traversal attacks.
 */

const DANGEROUS_BLOCKS_REGEX = /<(?:script|style|iframe|embed|object|applet)[^>]*>[\s\S]*?<\/(?:script|style|iframe|embed|object|applet)>/gi;
const DANGEROUS_TAGS_REGEX = /<\/?(?:script|iframe|embed|object|applet|meta|link|style|svg|form|input|button|base|frame|frameset)[^>]*>/gi;
const EVENT_HANDLER_REGEX = /\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
const JAVASCRIPT_URI_REGEX = /(?:javascript|vbscript|data):[^\s"']*/gi;

/**
 * Strips executable HTML blocks, tags, event handlers, and malicious URI schemes
 * from user-supplied text.
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .replace(DANGEROUS_BLOCKS_REGEX, "")
    .replace(DANGEROUS_TAGS_REGEX, "")
    .replace(EVENT_HANDLER_REGEX, "")
    .replace(JAVASCRIPT_URI_REGEX, "")
    .trim();
}

/**
 * Escapes standard HTML special characters to prevent markup injection.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";

  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
    "/": "&#x2F;",
    "`": "&#x60;",
    "=": "&#x3D;",
  };

  return str.replace(/[&<>"'`=/]/g, (s) => entityMap[s] || s);
}

/**
 * Sanitizes a filename to protect against Path Traversal and Shell Injection attacks.
 * Strips path separators (../, / , \), null bytes, and non-whitelisted characters.
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== "string") return "file";

  // Remove null bytes and path separators
  let clean = filename
    .replace(/\0/g, "")
    .replace(/[\/\\]+/g, "_")
    .replace(/\.\.+/g, ".");

  // Keep only alphanumeric characters, dots, hyphens, and underscores
  clean = clean.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  // Prevent hidden files (starting with dot) or trailing dots
  clean = clean.replace(/^\.+/, "").replace(/\.+$/, "");

  // Fallback if cleaned name is empty
  return clean.slice(0, 100) || "file";
}
