"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";

export function PortalNav() {
  const pathname = usePathname();
  const router = useRouter();

  // Do not render authenticated navigation on public auth pages
  if (pathname === "/portal/login" || pathname === "/portal/verify") {
    return null;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/portal/auth/logout", { method: "POST" });
      router.push("/portal/login");
    } catch {
      router.push("/portal/login");
    }
  };

  const navLinks = [
    { label: "Overview", href: "/portal/dashboard" },
    { label: "Invoices", href: "/portal/invoices" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D0E]/95 backdrop-blur-sm border-b border-[#292D30] py-3.5">
      <Container size="2xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo with Portal badge */}
          <div className="flex items-center gap-4">
            <Link
              href="/portal/dashboard"
              className="flex items-center gap-2.5 text-[#F5F5F3] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-1"
              aria-label="Client Portal Home"
            >
              <span className="w-6 h-6 flex items-center justify-center border border-[#292D30] bg-[#111416] text-[#63C7D9] font-mono text-xs font-semibold rounded-sm">
                FS
              </span>
              <span className="font-semibold text-base tracking-tight text-[#F5F5F3]">
                Client Portal
              </span>
            </Link>

            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#63C7D9] bg-[#111416] border border-[#292D30] rounded-sm">
              Authenticated
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6" aria-label="Client Portal Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] py-1 ${
                    isActive ? "text-[#63C7D9]" : "text-[#A6AAAC] hover:text-[#F5F5F3]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={handleLogout}
              className="text-xs font-medium text-[#A6AAAC] hover:text-[#F87171] border border-[#292D30] hover:border-[#521C1D] bg-[#111416] px-3 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              aria-label="Sign out of Client Portal"
            >
              Sign Out
            </button>
          </nav>
        </div>
      </Container>
    </header>
  );
}
