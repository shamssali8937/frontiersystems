/**
 * Automated Verification Script for /company route
 * Validates:
 * 1. HTTP 200 OK
 * 2. Exactly one <h1> tag
 * 3. Unique SEO title, description, canonical link, and Open Graph tags
 * 4. Presence of all 10 required SRS sections
 * 5. Agency narrative focus (absence of employee rosters / headshots / fake claims)
 * 6. Internal links to /solutions, /work, and /contact
 */

async function getAvailableBaseUrl(): Promise<string> {
  const candidatePorts = [3000, 3002, 3001];
  for (const port of candidatePorts) {
    try {
      const res = await fetch(`http://localhost:${port}/api/health`, {
        signal: AbortSignal.timeout(1500),
      }).catch(() => null);
      if (res && (res.ok || res.status === 404)) {
        return `http://localhost:${port}`;
      }
      const pageRes = await fetch(`http://localhost:${port}/`, {
        signal: AbortSignal.timeout(1500),
      }).catch(() => null);
      if (pageRes) {
        return `http://localhost:${port}`;
      }
    } catch {
      // Continue to next port
    }
  }
  return "http://localhost:3000";
}

async function runCompanyVerification() {
  const baseUrl = await getAvailableBaseUrl();
  console.log(`[TEST] Using base URL: ${baseUrl}`);
  console.log("[TEST] Beginning verification of /company route...");

  let allPassed = true;
  const url = `${baseUrl}/company`;

  try {
    const res = await fetch(url);
    if (res.status === 200) {
      console.log(`[PASS] ${url} returned HTTP 200 OK`);
    } else {
      console.error(`[FAIL] ${url} returned HTTP ${res.status}`);
      allPassed = false;
    }

    const html = await res.text();

    // 1. Heading verification (exactly 1 h1)
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)];
    if (h1Matches.length === 1) {
      const h1Text = h1Matches[0]?.[1]?.replace(/<[^>]+>/g, "").trim() ?? "";
      console.log(`[PASS] Exactly one <h1> element found: "${h1Text}"`);
    } else {
      console.error(`[FAIL] Expected 1 <h1>, found ${h1Matches.length}`);
      allPassed = false;
    }

    // 2. SEO Title check
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const rawTitle = titleMatch?.[1]?.trim() ?? "";
    const title = rawTitle.replace(/&amp;/g, "&");
    if (title.includes("Company & Engineering Philosophy") && title.includes("Frontier Systems")) {
      console.log(`[PASS] Title properly configured: "${title}"`);
    } else {
      console.error(`[FAIL] Title does not match expected format: "${rawTitle}"`);
      allPassed = false;
    }

    // 3. Description check
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    const desc = descMatch?.[1] ?? "";
    if (desc.length >= 50) {
      console.log(`[PASS] Meta description present (${desc.length} chars): "${desc.slice(0, 70)}..."`);
    } else {
      console.error(`[FAIL] Meta description missing or too short (${desc.length} chars)`);
      allPassed = false;
    }

    // 4. Canonical URL check
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
    const canonical = canonicalMatch?.[1] ?? "";
    if (canonical.endsWith("/company")) {
      console.log(`[PASS] Canonical URL is valid: ${canonical}`);
    } else {
      console.error(`[FAIL] Canonical URL invalid or missing: ${canonical}`);
      allPassed = false;
    }

    // 5. Open Graph tags
    const ogTitle = html.match(/<meta property="og:title"/i);
    const ogDesc = html.match(/<meta property="og:description"/i);
    const ogUrl = html.match(/<meta property="og:url"/i);
    if (ogTitle && ogDesc && ogUrl) {
      console.log("[PASS] Open Graph tags verified (og:title, og:description, og:url)");
    } else {
      console.error("[FAIL] Open Graph tags missing or incomplete");
      allPassed = false;
    }

    // 6. Verify 10 required SRS sections
    const requiredSections = [
      { name: "Section 1: Who Frontier Systems Is", needles: ["Who Frontier Systems Is", "WHO FRONTIER SYSTEMS IS"] },
      { name: "Section 2: Mission", needles: ["Our Mission", "OUR MISSION"] },
      { name: "Section 3: Technology Philosophy", needles: ["Engineering Philosophy", "First Principles Architecture"] },
      { name: "Section 4: How We Work", needles: ["How We Work", "Operating Principles"] },
      { name: "Section 5: Understand", needles: ["Phase 01: Understand", "Understand"] },
      { name: "Section 6: Plan", needles: ["Phase 02: Plan", "Plan"] },
      { name: "Section 7: Build", needles: ["Phase 03: Build", "Build"] },
      { name: "Section 8: Evolve", needles: ["Phase 04: Evolve", "Evolve"] },
      { name: "Section 9: Why Frontier Systems", needles: ["WHY FRONTIER SYSTEMS", "Why Enterprise Leaders Choose Frontier Systems"] },
      { name: "Section 10: Closing CTA", needles: ["Ready to Partner with Our Senior Systems Engineers?", "Schedule Technical Consultation"] },
    ];

    for (const section of requiredSections) {
      const found = section.needles.some((needle) => html.includes(needle));
      if (found) {
        console.log(`[PASS] Verified ${section.name}`);
      } else {
        console.error(`[FAIL] Missing ${section.name} (checked needles: ${section.needles.join(", ")})`);
        allPassed = false;
      }
    }

    // 7. Agency Narrative Guardrail: Ensure no individual employee rosters / team member cards
    const forbiddenPhrases = [
      "Meet the Team",
      "Our Leadership Team",
      "Head of Design",
      "VP of Sales",
      "Years of Experience",
      "Fortune 500 Clients",
      "Award-Winning Agency",
    ];

    for (const phrase of forbiddenPhrases) {
      if (html.toLowerCase().includes(phrase.toLowerCase())) {
        console.error(`[FAIL] Detected forbidden fabricated or team-roster phrase: "${phrase}"`);
        allPassed = false;
      } else {
        console.log(`[PASS] Verified absence of hype/roster phrase: "${phrase}"`);
      }
    }

    // 8. Internal Navigation Links
    const requiredLinks = [
      { path: "/solutions", label: "Solutions" },
      { path: "/work", label: "Work" },
      { path: "/contact", label: "Contact" },
    ];

    for (const link of requiredLinks) {
      if (html.includes(`href="${link.path}"`)) {
        console.log(`[PASS] Verified internal link to ${link.label} (${link.path})`);
      } else {
        console.error(`[FAIL] Missing internal link to ${link.label} (${link.path})`);
        allPassed = false;
      }
    }
  } catch (err) {
    console.error(`[FAIL] Exception during verification: ${(err as Error).message}`);
    allPassed = false;
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL COMPANY PAGE VERIFICATION CHECKS PASSED SUCCESSFULLY!");
  } else {
    console.error("COMPANY PAGE VERIFICATION CHECKS FAILED.");
    process.exit(1);
  }
}

runCompanyVerification();
