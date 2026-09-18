"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
}

interface Milestone {
  id: string;
  title: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETE";
  dueDate: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  summary: string | null;
  createdAt: string;
  milestones: Milestone[];
  documents: { id: string }[];
  invoices: { id: string }[];
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  amountDue: string;
  currency: string;
  dueAt: string;
  project: { id: string; name: string };
}

interface DashboardData {
  customer: CustomerProfile;
  activeProjectsCount: number;
  totalProjectsCount: number;
  outstandingInvoicesCount: number;
  recentProjects: Project[];
  recentInvoices: Invoice[];
}

export default function PortalDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("/api/portal/dashboard");
        if (!res.ok) {
          throw new Error("Failed to load customer dashboard");
        }
        const json = await res.json();
        setData(json.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <Container size="2xl" className="space-y-8">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-[#171A1C] rounded animate-pulse" />
          <div className="h-8 w-64 bg-[#171A1C] rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-28 bg-[#111416] border border-[#292D30] rounded animate-pulse" />
          <div className="h-28 bg-[#111416] border border-[#292D30] rounded animate-pulse" />
          <div className="h-28 bg-[#111416] border border-[#292D30] rounded animate-pulse" />
        </div>
      </Container>
    );
  }

  if (error || !data) {
    return (
      <Container size="2xl" className="py-12">
        <div className="p-8 bg-[#1A0D0E] border border-[#521C1D] text-center rounded-sm space-y-4">
          <p className="text-sm text-[#F87171]">{error || "Unable to retrieve dashboard data"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-xs font-medium bg-[#F5F5F3] text-[#0B0D0E] rounded-sm hover:bg-white"
          >
            Retry
          </button>
        </div>
      </Container>
    );
  }

  return (
    <Container size="2xl" className="space-y-10">
      {/* Client Greeting & Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#4EBA87]" />
          <span className="text-xs font-mono uppercase tracking-wider text-[#A6AAAC]">
            {data.customer.companyName || "Client Account"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F3]">
          Welcome, {data.customer.name}
        </h1>
        <p className="text-xs text-[#A6AAAC] leading-relaxed">
          Operational visibility into ongoing engineering deliverables, milestones, and account statements.
        </p>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
            Active Engagements
          </span>
          <div className="text-3xl font-bold font-mono text-[#F5F5F3]">
            {data.activeProjectsCount}
          </div>
          <p className="text-xs text-[#A6AAAC]">Projects currently in engineering lifecycle</p>
        </div>

        <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
            Total Engagements
          </span>
          <div className="text-3xl font-bold font-mono text-[#63C7D9]">
            {data.totalProjectsCount}
          </div>
          <p className="text-xs text-[#A6AAAC]">Total historical and current projects</p>
        </div>

        <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#6E7376]">
            Outstanding Invoices
          </span>
          <div className="text-3xl font-bold font-mono text-[#F5F5F3]">
            {data.outstandingInvoicesCount}
          </div>
          <p className="text-xs text-[#A6AAAC]">Invoices awaiting settlement</p>
        </div>
      </div>

      {/* Section 1: Active & Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#171A1C] pb-3">
          <h2 className="text-base font-semibold text-[#F5F5F3]">Engineering Projects</h2>
          <span className="text-xs font-mono text-[#6E7376]">
            {data.recentProjects.length} Engagements
          </span>
        </div>

        {data.recentProjects.length === 0 ? (
          <div className="p-12 text-center bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
            <div className="w-8 h-8 rounded-full border border-[#292D30] flex items-center justify-center text-[#6E7376] mx-auto font-mono text-xs">
              0
            </div>
            <h3 className="text-sm font-medium text-[#F5F5F3]">
              Your projects will appear here once your engagement begins
            </h3>
            <p className="text-xs text-[#A6AAAC] max-w-md mx-auto leading-relaxed">
              When Frontier Systems architects initialize your engagement workspace, milestone tracking, documentation, and deliverables will be displayed directly in this view.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.recentProjects.map((project) => (
              <div
                key={project.id}
                className="p-6 bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors rounded-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#63C7D9] bg-[#0B0D0E] border border-[#292D30] rounded-sm">
                      {project.status.replace("_", " ")}
                    </span>
                    <span className="text-[11px] font-mono text-[#6E7376]">
                      {new Date(project.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[#F5F5F3] tracking-tight">
                    {project.name}
                  </h3>

                  {project.summary && (
                    <p className="text-xs text-[#A6AAAC] line-clamp-2 leading-relaxed">
                      {project.summary}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-[#171A1C] flex items-center justify-between">
                  <span className="text-xs text-[#6E7376] font-mono">
                    {project.milestones?.length || 0} Milestones &bull; {project.documents?.length || 0} Docs
                  </span>
                  <Link
                    href={`/portal/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#63C7D9] hover:text-[#78D3E3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-0.5"
                  >
                    View Project Detail &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Recent Invoices */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#171A1C] pb-3">
          <h2 className="text-base font-semibold text-[#F5F5F3]">Recent Invoices</h2>
          <Link
            href="/portal/invoices"
            className="text-xs font-mono text-[#63C7D9] hover:underline"
          >
            View All Invoices &rarr;
          </Link>
        </div>

        {data.recentInvoices.length === 0 ? (
          <div className="p-8 text-center bg-[#111416] border border-[#292D30] rounded-sm text-xs text-[#A6AAAC]">
            No invoices have been issued to date.
          </div>
        ) : (
          <div className="overflow-x-auto border border-[#292D30] rounded-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B0D0E] text-[#A6AAAC] uppercase font-mono text-[10px] border-b border-[#292D30]">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171A1C] bg-[#111416]">
                {data.recentInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#171A1C]/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-[#F5F5F3]">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4 text-[#A6AAAC]">{inv.project.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-sm ${
                          inv.status === "PAID"
                            ? "bg-[#16382B] text-[#4EBA87] border border-[#1F4E3C]"
                            : inv.status === "OVERDUE"
                            ? "bg-[#2A1213] text-[#F87171] border border-[#521C1D]"
                            : "bg-[#111416] text-[#63C7D9] border border-[#292D30]"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#F5F5F3]">
                      {inv.currency} {parseFloat(inv.amountDue).toLocaleString("en-GB", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-4 text-[#A6AAAC]">
                      {new Date(inv.dueAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/portal/invoices/${inv.id}`}
                        className="text-xs text-[#63C7D9] hover:underline"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Container>
  );
}
