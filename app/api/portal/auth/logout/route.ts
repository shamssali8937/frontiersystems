import { NextRequest } from "next/server";
import { handleCustomerLogout } from "@/server/controllers/portal-auth.controller";

export async function POST(request: NextRequest) {
  return handleCustomerLogout(request);
}
