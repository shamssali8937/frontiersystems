"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface Milestone {
  id: string;
  title: string;
  description: string | null;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETE";
  dueDate: string | null;
  completedAt: string | null;
}

interface ProjectDoc {
  id: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: "ADMIN" | "CUSTOMER";
  createdAt: string;
}

interface ProjectData {
  id: string;
  name: string;
  status: string;
  summary: string | null;
  createdAt: string;
  customer: {
    name: string;
    companyName: string | null;
  };
  milestones: Milestone[];
  documents: ProjectDoc[];
}

export default function PortalProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // File Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/portal/projects/${id}`);
        if (!res.ok) {
          throw new Error("Project not found or unauthorized");
        }
        const json = await res.json();
        setProject(json.data.project);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading project");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  const handleDownloadDoc = async (docId: string, fileName: string) => {
    try {
      const res = await fetch(`/api/portal/projects/${id}/documents/${docId}/download`);
      if (!res.ok) {
        throw new Error("Could not generate secure download link");
      }
      const json = await res.json();
      if (json.data?.signedUrl) {
        window.open(json.data.signedUrl, "_blank", "noopener,noreferrer");
      }
    } catch {
      alert(`Unable to download ${fileName}. Please contact engineering support.`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side quick check
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File exceeds the 5MB enterprise upload size limit.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/portal/projects/${id}/upload`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok) {
        setUploadError(json.error?.message || "File upload failed.");
        return;
      }

      setUploadSuccess(`Successfully uploaded "${file.name}".`);
      // Add uploaded document to list
      if (json.data?.document) {
        setProject((prev) =>
          prev
            ? {
                ...prev,
                documents: [json.data.document, ...prev.documents],
              }
            : null,
        );
      }
      e.target.value = "";
    } catch {
      setUploadError("Network error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Container size="2xl" className="space-y-6">
        <div className="h-6 w-48 bg-[#171A1C] rounded animate-pulse" />
        <div className="h-10 w-96 bg-[#171A1C] rounded animate-pulse" />
        <div className="h-64 bg-[#111416] border border-[#292D30] rounded animate-pulse" />
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container size="2xl" className="py-12">
        <div className="p-8 bg-[#1A0D0E] border border-[#521C1D] text-center rounded-sm space-y-4">
          <p className="text-sm text-[#F87171]">{error || "Project not found or unauthorized"}</p>
          <Link
            href="/portal/dashboard"
            className="inline-block px-4 py-2 text-xs font-medium bg-[#F5F5F3] text-[#0B0D0E] rounded-sm hover:bg-white"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container size="2xl" className="space-y-10">
      {/* Breadcrumb & Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumbs" className="flex items-center gap-2 text-xs text-[#6E7376]">
          <Link href="/portal/dashboard" className="hover:text-[#A6AAAC] transition-colors">
            Portal Overview
          </Link>
          <span>/</span>
          <span className="text-[#A6AAAC]">Projects</span>
          <span>/</span>
          <span className="text-[#F5F5F3] font-mono text-[11px] truncate max-w-[200px]">
            {project.name}
          </span>
        </nav>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[#63C7D9] bg-[#111416] border border-[#292D30] rounded-sm">
                {project.status.replace("_", " ")}
              </span>
              <span className="text-xs font-mono text-[#6E7376]">
                Initiated {new Date(project.createdAt).toLocaleDateString("en-GB")}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#F5F5F3] mt-2">
              {project.name}
            </h1>
          </div>
        </div>

        {project.summary && (
          <p className="text-sm text-[#A6AAAC] leading-relaxed max-w-3xl pt-2">
            {project.summary}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols): Milestones Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-[#171A1C] pb-3">
            <h2 className="text-base font-semibold text-[#F5F5F3]">Milestone Timeline</h2>
            <span className="text-xs font-mono text-[#6E7376]">
              {project.milestones.length} Phases
            </span>
          </div>

          {project.milestones.length === 0 ? (
            <div className="p-8 text-center bg-[#111416] border border-[#292D30] rounded-sm text-xs text-[#A6AAAC]">
              Milestones for this engagement will be provisioned by your engineering lead.
            </div>
          ) : (
            <div className="space-y-4">
              {project.milestones.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-5 bg-[#111416] border border-[#292D30] rounded-sm flex items-start gap-4"
                >
                  <div className="flex flex-col items-center">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        m.status === "COMPLETE"
                          ? "bg-[#16382B] text-[#4EBA87] border border-[#1F4E3C]"
                          : m.status === "IN_PROGRESS"
                          ? "bg-[#111416] text-[#63C7D9] border border-[#63C7D9]"
                          : "bg-[#0B0D0E] text-[#6E7376] border border-[#292D30]"
                      }`}
                    >
                      {idx + 1}
                    </span>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[#F5F5F3]">{m.title}</h3>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                          m.status === "COMPLETE"
                            ? "bg-[#16382B] text-[#4EBA87]"
                            : m.status === "IN_PROGRESS"
                            ? "bg-[#0A262E] text-[#63C7D9]"
                            : "bg-[#0B0D0E] text-[#6E7376]"
                        }`}
                      >
                        {m.status.replace("_", " ")}
                      </span>
                    </div>

                    {m.description && (
                      <p className="text-xs text-[#A6AAAC] leading-relaxed pt-1">
                        {m.description}
                      </p>
                    )}

                    {m.dueDate && (
                      <div className="pt-2 text-[11px] font-mono text-[#6E7376]">
                        Target Completion: {new Date(m.dueDate).toLocaleDateString("en-GB")}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Documents & Client Upload */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-b border-[#171A1C] pb-3">
            <h2 className="text-base font-semibold text-[#F5F5F3]">Project Deliverables & Docs</h2>
          </div>

          {/* Client Document Upload Box */}
          <div className="p-5 bg-[#111416] border border-[#292D30] rounded-sm space-y-4">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#63C7D9]">
              Upload Specification / Document
            </h3>
            <p className="text-[11px] text-[#A6AAAC] leading-relaxed">
              Upload architecture briefs, datasets, or requirements (PDF, PNG, JPEG, WEBP; max 5MB).
            </p>

            {uploadError && (
              <div className="p-2.5 bg-[#1A0D0E] border border-[#521C1D] text-[#F87171] text-xs rounded-sm">
                {uploadError}
              </div>
            )}

            {uploadSuccess && (
              <div className="p-2.5 bg-[#16382B] border border-[#1F4E3C] text-[#4EBA87] text-xs rounded-sm">
                {uploadSuccess}
              </div>
            )}

            <label className="w-full flex items-center justify-center h-10 px-4 text-xs font-medium text-[#F5F5F3] bg-[#0B0D0E] border border-[#292D30] hover:border-[#3D4347] rounded-sm cursor-pointer transition-colors focus-within:ring-1 focus-within:ring-[#63C7D9]">
              <span>{uploading ? "Verifying & Uploading..." : "Choose File to Upload"}</span>
              <input
                type="file"
                disabled={uploading}
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                className="sr-only"
              />
            </label>
          </div>

          {/* Documents List */}
          <div className="space-y-3">
            {project.documents.length === 0 ? (
              <div className="p-6 text-center bg-[#111416] border border-[#292D30] rounded-sm text-xs text-[#A6AAAC]">
                No files registered for this project yet.
              </div>
            ) : (
              project.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 bg-[#111416] border border-[#292D30] hover:border-[#3D4347] transition-colors rounded-sm flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs font-medium text-[#F5F5F3] truncate" title={doc.fileName}>
                      {doc.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-[#6E7376]">
                      <span>{(doc.fileSize / 1024).toFixed(0)} KB</span>
                      <span>&bull;</span>
                      <span className="uppercase">{doc.uploadedBy}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadDoc(doc.id, doc.fileName)}
                    className="px-2.5 py-1 text-[11px] font-mono text-[#63C7D9] hover:text-white border border-[#292D30] hover:border-[#63C7D9] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                    aria-label={`Download ${doc.fileName}`}
                  >
                    Download
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
