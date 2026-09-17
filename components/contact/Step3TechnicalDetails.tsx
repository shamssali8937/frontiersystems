"use client";

import { useState, useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { ContactFormValues, AttachedFileMetadata } from "@/lib/validation/contact-form.schema";
import { Heading } from "@/components/ui/Heading";

interface Step3TechnicalDetailsProps {
  form: UseFormReturn<ContactFormValues>;
}

const ALLOWED_EXTENSIONS = [".pdf", ".png", ".jpg", ".jpeg", ".webp"];
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function Step3TechnicalDetails({ form }: Step3TechnicalDetailsProps) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = form;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const attachedFiles = watch("attachedFiles") || [];
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);

    // Client-side pre-validation
    const extension = `.${file.name.split(".").pop()?.toLowerCase()}`;
    if (!ALLOWED_EXTENSIONS.includes(extension) || !ALLOWED_MIME_TYPES.includes(file.type)) {
      setUploadError(
        `Invalid file type. Allowed formats: ${ALLOWED_EXTENSIONS.join(", ")}`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setUploadError("File exceeds maximum permitted size of 5 MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "File upload rejected by security gateway.");
      }

      const uploadResult = json.data as {
        id: string;
        sanitizedFilename: string;
        sizeBytes: number;
        mimeType: string;
      };

      const newFile: AttachedFileMetadata = {
        id: uploadResult.id,
        name: uploadResult.sanitizedFilename || file.name,
        size: uploadResult.sizeBytes || file.size,
        type: uploadResult.mimeType || file.type,
      };

      setValue("attachedFiles", [...attachedFiles, newFile], {
        shouldDirty: true,
      });
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Secure file upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const updated = attachedFiles.filter((f) => f.id !== fileId);
    setValue("attachedFiles", updated, { shouldDirty: true });
  };

  return (
    <div className="space-y-8">
      <div>
        <Heading as="h2" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3]">
          Technical Scope & Architecture Specifications
        </Heading>
        <p className="mt-1 text-sm text-[#A6AAAC]">
          Describe your system requirements, performance constraints, and optionally attach architectural briefs or RFPs.
        </p>
      </div>

      {/* Technical Details Input */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="tech-details-field" className="block text-sm font-medium text-[#F5F5F3]">
            Technical Context & Requirements <span className="text-[#63C7D9]">*</span>
          </label>
          <span className="text-xs font-mono text-[#6E7376]">
            MIN 10 CHARS
          </span>
        </div>

        <textarea
          id="tech-details-field"
          rows={5}
          placeholder="Outline your target architecture, existing tech stack, concurrency requirements, security standards, or integration dependencies..."
          aria-invalid={Boolean(errors.technicalDetails)}
          aria-describedby={errors.technicalDetails ? "tech-details-error" : undefined}
          {...register("technicalDetails")}
          className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus:outline-none focus:border-[#63C7D9] focus:ring-1 focus:ring-[#63C7D9] transition-colors leading-relaxed resize-y"
        />

        {errors.technicalDetails && (
          <p id="tech-details-error" role="alert" className="text-xs text-[#E85D5D] font-mono">
            {errors.technicalDetails.message}
          </p>
        )}
      </div>

      {/* Secure File/Specification Upload Section */}
      <div className="space-y-4 pt-4 border-t border-[#171A1C]">
        <div>
          <label className="block text-sm font-medium text-[#F5F5F3]">
            Secure Specification & RFP Upload
          </label>
          <p className="text-xs text-[#A6AAAC] mt-1 leading-relaxed">
            Attach relevant technical briefs, system architecture diagrams, or RFP documents. Files are validated through binary magic-byte inspection and stored under zero-trust encryption.
          </p>
        </div>

        {/* Upload Constraints Bar */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-mono text-[#6E7376] bg-[#0B0D0E] p-3 rounded-sm border border-[#171A1C]">
          <div>
            <span className="text-[#A6AAAC]">ALLOWED FORMATS:</span> PDF, PNG, JPG, WEBP
          </div>
          <div>
            <span className="text-[#A6AAAC]">MAXIMUM SIZE:</span> 5 MB
          </div>
          <div>
            <span className="text-[#4EBA87]">ENCRYPTION:</span> AES-256 / SHA-256
          </div>
        </div>

        {/* Upload Action Trigger */}
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            id="file-upload-input"
            accept=".pdf,.png,.jpg,.jpeg,.webp"
            onChange={handleFileSelection}
            disabled={uploading}
            className="sr-only"
          />
          <label
            htmlFor="file-upload-input"
            className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-sm text-xs font-mono font-medium transition-all cursor-pointer ${
              uploading
                ? "bg-[#171A1C] text-[#6E7376] border border-[#292D30] cursor-not-allowed"
                : "bg-[#171A1C] hover:bg-[#1E2225] text-[#63C7D9] border border-[#292D30] hover:border-[#63C7D9]"
            } focus-within:ring-2 focus-within:ring-[#63C7D9]`}
          >
            {uploading ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-[#63C7D9] border-t-transparent rounded-full animate-spin" />
                <span>UPLOADING & INSPECTING...</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">+</span>
                <span>ATTACH SPECIFICATION FILE</span>
              </>
            )}
          </label>
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <p role="alert" className="text-xs text-[#E85D5D] font-mono">
            {uploadError}
          </p>
        )}

        {/* Attached Files List with Remove Functionality */}
        {attachedFiles.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-xs font-mono text-[#A6AAAC] uppercase tracking-wider">
              Attached Artifacts ({attachedFiles.length})
            </div>
            <ul className="space-y-2" role="list">
              {attachedFiles.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between p-3 rounded-sm bg-[#111416] border border-[#292D30] text-xs font-mono"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-[#63C7D9]">DOC</span>
                    <span className="text-[#F5F5F3] truncate max-w-xs sm:max-w-md">
                      {file.name}
                    </span>
                    <span className="text-[#6E7376]">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    aria-label={`Remove attached file ${file.name}`}
                    className="text-[#E85D5D] hover:text-[#FF8080] ml-3 transition-colors underline hover:no-underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E85D5D]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
