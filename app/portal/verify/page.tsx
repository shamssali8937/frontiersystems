"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"verifying" | "success" | "error">(() =>
    !token ? "error" : "verifying",
  );
  const [errorMessage, setErrorMessage] = useState<string>(() =>
    !token ? "No authentication token was provided in the URL." : "",
  );

  useEffect(() => {
    if (!token) return;

    let isMounted = true;

    async function verify() {
      try {
        const res = await fetch(`/api/portal/auth/verify?token=${encodeURIComponent(token!)}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.ok && data.success) {
          setStatus("success");
          setTimeout(() => {
            router.push("/portal/dashboard");
          }, 800);
        } else {
          setStatus("error");
          setErrorMessage(data.error?.message || "Sign-in link is invalid or has expired.");
        }
      } catch {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("Network or server connection error. Please try again.");
      }
    }

    verify();

    return () => {
      isMounted = false;
    };
  }, [token, router]);

  return (
    <Container size="sm" className="w-full max-w-md my-auto">
      <div className="p-8 sm:p-10 bg-[#111416] border border-[#292D30] rounded-sm space-y-6 text-center">
        {status === "verifying" && (
          <div className="space-y-4">
            <div className="w-8 h-8 border-2 border-[#63C7D9] border-t-transparent rounded-full animate-spin mx-auto" />
            <h1 className="text-xl font-semibold text-[#F5F5F3]">Verifying your sign-in link</h1>
            <p className="text-xs text-[#A6AAAC]">
              Authenticating session credentials. You will be redirected momentarily...
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#16382B] border border-[#4EBA87] flex items-center justify-center text-[#4EBA87] mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-[#F5F5F3]">Session Verified</h1>
            <p className="text-xs text-[#A6AAAC]">
              Access granted. Entering client dashboard...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-5">
            <div className="w-10 h-10 rounded-full bg-[#2A1213] border border-[#F87171] flex items-center justify-center text-[#F87171] mx-auto">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-[#F5F5F3]">Authentication Failed</h1>
              <p className="text-xs text-[#F87171] leading-relaxed">
                {errorMessage}
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/portal/login"
                className="inline-flex items-center justify-center h-10 px-5 text-xs font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                Request a New Link &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default function PortalVerifyPage() {
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

      <Suspense
        fallback={
          <Container size="sm" className="w-full max-w-md my-auto text-center">
            <div className="w-8 h-8 border-2 border-[#63C7D9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-xs text-[#A6AAAC]">Validating request...</p>
          </Container>
        }
      >
        <VerifyContent />
      </Suspense>

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-[#6E7376]">
        &copy; {new Date().getFullYear()} Frontier Systems Ltd. All rights reserved.
      </div>
    </div>
  );
}
