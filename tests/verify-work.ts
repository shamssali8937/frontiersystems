async function runWorkVerification() {
  console.log("=== FRONTIER SYSTEMS WORK & CASE STUDIES VERIFICATION ===");
  let allPassed = true;

  // 1. Test /work List Page
  console.log("\n--- Testing /work List Page ---");
  try {
    const res = await fetch("http://localhost:3000/work");
    if (!res.ok) {
      console.error(`[FAIL] Expected 200 OK from /work, got ${res.status}`);
      allPassed = false;
    } else {
      console.log(`[PASS] HTTP 200 OK`);
    }

    const rawHtml = await res.text();
    const html = rawHtml.replaceAll("&amp;", "&");

    // Single H1 Check
    const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
    if (h1Matches.length === 1) {
      console.log(`[PASS] Exactly one H1 tag on /work`);
    } else {
      console.error(`[FAIL] Found ${h1Matches.length} H1 tags on /work`);
      allPassed = false;
    }

    // Title Check
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title: string = titleMatch?.[1] ?? "";
    if (title.includes("Case Evidence & Technical Deployments")) {
      console.log(`[PASS] Title matches expected: "${title}"`);
    } else {
      console.error(`[FAIL] Title mismatch: "${title}"`);
      allPassed = false;
    }

    // Canonical URL Check
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
    const canonical: string = canonicalMatch?.[1] ?? "";
    if (canonical.endsWith("/work")) {
      console.log(`[PASS] Canonical URL matches /work: "${canonical}"`);
    } else {
      console.error(`[FAIL] Canonical mismatch: "${canonical}"`);
      allPassed = false;
    }

    // Open Graph Check
    const hasOg = html.includes('property="og:title"') && html.includes('property="og:description"');
    if (hasOg) {
      console.log(`[PASS] Open Graph metadata present`);
    } else {
      console.error(`[FAIL] Open Graph metadata missing`);
      allPassed = false;
    }

    // Zero Hardcoded Fake Case Studies Check
    const hasFakeStudy1 = html.includes("Autonomous Logistics Dispatch & Fleet Routing Engine");
    const hasFakeStudy2 = html.includes("Real-Time Counterparty Risk Calculation Engine");
    if (!hasFakeStudy1 && !hasFakeStudy2) {
      console.log(`[PASS] Zero hardcoded fake case studies present`);
    } else {
      console.error(`[FAIL] Found hardcoded fake case studies in /work!`);
      allPassed = false;
    }

    // Intentional Clearance-Restricted Empty State Check
    const hasClearanceBadge = html.includes("SECURITY CLEARANCE ACTIVE");
    const hasClearanceText = html.includes("Enterprise Case Evidence Under Active Confidentiality Clearance");
    const hasNdaLink = html.includes('href="/contact"');
    if (hasClearanceBadge && hasClearanceText && hasNdaLink) {
      console.log(`[PASS] Intentional confidentiality/clearance empty state rendered with NDA action`);
    } else {
      console.error(`[FAIL] Intentional empty state missing or incomplete`);
      allPassed = false;
    }

    // Internal Link to /solutions
    if (html.includes('href="/solutions"')) {
      console.log(`[PASS] Contains internal link to /solutions`);
    } else {
      console.error(`[FAIL] Missing internal link to /solutions`);
      allPassed = false;
    }
  } catch (err) {
    console.error(`[FAIL] Error testing /work: ${(err as Error).message}`);
    allPassed = false;
  }

  // 2. Test 404 Behavior for non-existent slug
  console.log("\n--- Testing /work/[slug] 404 for Missing Slug ---");
  try {
    const res = await fetch("http://localhost:3000/work/unregistered-synthetic-slug-404");
    if (res.status === 404) {
      console.log(`[PASS] Missing slug returns HTTP 404 Not Found as expected`);
    } else {
      console.error(`[FAIL] Expected 404 for missing slug, got ${res.status}`);
      allPassed = false;
    }
  } catch (err) {
    console.error(`[FAIL] Error testing 404 route: ${(err as Error).message}`);
    allPassed = false;
  }

  // 3. Test Sitemap for /work route
  console.log("\n--- Testing /sitemap.xml ---");
  try {
    const res = await fetch("http://localhost:3000/sitemap.xml");
    if (!res.ok) {
      console.error(`[FAIL] Expected 200 from /sitemap.xml, got ${res.status}`);
      allPassed = false;
    } else {
      console.log(`[PASS] HTTP 200 OK from /sitemap.xml`);
      const xml = await res.text();
      if (xml.includes("<loc>") && xml.includes("/work</loc>")) {
        console.log(`[PASS] Sitemap contains /work entry`);
      } else {
        console.error(`[FAIL] Sitemap missing /work entry`);
        allPassed = false;
      }
    }
  } catch (err) {
    console.error(`[FAIL] Error testing sitemap: ${(err as Error).message}`);
    allPassed = false;
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL WORK & CASE STUDIES VERIFICATION CHECKS PASSED!");
  } else {
    console.error("SOME WORK VERIFICATION CHECKS FAILED.");
    process.exit(1);
  }
}

runWorkVerification();
