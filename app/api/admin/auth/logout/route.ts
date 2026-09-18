import { NextRequest } from "next/server";
import { handleAdminLogout } from "@/server/controllers/admin-auth.controller";

export async function POST(request: NextRequest) {
  return handleAdminLogout(request);
}
