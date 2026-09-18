import Link from "next/link";
import { Heading } from "@/components/ui/Heading";

interface InquirySuccessStateProps {
  referenceId: string;
  onReset: () => void;
}

export function InquirySuccessState({
  referenceId,
  onReset,
}: InquirySuccessStateProps) {
  return (
    <div className="p-8 sm:p-12 rounded-sm bg-[#111416] border border-[#292D30] text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 mx-auto rounded-full bg-[#4EBA87]/10 border border-[#4EBA87]/30 flex items-center justify-center text-[#4EBA87]">
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <div className="text-xs font-mono text-[#63C7D9] tracking-wider uppercase">
          TRANSMISSION CONFIRMED // SLA ACTIVE
        </div>
        <Heading as="h2" variant="h2" className="text-2xl sm:text-3xl font-semibold text-[#F5F5F3]">
          Inquiry Successfully Dispatched
        </Heading>
        <p className="text-sm text-[#A6AAAC] leading-relaxed">
          Your architecture consultation inquiry has been securely queued in our systems.
          Our London engineering leadership reviews all technical briefs within one business day (24–48 hours) under standard bilateral non-disclosure terms.
        </p>
      </div>

      <div className="inline-flex items-center gap-3 px-4 py-2 rounded-sm bg-[#0B0D0E] border border-[#171A1C] text-xs font-mono text-[#A6AAAC]">
        <span>INQUIRY REF:</span>
        <span className="text-[#63C7D9] font-bold">{referenceId}</span>
      </div>

      <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onReset}
          className="px-6 py-2.5 rounded-sm bg-[#171A1C] hover:bg-[#1E2225] border border-[#292D30] text-xs font-mono text-[#F5F5F3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
        >
          SUBMIT ANOTHER INQUIRY
        </button>
        <Link
          href="/solutions"
          className="px-6 py-2.5 rounded-sm bg-[#63C7D9] hover:bg-[#78D3E3] text-xs font-mono text-[#0B0D0E] font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
        >
          EXPLORE CAPABILITY MATRIX &rarr;
        </Link>
      </div>
    </div>
  );
}
