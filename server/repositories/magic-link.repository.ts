import { prisma } from "@/lib/prisma";
import type { MagicLinkToken } from "@prisma/client";

export async function createMagicLinkToken(data: {
  customerId: string;
  tokenHash: string;
  expiresAt: Date;
}): Promise<MagicLinkToken> {
  return prisma.magicLinkToken.create({
    data: {
      customerId: data.customerId,
      tokenHash: data.tokenHash,
      expiresAt: data.expiresAt,
    },
  });
}

export async function findMagicLinkTokenByHash(tokenHash: string): Promise<(MagicLinkToken & {
  customer: { id: string; email: string; name: string; companyName: string | null };
}) | null> {
  return prisma.magicLinkToken.findFirst({
    where: { tokenHash },
    include: {
      customer: {
        select: { id: true, email: true, name: true, companyName: true },
      },
    },
  });
}

export async function markMagicLinkTokenUsed(id: string): Promise<MagicLinkToken> {
  return prisma.magicLinkToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}

export async function cleanupExpiredMagicLinkTokens(): Promise<number> {
  const result = await prisma.magicLinkToken.deleteMany({
    where: {
      expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // delete older than 24h
    },
  });
  return result.count;
}
