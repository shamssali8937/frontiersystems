import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ConvertInquiryButton } from "./ConvertInquiryButton";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [
    inquiriesCount,
    wonCount,
    customersCount,
    projectsCount,
    invoicesData,
    recentInquiries,
    recentProjects,
  ] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { status: "WON" } }),
    prisma.customer.count(),
    prisma.project.count(),
    prisma.invoice.aggregate({
      _sum: { amountDue: true },
      where: { status: "PAID" },
    }),
    prisma.inquiry.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        projects: { select: { id: true, name: true } },
      },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { name: true, email: true } },
        _count: { select: { milestones: true, invoices: true } },
      },
    }),
  ]);

  const totalPaid = invoicesData._sum.amountDue
    ? Number(invoicesData._sum.amountDue).toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";

  return (
    <div className="space-y-10">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#292D30] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#63C7D9] animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-[#63C7D9] uppercase">
              OPERATIONS DESK // ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F5F5F3] pt-1">
            Command Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/customers"
            className="px-4 py-2 bg-[#171A1C] border border-[#292D30] hover:border-[#3D4347] text-xs font-mono text-[#F5F5F3] rounded-xs transition-colors"
          >
            + NEW CUSTOMER
          </Link>
          <Link
            href="/admin/projects"
            className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-xs font-mono font-semibold text-[#0B0D0E] rounded-xs transition-colors"
          >
            + NEW PROJECT
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-sm bg-[#111416] border border-[#292D30]">
          <div className="text-[10px] font-mono text-[#6E7376] uppercase tracking-wider">
            Total Inquiries
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3] mt-2">
            {inquiriesCount}
          </div>
          <div className="text-[11px] font-mono text-[#63C7D9] mt-1">
            {wonCount} Won ({inquiriesCount > 0 ? Math.round((wonCount / inquiriesCount) * 100) : 0}%)
          </div>
        </div>

        <div className="p-5 rounded-sm bg-[#111416] border border-[#292D30]">
          <div className="text-[10px] font-mono text-[#6E7376] uppercase tracking-wider">
            Active Customers
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3] mt-2">
            {customersCount}
          </div>
          <div className="text-[11px] font-mono text-[#4EBA87] mt-1">
            Registered CRM
          </div>
        </div>

        <div className="p-5 rounded-sm bg-[#111416] border border-[#292D30]">
          <div className="text-[10px] font-mono text-[#6E7376] uppercase tracking-wider">
            Active Projects
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#F5F5F3] mt-2">
            {projectsCount}
          </div>
          <div className="text-[11px] font-mono text-[#63C7D9] mt-1">
            In Delivery / Ops
          </div>
        </div>

        <div className="p-5 rounded-sm bg-[#111416] border border-[#292D30] col-span-2 lg:col-span-2">
          <div className="text-[10px] font-mono text-[#6E7376] uppercase tracking-wider">
            Settled Revenue (GBP)
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#4EBA87] mt-2">
            £{totalPaid}
          </div>
          <div className="text-[11px] font-mono text-[#6E7376] mt-1">
            Verified Paid Invoices
          </div>
        </div>
      </div>

      {/* Two-Column Matrix: Recent Inquiries & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Inquiries with Convert Action */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
            <h2 className="text-sm font-mono font-semibold tracking-wider text-[#F5F5F3] uppercase">
              Recent Lead Inquiries
            </h2>
            <span className="text-xs font-mono text-[#6E7376]">
              {recentInquiries.length} recent
            </span>
          </div>

          <div className="space-y-3">
            {recentInquiries.map((inquiry) => {
              const isConverted = inquiry.projects.length > 0;
              return (
                <div
                  key={inquiry.id}
                  className="p-4 rounded-sm bg-[#111416] border border-[#292D30] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#3D4347] transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-[#F5F5F3]">
                        {inquiry.name}
                      </span>
                      {inquiry.company && (
                        <span className="text-xs text-[#6E7376]">
                          ({inquiry.company})
                        </span>
                      )}
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded-xs uppercase ${
                          inquiry.status === "WON"
                            ? "bg-[#4EBA87]/15 text-[#4EBA87] border border-[#4EBA87]/30"
                            : inquiry.status === "QUALIFIED"
                            ? "bg-[#63C7D9]/15 text-[#63C7D9] border border-[#63C7D9]/30"
                            : "bg-[#171A1C] text-[#A6AAAC] border border-[#292D30]"
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-[#6E7376]">
                      {inquiry.email} &bull; {inquiry.service || "General Systems"} &bull;{" "}
                      {inquiry.budget || "Open Budget"}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {isConverted ? (
                      <Link
                        href={`/admin/projects/${inquiry.projects[0]?.id}`}
                        className="text-[11px] font-mono text-[#4EBA87] hover:underline"
                      >
                        Project &rarr;
                      </Link>
                    ) : (
                      <ConvertInquiryButton
                        inquiryId={inquiry.id}
                        inquiryName={inquiry.name}
                        company={inquiry.company}
                        service={inquiry.service}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Projects Ledger */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
            <h2 className="text-sm font-mono font-semibold tracking-wider text-[#F5F5F3] uppercase">
              Active Project Matrix
            </h2>
            <Link
              href="/admin/projects"
              className="text-xs font-mono text-[#63C7D9] hover:underline"
            >
              View All &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentProjects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="block p-4 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#63C7D9] transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#F5F5F3] truncate max-w-[200px]">
                    {project.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-xs bg-[#171A1C] text-[#63C7D9] border border-[#292D30] uppercase">
                    {project.status}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-[#6E7376]">
                  Client: {project.customer.name}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#A6AAAC] pt-1 border-t border-[#171A1C]">
                  <span>{project._count.milestones} Milestones</span>
                  <span>{project._count.invoices} Invoices</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
