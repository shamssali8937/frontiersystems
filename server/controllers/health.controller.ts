import { NextResponse } from "next/server";
import { getHealthStatus } from "@/server/services/health.service";
import { jsonSuccess, jsonError, type ApiResponse } from "@/types/api";

export async function handleHealthCheck(): Promise<
  NextResponse<ApiResponse<{ status: string; timestamp: string }>>
> {
  try {
    const data = await getHealthStatus();
    return jsonSuccess(data, 200);
  } catch (error) {
    console.error("[HealthController] Error:", error);
    return jsonError("INTERNAL_SERVER_ERROR", "Service unavailable", 503);
  }
}
