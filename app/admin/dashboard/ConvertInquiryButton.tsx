"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ConvertInquiryButtonProps {
  inquiryId: string;
  inquiryName: string;
  company?: string | null;
  service?: string | null;
}

export function ConvertInquiryButton({
  inquiryId,
  inquiryName,
  company,
  service,
}: ConvertInquiryButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    const confirmMessage = `Convert inquiry from "${inquiryName}" into an active client project?`;
    if (!window.confirm(confirmMessage)) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/inquiries/${inquiryId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: `${company || inquiryName} — ${service || "Systems Architecture"}`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to convert inquiry to project");
        setLoading(false);
        return;
      }

      // Navigate directly to the newly created project
      router.push(`/admin/projects/${data.data.project.id}`);
      router.refresh();
    } catch {
      setError("Network failure during conversion");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleConvert}
        disabled={loading}
        className="px-2.5 py-1 text-[10px] font-mono font-medium rounded-xs bg-[#171A1C] hover:bg-[#63C7D9] hover:text-[#0B0D0E] text-[#63C7D9] border border-[#292D30] hover:border-[#63C7D9] transition-colors disabled:opacity-50"
      >
        {loading ? "CONVERTING..." : "CONVERT TO PROJECT &rarr;"}
      </button>
      {error && <span className="text-[10px] text-[#FF6B6B] font-mono">{error}</span>}
    </div>
  );
}
