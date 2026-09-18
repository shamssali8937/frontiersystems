import {
  findCustomers,
  countCustomers,
  findCustomerById,
  findCustomerByEmail,
  createCustomer,
  updateCustomer,
} from "@/server/repositories/customer.repository";
import type { CreateCustomerInput, UpdateCustomerInput } from "@/lib/validation/admin.schema";
import { ServiceError } from "@/server/services/inquiry.service";

export async function listCustomers(params?: {
  page?: number | undefined;
  limit?: number | undefined;
  search?: string | undefined;
}) {
  const page = Math.max(params?.page ?? 1, 1);
  const limit = Math.min(Math.max(params?.limit ?? 20, 1), 100);
  const skip = (page - 1) * limit;

  const [customers, total] = await Promise.all([
    findCustomers({ skip, take: limit, search: params?.search }),
    countCustomers(params?.search),
  ]);

  return {
    customers,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}

export async function getCustomerDetails(id: string) {
  const customer = await findCustomerById(id);
  if (!customer) {
    throw new ServiceError("NOT_FOUND", "Customer not found", 404);
  }
  return customer;
}

export async function registerCustomer(input: CreateCustomerInput) {
  const existing = await findCustomerByEmail(input.email);
  if (existing) {
    throw new ServiceError("DUPLICATE_CUSTOMER", "A customer with this email address already exists", 409);
  }

  return createCustomer({
    name: input.name,
    email: input.email,
    companyName: input.companyName ?? null,
  });
}

export async function modifyCustomer(id: string, input: UpdateCustomerInput) {
  await getCustomerDetails(id); // verify existence

  return updateCustomer(id, {
    ...(input.name ? { name: input.name.trim() } : {}),
    ...(input.companyName !== undefined ? { companyName: input.companyName } : {}),
  });
}
