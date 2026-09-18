"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  amountDue: string;
  currency: string;
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
  project: {
    id: string;
    name: string;
  };
}

export default function PortalInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const res = await fetch("/api/portal/invoices");
        if (!res.ok) {
          throw new Error("Failed to load invoices");
        }
        const json = await res.json();
        setInvoices(json.data.invoices);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching invoices");
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <Container size="2xl" className="space-y-6">
        <div className="h-6 w-36 bg-[#171A1C] rounded animate-pulse" />
        <div className="h-48 bg-[#111416] border border-[#292D30] rounded animate-pulse" />
      </Container>
    );
  }

  return (
    <Container size="2xl" className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#63C7D9]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#A6AAAC]">
            Financial &amp; Billing
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F3]">
          Invoices &amp; Statements
        </h1>
        <p className="text-xs text-[#A6AAAC] leading-relaxed">
          Historical statements, pending invoices, and verified PDF receipts for your client account.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-[#1A0D0E] border border-[#521C1D] text-xs text-[#F87171] rounded-sm">
          {error}
        </div>
      )}

      {invoices.length === 0 ? (
        <div className="p-12 text-center bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
          <div className="w-8 h-8 rounded-full border border-[#292D30] flex items-center justify-center text-[#6E7376] mx-auto font-mono text-xs">
            0
          </div>
          <h3 className="text-sm font-medium text-[#F5F5F3]">
            No invoices have been issued
          </h3>
          <p className="text-xs text-[#A6AAAC] max-w-md mx-auto leading-relaxed">
            Invoices associated with project milestones and contractual retainers will appear here once finalized by engineering operations.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[#292D30] rounded-sm bg-[#111416]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0D0E] text-[#A6AAAC] uppercase font-mono text-[10px] border-b border-[#292D30]">
              <tr>
                <th className="py-3 px-4">Invoice Number</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Issued</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171A1C]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#171A1C]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[#F5F5F3]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 text-[#A6AAAC]">
                    {inv.project.name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm ${
                        inv.status === "PAID"
                          ? "bg-[#16382B] text-[#4EBA87] border border-[#1F4E3C]"
                          : inv.status === "OVERDUE"
                          ? "bg-[#2A1213] text-[#F87171] border border-[#521C1D]"
                          : "bg-[#0B0D0E] text-[#63C7D9] border border-[#292D30]"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#F5F5F3]">
                    {inv.currency} {parseFloat(inv.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3.5 px-4 text-[#A6AAAC]">
                    {new Date(inv.issuedAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-[#A6AAAC]">
                    {new Date(inv.dueAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/portal/invoices/${inv.id}`}
                      className="text-xs text-[#63C7D9] hover:underline"
                    >
                      View Invoice &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Container>
  );
}
