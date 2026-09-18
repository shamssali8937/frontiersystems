import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { InvoiceDetailClient } from "./InvoiceDetailClient";

export const dynamic = "force-dynamic";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
    include: {
      project: {
        include: {
          customer: true,
        },
      },
    },
  });

  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#6E7376]">
        <Link href="/admin/invoices" className="hover:text-[#63C7D9]">
          &larr; Invoice Ledger
        </Link>
        <span>/</span>
        <span className="text-[#A6AAAC]">{invoice.invoiceNumber}</span>
      </div>

      <InvoiceDetailClient invoice={JSON.parse(JSON.stringify(invoice))} />
    </div>
  );
}
