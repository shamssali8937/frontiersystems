import { UseFormReturn } from "react-hook-form";
import { ContactFormValues } from "@/lib/validation/contact-form.schema";
import { Heading } from "@/components/ui/Heading";

interface Step4ContactInfoProps {
  form: UseFormReturn<ContactFormValues>;
}

export function Step4ContactInfo({ form }: Step4ContactInfoProps) {
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <div className="space-y-8">
      <div>
        <Heading as="h2" variant="h2" className="text-xl sm:text-2xl font-semibold text-[#F5F5F3]">
          Contact & Representation Details
        </Heading>
        <p className="mt-1 text-sm text-[#A6AAAC]">
          Provide your enterprise contact details for bilateral non-disclosure confirmation and technical follow-up.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="space-y-2">
          <label htmlFor="name-field" className="block text-sm font-medium text-[#F5F5F3]">
            Full Name <span className="text-[#63C7D9]">*</span>
          </label>
          <input
            id="name-field"
            type="text"
            placeholder="e.g. Dr. Jane Holloway"
            autoComplete="name"
            aria-required="true"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
            className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] transition-colors"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-[#E85D5D] font-mono flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0 text-[#E85D5D]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{errors.name.message}</span>
            </p>
          )}
        </div>

        {/* Work Email */}
        <div className="space-y-2">
          <label htmlFor="email-field" className="block text-sm font-medium text-[#F5F5F3]">
            Work Email Address <span className="text-[#63C7D9]">*</span>
          </label>
          <input
            id="email-field"
            type="email"
            placeholder="e.g. jane@organization.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
            className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] transition-colors"
          />
          {errors.email && (
            <p id="email-error" role="alert" className="text-xs text-[#E85D5D] font-mono flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0 text-[#E85D5D]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <span>{errors.email.message}</span>
            </p>
          )}
        </div>

        {/* Company / Organization (Optional) */}
        <div className="space-y-2">
          <label htmlFor="company-field" className="block text-sm font-medium text-[#F5F5F3]">
            Company / Organization <span className="text-xs text-[#6E7376]">(Optional)</span>
          </label>
          <input
            id="company-field"
            type="text"
            placeholder="e.g. Acme Aerospace Ltd."
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            {...register("company")}
            className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] transition-colors"
          />
        </div>

        {/* Phone (Optional) */}
        <div className="space-y-2">
          <label htmlFor="phone-field" className="block text-sm font-medium text-[#F5F5F3]">
            Direct Phone <span className="text-xs text-[#6E7376]">(Optional)</span>
          </label>
          <input
            id="phone-field"
            type="tel"
            placeholder="e.g. +44 20 7946 0912"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
            className="w-full px-4 py-3 rounded-sm bg-[#111416] border border-[#292D30] text-[#F5F5F3] placeholder-[#6E7376] text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] transition-colors"
          />
        </div>
      </div>

      <div className="p-4 rounded-sm bg-[#0B0D0E] border border-[#292D30] flex items-center justify-between text-xs text-[#A6AAAC]">
        <span>Strict Bilateral NDA Enforced</span>
        <span className="font-mono text-[#63C7D9]">256-BIT ENCRYPTION</span>
      </div>
    </div>
  );
}
