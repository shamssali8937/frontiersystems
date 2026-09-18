"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

export default function PortalLoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid corporate email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/portal/auth/request-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error?.message || "Too many requests. Please retry in a few moments.");
        } else {
          setError(data.error?.message || "An error occurred while dispatching sign-in link.");
        }
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network or system error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D0E] dark:bg-[#0B0D0E] bg-slate-50 text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header — Centered */}
      <div className="w-full flex items-center justify-center py-2">
        <Logo size="md" />
      </div>

      {/* Main Login Card */}
      <Container size="sm" className="w-full max-w-md my-auto">
        <div className="p-8 sm:p-10 bg-[#111416] dark:bg-[#111416] bg-white border border-[#292D30] dark:border-[#292D30] border-slate-200 rounded-sm space-y-6 shadow-xl">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#63C7D9] dark:bg-[#63C7D9] bg-[#0891B2]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#63C7D9] dark:text-[#63C7D9] text-[#0891B2]">
                Client Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900">
              Sign in to your portal
            </h1>
            <p className="text-xs text-[#A6AAAC] dark:text-[#A6AAAC] text-slate-600 leading-relaxed">
              Passwordless sign-in for authorized clients. Enter your corporate email to receive a single-use secure link.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 bg-[#0B0D0E] dark:bg-[#0B0D0E] bg-slate-50 border border-[#292D30] dark:border-[#292D30] border-slate-200 rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-[#4EBA87] dark:text-[#4EBA87] text-emerald-600 text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Link Dispatched</span>
              </div>
              <p className="text-xs text-[#A6AAAC] dark:text-[#A6AAAC] text-slate-600 leading-relaxed">
                If an active client account exists for <strong className="text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900">{email}</strong>, a secure sign-in link has been sent. Check your inbox and click the link within 15 minutes.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="text-xs font-mono text-[#63C7D9] dark:text-[#63C7D9] text-[#0891B2] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  &larr; Try a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div
                  role="alert"
                  className="p-3 bg-[#1A0D0E] dark:bg-[#1A0D0E] bg-rose-50 border border-[#521C1D] dark:border-[#521C1D] border-rose-200 text-[#F87171] dark:text-[#F87171] text-rose-700 text-xs rounded-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0 text-[#F87171] dark:text-[#F87171] text-rose-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="client-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[#A6AAAC] dark:text-[#A6AAAC] text-slate-600"
                >
                  Corporate Email
                </label>
                <input
                  id="client-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@enterprise.com"
                  className="w-full h-11 px-3.5 bg-[#0B0D0E] dark:bg-[#0B0D0E] bg-slate-50 border border-[#292D30] dark:border-[#292D30] border-slate-300 text-sm text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 placeholder-[#4D5358] dark:placeholder-[#4D5358] placeholder-slate-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] dark:focus-visible:ring-[#63C7D9] focus-visible:ring-[#0891B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] dark:focus-visible:ring-offset-[#0B0D0E] focus-visible:ring-offset-white transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center h-11 text-sm font-medium text-[#0B0D0E] dark:text-[#0B0D0E] text-white bg-[#F5F5F3] dark:bg-[#F5F5F3] bg-slate-900 hover:bg-white dark:hover:bg-white hover:bg-slate-800 active:bg-[#E5E5E3] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] dark:focus-visible:ring-[#63C7D9] focus-visible:ring-[#0891B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] dark:focus-visible:ring-offset-[#0B0D0E] focus-visible:ring-offset-white"
              >
                {loading ? "Dispatching link..." : "Send Sign-In Link \u2192"}
              </button>

              <div className="pt-3 border-t border-[#171A1C] dark:border-[#171A1C] border-slate-100 text-[11px] text-[#6E7376] dark:text-[#6E7376] text-slate-500 leading-relaxed">
                Existing client access only. Portal access is provisioned during project onboarding and cannot be self-registered.
              </div>
            </form>
          )}
        </div>
      </Container>

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-[#6E7376] dark:text-[#6E7376] text-slate-500">
        &copy; {new Date().getFullYear()} Frontier Systems Ltd. All rights reserved.
      </div>
    </div>
  );
}
