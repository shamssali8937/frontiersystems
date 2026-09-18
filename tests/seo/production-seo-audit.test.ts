import { siteConfig, getOrganizationJsonLd, getWebSiteJsonLd, getBreadcrumbJsonLd, getCaseStudyJsonLd } from "@/lib/seo";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as solutionsMetadata } from "@/app/solutions/page";
import { metadata as workMetadata } from "@/app/work/page";
import { metadata as companyMetadata } from "@/app/company/page";
import { metadata as contactMetadata } from "@/app/contact/page";
import { generateMetadata as generateSolutionMetadata } from "@/app/solutions/[slug]/page";
import { SOLUTIONS_DATA } from "@/lib/solutionsData";

interface SeoReportItem {
  check: string;
  result: "PASS" | "FAIL";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  details?: string | undefined;
}

export async function runProductionSeoAudit(): Promise<{
  passed: number;
  failed: number;
  report: SeoReportItem[];
}> {
  const report: SeoReportItem[] = [];
  let passed = 0;
  let failed = 0;

  function record(check: string, condition: boolean, severity: SeoReportItem["severity"], details?: string) {
    if (condition) {
      passed++;
      report.push({ check, result: "PASS", severity });
    } else {
      failed++;
      report.push({ check, result: "FAIL", severity, details });
    }
  }

  // =========================================================================
  // 1. Robots.txt Compliance
  // =========================================================================
  {
    const robotsData = robots();
    const rules = Array.isArray(robotsData.rules) ? robotsData.rules[0] : robotsData.rules;
    const disallows = Array.isArray(rules?.disallow) ? rules.disallow : [rules?.disallow || ""];

    record(
      "robots.txt disallows /admin/",
      disallows.includes("/admin/"),
      "CRITICAL",
      "Private admin paths must be disallowed in robots.txt",
    );
    record(
      "robots.txt disallows /portal/",
      disallows.includes("/portal/"),
      "CRITICAL",
      "Private client portal paths must be disallowed in robots.txt",
    );
    record(
      "robots.txt disallows /api/",
      disallows.includes("/api/"),
      "HIGH",
      "Internal API endpoints must not be crawled",
    );
    record(
      "robots.txt references canonical sitemap.xml",
      Boolean(robotsData.sitemap?.includes("/sitemap.xml")),
      "HIGH",
      "robots.txt must point to sitemap.xml",
    );
  }

  // =========================================================================
  // 2. Sitemap.xml Compliance
  // =========================================================================
  {
    const sitemapEntries = await sitemap();
    const urls = sitemapEntries.map((e) => e.url);

    record(
      "sitemap.xml contains homepage",
      urls.includes(siteConfig.url),
      "HIGH",
    );
    record(
      "sitemap.xml contains /solutions hub",
      urls.includes(`${siteConfig.url}/solutions`),
      "HIGH",
    );
    record(
      "sitemap.xml contains all 4 solutions pillar URLs",
      urls.includes(`${siteConfig.url}/solutions/ai-automation`) &&
        urls.includes(`${siteConfig.url}/solutions/digital-products`) &&
        urls.includes(`${siteConfig.url}/solutions/business-systems`) &&
        urls.includes(`${siteConfig.url}/solutions/infrastructure-security`),
      "HIGH",
    );
    record(
      "sitemap.xml contains /work, /company, /contact",
      urls.includes(`${siteConfig.url}/work`) &&
        urls.includes(`${siteConfig.url}/company`) &&
        urls.includes(`${siteConfig.url}/contact`),
      "HIGH",
    );
    record(
      "sitemap.xml contains legal policy pages",
      urls.includes(`${siteConfig.url}/privacy-policy`) &&
        urls.includes(`${siteConfig.url}/cookie-policy`) &&
        urls.includes(`${siteConfig.url}/terms`),
      "MEDIUM",
    );

    // Strict non-indexing of private routes in sitemap
    const hasAdminInSitemap = urls.some((u) => u.includes("/admin"));
    const hasPortalInSitemap = urls.some((u) => u.includes("/portal"));
    const hasApiInSitemap = urls.some((u) => u.includes("/api"));

    record(
      "sitemap.xml excludes /admin/* routes",
      !hasAdminInSitemap,
      "CRITICAL",
      "Admin routes must never appear in sitemap.xml",
    );
    record(
      "sitemap.xml excludes /portal/* routes",
      !hasPortalInSitemap,
      "CRITICAL",
      "Customer portal routes must never appear in sitemap.xml",
    );
    record(
      "sitemap.xml excludes /api/* routes",
      !hasApiInSitemap,
      "CRITICAL",
      "API endpoints must never appear in sitemap.xml",
    );

    // Duplicate URLs in sitemap
    const uniqueUrls = new Set(urls);
    record(
      "sitemap.xml contains zero duplicate URLs",
      uniqueUrls.size === urls.length,
      "HIGH",
      "All sitemap URLs must be unique",
    );
  }

  // =========================================================================
  // 3. Metadata Uniqueness & Length across Crawlable Routes
  // =========================================================================
  {
    const staticPagesMeta = [
      { page: "Home", meta: homeMetadata },
      { page: "Solutions", meta: solutionsMetadata },
      { page: "Work", meta: workMetadata },
      { page: "Company", meta: companyMetadata },
      { page: "Contact", meta: contactMetadata },
    ];

    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const p of staticPagesMeta) {
      const titleStr = typeof p.meta.title === "string" ? p.meta.title : "";
      const descStr = p.meta.description || "";

      titles.push(titleStr);
      descriptions.push(descStr);

      record(
        `[${p.page}] has non-empty title`,
        titleStr.length > 5,
        "HIGH",
      );
      record(
        `[${p.page}] has non-empty meta description`,
        descStr.length > 20,
        "HIGH",
      );
      record(
        `[${p.page}] has canonical URL defined`,
        Boolean(p.meta.alternates?.canonical),
        "HIGH",
      );
      record(
        `[${p.page}] has OpenGraph metadata configured`,
        Boolean(p.meta.openGraph?.title),
        "MEDIUM",
      );
    }

    // Dynamic Solution Pages Meta
    for (const slug of Object.keys(SOLUTIONS_DATA)) {
      const solMeta = await generateSolutionMetadata({
        params: Promise.resolve({ slug }),
      });
      const solTitle = typeof solMeta.title === "string" ? solMeta.title : "";
      const solDesc = solMeta.description || "";

      titles.push(solTitle);
      descriptions.push(solDesc);

      record(
        `[Solution: ${slug}] has unique meta title & description`,
        solTitle.length > 10 && solDesc.length > 30,
        "HIGH",
      );
      record(
        `[Solution: ${slug}] has canonical URL pointing to /solutions/${slug}`,
        String(solMeta.alternates?.canonical).includes(`/solutions/${slug}`),
        "HIGH",
      );
    }

    // Check for duplicate titles or duplicate descriptions
    const uniqueTitles = new Set(titles);
    const uniqueDescriptions = new Set(descriptions);

    record(
      "Zero duplicate page titles across all crawlable routes",
      uniqueTitles.size === titles.length,
      "HIGH",
      "Each public route must have a distinctive title",
    );
    record(
      "Zero duplicate meta descriptions across all crawlable routes",
      uniqueDescriptions.size === descriptions.length,
      "HIGH",
      "Each public route must have a distinctive meta description",
    );
  }

  // =========================================================================
  // 4. Structured Data (JSON-LD) Validation
  // =========================================================================
  {
    const orgJsonLd = getOrganizationJsonLd();
    record(
      "Organization JSON-LD is valid Schema.org Organization",
      orgJsonLd["@context"] === "https://schema.org" &&
        orgJsonLd["@type"] === "Organization" &&
        Boolean(orgJsonLd.name),
      "HIGH",
    );
    record(
      "Organization JSON-LD has UK PostalAddress",
      Boolean(orgJsonLd.address) && orgJsonLd.address.addressCountry === "GB",
      "HIGH",
    );

    const siteJsonLd = getWebSiteJsonLd();
    record(
      "WebSite JSON-LD is valid Schema.org WebSite",
      siteJsonLd["@context"] === "https://schema.org" &&
        siteJsonLd["@type"] === "WebSite" &&
        Boolean(siteJsonLd.name),
      "HIGH",
    );

    const breadcrumbJsonLd = getBreadcrumbJsonLd([
      { name: "Home", url: "/" },
      { name: "Solutions", url: "/solutions" },
      { name: "AI & Automation", url: "/solutions/ai-automation" },
    ]);
    record(
      "BreadcrumbList JSON-LD generates sequential ListItem hierarchy",
      breadcrumbJsonLd["@type"] === "BreadcrumbList" &&
        breadcrumbJsonLd.itemListElement.length === 3 &&
        breadcrumbJsonLd.itemListElement[2]?.position === 3,
      "MEDIUM",
    );

    const articleJsonLd = getCaseStudyJsonLd({
      title: "Fintech Platform Modernization",
      description: "Case study on distributed event ledger migration.",
      url: "/work/fintech-platform",
      datePublished: "2026-01-15T00:00:00Z",
    });
    record(
      "Article JSON-LD generates valid Article schema for case studies",
      articleJsonLd["@type"] === "Article" &&
        articleJsonLd.headline === "Fintech Platform Modernization" &&
        Boolean(articleJsonLd.publisher),
      "MEDIUM",
    );
  }

  return { passed, failed, report };
}

// Standalone execution runner
if (require.main === module || process.argv[1]?.includes("production-seo-audit")) {
  runProductionSeoAudit().then(({ passed, failed, report }) => {
    console.log("\n========================================================");
    console.log("     FRONTIER SYSTEMS PRODUCTION SEO AUDIT REPORT       ");
    console.log("========================================================\n");
    for (const r of report) {
      const icon = r.result === "PASS" ? "✅" : "❌";
      console.log(`${icon} [${r.severity}] ${r.check}`);
      if (r.result === "FAIL" && r.details) {
        console.log(`   -> DETAIL: ${r.details}`);
      }
    }
    console.log("\n--------------------------------------------------------");
    console.log(`TOTAL AUDIT CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("========================================================\n");

    if (failed > 0) process.exit(1);
  });
}
