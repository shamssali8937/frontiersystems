/**
 * Server-side Structured Logger with Automatic Secret & PII Redaction
 *
 * SECURITY:
 * - Automatically scrubs secrets, tokens, API keys, and sensitive fields.
 * - Never leaks stack traces to client bundles.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

const REDACTED_KEYS = new Set([
  "password",
  "token",
  "secret",
  "apikey",
  "key",
  "authorization",
  "cookie",
  "set-cookie",
  "turnstiletoken",
  "creditcard",
  "cvv",
]);

/**
 * Deeply scrubs sensitive keys from logging contexts.
 */
function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Redact bearer tokens or auth headers if embedded in string
    if (data.toLowerCase().startsWith("bearer ")) {
      return "Bearer [REDACTED]";
    }
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }

  if (typeof data === "object") {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
      const lowerKey = k.toLowerCase().replace(/[-_]/g, "");
      if (REDACTED_KEYS.has(lowerKey)) {
        clean[k] = "[REDACTED]";
      } else {
        clean[k] = redactSensitiveData(v);
      }
    }
    return clean;
  }

  return data;
}

function formatEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry {
  const safeContext = context ? (redactSensitiveData(context) as Record<string, unknown>) : undefined;

  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(safeContext ? { context: safeContext } : {}),
  };
}

function output(entry: LogEntry): void {
  const line = JSON.stringify(entry);

  switch (entry.level) {
    case "debug":
      console.debug(line);
      break;
    case "info":
      console.info(line);
      break;
    case "warn":
      console.warn(line);
      break;
    case "error":
      console.error(line);
      break;
  }
}

export const logger = {
  debug(message: string, context?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
      output(formatEntry("debug", message, context));
    }
  },
  info(message: string, context?: Record<string, unknown>): void {
    output(formatEntry("info", message, context));
  },
  warn(message: string, context?: Record<string, unknown>): void {
    output(formatEntry("warn", message, context));
  },
  error(message: string, context?: Record<string, unknown>): void {
    output(formatEntry("error", message, context));
  },
};
