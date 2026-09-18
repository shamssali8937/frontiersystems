"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("fs_cookie_consent");
    if (!consent) {
      // Delay slightly for smooth non-blocking entry
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleChoice = (type: "all" | "essential") => {
    localStorage.setItem("fs_cookie_consent", type);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-[#0B0D0E]/95 backdrop-blur-md border-t border-[#292D30] transition-all duration-300"
    >
      <Container size="2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <p className="text-xs text-[#F5F5F3] font-medium">
              Cookie &amp; Technical Storage Notice
            </p>
            <p className="text-xs text-[#A6AAAC] leading-relaxed">
              We use strictly essential cookies for secure portal authentication and session management. Optional analytics cookies evaluate aggregated platform performance. Review our{" "}
              <Link
                href="/cookie-policy"
                className="text-[#63C7D9] hover:underline underline-offset-2"
              >
                Cookie Policy
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-[#63C7D9] hover:underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleChoice("essential")}
              className="h-8 px-3.5 text-xs font-medium text-[#A6AAAC] hover:text-[#F5F5F3] border border-[#292D30] bg-[#111416] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Essential Only
            </button>
            <button
              type="button"
              onClick={() => handleChoice("all")}
              className="h-8 px-4 text-xs font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Accept All
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
