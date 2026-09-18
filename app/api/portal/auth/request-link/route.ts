import { NextRequest } from "next/server";
import { handleRequestMagicLink } from "@/server/controllers/portal-auth.controller";

export async function POST(request: NextRequest) {
  return handleRequestMagicLink(request);
}
