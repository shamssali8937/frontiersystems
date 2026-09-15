/**
 * Health-check repository.
 *
 * Responsibilities:
 * - Database access only via Prisma.
 * - No HTTP logic.
 * - No UI logic.
 * - No business rules.
 */
import { prisma } from "@/lib/prisma";

/**
 * Pings the database to verify connectivity.
 * Returns true if reachable, false otherwise.
 */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    // Raw query used only for a lightweight connectivity ping.
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("[HealthRepository] Database ping failed:", error);
    return false;
  }
}
