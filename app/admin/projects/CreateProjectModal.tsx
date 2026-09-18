"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface CustomerOption {
  id: string;
  name: string;
  email: string;
  companyName?: string | null;
}

interface CreateProjectModalProps {
  customers: CustomerOption[];
}

export function CreateProjectModal({ customers }: CreateProjectModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [customerId, setCustomerId] = useState(customers[0]?.id || "");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ONBOARDING");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      setError("Please select a customer or create one first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId,
          name,
          status,
          summary: summary || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to create project");
        setLoading(false);
        return;
      }

      setOpen(false);
      setName("");
      setSummary("");
      setLoading(false);
      router.push(`/admin/projects/${data.data.project.id}`);
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
        + INITIALIZE PROJECT
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D0E]/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#111416] border border-[#292D30] rounded-sm p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
              <span className="text-xs font-mono font-bold text-[#F5F5F3] uppercase tracking-wider">
                Initialize Architecture Project
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
                <label className="block text-xs font-mono text-[#A6AAAC]">Client / Customer</label>
                <select
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.companyName || c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Project Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Distributed Consensus Engine"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                >
                  <option value="ONBOARDING">ONBOARDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="REVIEW">REVIEW</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="MAINTENANCE">MAINTENANCE</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">
                  Summary / Scope Overview (Client-Facing)
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Brief architectural scope and deliverable commitments..."
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                />
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
                  {loading ? "CREATING..." : "INITIALIZE PROJECT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
