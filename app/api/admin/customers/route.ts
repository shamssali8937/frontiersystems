import { NextRequest } from "next/server";
import {
  handleListCustomers,
  handleCreateCustomer,
} from "@/server/controllers/admin-customer.controller";

export async function GET(request: NextRequest) {
  return handleListCustomers(request);
}

export async function POST(request: NextRequest) {
  return handleCreateCustomer(request);
}
