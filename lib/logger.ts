/**
 * Server-side logger.
 *
 * Wraps console methods with structured output.
 * In production, replace with a proper logging library (e.g. Pino, Winston).
 *
 * SECURITY:
 * - Do NOT log secrets, tokens, or PII.
 * - Do NOT expose server-side error details to the client.
 * - Sanitise any user-provided values before logging.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

function formatEntry(
  level: LogLevel,
  message: string,
  context?: Record<string, unknown>,
): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(context ? { context } : {}),
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
    if (process.env.NODE_ENV === "development") {
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
