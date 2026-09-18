"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: string;
  amountDue: string;
  currency: string;
  issuedAt: string;
  dueAt: string;
  paidAt: string | null;
  pdfStorageKey: string | null;
  project: {
    id: string;
    name: string;
    customer: {
      name: string;
      email: string;
      companyName: string | null;
    };
  };
}

export default function PortalInvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function fetchInvoice() {
      try {
        const res = await fetch(`/api/portal/invoices/${id}`);
        if (!res.ok) {
          throw new Error("Invoice not found or unauthorized");
        }
        const json = await res.json();
        setInvoice(json.data.invoice);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching invoice details");
      } finally {
        setLoading(false);
      }
    }

    fetchInvoice();
  }, [id]);

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/portal/invoices/${id}/pdf`);
      const json = await res.json();
      if (!res.ok || !json.data?.signedUrl) {
        alert(json.error?.message || "PDF download link unavailable at this time.");
        return;
      }
      window.open(json.data.signedUrl, "_blank", "noopener,noreferrer");
    } catch {
      alert("Unable to generate invoice PDF download link.");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <Container size="2xl" className="space-y-6">
        <div className="h-6 w-48 bg-[#171A1C] rounded animate-pulse" />
        <div className="h-64 bg-[#111416] border border-[#292D30] rounded animate-pulse" />
      </Container>
    );
  }

  if (error || !invoice) {
    return (
      <Container size="2xl" className="py-12">
        <div className="p-8 bg-[#1A0D0E] border border-[#521C1D] text-center rounded-sm space-y-4">
          <p className="text-sm text-[#F87171]">{error || "Invoice not found or access denied"}</p>
          <Link
            href="/portal/invoices"
            className="inline-block px-4 py-2 text-xs font-medium bg-[#F5F5F3] text-[#0B0D0E] rounded-sm hover:bg-white"
          >
            &larr; Back to Invoices
          </Link>
        </div>
      </Container>
    );
  }

  const isPaid = invoice.status === "PAID";

  return (
    <Container size="2xl" className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#6E7376]">
        <Link href="/portal/dashboard" className="hover:text-[#A6AAAC] transition-colors">
          Portal Overview
        </Link>
        <span>/</span>
        <Link href="/portal/invoices" className="hover:text-[#A6AAAC] transition-colors">
          Invoices
        </Link>
        <span>/</span>
        <span className="text-[#F5F5F3] font-mono text-[11px]">{invoice.invoiceNumber}</span>
      </nav>

      {/* Invoice Card */}
      <div className="p-8 sm:p-10 bg-[#111416] border border-[#292D30] rounded-sm space-y-8 max-w-3xl">
        {/* Header Bar */}
        <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-[#292D30]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#63C7D9]">
              Frontier Systems Statement
            </span>
            <h1 className="text-2xl font-bold font-mono text-[#F5F5F3] mt-1">
              {invoice.invoiceNumber}
            </h1>
            <p className="text-xs text-[#A6AAAC] mt-1">
              Project: {invoice.project.name}
            </p>
          </div>

          <div className="text-right space-y-2">
            <span
              className={`inline-block px-2.5 py-1 text-xs font-mono uppercase tracking-wider rounded-sm ${
                isPaid
                  ? "bg-[#16382B] text-[#4EBA87] border border-[#1F4E3C]"
                  : invoice.status === "OVERDUE"
                  ? "bg-[#2A1213] text-[#F87171] border border-[#521C1D]"
                  : "bg-[#0B0D0E] text-[#63C7D9] border border-[#292D30]"
              }`}
            >
              {invoice.status}
            </span>
            <div className="text-xl font-mono font-bold text-[#F5F5F3]">
              {invoice.currency} {parseFloat(invoice.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Invoice Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-[#6E7376] font-mono uppercase text-[10px]">Billed To</span>
            <p className="font-semibold text-[#F5F5F3]">{invoice.project.customer.name}</p>
            {invoice.project.customer.companyName && (
              <p className="text-[#A6AAAC]">{invoice.project.customer.companyName}</p>
            )}
            <p className="text-[#A6AAAC]">{invoice.project.customer.email}</p>
          </div>

          <div className="space-y-1 sm:text-right">
            <span className="text-[#6E7376] font-mono uppercase text-[10px]">Payment Terms</span>
            <p className="text-[#A6AAAC]">
              Issued: <strong className="text-[#F5F5F3]">{new Date(invoice.issuedAt).toLocaleDateString("en-GB")}</strong>
            </p>
            <p className="text-[#A6AAAC]">
              Due Date: <strong className="text-[#F5F5F3]">{new Date(invoice.dueAt).toLocaleDateString("en-GB")}</strong>
            </p>
            {invoice.paidAt && (
              <p className="text-[#4EBA87]">
                Settled on: {new Date(invoice.paidAt).toLocaleDateString("en-GB")}
              </p>
            )}
          </div>
        </div>

        {/* Line Items Preview / Summary */}
        <div className="p-4 bg-[#0B0D0E] border border-[#292D30] rounded-sm space-y-2">
          <div className="flex justify-between text-xs text-[#A6AAAC]">
            <span>Milestone / Scope Deliverables</span>
            <span className="font-mono text-[#F5F5F3]">
              {invoice.currency} {parseFloat(invoice.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between text-xs pt-2 border-t border-[#171A1C] font-semibold text-[#F5F5F3]">
            <span>Total Amount Due</span>
            <span className="font-mono text-[#63C7D9]">
              {invoice.currency} {parseFloat(invoice.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#292D30]">
          <Link
            href="/portal/invoices"
            className="text-xs font-mono text-[#A6AAAC] hover:text-[#F5F5F3]"
          >
            &larr; Back to Invoices
          </Link>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="inline-flex items-center justify-center h-10 px-5 text-xs font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] disabled:opacity-50 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
          >
            {downloading ? "Generating Signed Link..." : "Download Official PDF \u2193"}
          </button>
        </div>
      </div>
    </Container>
  );
}
