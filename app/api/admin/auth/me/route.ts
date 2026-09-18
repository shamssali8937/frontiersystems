import { NextRequest } from "next/server";
import { handleAdminMe } from "@/server/controllers/admin-auth.controller";

export async function GET(request: NextRequest) {
  return handleAdminMe(request);
}
