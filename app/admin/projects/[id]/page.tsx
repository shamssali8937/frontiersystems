import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProjectConsoleClient } from "./ProjectConsoleClient";

export const dynamic = "force-dynamic";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      inquiry: true,
      milestones: { orderBy: { createdAt: "asc" } },
      documents: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { issuedAt: "desc" } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[#6E7376]">
        <Link href="/admin/projects" className="hover:text-[#63C7D9]">
          &larr; Project Matrix
        </Link>
        <span>/</span>
        <span className="text-[#A6AAAC]">{project.name}</span>
      </div>

      {/* Interactive Project Console Client */}
      <ProjectConsoleClient
        project={JSON.parse(JSON.stringify(project))}
      />
    </div>
  );
}
