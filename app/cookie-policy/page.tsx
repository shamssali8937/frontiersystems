import type { Metadata } from "next";
import Link from "next/link";
import { createMetadata } from "@/lib/seo";
import { PageContainer } from "@/components/layout";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";

export const metadata: Metadata = createMetadata({
  title: "Cookie Policy",
  description: "Frontier Systems cookie disclosure and technical storage policy.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <PageContainer>
      <section className="py-20 lg:py-28">
        <Container size="xl">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-4">
              <Badge variant="neutral">Legal &amp; Regulatory Compliance</Badge>
              <Heading as="h1" variant="display" className="text-3xl sm:text-4xl text-[#F5F5F3]">
                Cookie &amp; Technical Storage Policy
              </Heading>
              <p className="text-sm font-mono text-[#6E7376]">
                Last Updated: September 2026 &bull; Frontier Systems Ltd
              </p>
            </div>

            <div className="space-y-8 text-sm text-[#A6AAAC] leading-relaxed">
              <p>
                This Cookie Policy explains how Frontier Systems Ltd uses cookies, local browser storage, and related web technologies on our public website and authenticated portals.
              </p>

              {/* Section 1: Strictly Essential Cookies */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-[#F5F5F3]">
                    1. Strictly Essential Cookies (No Consent Required)
                  </h2>
                  <p className="text-xs text-[#A6AAAC]">
                    These cookies are strictly necessary to provide core authentication, secure session routing, and platform integrity. Under the Privacy and Electronic Communications Regulations (PECR) and UK GDPR, strictly necessary cookies do not require prior consent.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B0D0E] text-[#A6AAAC] font-mono text-[10px] uppercase border-b border-[#292D30]">
                      <tr>
                        <th className="py-2.5 px-3">Cookie Name</th>
                        <th className="py-2.5 px-3">Domain / Scope</th>
                        <th className="py-2.5 px-3">Purpose</th>
                        <th className="py-2.5 px-3">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#171A1C] font-mono text-[11px]">
                      <tr>
                        <td className="py-2.5 px-3 text-[#63C7D9]">fs_customer_session</td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">/portal/*</td>
                        <td className="py-2.5 px-3 text-[#F5F5F3] font-sans">
                          Cryptographically signed customer session token (httpOnly, secure, SameSite=lax).
                        </td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">24 hours</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#63C7D9]">fs_admin_session</td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">/admin/*</td>
                        <td className="py-2.5 px-3 text-[#F5F5F3] font-sans">
                          Cryptographically signed engineering administrator session token.
                        </td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">8 hours</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-3 text-[#63C7D9]">fs_cookie_consent</td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">Site-wide</td>
                        <td className="py-2.5 px-3 text-[#F5F5F3] font-sans">
                          Remembers whether you have acknowledged the compliance notice.
                        </td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 2: Non-Essential & Performance Analytics */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-semibold text-[#F5F5F3]">
                    2. Optional Analytics &amp; Performance Cookies
                  </h2>
                  <p className="text-xs text-[#A6AAAC]">
                    Where analytics (such as privacy-configured Google Analytics) is configured, it is utilized solely to evaluate aggregate page performance, server response latency, and general navigation flow. We do not sell analytics data or use tracking cookies for behavioral advertising.
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0B0D0E] text-[#A6AAAC] font-mono text-[10px] uppercase border-b border-[#292D30]">
                      <tr>
                        <th className="py-2.5 px-3">Cookie Name</th>
                        <th className="py-2.5 px-3">Provider</th>
                        <th className="py-2.5 px-3">Purpose</th>
                        <th className="py-2.5 px-3">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#171A1C] font-mono text-[11px]">
                      <tr>
                        <td className="py-2.5 px-3 text-[#F5F5F3]">_ga, _ga_*</td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">Google Analytics</td>
                        <td className="py-2.5 px-3 text-[#A6AAAC] font-sans">
                          Measures aggregated site visitation and page latency metrics.
                        </td>
                        <td className="py-2.5 px-3 text-[#A6AAAC]">Up to 2 years</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Browser Management */}
              <div className="p-6 bg-[#111416] border border-[#292D30] rounded-sm space-y-3">
                <h2 className="text-base font-semibold text-[#F5F5F3]">
                  3. Managing and Disabling Cookies
                </h2>
                <p>
                  Most web browsers allow you to modify cookie preferences or delete stored cookies through their settings:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs text-[#A6AAAC]">
                  <li>To block or delete cookies in Chrome: Settings &rarr; Privacy and security &rarr; Third-party cookies.</li>
                  <li>To block or delete cookies in Firefox: Settings &rarr; Privacy &amp; Security &rarr; Cookies and Site Data.</li>
                  <li>To block or delete cookies in Safari: Preferences &rarr; Privacy.</li>
                </ul>
                <p className="text-xs text-[#6E7376] pt-1">
                  Note: Disabling strictly essential cookies will prevent successful login to both the Client Portal and Administrator endpoints.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between text-xs text-[#6E7376] border-t border-[#171A1C]">
                <Link href="/privacy-policy" className="text-[#63C7D9] hover:underline">
                  View Privacy Policy &rarr;
                </Link>
                <Link href="/terms" className="text-[#63C7D9] hover:underline">
                  View Terms of Engagement &rarr;
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </PageContainer>
  );
}
