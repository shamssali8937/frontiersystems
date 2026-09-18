"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ProjectOption {
  id: string;
  name: string;
  customer: {
    name: string;
  };
}

interface CreateInvoiceModalProps {
  projects: ProjectOption[];
}

export function CreateInvoiceModal({ projects }: CreateInvoiceModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState(projects[0]?.id || "");
  const [invoiceNumber, setInvoiceNumber] = useState("FS-2026-1001");
  const [amountDue, setAmountDue] = useState("10000.00");
  const [status, setStatus] = useState("DRAFT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      setError("Please select a project first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dueAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          invoiceNumber,
          amountDue,
          currency: "GBP",
          status,
          dueAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to create invoice");
        setLoading(false);
        return;
      }

      setOpen(false);
      setLoading(false);
      router.push(`/admin/invoices/${data.data.invoice.id}`);
      router.refresh();
    } catch {
      setError("Network failure");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-xs font-mono font-semibold text-[#0B0D0E] rounded-xs transition-colors"
      >
        + ISSUE INVOICE
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D0E]/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#111416] border border-[#292D30] rounded-sm p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
              <span className="text-xs font-mono font-bold text-[#F5F5F3] uppercase tracking-wider">
                Generate Client Invoice
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-[#6E7376] hover:text-[#F5F5F3] text-lg font-mono"
              >
                &times;
              </button>
            </div>

            {error && (
              <div className="p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xs text-xs font-mono text-[#FF6B6B]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Project</label>
                <select
                  required
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.customer.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Invoice Number</label>
                <input
                  required
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="e.g. FS-2026-0001"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Amount Due (GBP)</label>
                <input
                  required
                  value={amountDue}
                  onChange={(e) => setAmountDue(e.target.value)}
                  placeholder="10000.00"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="SENT">SENT</option>
                  <option value="PAID">PAID</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="VOID">VOID</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#292D30]">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 text-xs font-mono text-[#A6AAAC] hover:text-[#F5F5F3]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-[#0B0D0E] text-xs font-mono font-semibold rounded-xs transition-colors disabled:opacity-50"
                >
                  {loading ? "SAVING..." : "CREATE INVOICE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
