import { NextRequest } from "next/server";
import { handleAdminLogin } from "@/server/controllers/admin-auth.controller";

export async function POST(request: NextRequest) {
  return handleAdminLogin(request);
}
