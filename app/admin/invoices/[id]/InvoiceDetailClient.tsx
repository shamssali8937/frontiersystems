"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InvoiceDetailClientProps {
  invoice: {
    id: string;
    invoiceNumber: string;
    status: string;
    amountDue: string | number;
    currency: string;
    issuedAt: string;
    dueAt: string;
    paidAt?: string | null;
    pdfStorageKey?: string | null;
    project: {
      id: string;
      name: string;
      customer: {
        id: string;
        name: string;
        email: string;
        companyName?: string | null;
      };
    };
  };
}

export function InvoiceDetailClient({ invoice }: InvoiceDetailClientProps) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(invoice.status);
  const [loading, setLoading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleMarkPaid = async () => {
    setLoading(true);
    try {
      await fetch(`/api/admin/invoices/${invoice.id}?action=pay`, {
        method: "PATCH",
      });
      setCurrentStatus("PAID");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setLoading(true);
    try {
      await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setCurrentStatus(newStatus);
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPdfUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setUploadError(data.error?.message || "PDF upload failed");
        setPdfUploading(false);
        return;
      }

      await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfStorageKey: data.data.storageKey }),
      });

      router.refresh();
    } catch {
      setUploadError("Failed to upload invoice PDF");
    } finally {
      setPdfUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Invoice Status Banner */}
      <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-mono text-[#F5F5F3]">
              {invoice.invoiceNumber}
            </h1>
            <span
              className={`text-xs font-mono px-2.5 py-0.5 rounded-xs uppercase ${
                currentStatus === "PAID"
                  ? "bg-[#4EBA87]/15 text-[#4EBA87] border border-[#4EBA87]/30"
                  : currentStatus === "SENT"
                  ? "bg-[#63C7D9]/15 text-[#63C7D9] border border-[#63C7D9]/30"
                  : currentStatus === "OVERDUE"
                  ? "bg-[#FF6B6B]/15 text-[#FF6B6B] border border-[#FF6B6B]/30"
                  : "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]"
              }`}
            >
              {currentStatus}
            </span>
          </div>
          <div className="text-xs font-mono text-[#A6AAAC]">
            Issued: {new Date(invoice.issuedAt).toLocaleDateString("en-GB")} &bull; Due:{" "}
            {new Date(invoice.dueAt).toLocaleDateString("en-GB")}
            {invoice.paidAt && (
              <span className="text-[#4EBA87]">
                {" "}
                &bull; Settled on {new Date(invoice.paidAt).toLocaleDateString("en-GB")}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentStatus !== "PAID" && (
            <button
              onClick={handleMarkPaid}
              disabled={loading}
              className="px-4 py-2 bg-[#4EBA87] hover:bg-[#5fcfa0] text-[#0B0D0E] text-xs font-mono font-semibold rounded-xs transition-colors disabled:opacity-50"
            >
              {loading ? "RECORDING..." : "✓ MARK AS PAID"}
            </button>
          )}

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#6E7376]">STATE:</span>
            <select
              value={currentStatus}
              disabled={loading}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
            >
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT</option>
              <option value="PAID">PAID</option>
              <option value="OVERDUE">OVERDUE</option>
              <option value="VOID">VOID</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoice Financial Brief */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
          <h2 className="text-xs font-mono font-semibold text-[#63C7D9] uppercase tracking-wider">
            Billable Subject
          </h2>
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-[#6E7376]">Project:</span>{" "}
              <Link
                href={`/admin/projects/${invoice.project.id}`}
                className="text-[#F5F5F3] hover:underline font-semibold"
              >
                {invoice.project.name}
              </Link>
            </div>
            <div>
              <span className="text-[#6E7376]">Client:</span>{" "}
              <Link
                href={`/admin/customers/${invoice.project.customer.id}`}
                className="text-[#63C7D9] hover:underline"
              >
                {invoice.project.customer.name} ({invoice.project.customer.companyName || invoice.project.customer.email})
              </Link>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
          <h2 className="text-xs font-mono font-semibold text-[#4EBA87] uppercase tracking-wider">
            Accounting Balance
          </h2>
          <div className="space-y-1">
            <div className="text-3xl font-bold font-mono text-[#F5F5F3]">
              £{Number(invoice.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] font-mono text-[#6E7376]">
              Currency: {invoice.currency} &bull; Stored in PostgreSQL Decimal (10, 2)
            </div>
          </div>
        </div>
      </div>

      {/* PDF Document Attachment Section */}
      <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
        <h2 className="text-xs font-mono font-semibold text-[#F5F5F3] uppercase tracking-wider">
          Invoice PDF Attachment
        </h2>
        {uploadError && <div className="text-xs font-mono text-[#FF6B6B]">{uploadError}</div>}

        {invoice.pdfStorageKey ? (
          <div className="flex items-center justify-between p-4 bg-[#0B0D0E] border border-[#292D30] rounded-xs">
            <div className="space-y-1">
              <span className="text-xs font-mono text-[#63C7D9] font-semibold">
                PDF Invoice Attached
              </span>
              <div className="text-[10px] font-mono text-[#6E7376]">
                STORAGE_KEY: {invoice.pdfStorageKey}
              </div>
            </div>
            <label className="px-3 py-1.5 bg-[#171A1C] hover:bg-[#292D30] text-xs font-mono text-[#A6AAAC] rounded-xs cursor-pointer transition-colors">
              {pdfUploading ? "UPLOADING..." : "REPLACE PDF"}
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={pdfUploading}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-[#A6AAAC]">
              No PDF file attached to this invoice. You can upload a statement or formal invoice PDF:
            </p>
            <label className="inline-block px-4 py-2 bg-[#171A1C] border border-[#292D30] hover:border-[#63C7D9] text-xs font-mono text-[#63C7D9] rounded-xs cursor-pointer transition-colors">
              {pdfUploading ? "UPLOADING PDF..." : "+ UPLOAD INVOICE PDF"}
              <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                disabled={pdfUploading}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
