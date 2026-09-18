import { NextRequest } from "next/server";
import {
  handleGetInvoice,
  handleUpdateInvoice,
  handleMarkInvoicePaidAction,
} from "@/server/controllers/admin-invoice.controller";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  return handleGetInvoice(request, resolved);
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const resolved = await params;
  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "pay") {
    return handleMarkInvoicePaidAction(request, resolved);
  }

  return handleUpdateInvoice(request, resolved);
}
