"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactFormSchema,
  ContactFormValues,
  DEFAULT_FORM_VALUES,
} from "@/lib/validation/contact-form.schema";
import { InquiryFormProgress } from "./InquiryFormProgress";
import { Step1Goal } from "./Step1Goal";
import { Step2TimelineBudget } from "./Step2TimelineBudget";
import { Step3TechnicalDetails } from "./Step3TechnicalDetails";
import { Step4ContactInfo } from "./Step4ContactInfo";
import { InquirySuccessState } from "./InquirySuccessState";

const STEP_LABELS = [
  "Goal Selection",
  "Timeline & Budget",
  "Technical Scope",
  "Contact Info",
];
const TOTAL_STEPS = 4;
const STORAGE_KEY = "frontier_contact_inquiry_state";

export function ContactForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [successReferenceId, setSuccessReferenceId] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onTouched",
  });

  // Load saved state from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.values) {
          form.reset(parsed.values);
        }
        if (typeof parsed.step === "number" && parsed.step >= 1 && parsed.step <= 4) {
          setCurrentStep(parsed.step);
        }
      }
    } catch {
      // Ignore parse/storage errors
    }
  }, [form]);

  // Save changes to sessionStorage to survive page refresh
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step: currentStep,
            values,
          }),
        );
      } catch {
        // Storage full or unavailable
      }
    });
    return () => subscription.unsubscribe();
  }, [form, currentStep]);

  /** Step validation before allowing forward progression */
  const handleNext = async () => {
    setSubmissionError(null);
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger(["goal"]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(["timeline", "budget"]);
    } else if (currentStep === 3) {
      isValid = await form.trigger(["technicalDetails"]);
    }

    if (isValid && currentStep < TOTAL_STEPS) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step: nextStep,
            values: form.getValues(),
          }),
        );
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      try {
        sessionStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            step: prevStep,
            values: form.getValues(),
          }),
        );
      } catch {
        // Ignore
      }
      window.scrollTo({ top: 100, behavior: "smooth" });
    }
  };

  const onSubmit = async (data: ContactFormValues) => {
    setSubmissionError(null);
    setIsSubmitting(true);

    try {
      // Format technical details with structured metadata for the backend message field
      const attachmentsSummary = data.attachedFiles?.length
        ? `\n\n[Attached Specifications (${data.attachedFiles.length}): ${data.attachedFiles.map((f) => `${f.name} (${f.id})`).join(", ")}]`
        : "";

      const formattedMessage = `[Engagement Goal: ${data.goal}]\n[Target Timeline: ${data.timeline}]\n[Budget Allocation: ${data.budget}]${attachmentsSummary}\n\n[Technical Requirements]:\n${data.technicalDetails}`;

      const payload = {
        name: data.name,
        email: data.email,
        company: data.company || undefined,
        phone: data.phone || undefined,
        service: data.goal,
        budget: data.budget,
        message: formattedMessage,
      };

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        const errorMsg =
          json.error?.message ||
          (json.error?.details?.[0]?.message ?? "Submission rejected by server validation.");
        throw new Error(errorMsg);
      }

      const refId = json.data?.id || `FS-${Date.now().toString(36).toUpperCase()}`;
      setSuccessReferenceId(refId);

      // Clear persisted state on successful submission
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore
      }
    } catch (err) {
      setSubmissionError(
        err instanceof Error ? err.message : "An unexpected communication error occurred. Please retry or contact us directly.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset(DEFAULT_FORM_VALUES);
    setCurrentStep(1);
    setSuccessReferenceId(null);
    setSubmissionError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  if (successReferenceId) {
    return (
      <InquirySuccessState
        referenceId={successReferenceId}
        onReset={handleReset}
      />
    );
  }

  return (
    <div className="p-6 sm:p-8 lg:p-10 rounded-sm bg-[#111416] border border-[#292D30]">
      {/* Progress Bar */}
      <InquiryFormProgress
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabels={STEP_LABELS}
      />

      {/* Submission Error Banner */}
      {submissionError && (
        <div
          role="alert"
          className="mb-8 p-4 rounded-sm bg-[#E85D5D]/10 border border-[#E85D5D]/30 text-xs font-mono text-[#E85D5D] space-y-1"
        >
          <div className="font-semibold uppercase tracking-wider">
            SUBMISSION REJECTED:
          </div>
          <div>{submissionError}</div>
        </div>
      )}

      {/* Progressive Form Steps */}
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
        {currentStep === 1 && <Step1Goal form={form} />}
        {currentStep === 2 && <Step2TimelineBudget form={form} />}
        {currentStep === 3 && <Step3TechnicalDetails form={form} />}
        {currentStep === 4 && <Step4ContactInfo form={form} />}

        {/* Navigation Actions Bar */}
        <div className="mt-10 pt-6 border-t border-[#171A1C] flex items-center justify-between gap-4">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-sm bg-[#171A1C] hover:bg-[#1E2225] border border-[#292D30] text-xs font-mono text-[#F5F5F3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] disabled:opacity-50"
              >
                &larr; BACK
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-sm bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] text-xs font-mono text-[#0B0D0E] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              >
                NEXT STEP &rarr;
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-7 py-3 rounded-sm bg-[#63C7D9] hover:bg-[#78D3E3] active:bg-[#52B8CA] text-xs font-mono text-[#0B0D0E] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] disabled:opacity-60 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#0B0D0E] border-t-transparent rounded-full animate-spin" />
                    <span>TRANSMITTING INQUIRY...</span>
                  </>
                ) : (
                  <span>DISPATCH CONSULTATION INQUIRY &rarr;</span>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
