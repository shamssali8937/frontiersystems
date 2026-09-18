import { prisma } from "@/lib/prisma";
import type { Customer, Prisma } from "@prisma/client";

export async function findCustomers(params?: {
  skip?: number | undefined;
  take?: number | undefined;
  search?: string | undefined;
}): Promise<Customer[]> {
  const where: Prisma.CustomerWhereInput = params?.search
    ? {
        OR: [
          { name: { contains: params.search, mode: "insensitive" } },
          { email: { contains: params.search, mode: "insensitive" } },
          { companyName: { contains: params.search, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.customer.findMany({
    where,
    skip: params?.skip ?? 0,
    take: params?.take ?? 50,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { projects: true },
      },
    },
  });
}

export async function countCustomers(search?: string): Promise<number> {
  const where: Prisma.CustomerWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { companyName: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.customer.count({ where });
}

export async function findCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: { milestones: true, documents: true, invoices: true },
          },
        },
      },
    },
  });
}

export async function findCustomerByEmail(email: string): Promise<Customer | null> {
  return prisma.customer.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function createCustomer(data: {
  name: string;
  email: string;
  companyName?: string | null | undefined;
}): Promise<Customer> {
  return prisma.customer.create({
    data: {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      companyName: data.companyName ? data.companyName.trim() : null,
    },
  });
}

export async function updateCustomer(
  id: string,
  data: Prisma.CustomerUpdateInput,
): Promise<Customer> {
  return prisma.customer.update({
    where: { id },
    data,
  });
}
