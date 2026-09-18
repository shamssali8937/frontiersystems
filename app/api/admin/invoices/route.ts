import { NextRequest } from "next/server";
import {
  handleListInvoices,
  handleCreateInvoice,
} from "@/server/controllers/admin-invoice.controller";

export async function GET(request: NextRequest) {
  return handleListInvoices(request);
}

export async function POST(request: NextRequest) {
  return handleCreateInvoice(request);
}
