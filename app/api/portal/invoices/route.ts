import { NextRequest } from "next/server";
import { handleGetPortalInvoices } from "@/server/controllers/portal.controller";

export async function GET(request: NextRequest) {
  return handleGetPortalInvoices(request);
}
