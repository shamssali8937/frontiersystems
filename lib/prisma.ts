import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * Instantiates a single PrismaClient for the application.
 * In development, the instance is stored on the global object to prevent
 * hot-reload from creating multiple connections.
 *
 * SECURITY: This module must never be imported by client components.
 * Keep all Prisma interactions server-side.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
