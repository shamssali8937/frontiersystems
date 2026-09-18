import { NextRequest } from "next/server";
import { handleVerifyMagicLink } from "@/server/controllers/portal-auth.controller";

export async function POST(request: NextRequest) {
  return handleVerifyMagicLink(request);
}

export async function GET(request: NextRequest) {
  return handleVerifyMagicLink(request);
}
