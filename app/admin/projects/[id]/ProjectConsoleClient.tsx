"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectConsoleClientProps {
  project: {
    id: string;
    name: string;
    status: string;
    summary?: string | null;
    createdAt: string;
    customer: {
      id: string;
      name: string;
      email: string;
      companyName?: string | null;
    };
    inquiry?: {
      id: string;
      service?: string | null;
      budget?: string | null;
      message: string;
    } | null;
    milestones: Array<{
      id: string;
      title: string;
      description?: string | null;
      status: string;
      dueDate?: string | null;
      completedAt?: string | null;
    }>;
    documents: Array<{
      id: string;
      fileName: string;
      storageKey: string;
      mimeType: string;
      fileSize: number;
      uploadedBy: string;
      createdAt: string;
    }>;
    invoices: Array<{
      id: string;
      invoiceNumber: string;
      status: string;
      amountDue: string | number;
      currency: string;
      issuedAt: string;
      dueAt: string;
      paidAt?: string | null;
    }>;
  };
}

export function ProjectConsoleClient({ project }: ProjectConsoleClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "documents" | "invoices">("overview");
  const [currentStatus, setCurrentStatus] = useState(project.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // New Milestone state
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDesc, setNewMilestoneDesc] = useState("");
  const [milestoneLoading, setMilestoneLoading] = useState(false);

  // New Invoice state
  const [invoiceNumber, setInvoiceNumber] = useState("FS-2026-1001");
  const [amountDue, setAmountDue] = useState("5000.00");
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  // File Upload state
  const [fileUploading, setFileUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      await fetch(`/api/admin/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      setCurrentStatus(newStatus);
      router.refresh();
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle) return;
    setMilestoneLoading(true);

    try {
      await fetch(`/api/admin/projects/${project.id}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMilestoneTitle,
          description: newMilestoneDesc || undefined,
          status: "PENDING",
        }),
      });
      setNewMilestoneTitle("");
      setNewMilestoneDesc("");
      router.refresh();
    } finally {
      setMilestoneLoading(false);
    }
  };

  const handleToggleMilestone = async (milestoneId: string, currentMilestoneStatus: string) => {
    const nextStatus = currentMilestoneStatus === "COMPLETE" ? "PENDING" : "COMPLETE";
    await fetch(`/api/admin/projects/${project.id}/milestones?milestoneId=${milestoneId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        completedAt: nextStatus === "COMPLETE" ? new Date().toISOString() : null,
      }),
    });
    router.refresh();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload via existing secure upload pipeline
      const uploadRes = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        setUploadError(uploadData.error?.message || "File upload failed");
        setFileUploading(false);
        return;
      }

      // Attach document metadata to project
      await fetch(`/api/admin/projects/${project.id}/documents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          storageKey: uploadData.data.storageKey,
          mimeType: file.type || "application/octet-stream",
          fileSize: file.size,
          uploadedBy: "ADMIN",
        }),
      });

      router.refresh();
    } catch {
      setUploadError("Failed to upload and attach document");
    } finally {
      setFileUploading(false);
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setInvoiceLoading(true);

    try {
      const dueAt = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
      await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: project.id,
          invoiceNumber,
          amountDue,
          currency: "GBP",
          dueAt,
          status: "DRAFT",
        }),
      });
      setInvoiceNumber(`FS-2026-${Math.floor(1000 + Math.random() * 9000)}`);
      router.refresh();
    } finally {
      setInvoiceLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Header Console */}
      <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#63C7D9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9]" />
              <span>PROJECT_ID: {project.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-[#F5F5F3] pt-1">{project.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A6AAAC] pt-2">
              <span>
                Client:{" "}
                <Link
                  href={`/admin/customers/${project.customer.id}`}
                  className="text-[#63C7D9] hover:underline"
                >
                  {project.customer.name} ({project.customer.companyName || project.customer.email})
                </Link>
              </span>
              <span>&bull;</span>
              <span>Initialized: {new Date(project.createdAt).toLocaleDateString("en-GB")}</span>
              {project.inquiry && (
                <>
                  <span>&bull;</span>
                  <span className="text-[#4EBA87]">Origin: WON Lead #{project.inquiry.id.slice(0, 8)}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-[#A6AAAC]">STATUS:</span>
            <select
              value={currentStatus}
              disabled={updatingStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="px-3 py-1.5 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#63C7D9] focus:outline-none focus:border-[#63C7D9]"
            >
              <option value="ONBOARDING">ONBOARDING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="REVIEW">REVIEW</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="MAINTENANCE">MAINTENANCE</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-4 border-t border-[#292D30] pt-4 text-xs font-mono">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-[#63C7D9] text-[#63C7D9] font-semibold"
                : "border-transparent text-[#A6AAAC] hover:text-[#F5F5F3]"
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveTab("milestones")}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === "milestones"
                ? "border-[#63C7D9] text-[#63C7D9] font-semibold"
                : "border-transparent text-[#A6AAAC] hover:text-[#F5F5F3]"
            }`}
          >
            MILESTONES ({project.milestones.length})
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === "documents"
                ? "border-[#63C7D9] text-[#63C7D9] font-semibold"
                : "border-transparent text-[#A6AAAC] hover:text-[#F5F5F3]"
            }`}
          >
            DOCUMENTS ({project.documents.length})
          </button>
          <button
            onClick={() => setActiveTab("invoices")}
            className={`pb-1 border-b-2 transition-colors ${
              activeTab === "invoices"
                ? "border-[#63C7D9] text-[#63C7D9] font-semibold"
                : "border-transparent text-[#A6AAAC] hover:text-[#F5F5F3]"
            }`}
          >
            INVOICES ({project.invoices.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-3">
              <h3 className="text-xs font-mono font-semibold text-[#63C7D9] uppercase tracking-wider">
                Scope & Architecture Summary
              </h3>
              <p className="text-xs text-[#A6AAAC] leading-relaxed whitespace-pre-wrap">
                {project.summary || "No architectural summary or specifications recorded."}
              </p>
            </div>

            {project.inquiry && (
              <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-3">
                <h3 className="text-xs font-mono font-semibold text-[#4EBA87] uppercase tracking-wider">
                  Original Ingestion Brief
                </h3>
                <div className="text-xs text-[#6E7376] font-mono">
                  Service Pillar: {project.inquiry.service || "Enterprise Architecture"} &bull; Budget: {project.inquiry.budget || "Open"}
                </div>
                <p className="text-xs text-[#A6AAAC] leading-relaxed whitespace-pre-wrap bg-[#0B0D0E] p-4 rounded-xs border border-[#292D30]">
                  {project.inquiry.message}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
              <h3 className="text-xs font-mono font-semibold text-[#F5F5F3] uppercase tracking-wider">
                Quick Metrics
              </h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between text-[#A6AAAC]">
                  <span>Total Milestones:</span>
                  <span className="text-[#F5F5F3]">{project.milestones.length}</span>
                </div>
                <div className="flex justify-between text-[#A6AAAC]">
                  <span>Completed:</span>
                  <span className="text-[#4EBA87]">
                    {project.milestones.filter((m) => m.status === "COMPLETE").length}
                  </span>
                </div>
                <div className="flex justify-between text-[#A6AAAC]">
                  <span>Uploaded Docs:</span>
                  <span className="text-[#F5F5F3]">{project.documents.length}</span>
                </div>
                <div className="flex justify-between text-[#A6AAAC]">
                  <span>Active Invoices:</span>
                  <span className="text-[#F5F5F3]">{project.invoices.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
            <h3 className="text-xs font-mono font-semibold text-[#F5F5F3] uppercase tracking-wider">
              Add Project Milestone
            </h3>
            <form onSubmit={handleAddMilestone} className="flex flex-col sm:flex-row gap-3">
              <input
                required
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Milestone title (e.g. Ingestion Pipeline Deployment)"
                className="flex-1 px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
              />
              <input
                value={newMilestoneDesc}
                onChange={(e) => setNewMilestoneDesc(e.target.value)}
                placeholder="Description optional..."
                className="flex-1 px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
              />
              <button
                type="submit"
                disabled={milestoneLoading}
                className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-[#0B0D0E] text-xs font-mono font-semibold rounded-xs transition-colors shrink-0 disabled:opacity-50"
              >
                {milestoneLoading ? "ADDING..." : "+ ADD MILESTONE"}
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {project.milestones.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#6E7376] bg-[#111416] border border-[#292D30] rounded-sm">
                No delivery milestones recorded yet.
              </div>
            ) : (
              project.milestones.map((m) => (
                <div
                  key={m.id}
                  className="p-4 rounded-sm bg-[#111416] border border-[#292D30] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleMilestone(m.id, m.status)}
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center text-[10px] font-mono transition-colors ${
                          m.status === "COMPLETE"
                            ? "bg-[#4EBA87] border-[#4EBA87] text-[#0B0D0E]"
                            : "border-[#6E7376] text-transparent hover:border-[#63C7D9]"
                        }`}
                      >
                        ✓
                      </button>
                      <span
                        className={`text-xs font-mono font-semibold ${
                          m.status === "COMPLETE" ? "line-through text-[#6E7376]" : "text-[#F5F5F3]"
                        }`}
                      >
                        {m.title}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase ${
                          m.status === "COMPLETE"
                            ? "bg-[#4EBA87]/15 text-[#4EBA87] border border-[#4EBA87]/30"
                            : "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                    {m.description && (
                      <p className="text-xs text-[#A6AAAC] pl-7">{m.description}</p>
                    )}
                  </div>

                  {m.completedAt && (
                    <span className="text-[10px] font-mono text-[#6E7376]">
                      Completed {new Date(m.completedAt).toLocaleDateString("en-GB")}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Documents */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
            <h3 className="text-xs font-mono font-semibold text-[#F5F5F3] uppercase tracking-wider">
              Upload Project Architecture Document
            </h3>
            {uploadError && (
              <div className="text-xs font-mono text-[#FF6B6B]">{uploadError}</div>
            )}
            <div className="flex items-center gap-4">
              <label className="px-4 py-2 bg-[#171A1C] border border-[#292D30] hover:border-[#63C7D9] text-xs font-mono text-[#63C7D9] rounded-xs cursor-pointer transition-colors">
                {fileUploading ? "UPLOADING TO STORAGE..." : "+ SELECT FILE TO UPLOAD"}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={fileUploading}
                  className="hidden"
                />
              </label>
              <span className="text-[10px] font-mono text-[#6E7376]">
                PDF, PNG, JPG, or DOCX (Max 5MB)
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {project.documents.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#6E7376] bg-[#111416] border border-[#292D30] rounded-sm">
                No project documents uploaded yet.
              </div>
            ) : (
              project.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-sm bg-[#111416] border border-[#292D30] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold font-mono text-[#F5F5F3]">
                        {doc.fileName}
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#171A1C] text-[#6E7376] border border-[#292D30]">
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </span>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#171A1C] text-[#63C7D9] border border-[#292D30]">
                        Uploaded by {doc.uploadedBy}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#6E7376]">
                      {new Date(doc.createdAt).toLocaleDateString("en-GB")} &bull; MIME: {doc.mimeType}
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-[#6E7376]">
                    SECURE_KEY: {doc.storageKey.slice(0, 16)}...
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Invoices */}
      {activeTab === "invoices" && (
        <div className="space-y-6">
          <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] space-y-4">
            <h3 className="text-xs font-mono font-semibold text-[#F5F5F3] uppercase tracking-wider">
              Issue Invoice for this Project
            </h3>
            <form onSubmit={handleCreateInvoice} className="flex flex-col sm:flex-row gap-3">
              <input
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Invoice #"
                className="w-48 px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
              />
              <input
                required
                value={amountDue}
                onChange={(e) => setAmountDue(e.target.value)}
                placeholder="Amount (GBP)"
                className="w-36 px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
              />
              <button
                type="submit"
                disabled={invoiceLoading}
                className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-[#0B0D0E] text-xs font-mono font-semibold rounded-xs transition-colors shrink-0 disabled:opacity-50"
              >
                {invoiceLoading ? "GENERATING..." : "+ ISSUE INVOICE"}
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {project.invoices.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-[#6E7376] bg-[#111416] border border-[#292D30] rounded-sm">
                No invoices issued for this project yet.
              </div>
            ) : (
              project.invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-4 rounded-sm bg-[#111416] border border-[#292D30] flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-semibold text-[#F5F5F3]">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase ${
                          inv.status === "PAID"
                            ? "bg-[#4EBA87]/15 text-[#4EBA87] border border-[#4EBA87]/30"
                            : inv.status === "SENT"
                            ? "bg-[#63C7D9]/15 text-[#63C7D9] border border-[#63C7D9]/30"
                            : "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-[#6E7376]">
                      Issued: {new Date(inv.issuedAt).toLocaleDateString("en-GB")} &bull; Due:{" "}
                      {new Date(inv.dueAt).toLocaleDateString("en-GB")}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold font-mono text-[#F5F5F3]">
                      £{Number(inv.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </span>
                    <Link
                      href={`/admin/invoices/${inv.id}`}
                      className="text-xs font-mono text-[#63C7D9] hover:underline"
                    >
                      Inspect &rarr;
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
