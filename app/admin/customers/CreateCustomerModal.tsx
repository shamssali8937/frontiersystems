"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export function CreateCustomerModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus trap and Escape key support
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        triggerButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl?.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl?.focus();
          }
        }
      }
    },
    [open],
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => {
        firstInputRef.current?.focus();
      });
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, handleKeyDown]);

  const handleClose = () => {
    setOpen(false);
    setError(null);
    triggerButtonRef.current?.focus();
  };

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
      triggerButtonRef.current?.focus();
      router.refresh();
    } catch {
      setError("Network failure during customer registration");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-xs font-mono font-semibold text-[#0B0D0E] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E]"
      >
        + REGISTER CUSTOMER
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D0E]/80 backdrop-blur-xs p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="customer-modal-title"
            className="w-full max-w-md bg-[#111416] border border-[#292D30] rounded-sm p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
              <h2
                id="customer-modal-title"
                className="text-xs font-mono font-bold text-[#F5F5F3] uppercase tracking-wider"
              >
                Register New Customer
              </h2>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close dialog"
                className="text-[#6E7376] hover:text-[#F5F5F3] p-1 text-lg font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] rounded-xs"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {error && (
              <div
                role="alert"
                className="p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xs text-xs font-mono text-[#FF6B6B] flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 shrink-0 text-[#FF6B6B]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="customer-name" className="block text-xs font-mono text-[#A6AAAC]">
                  Customer Name <span className="text-[#63C7D9]">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="customer-name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Catherine Vance"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="customer-email" className="block text-xs font-mono text-[#A6AAAC]">
                  Corporate Email <span className="text-[#63C7D9]">*</span>
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="catherine@vance-holdings.co.uk"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="customer-company" className="block text-xs font-mono text-[#A6AAAC]">
                  Organization / Company <span className="text-[10px] text-[#6E7376]">(Optional)</span>
                </label>
                <input
                  id="customer-company"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Vance Applied Robotics Ltd"
                  className="w-full px-3 py-2 bg-[#0B0D0E] border border-[#292D30] rounded-xs text-xs font-mono text-[#F5F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#292D30]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-3 py-2 text-xs font-mono text-[#A6AAAC] hover:text-[#F5F5F3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] rounded-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-[#0B0D0E] text-xs font-mono font-semibold rounded-xs transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9]"
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
