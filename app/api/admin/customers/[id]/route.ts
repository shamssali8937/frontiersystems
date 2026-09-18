import { NextRequest } from "next/server";
import {
  handleGetCustomer,
  handleUpdateCustomer,
} from "@/server/controllers/admin-customer.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleGetCustomer(request, resolved);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleUpdateCustomer(request, resolved);
}
