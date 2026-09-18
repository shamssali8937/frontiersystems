import { prisma } from "@/lib/prisma";
import type { AdminUser, Prisma } from "@prisma/client";

export async function findAdminByEmail(email: string): Promise<AdminUser | null> {
  return prisma.adminUser.findUnique({
    where: { email: email.toLowerCase() },
  });
}

export async function findAdminById(id: string): Promise<AdminUser | null> {
  return prisma.adminUser.findUnique({
    where: { id },
  });
}

export async function updateAdminLastLogin(id: string): Promise<AdminUser> {
  return prisma.adminUser.update({
    where: { id },
    data: { lastLoginAt: new Date() },
  });
}

export async function createAdminUser(data: Prisma.AdminUserCreateInput): Promise<AdminUser> {
  return prisma.adminUser.create({
    data: {
      ...data,
      email: data.email.toLowerCase(),
    },
  });
}
