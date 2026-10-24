import type { Metadata } from "next";
import { PortalNav } from "@/components/portal/PortalNav";

export const metadata: Metadata = {
  title: "Client Portal | Frontier Systems",
  description: "Secure client portal for active engagements, deliverables, and financial statements.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0D0E] text-[#F5F5F3] flex flex-col">
      <PortalNav />
      <main className="flex-1 py-8 sm:py-12">
        {children}
      </main>
      <footer className="border-t border-[#171A1C] py-6 text-center text-xs text-[#6E7376]">
        &copy; {new Date().getFullYear()} Frontier Systems Ltd. Confidentially secured for authorized enterprise clients.
      </footer>
    </div>
  );
}
