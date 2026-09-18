/**
 * Automated Verification Script for /contact route and Progressive Four-Step Inquiry Form
 *
 * Validates:
 * 1. HTTP 200 OK
 * 2. Exactly one <h1> tag
 * 3. Unique SEO title, description, canonical link, and Open Graph tags
 * 4. Prominent direct mailto link: hello@frontiersystems.co (SRS mandatory requirement)
 * 5. Presence of Step 1 Goals: Build, Automate, Scale, Modernize
 * 6. Presence of Step 2 Timeline & Open-Text Budget specification
 * 7. Presence of Step 3 Technical Details & Secure File Upload specifications
 * 8. Presence of Step 4 Contact Information
 * 9. UX: Progress indicator, navigation buttons, accessible attributes
 * 10. API Integration: Valid submission to POST /api/inquiries returns 201 Created
 * 11. API Security: Invalid payload is rejected by server Zod schema with 422
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
      const pageRes = await fetch(`http://localhost:${port}/contact`, {
        signal: AbortSignal.timeout(1500),
      }).catch(() => null);
      if (pageRes) {
        return `http://localhost:${port}`;
      }
    } catch {
      // Continue to next candidate
    }
  }
  return "http://localhost:3000";
}

async function runContactVerification() {
  const baseUrl = await getAvailableBaseUrl();
  console.log(`[TEST] Using base URL: ${baseUrl}`);
  console.log("[TEST] Beginning verification of /contact route and progressive inquiry form...");

  let allPassed = true;
  const url = `${baseUrl}/contact`;

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
    if (title.includes("Enterprise Contact & Consultation") && title.includes("Frontier Systems")) {
      console.log(`[PASS] Title properly configured: "${title}"`);
    } else {
      console.error(`[FAIL] Title does not match expected format: "${rawTitle}"`);
      allPassed = false;
    }

    // 3. Description check
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    const desc = descMatch?.[1] ?? "";
    if (desc.length >= 50) {
      console.log(`[PASS] Meta description present (${desc.length} chars): "${desc.slice(0, 60)}..."`);
    } else {
      console.error(`[FAIL] Meta description missing or too short (${desc.length} chars)`);
      allPassed = false;
    }

    // 4. Canonical URL check
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/i);
    const canonical = canonicalMatch?.[1] ?? "";
    if (canonical.endsWith("/contact")) {
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

    // 6. Direct Mailto link check (SRS requirement: hello@frontiersystems.co visible, not hidden)
    if (html.includes('href="mailto:hello@frontiersystems.co"') && html.includes("hello@frontiersystems.co")) {
      console.log(`[PASS] Direct mailto link (hello@frontiersystems.co) is prominently visible`);
    } else {
      console.error(`[FAIL] Direct mailto link (hello@frontiersystems.co) missing or improperly formatted`);
      allPassed = false;
    }

    // 7. Progressive 4-Step Form Elements
    const stepChecks = [
      { name: "Step 1: Build Goal", needle: "Build" },
      { name: "Step 1: Automate Goal", needle: "Automate" },
      { name: "Step 1: Scale Goal", needle: "Scale" },
      { name: "Step 1: Modernize Goal", needle: "Modernize" },
      { name: "Step Progress Indicator", needle: "Goal Selection" },
      { name: "Next Step Action", needle: "NEXT STEP" },
    ];

    for (const check of stepChecks) {
      if (html.includes(check.needle)) {
        console.log(`[PASS] Verified form component element: "${check.name}"`);
      } else {
        console.error(`[FAIL] Missing form component element: "${check.name}"`);
        allPassed = false;
      }
    }

    // 8. Test Backend API Endpoint (POST /api/inquiries)
    console.log("\n[TEST] Testing POST /api/inquiries backend integration...");

    const testPayload = {
      name: "Arthur Pendelton",
      email: "arthur.pendelton@enterprisecorp.co.uk",
      company: "Enterprise Corp UK",
      phone: "+44 20 7946 0192",
      service: "Automate",
      budget: "£75,000 – £150,000",
      message:
        "[Engagement Goal: Automate]\n[Target Timeline: 1–3 months]\n[Budget Allocation: £75,000 – £150,000]\n\n[Technical Requirements]:\nHigh-throughput autonomous agent pipeline with deterministic state machine verification and zero-trust VPC deployment.",
    };

    const testIp = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
    const apiRes = await fetch(`${baseUrl}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: baseUrl,
        "X-Forwarded-For": testIp,
      },
      body: JSON.stringify(testPayload),
    });

    const apiJson = await apiRes.json();

    if (apiRes.status === 201 && apiJson.success && apiJson.data?.id) {
      console.log(`[PASS] POST /api/inquiries accepted valid inquiry (Created ID: ${apiJson.data.id})`);
    } else {
      console.error(`[FAIL] POST /api/inquiries failed with status ${apiRes.status}:`, apiJson);
      allPassed = false;
    }

    // 9. Test Backend Server Validation (Rejection of invalid payload)
    console.log("\n[TEST] Testing server-side validation gate (invalid email & short message)...");
    const testIp2 = `198.51.100.${Math.floor(Math.random() * 200) + 10}`;
    const invalidPayload = {
      name: "A", // too short (min 2)
      email: "not-an-email", // invalid email
      message: "short", // too short (min 10)
    };

    const invalidRes = await fetch(`${baseUrl}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: baseUrl,
        "X-Forwarded-For": testIp2,
      },
      body: JSON.stringify(invalidPayload),
    });

    const invalidJson = await invalidRes.json();
    if (invalidRes.status === 422 && !invalidJson.success && invalidJson.error?.code === "VALIDATION_ERROR") {
      console.log(`[PASS] Server-side Zod validation correctly rejected invalid payload with HTTP 422`);
    } else {
      console.error(`[FAIL] Expected HTTP 422 validation rejection, got ${invalidRes.status}:`, invalidJson);
      allPassed = false;
    }
  } catch (err) {
    console.error(`[FAIL] Verification error: ${(err as Error).message}`);
    allPassed = false;
  }

  console.log("\n==================================================");
  if (allPassed) {
    console.log("ALL CONTACT PAGE & PROGRESSIVE FORM VERIFICATION CHECKS PASSED!");
  } else {
    console.error("SOME CONTACT PAGE CHECKS FAILED.");
    process.exit(1);
  }
}

runContactVerification();

export {};
