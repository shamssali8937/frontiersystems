/**
 * Health-check route handler.
 *
 * HTTP entry point only.
 * - Delegates to the controller.
 * - Returns the HTTP response.
 * No business logic lives here.
 */
import { handleHealthCheck } from "@/server/controllers/health.controller";

export async function GET() {
  return handleHealthCheck();
}
