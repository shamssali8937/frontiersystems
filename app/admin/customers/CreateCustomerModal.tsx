"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateCustomerModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, companyName: companyName || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to create customer");
        setLoading(false);
        return;
      }

      setOpen(false);
      setName("");
      setEmail("");
      setCompanyName("");
      setLoading(false);
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
        + REGISTER CUSTOMER
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D0E]/80 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#111416] border border-[#292D30] rounded-sm p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
              <span className="text-xs font-mono font-bold text-[#F5F5F3] uppercase tracking-wider">
                Register New Customer
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
                <label className="block text-xs font-mono text-[#A6AAAC]">Customer Name</label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Catherine Vance"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="catherine@vance-holdings.co.uk"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus:outline-none focus:border-[#63C7D9]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-[#A6AAAC]">Organization / Company</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Vance Applied Robotics Ltd"
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
                  {loading ? "SAVING..." : "CREATE CUSTOMER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
