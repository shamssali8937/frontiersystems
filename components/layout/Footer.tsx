import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";

const SOLUTION_LINKS = [
  { label: "AI Systems & Automation", href: "/solutions/ai-automation" },
  { label: "Digital Products & Platforms", href: "/solutions/digital-products" },
  { label: "Enterprise Business Systems", href: "/solutions/business-systems" },
  { label: "Infrastructure & Security", href: "/solutions/infrastructure-security" },
];

const NAVIGATION_LINKS = [
  { label: "Solutions Overview", href: "/solutions" },
  { label: "Case Studies & Work", href: "/work" },
  { label: "About Frontier Systems", href: "/company" },
  { label: "Enterprise Inquiries", href: "/contact" },
  { label: "Client Login", href: "/portal/login" },
  { label: "Admin Console", href: "/admin/login" },
];

/**
 * Footer — Comprehensive semantic footer for Frontier Systems.
 *
 * Implements:
 * - Semantic <footer> element with role="contentinfo".
 * - Crawlable anchor navigation across solutions, company, and contact.
 * - Restrained engineering aesthetic without noisy gradients.
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="bg-[#0B0D0E] border-t border-[#292D30] text-[#A6AAAC] text-sm mt-auto"
    >
      <Container size="2xl" className="py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Column 1 & 2: Company Identity & Positioning */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" />

            <p className="text-[#A6AAAC] text-sm leading-relaxed max-w-sm">
              Premium B2B technology and AI systems engineering partner. Delivering
              high-assurance software architecture, automation platforms, and mission-critical
              digital infrastructure for global enterprises.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-[#A6AAAC]">
              <span className="inline-block w-2 h-2 rounded-full bg-[#4EBA87]" aria-hidden="true" />
              <span>Platform Engineering & Systems Active</span>
            </div>
          </div>

          {/* Column 3: Solutions */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F3]">
              Solutions
            </p>
            <nav aria-label="Solutions Navigation">
              <ul className="space-y-2.5">
                {SOLUTION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#A6AAAC] hover:text-[#F5F5F3] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 4: Navigation */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F3]">
              Organisation
            </p>
            <nav aria-label="Footer Organisation Navigation">
              <ul className="space-y-2.5">
                {NAVIGATION_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[#A6AAAC] hover:text-[#F5F5F3] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Column 5: Direct Contact & Office */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#F5F5F3]">
              Contact & Presence
            </p>
            <div className="space-y-2.5 text-sm text-[#A6AAAC]">
              <p>London, United Kingdom</p>
              <p className="font-mono text-xs text-[#6E7376]">B2B Technology Consultancy</p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#63C7D9] hover:text-[#78D3E3] underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
                >
                  Initiate Partnership Inquiry &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal & Copyright */}
        <div className="mt-16 pt-8 border-t border-[#171A1C] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E7376]">
          <p>
            &copy; {currentYear} Frontier Systems Ltd. All rights reserved. Registered in the United Kingdom.
          </p>

          <nav aria-label="Legal Navigation" className="flex flex-wrap items-center gap-6">
            <Link
              href="/privacy-policy"
              className="hover:text-[#A6AAAC] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookie-policy"
              className="hover:text-[#A6AAAC] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
            >
              Cookie Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#A6AAAC] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
            >
              Terms of Engagement
            </Link>
            <Link
              href="/security"
              className="hover:text-[#A6AAAC] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm"
            >
              Security Posture
            </Link>
            <Link
              href="/admin/login"
              className="hover:text-[#63C7D9] text-[#6E7376] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm font-mono text-[11px]"
            >
              Admin Access
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
