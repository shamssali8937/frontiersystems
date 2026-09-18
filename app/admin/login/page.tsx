"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Authentication rejected. Verify credentials.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network or connection error during authentication attempt.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D0E] dark:bg-[#0B0D0E] bg-slate-50 text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header — Centered */}
      <div className="w-full flex items-center justify-center py-2">
        <Logo size="md" />
      </div>

      <div className="w-full max-w-md mx-auto my-auto bg-[#111416] dark:bg-[#111416] bg-white border border-[#292D30] dark:border-[#292D30] border-slate-200 rounded-sm p-8 space-y-6 shadow-2xl">
        {/* Terminal Header */}
        <div className="space-y-2 border-b border-[#292D30] dark:border-[#292D30] border-slate-200 pb-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono tracking-wider text-[#63C7D9] dark:text-[#63C7D9] text-[#0891B2] px-2 py-0.5 rounded-xs bg-[#171A1C] dark:bg-[#171A1C] bg-slate-100 border border-[#292D30] dark:border-[#292D30] border-slate-300">
              ADMIN CONSOLE
            </span>
            <span className="text-[10px] font-mono text-[#63C7D9] dark:text-[#63C7D9] text-[#0891B2] px-2 py-0.5 rounded-xs bg-[#171A1C] dark:bg-[#171A1C] bg-slate-100 border border-[#292D30] dark:border-[#292D30] border-slate-300">
              AUTH_GATEWAY // V4
            </span>
          </div>
          <h1 className="text-lg font-semibold text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 pt-1">
            Administrative Access Portal
          </h1>
          <p className="text-xs text-[#6E7376] dark:text-[#6E7376] text-slate-500">
            High-assurance session authentication for senior engineering & operations personnel.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            role="alert"
            className="p-3 bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xs text-xs font-mono text-[#FF6B6B] flex items-center gap-2"
          >
            <svg className="w-4 h-4 shrink-0 text-[#FF6B6B]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-mono text-[#A6AAAC] dark:text-[#A6AAAC] text-slate-600 uppercase tracking-wider"
            >
              Staff Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@frontiersystems.co"
              className="w-full px-3 py-2.5 bg-[#0B0D0E] dark:bg-[#0B0D0E] bg-slate-50 border border-[#292D30] dark:border-[#292D30] border-slate-300 rounded-xs text-xs font-mono text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 placeholder-[#6E7376] dark:placeholder-[#6E7376] placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] dark:focus-visible:ring-[#63C7D9] focus-visible:ring-[#0891B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] dark:focus-visible:ring-offset-[#0B0D0E] focus-visible:ring-offset-white transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-mono text-[#A6AAAC] dark:text-[#A6AAAC] text-slate-600 uppercase tracking-wider"
            >
              Access Secret
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3 py-2.5 bg-[#0B0D0E] dark:bg-[#0B0D0E] bg-slate-50 border border-[#292D30] dark:border-[#292D30] border-slate-300 rounded-xs text-xs font-mono text-[#F5F5F3] dark:text-[#F5F5F3] text-slate-900 placeholder-[#6E7376] dark:placeholder-[#6E7376] placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] dark:focus-visible:ring-[#63C7D9] focus-visible:ring-[#0891B2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] dark:focus-visible:ring-offset-[#0B0D0E] focus-visible:ring-offset-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-[#63C7D9] hover:bg-[#78D3E3] text-[#0B0D0E] font-mono text-xs font-semibold rounded-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E]"
          >
            {loading ? (
              <>
                <span className="w-2 h-2 rounded-full bg-[#0B0D0E] animate-ping" />
                <span>VERIFYING CREDENTIALS...</span>
              </>
            ) : (
              <span>VERIFY ACCESS & ENTER &rarr;</span>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="pt-4 border-t border-[#292D30] dark:border-[#292D30] border-slate-200 text-[10px] font-mono text-[#6E7376] dark:text-[#6E7376] text-slate-500 space-y-1">
          <div>RESTRICTED ACCESS — IP HASHES LOGGED</div>
          <div>All authentication transactions are monitored and cryptographically signed.</div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-[#6E7376] dark:text-[#6E7376] text-slate-500">
        &copy; {new Date().getFullYear()} Frontier Systems Ltd. All rights reserved.
      </div>
    </div>
  );
}
