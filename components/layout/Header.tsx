"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Logo } from "@/components/ui/Logo";

interface NavItem {
  label: string;
  href: string;
}

interface ServiceItem {
  title: string;
  badge: string;
  description: string;
  href: string;
}

const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { label: "Work", href: "/work" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
];

const SERVICES_ITEMS: readonly ServiceItem[] = [
  {
    title: "AI & Autonomous Automation",
    badge: "01 // AGENTS & MESH",
    description: "Deterministic agent pipelines, LLM fine-tuning, and low-latency process automation.",
    href: "/solutions/ai-automation",
  },
  {
    title: "High-Assurance Digital Products",
    badge: "02 // WEB & PLATFORMS",
    description: "Enterprise SaaS, resilient web applications, and mathematical interface design.",
    href: "/solutions/digital-products",
  },
  {
    title: "Mission-Critical Business Systems",
    badge: "03 // DISTRIBUTED ARCH",
    description: "Fault-tolerant transaction backbones, event meshes, and monolithic modernization.",
    href: "/solutions/business-systems",
  },
  {
    title: "Resilient Cloud & Security",
    badge: "04 // ZERO-TRUST INFRA",
    description: "Hardened perimeter architecture, sovereign data boundaries, and multi-region failover.",
    href: "/solutions/infrastructure-security",
  },
];

const LEGAL_NAV_ITEMS: readonly NavItem[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Engagement", href: "/terms" },
];

/**
 * Header — Primary navigation component for Frontier Systems.
 *
 * Implements:
 * - WCAG 2.2 AA compliant keyboard navigation with visible focus rings.
 * - Accessible "Services" dropdown showcasing engineering pillars.
 * - Navigation links for Privacy Policy and Terms.
 * - Responsive mobile drawer with focus trapping and Escape key management.
 * - Semantic <nav> and <ul> elements for SEO crawler accessibility.
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const pathname = usePathname();

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);

  // Subtle scroll listener to transition from transparent to solid
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route navigation
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }

  // Handle outside click for services dropdown
  useEffect(() => {
    if (!servicesDropdownOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (
        servicesMenuRef.current &&
        !servicesMenuRef.current.contains(e.target as Node) &&
        servicesTriggerRef.current &&
        !servicesTriggerRef.current.contains(e.target as Node)
      ) {
        setServicesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [servicesDropdownOpen]);

  // Handle keyboard events for services dropdown
  const handleServicesKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setServicesDropdownOpen(false);
      servicesTriggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!servicesDropdownOpen) {
        setServicesDropdownOpen(true);
      } else {
        const firstLink = servicesMenuRef.current?.querySelector<HTMLAnchorElement>("a[href]");
        firstLink?.focus();
      }
    }
  };

  // Keyboard navigation within the dropdown
  const handleDropdownKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setServicesDropdownOpen(false);
      servicesTriggerRef.current?.focus();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!servicesMenuRef.current) return;
      const links = Array.from(servicesMenuRef.current.querySelectorAll<HTMLAnchorElement>("a[href]"));
      const currentIndex = links.indexOf(document.activeElement as HTMLAnchorElement);

      if (e.key === "ArrowDown") {
        const nextIndex = currentIndex + 1 < links.length ? currentIndex + 1 : 0;
        links[nextIndex]?.focus();
      } else {
        const prevIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : links.length - 1;
        links[prevIndex]?.focus();
      }
    }
  };

  // Lock body scroll and trap focus when mobile menu is open
  const handleMobileKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!mobileMenuOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        setMobileMenuOpen(false);
        toggleButtonRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && mobileMenuRef.current) {
        const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement && lastElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement && firstElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [mobileMenuOpen],
  );

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleMobileKeyDown);

      requestAnimationFrame(() => {
        const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a[href]");
        firstLink?.focus();
      });
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleMobileKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleMobileKeyDown);
    };
  }, [mobileMenuOpen, handleMobileKeyDown]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const isSolutionsActive = pathname.startsWith("/solutions");

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-[#0B0D0E]/95 backdrop-blur-sm border-b border-[#292D30] py-3.5"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <Container size="2xl">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-7"
            aria-label="Primary Navigation"
          >
            {/* Services Dropdown */}
            <div className="relative">
              <button
                ref={servicesTriggerRef}
                type="button"
                aria-haspopup="true"
                aria-expanded={servicesDropdownOpen}
                aria-controls="services-dropdown-menu"
                onClick={() => setServicesDropdownOpen((prev) => !prev)}
                onKeyDown={handleServicesKeyDown}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-150 rounded-xs py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] ${
                  isSolutionsActive || servicesDropdownOpen
                    ? "text-[#F5F5F3]"
                    : "text-[#A6AAAC] hover:text-[#F5F5F3]"
                }`}
              >
                <span>Services</span>
                <svg
                  className={`w-3.5 h-3.5 text-[#6E7376] transition-transform duration-150 ${
                    servicesDropdownOpen ? "rotate-180 text-[#63C7D9]" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Dropdown Panel */}
              {servicesDropdownOpen && (
                <div
                  id="services-dropdown-menu"
                  ref={servicesMenuRef}
                  role="menu"
                  aria-label="Services and Solutions"
                  onKeyDown={handleDropdownKeyDown}
                  className="absolute top-full left-0 mt-3 w-84 sm:w-96 rounded-sm bg-[#111416] border border-[#292D30] shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                >
                  <div className="px-3 py-2 border-b border-[#1E2225] flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#63C7D9]">
                      Core Capabilities
                    </span>
                    <span className="text-[10px] font-mono text-[#6E7376]">
                      4 PILLARS
                    </span>
                  </div>

                  <div className="py-2 space-y-1">
                    {SERVICES_ITEMS.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        role="menuitem"
                        onClick={() => setServicesDropdownOpen(false)}
                        className="group block p-2.5 rounded-xs transition-colors hover:bg-[#171A1C] border border-transparent hover:border-[#292D30] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#63C7D9]">
                            {service.badge}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-[#F5F5F3] group-hover:text-[#63C7D9] transition-colors mt-1">
                          {service.title}
                        </p>
                        <p className="text-[11px] text-[#A6AAAC] leading-normal mt-0.5 line-clamp-2">
                          {service.description}
                        </p>
                      </Link>
                    ))}
                  </div>

                  <div className="pt-2 mt-1 border-t border-[#1E2225] px-1">
                    <Link
                      href="/solutions"
                      role="menuitem"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center justify-between p-2 text-xs font-medium text-[#63C7D9] hover:text-[#78D3E3] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                    >
                      <span>Explore Full Solutions Catalog</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Standard Nav Items */}
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-150 rounded-xs py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] ${
                    isActive
                      ? "text-[#F5F5F3]"
                      : "text-[#A6AAAC] hover:text-[#F5F5F3]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Legal Utility Links in Desktop Navbar */}
            <div className="h-4 w-[1px] bg-[#292D30] mx-1" aria-hidden="true" />
            <Link
              href="/privacy-policy"
              className={`text-xs font-medium transition-colors duration-150 rounded-xs py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] ${
                pathname === "/privacy-policy"
                  ? "text-[#F5F5F3]"
                  : "text-[#6E7376] hover:text-[#A6AAAC]"
              }`}
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className={`text-xs font-medium transition-colors duration-150 rounded-xs py-1 px-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E] ${
                pathname === "/terms"
                  ? "text-[#F5F5F3]"
                  : "text-[#6E7376] hover:text-[#A6AAAC]"
              }`}
            >
              Terms
            </Link>
          </nav>

          {/* Desktop Direct Actions: ThemeToggle + Client Login (Ghost) + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle size="sm" />
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-[#A6AAAC] hover:text-[#F5F5F3] border border-[#292D30] bg-[#111416]/50 hover:bg-[#111416] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E]"
              aria-label="Client Portal Login"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-8 px-3.5 text-xs font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0D0E]"
            >
              Initiate Consultation
            </Link>
          </div>

          {/* Mobile Actions: ThemeToggle + Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle size="sm" />
            <button
              ref={toggleButtonRef}
              type="button"
              className="flex items-center justify-center w-9 h-9 border border-[#292D30] bg-[#111416] text-[#F5F5F3] hover:border-[#63C7D9] hover:text-[#63C7D9] rounded-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#63C7D9] transition-colors"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <span className="sr-only">
                {mobileMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {mobileMenuOpen ? (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-x-0 top-[61px] bottom-0 z-50 bg-[#0B0D0E] border-t border-[#292D30] flex flex-col justify-between px-6 py-8 md:hidden overflow-y-auto"
        >
          <div className="space-y-6">
            {/* Services Section */}
            <div className="space-y-2 border-b border-[#171A1C] pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-[#63C7D9]">
                  Services & Solutions
                </span>
                <Link
                  href="/solutions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-[#A6AAAC] hover:text-[#63C7D9] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  All Solutions &rarr;
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-2 pt-1">
                {SERVICES_ITEMS.map((service) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xs bg-[#111416] border border-[#1E2225] hover:border-[#63C7D9] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                  >
                    <div className="text-[10px] font-mono text-[#63C7D9]">
                      {service.badge}
                    </div>
                    <div className="text-sm font-medium text-[#F5F5F3]">
                      {service.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Primary Nav Links */}
            <nav className="flex flex-col space-y-3" aria-label="Mobile Navigation Links">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium tracking-tight py-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-xs ${
                      isActive
                        ? "text-[#63C7D9]"
                        : "text-[#F5F5F3] hover:text-[#63C7D9]"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Legal Links */}
            <div className="border-t border-[#171A1C] pt-3">
              <span className="text-[11px] font-mono text-[#6E7376] uppercase tracking-wider block mb-2">
                Legal & Governance
              </span>
              <div className="flex flex-wrap gap-4 text-xs">
                {LEGAL_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-[#A6AAAC] hover:text-[#F5F5F3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/cookie-policy"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[#A6AAAC] hover:text-[#F5F5F3] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-[#292D30] flex flex-col gap-3">
            <Link
              href="/portal/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center h-10 text-xs font-medium text-[#A6AAAC] hover:text-[#F5F5F3] border border-[#292D30] bg-[#111416] hover:bg-[#171A1C] rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              aria-label="Client Portal Login"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center h-11 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white rounded-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Initiate Consultation
            </Link>
            <div className="text-xs text-[#A6AAAC] flex items-center justify-between pt-1">
              <span>London, United Kingdom</span>
              <span className="flex items-center gap-1.5 text-[#4EBA87]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4EBA87]" />
                Systems Operational
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
