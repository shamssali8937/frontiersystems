import { z } from "zod";

/**
 * Environment Variable Classification & Security Validator
 *
 * Enforces strict boundaries between:
 * - PUBLIC: Safe to expose to the browser (must begin with NEXT_PUBLIC_)
 * - SERVER_ONLY: Safe for server operation, not secret
 * - SECRET: High-value credentials, must NEVER have NEXT_PUBLIC_ prefix
 */

export const EnvClassification = {
  PUBLIC: [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_SANITY_PROJECT_ID",
    "NEXT_PUBLIC_SANITY_DATASET",
    "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  ],
  SERVER_ONLY: [
    "DATABASE_URL",
    "SANITY_PROJECT_ID",
    "SANITY_DATASET",
    "SANITY_API_VERSION",
    "SMTP_HOST",
    "SMTP_PORT",
    "SMTP_USER",
    "SMTP_FROM",
    "INQUIRY_RECIPIENT_EMAIL",
    "NODE_ENV",
  ],
  SECRET: [
    "ADMIN_API_KEY",
    "SANITY_API_TOKEN",
    "TURNSTILE_SECRET_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "SMTP_PASSWORD",
  ],
} as const;

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  // Sanity
  SANITY_PROJECT_ID: z.string().optional(),
  SANITY_DATASET: z.string().optional(),
  SANITY_API_VERSION: z.string().default("2024-01-01"),
  SANITY_API_TOKEN: z.string().optional(),
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),

  // Cloudflare Turnstile
  TURNSTILE_SECRET_KEY: z.string().optional(),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().optional(),

  // Admin API
  ADMIN_API_KEY: z.string().min(16, "ADMIN_API_KEY should be at least 16 characters in production").optional(),

  // Redis / Rate Limiting
  UPSTASH_REDIS_REST_URL: z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // SMTP
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  INQUIRY_RECIPIENT_EMAIL: z.string().email().optional(),
});

/**
 * Validates that no secret key has mistakenly leaked into NEXT_PUBLIC_
 */
export function validateNoPublicSecrets(envObj: Record<string, string | undefined> = process.env): void {
  const publicKeys = Object.keys(envObj).filter((k) => k.startsWith("NEXT_PUBLIC_"));
  const forbiddenSubstrings = ["SECRET", "TOKEN", "PASSWORD", "PRIVATE", "KEY"];

  for (const key of publicKeys) {
    // Specifically allowed public keys
    if (key === "NEXT_PUBLIC_TURNSTILE_SITE_KEY") continue;

    for (const forbidden of forbiddenSubstrings) {
      if (key.toUpperCase().includes(forbidden)) {
        throw new Error(
          `[SECURITY VIOLATION] Environment variable "${key}" contains sensitive indicator "${forbidden}" but carries "NEXT_PUBLIC_" prefix. Secrets must never be exposed to the client bundle.`,
        );
      }
    }
  }
}

/**
 * Validates and returns parsed environment configuration.
 */
export function getValidatedEnv() {
  validateNoPublicSecrets();
  const parsed = serverEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const errorDetails = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join(", ");
    console.warn(`[Env] Environment validation warning: ${errorDetails}`);
  }
  return parsed.data;
}
