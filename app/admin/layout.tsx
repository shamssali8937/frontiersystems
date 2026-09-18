"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  // On login page, render bare container without sidebar
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#0B0D0E] text-[#F5F5F3]">{children}</div>;
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Overview", href: "/admin/dashboard", icon: "SYS" },
    { label: "Customers", href: "/admin/customers", icon: "CRM" },
    { label: "Projects", href: "/admin/projects", icon: "PRJ" },
    { label: "Invoices", href: "/admin/invoices", icon: "INV" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D0E] text-[#F5F5F3] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#111416] border-b md:border-b-0 md:border-r border-[#292D30] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo & Platform Designation */}
          <div className="space-y-1">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#63C7D9]" />
              <span className="font-mono text-sm font-bold tracking-widest text-[#F5F5F3] uppercase">
                FRONTIER // OPS
              </span>
            </Link>
            <div className="text-[10px] font-mono text-[#6E7376]">
              ENTERPRISE ADMIN PORTAL
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xs text-xs font-mono transition-colors ${
                    isActive
                      ? "bg-[#171A1C] text-[#63C7D9] border-l-2 border-[#63C7D9]"
                      : "text-[#A6AAAC] hover:text-[#F5F5F3] hover:bg-[#171A1C]"
                  }`}
                >
                  <span className="text-[10px] text-[#6E7376] font-semibold">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Identity & Logout */}
        <div className="pt-6 border-t border-[#292D30] space-y-4 mt-6 md:mt-0">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#63C7D9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
              <span>SESSION_ACTIVE</span>
            </div>
            <div className="text-[10px] font-mono text-[#6E7376] truncate">
              admin@frontiersystems.co
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2 px-3 text-xs font-mono text-[#A6AAAC] hover:text-[#FF6B6B] border border-[#292D30] hover:border-[#FF6B6B]/40 rounded-xs transition-colors text-left flex items-center justify-between"
          >
            <span>TERMINATE SESSION</span>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen bg-[#0B0D0E] p-6 sm:p-8 lg:p-12">
        {children}
      </main>
    </div>
  );
}
