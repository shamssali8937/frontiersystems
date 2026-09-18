import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { milestones: true, documents: true, invoices: true } },
        },
      },
    },
  });

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#6E7376]">
        <Link href="/admin/customers" className="hover:text-[#63C7D9]">
          &larr; Customer Directory
        </Link>
        <span>/</span>
        <span className="text-[#A6AAAC]">{customer.name}</span>
      </div>

      {/* Customer Header */}
      <div className="p-6 rounded-sm bg-[#111416] border border-[#292D30] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-[#63C7D9]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#63C7D9]" />
            <span>ID: {customer.id}</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F5F3]">{customer.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#A6AAAC]">
            <span>Email: <strong className="text-[#F5F5F3]">{customer.email}</strong></span>
            <span>&bull;</span>
            <span>Organization: <strong className="text-[#F5F5F3]">{customer.companyName || "Independent"}</strong></span>
            <span>&bull;</span>
            <span>Registered: {new Date(customer.createdAt).toLocaleDateString("en-GB")}</span>
          </div>
        </div>

        <Link
          href={`/admin/projects?createFor=${customer.id}`}
          className="px-4 py-2 bg-[#63C7D9] hover:bg-[#78D3E3] text-xs font-mono font-semibold text-[#0B0D0E] rounded-xs transition-colors shrink-0"
        >
          + CREATE PROJECT FOR CLIENT
        </Link>
      </div>

      {/* Associated Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#292D30] pb-3">
          <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-[#F5F5F3]">
            Associated Client Projects ({customer.projects.length})
          </h2>
        </div>

        {customer.projects.length === 0 ? (
          <div className="p-8 rounded-sm bg-[#111416] border border-[#292D30] text-center text-xs font-mono text-[#6E7376]">
            No active or archived projects associated with this customer record.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.projects.map((project) => (
              <Link
                key={project.id}
                href={`/admin/projects/${project.id}`}
                className="p-5 rounded-sm bg-[#111416] border border-[#292D30] hover:border-[#63C7D9] transition-colors space-y-3 block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-[#F5F5F3]">{project.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#171A1C] text-[#63C7D9] border border-[#292D30] uppercase">
                    {project.status}
                  </span>
                </div>

                <p className="text-xs text-[#A6AAAC] line-clamp-2 leading-relaxed">
                  {project.summary || "No architectural summary recorded."}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-[#6E7376] pt-2 border-t border-[#171A1C]">
                  <span>{project._count.milestones} Milestones</span>
                  <span>{project._count.documents} Documents</span>
                  <span>{project._count.invoices} Invoices</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
