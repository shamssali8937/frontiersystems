import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateInvoiceModal } from "./CreateInvoiceModal";
import type { InvoiceStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface InvoicesPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminInvoicesPage({ searchParams }: InvoicesPageProps) {
  const { status, search } = await searchParams;

  const where = {
    ...(status && status !== "ALL" ? { status: status as InvoiceStatus } : {}),
    ...(search
      ? {
          OR: [
            { invoiceNumber: { contains: search, mode: "insensitive" as const } },
            { project: { name: { contains: search, mode: "insensitive" as const } } },
            { project: { customer: { name: { contains: search, mode: "insensitive" as const } } } },
          ],
        }
      : {}),
  };

  const [invoices, projects] = await Promise.all([
    prisma.invoice.findMany({
      where,
      orderBy: { issuedAt: "desc" },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            customer: { select: { id: true, name: true, email: true, companyName: true } },
          },
        },
      },
    }),
    prisma.project.findMany({
      select: { id: true, name: true, customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const statuses = ["ALL", "DRAFT", "SENT", "PAID", "OVERDUE", "VOID"];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292D30] pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#63C7D9] uppercase">
            FINANCIAL ACCOUNTING & BILLING
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3] pt-1">
            Invoice Ledger
          </h1>
        </div>

        <CreateInvoiceModal projects={projects} />
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#292D30] pb-3 text-xs font-mono">
        {statuses.map((s) => {
          const isActive = (!status && s === "ALL") || status === s;
          return (
            <Link
              key={s}
              href={`/admin/invoices${s === "ALL" ? "" : `?status=${s}`}`}
              className={`px-3 py-1.5 rounded-xs transition-colors ${
                isActive
                  ? "bg-[#63C7D9] text-[#0B0D0E] font-semibold"
                  : "bg-[#111416] text-[#A6AAAC] hover:text-[#F5F5F3] border border-[#292D30]"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {/* Invoices Table */}
      <div className="rounded-sm border border-[#292D30] bg-[#111416] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#171A1C] border-b border-[#292D30] text-[#A6AAAC] uppercase">
            <tr>
              <th className="py-3 px-4">Invoice #</th>
              <th className="py-3 px-4">Project</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Issued</th>
              <th className="py-3 px-4">Due Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292D30] text-[#F5F5F3]">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#6E7376]">
                  No invoice records matching filter.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#171A1C]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#63C7D9]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[#F5F5F3]">
                    <Link
                      href={`/admin/projects/${inv.project.id}`}
                      className="hover:underline"
                    >
                      {inv.project.name}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-[#A6AAAC]">
                    {inv.project.customer.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-xs uppercase ${
                        inv.status === "PAID"
                          ? "bg-[#4EBA87]/15 text-[#4EBA87] border border-[#4EBA87]/30"
                          : inv.status === "SENT"
                          ? "bg-[#63C7D9]/15 text-[#63C7D9] border border-[#63C7D9]/30"
                          : inv.status === "OVERDUE"
                          ? "bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30"
                          : "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#F5F5F3]">
                    £{Number(inv.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-[#6E7376]">
                    {new Date(inv.issuedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-[#6E7376]">
                    {new Date(inv.dueAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="text-[#63C7D9] hover:underline"
                    >
                      Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
