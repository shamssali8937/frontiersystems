/**
 * Health-check controller.
 *
 * Responsibilities:
 * - HTTP concerns only (status codes, response shaping).
 * - Calls the service layer.
 * - No direct Prisma access.
 * - No business logic.
 */
import { NextResponse } from "next/server";
import { getHealthStatus } from "@/server/services/health.service";
import type { ApiResponse } from "@/types/api";

export async function handleHealthCheck(): Promise<
  NextResponse<ApiResponse<{ status: string; timestamp: string }>>
> {
  try {
    const data = await getHealthStatus();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    // Do not expose internal error details to the client
    console.error("[HealthController] Error:", error);
    return NextResponse.json(
      { success: false, error: "Service unavailable" },
      { status: 503 },
    );
  }
}
