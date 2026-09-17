interface RouteCheck {
  path: string;
  expectedTitleSnippet: string;
  expectedH1: string;
  requiredTexts: string[];
}

const ROUTES_TO_TEST: RouteCheck[] = [
  {
    path: "/solutions",
    expectedTitleSnippet: "Solutions Catalog & Capability Matrix",
    expectedH1: "Enterprise Engineering Solutions for High-Assurance Environments",
    requiredTexts: [
      "AI & Automation",
      "Digital Products",
      "Business Systems",
      "Infrastructure & Security",
      "How Our Four Pillars Unify",
      'href="/solutions/ai-automation"',
      'href="/solutions/digital-products"',
      'href="/solutions/business-systems"',
      'href="/solutions/infrastructure-security"',
    ],
  },
  {
    path: "/solutions/ai-automation",
    expectedTitleSnippet: "Enterprise AI Solutions & Intelligent Automation",
    expectedH1: "Deterministic AI Systems & Autonomous Workflow Automation",
    requiredTexts: [
      "AI Solutions",
      "AI Automation",
      "Business Process Automation",
      "AGENT_PIPELINE",
      "SCHEMA_GATE",
      "Zod Schema Gate",
      "Entropy Audit & Domain Modeling",
      "Deterministic Graph Architecture",
      "Telemetry & Observability Loops",
      'href="/contact"',
      'href="/work"',
    ],
  },
  {
    path: "/solutions/digital-products",
    expectedTitleSnippet: "Enterprise Digital Products & Platform Engineering",
    expectedH1: "Mission-Critical Digital Products, Platforms, and SaaS Architecture",
    requiredTexts: [
      "Web Applications",
      "E-Commerce Systems",
      "Mobile Applications",
      "B2B SaaS Platforms",
      "STREAMING_ENGINE",
      "React 19 RSC",
      "Concurrency & Latency Profiling",
      "Design System & Component Rigor",
      "Continuous Edge Deployment",
      'href="/contact"',
      'href="/work"',
    ],
  },
  {
    path: "/solutions/business-systems",
    expectedTitleSnippet: "Enterprise Business Systems, ERP & API Integration",
    expectedH1: "Unified Enterprise Business Systems & Operational Architecture",
    requiredTexts: [
      "Custom Software",
      "Enterprise CRM Systems",
      "API Integrations",
      "Database Architecture",
      "TRANSACTIONAL_BUS",
      "Transactional Outbox",
      "Silo Mapping & Schema Normalization",
      "Event Bus & Middleware Construction",
      "Shadow Pipeline & Zero-Downtime Cutover",
      'href="/contact"',
      'href="/work"',
    ],
  },
  {
    path: "/solutions/infrastructure-security",
    expectedTitleSnippet: "Cloud Infrastructure, Zero-Trust Cybersecurity & Modernization",
    expectedH1: "Resilient Cloud Architecture, Zero-Trust Security, and Modernization",
    requiredTexts: [
      "Cloud Architecture",
      "Cybersecurity & Zero-Trust",
      "Systems Modernization",
      "Mission-Critical Support",
      "SECURITY_POSTURE",
      "Zero-Trust Gateway",
      "Threat Modeling & Infrastructure Audit",
      "Immutable IaC & Zero-Trust Hardening",
      "Chaos Testing & Failover Drills",
      'href="/contact"',
      'href="/work"',
    ],
  },
];

async function runSolutionsVerification() {
  console.log("=== FRONTIER SYSTEMS SOLUTIONS SECTION VERIFICATION ===");
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const canonicals = new Set<string>();
  let allPassed = true;

  for (const route of ROUTES_TO_TEST) {
    const url = `http://localhost:3000${route.path}`;
    console.log(`\n--- Testing route: ${route.path} ---`);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.error(`[FAIL] HTTP status ${res.status} for ${url}`);
        allPassed = false;
        continue;
      }
      console.log(`[PASS] HTTP 200 OK`);

      const rawHtml = await res.text();
      const html = rawHtml.replaceAll("&amp;", "&");

      // H1 Check
      const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
      if (h1Matches.length === 1) {
        console.log(`[PASS] Exactly one H1 tag`);
      } else {
        console.error(`[FAIL] Found ${h1Matches.length} H1 tags`);
        allPassed = false;
      }

      // Title check
      const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
      const title: string = titleMatch?.[1] ?? "";
      if (title.includes(route.expectedTitleSnippet)) {
        console.log(`[PASS] Title matches: "${title}"`);
      } else {
        console.error(`[FAIL] Title mismatch. Expected snippet "${route.expectedTitleSnippet}", got "${title}"`);
        allPassed = false;
      }

      if (titles.has(title)) {
        console.error(`[FAIL] Duplicate title detected across routes: "${title}"`);
        allPassed = false;
      }
      titles.add(title);

      // Description check
      const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
      const desc: string = descMatch?.[1] ?? "";
      if (desc.length > 20) {
        console.log(`[PASS] Unique description present (${desc.length} chars)`);
      } else {
        console.error(`[FAIL] Description missing or too short`);
        allPassed = false;
      }

      if (descriptions.has(desc)) {
        console.error(`[FAIL] Duplicate description detected across routes`);
        allPassed = false;
      }
      descriptions.add(desc);

      // Canonical URL check
      const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
      const canonical: string = canonicalMatch?.[1] ?? "";
      if (canonical.endsWith(route.path)) {
        console.log(`[PASS] Canonical URL matches path: ${canonical}`);
      } else {
        console.error(`[FAIL] Canonical URL mismatch: expected suffix ${route.path}, got ${canonical}`);
        allPassed = false;
      }

      if (canonicals.has(canonical)) {
        console.error(`[FAIL] Duplicate canonical detected`);
        allPassed = false;
      }
      canonicals.add(canonical);

      // Open Graph tag check
      const ogTitle = html.match(/<meta property="og:title"/i);
      const ogDesc = html.match(/<meta property="og:description"/i);
      const ogUrl = html.match(/<meta property="og:url"/i);
      if (ogTitle && ogDesc && ogUrl) {
        console.log(`[PASS] Open Graph tags present (title, description, url)`);
      } else {
        console.error(`[FAIL] Open Graph tags missing or incomplete`);
        allPassed = false;
      }

      // Required Texts / Sub-services check
      for (const text of route.requiredTexts) {
        if (html.includes(text)) {
          console.log(`[PASS] Contains required element: "${text}"`);
        } else {
          console.error(`[FAIL] Missing required element: "${text}"`);
          allPassed = false;
        }
      }
    } catch (err) {
      console.error(`[FAIL] Failed to fetch ${url}: ${(err as Error).message}`);
      allPassed = false;
    }
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL 5 SOLUTIONS ROUTES PASSED COMPREHENSIVE VERIFICATION!");
  } else {
    console.error("SOME VERIFICATION CHECKS FAILED.");
    process.exit(1);
  }
}

runSolutionsVerification();
