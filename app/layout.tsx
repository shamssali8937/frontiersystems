import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { siteConfig, getOrganizationJsonLd, getWebSiteJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { CookieConsent } from "@/components/ui/CookieConsent";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { GlobalScrollObserver } from "@/components/ui/ScrollReveal";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — B2B Technology & AI Partner`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — B2B Technology & AI Partner`,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — B2B Technology & AI Partner`,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [`${siteConfig.url}${siteConfig.ogImage}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-GB"
      data-theme="dark"
      className={inter.variable}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fs_theme');var d=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';var r=(t==='light'||t==='dark')?t:(t==='system'?d:d);document.documentElement.setAttribute('data-theme',r);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#0B0D0E] text-[#F5F5F3] font-sans antialiased"
      >
        <ThemeProvider>
          <JsonLd data={[getOrganizationJsonLd(), getWebSiteJsonLd()]} />
          <GlobalScrollObserver />
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
