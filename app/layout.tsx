/**
 * Root layout — Server Component.
 *
 * This is the shell for the entire application.
 * No business logic, no database access, no direct API calls.
 * Heavy client features (3D, animations) are loaded lazily in child pages.
 */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Frontier Systems — B2B Technology & AI",
    template: "%s | Frontier Systems",
  },
  description:
    "Frontier Systems delivers enterprise-grade technology and AI solutions for forward-thinking businesses.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Frontier Systems",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#0B0D0E] text-[#F5F5F3] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
