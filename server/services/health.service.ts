/**
 * Health-check service.
 *
 * Responsibilities:
 * - Business logic.
 * - Orchestration of validation, security checks, business rules.
 * - Calls repository layer for data.
 * - No HTTP logic, no direct Prisma calls.
 */
import { checkDatabaseConnection } from "@/server/repositories/health.repository";

export interface HealthStatus {
  status: string;
  timestamp: string;
  database: "connected" | "disconnected";
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const dbConnected = await checkDatabaseConnection();

  return {
    status: dbConnected ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    database: dbConnected ? "connected" : "disconnected",
  };
}
