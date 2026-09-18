import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CreateProjectModal } from "./CreateProjectModal";
import type { ProjectStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

interface ProjectsPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminProjectsPage({ searchParams }: ProjectsPageProps) {
  const { status, search } = await searchParams;

  const where = {
    ...(status && status !== "ALL" ? { status: status as ProjectStatus } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { summary: { contains: search, mode: "insensitive" as const } },
            { customer: { name: { contains: search, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [projects, customers] = await Promise.all([
    prisma.project.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, email: true, companyName: true } },
        inquiry: { select: { id: true, service: true, status: true } },
        _count: { select: { milestones: true, documents: true, invoices: true } },
      },
    }),
    prisma.customer.findMany({
      select: { id: true, name: true, email: true, companyName: true },
      orderBy: { name: "asc" },
    }),
  ]);

  const statuses = [
    "ALL",
    "ONBOARDING",
    "IN_PROGRESS",
    "REVIEW",
    "DELIVERED",
    "MAINTENANCE",
    "ARCHIVED",
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292D30] pb-6">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#63C7D9] uppercase">
            OPERATIONS & ARCHITECTURAL DELIVERY
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3] pt-1">
            Projects Matrix
          </h1>
        </div>

        <CreateProjectModal customers={customers} />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#292D30] pb-3 text-xs font-mono">
        {statuses.map((s) => {
          const isActive = (!status && s === "ALL") || status === s;
          return (
            <Link
              key={s}
              href={`/admin/projects${s === "ALL" ? "" : `?status=${s}`}`}
              className={`px-3 py-1.5 rounded-xs transition-colors ${
                isActive
                  ? "bg-[#63C7D9] text-[#0B0D0E] font-semibold"
                  : "bg-[#111416] text-[#A6AAAC] hover:text-[#F5F5F3] border border-[#292D30]"
              }`}
            >
              {s}
            </Link>
          );
        })}
      </div>

      {/* Projects Table */}
      <div className="rounded-sm border border-[#292D30] bg-[#111416] overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-[#171A1C] border-b border-[#292D30] text-[#A6AAAC] uppercase">
            <tr>
              <th className="py-3 px-4">Project Name</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Milestones</th>
              <th className="py-3 px-4 text-center">Docs</th>
              <th className="py-3 px-4 text-center">Invoices</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#292D30] text-[#F5F5F3]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-[#6E7376]">
                  No project records matching the active filter.
                </td>
              </tr>
            ) : (
              projects.map((p) => (
                <tr key={p.id} className="hover:bg-[#171A1C]/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-[#F5F5F3]">
                    <div>{p.name}</div>
                    {p.inquiry && (
                      <div className="text-[10px] text-[#63C7D9]">
                        Origin: Inquiry {p.inquiry.id}
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-[#A6AAAC]">
                    <div>{p.customer.name}</div>
                    <div className="text-[10px] text-[#6E7376]">{p.customer.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[9px] font-mono px-2 py-0.5 rounded-xs uppercase ${
                        p.status === "DELIVERED"
                          ? "bg-[#4EBA87]/15 text-[#4EBA87] border border-[#4EBA87]/30"
                          : p.status === "IN_PROGRESS"
                          ? "bg-[#63C7D9]/15 text-[#63C7D9] border border-[#63C7D9]/30"
                          : "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#A6AAAC]">
                    {p._count.milestones}
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#A6AAAC]">
                    {p._count.documents}
                  </td>
                  <td className="py-3.5 px-4 text-center text-[#A6AAAC]">
                    {p._count.invoices}
                  </td>
                  <td className="py-3.5 px-4 text-[#6E7376]">
                    {new Date(p.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/projects/${p.id}`}
                      className="text-[#63C7D9] hover:underline"
                    >
                      Manage &rarr;
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
