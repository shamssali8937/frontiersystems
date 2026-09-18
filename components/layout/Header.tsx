"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: "Solutions", href: "/solutions" },
  { label: "Work", href: "/work" },
  { label: "Company", href: "/company" },
  { label: "Contact", href: "/contact" },
];

/**
 * Header — Primary navigation component for Frontier Systems.
 *
 * Implements:
 * - Sticky positioning with scroll-triggered transparent-to-solid transition.
 * - Semantic <nav> elements with real anchor links for SEO crawlability.
 * - Accessible mobile menu with focus trapping, Escape handling, and screen reader announcements.
 */
export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Subtle scroll listener to transition from transparent to solid
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      setIsScrolled(scrolled);
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Synchronize mobile menu close on route navigation (render-time state adjustment)
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Lock body scroll and manage keyboard accessibility when mobile menu is open
  const handleKeyDown = useCallback(
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
      window.addEventListener("keydown", handleKeyDown);

      // Focus first link in mobile menu on open
      requestAnimationFrame(() => {
        const firstLink = mobileMenuRef.current?.querySelector<HTMLElement>("a[href]");
        firstLink?.focus();
      });
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, handleKeyDown]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

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
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[#F5F5F3] group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm py-1"
            aria-label="Frontier Systems Home"
          >
            {/* Minimalist engineering symbol */}
            <span className="w-6 h-6 flex items-center justify-center border border-[#292D30] bg-[#111416] text-[#63C7D9] font-mono text-xs font-semibold rounded-sm transition-colors group-hover:border-[#63C7D9]">
              FS
            </span>
            <span className="font-semibold text-base tracking-tight text-[#F5F5F3]">
              Frontier Systems
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Primary Navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors duration-150 rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] py-1 ${
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
          </nav>

          {/* Desktop Direct Actions: Client Login (Ghost) + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/portal/login"
              className="inline-flex items-center justify-center h-8 px-3 text-xs font-medium text-[#A6AAAC] hover:text-[#F5F5F3] border border-transparent hover:border-[#292D30] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              aria-label="Client Portal Login"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-8 px-3.5 text-xs font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white active:bg-[#E5E5E3] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Initiate Consultation
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            ref={toggleButtonRef}
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 border border-[#292D30] bg-[#111416] text-[#F5F5F3] hover:border-[#63C7D9] hover:text-[#63C7D9] rounded-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] transition-colors"
            onClick={toggleMobileMenu}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            <span className="sr-only">
              {mobileMenuOpen ? "Close menu" : "Open menu"}
            </span>
            {mobileMenuOpen ? (
              // Clean Close Icon (X)
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
              // Minimalist 2-line Engineering Burger
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
          <nav className="flex flex-col space-y-6" aria-label="Mobile Menu Links">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl font-medium tracking-tight py-2 border-b border-[#171A1C] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9] rounded-sm ${
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

          <div className="pt-8 border-t border-[#292D30] flex flex-col gap-3">
            <Link
              href="/portal/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center h-10 text-xs font-medium text-[#A6AAAC] hover:text-[#F5F5F3] border border-[#292D30] bg-[#111416] hover:bg-[#171A1C] rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
              aria-label="Client Portal Login"
            >
              Client Login
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center h-11 text-sm font-medium text-[#0B0D0E] bg-[#F5F5F3] hover:bg-white rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#63C7D9]"
            >
              Initiate Consultation
            </Link>
            <div className="text-xs text-[#A6AAAC] flex items-center justify-between pt-2">
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
