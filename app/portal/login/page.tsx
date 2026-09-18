"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

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
    <div className="min-h-screen bg-[#0B0D0E] text-[#F5F5F3] flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="w-full max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 text-[#F5F5F3] group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-1"
          aria-label="Frontier Systems Home"
        >
          <span className="w-6 h-6 flex items-center justify-center border border-[#292D30] bg-[#111416] text-[#63C7D9] font-mono text-xs font-semibold rounded-sm transition-colors group-hover:border-[#63C7D9]">
            FS
          </span>
          <span className="font-semibold text-base tracking-tight text-[#F5F5F3]">
            Frontier Systems
          </span>
        </Link>
      </div>

      {/* Main Login Card */}
      <Container size="sm" className="w-full max-w-md my-auto">
        <div className="p-8 sm:p-10 bg-[#111416] border border-[#292D30] rounded-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#63C7D9]" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#63C7D9]">
                Client Portal
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-[#F5F5F3]">
              Sign in to your portal
            </h1>
            <p className="text-xs text-[#A6AAAC] leading-relaxed">
              Passwordless sign-in for authorized clients. Enter your corporate email to receive a single-use secure link.
            </p>
          </div>

          {submitted ? (
            <div className="p-5 bg-[#0B0D0E] border border-[#292D30] rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-[#4EBA87] text-xs font-semibold">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Link Dispatched</span>
              </div>
              <p className="text-xs text-[#A6AAAC] leading-relaxed">
                If an active client account exists for <strong className="text-[#F5F5F3]">{email}</strong>, a secure sign-in link has been sent. Check your inbox and click the link within 15 minutes.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail("");
                  }}
                  className="text-xs font-mono text-[#63C7D9] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
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
                  className="p-3 bg-[#1A0D0E] border border-[#521C1D] text-[#F87171] text-xs rounded-sm flex items-center gap-2"
                >
                  <svg className="w-4 h-4 shrink-0 text-[#F87171]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label
                  htmlFor="client-email"
                  className="block text-xs font-mono uppercase tracking-wider text-[#A6AAAC]"
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
                  className="w-full h-11 px-3.5 bg-[#0B0D0E] border border-[#292D30] text-sm text-[#F5F5F3] placeholder-[#4D5358] rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center h-11 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] disabled:opacity-50 disabled:cursor-not-allowed rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E]"
              >
                {loading ? "Dispatching link..." : "Send Sign-In Link &rarr;"}
              </button>

              <div className="pt-3 border-t border-[#171A1C] text-[11px] text-[#6E7376] leading-relaxed">
                Existing client access only. Portal access is provisioned during project onboarding and cannot be self-registered.
              </div>
            </form>
          )}
        </div>
      </Container>

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-[#6E7376]">
        &copy; {new Date().getFullYear()} Frontier Systems Ltd. All rights reserved.
      </div>
    </div>
  );
}
