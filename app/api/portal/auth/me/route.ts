import { NextRequest } from "next/server";
import { handleCustomerMe } from "@/server/controllers/portal-auth.controller";

export async function GET(request: NextRequest) {
  return handleCustomerMe(request);
}
