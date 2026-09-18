async function runChecks() {
  try {
    const res = await fetch("http://localhost:3000");
    if (!res.ok) {
      throw new Error(`HTTP status: ${res.status}`);
    }
    const html = await res.text();

    const h1Matches = html.match(/<h1[^>]*>/gi) || [];
    const h2Matches = html.match(/<h2[^>]*>/gi) || [];
    const h3Matches = html.match(/<h3[^>]*>/gi) || [];

    const checks = [
      { name: "Single H1 tag", pass: h1Matches.length === 1 },
      { name: "Multiple H2 tags for sections", pass: h2Matches.length >= 4 },
      { name: "Multiple H3 tags for cards/steps", pass: h3Matches.length >= 8 },
      { name: "Hero Headline", pass: html.includes("Engineering Autonomous AI, Resilient Systems, and Critical Software") },
      { name: "Hero Metrics Bar", pass: html.includes("99.99%") && html.includes("Zero Trust") },
      { name: "Four Pillars Heading", pass: html.includes("Engineered Across Four Core Architectural Pillars") },
      { name: "Pillar 1: AI & Automation", pass: html.includes("AI &amp; Automation") || html.includes("AI & Automation") },
      { name: "Pillar 2: Digital Products", pass: html.includes("Digital Products") },
      { name: "Pillar 3: Business Systems", pass: html.includes("Business Systems") },
      { name: "Pillar 4: Infrastructure & Security", pass: html.includes("Infrastructure &amp; Security") || html.includes("Infrastructure & Security") },
      { name: "Selected Work Section", pass: html.includes("Selected Technical Deployments") },
      { name: "Process Section", pass: html.includes("Deterministic Delivery: From Problem Discovery to Systems Evolution") },
      { name: "Process 01 Understand", pass: html.includes("Understand") },
      { name: "Process 02 Plan", pass: html.includes("Plan") },
      { name: "Process 03 Build", pass: html.includes("Build") },
      { name: "Process 04 Evolve", pass: html.includes("Evolve") },
      { name: "Closing CTA Section", pass: html.includes("Ready to Engineer Mission-Critical Software and Autonomous AI?") },
      { name: "Internal link to /solutions", pass: html.includes('href="/solutions"') },
      { name: "Internal link to /work", pass: html.includes('href="/work"') },
      { name: "Internal link to /company", pass: html.includes('href="/company"') },
      { name: "Internal link to /contact", pass: html.includes('href="/contact"') },
      { name: "Accessible Screen Reader Text outside 3D canvas", pass: html.includes("Interactive 3D technical visualization") },
      { name: "Aria-hidden on visual canvas container", pass: html.includes('aria-hidden="true"') },
      { name: "Hero SVG Blueprint Fallback rendered", pass: html.includes("SYS_TOPOLOGY // V4") },
      { name: "data-scroll-behavior smooth on html element", pass: html.includes('data-scroll-behavior="smooth"') },
    ];

    console.log("=== FRONTIER SYSTEMS HOMEPAGE VERIFICATION ===");
    let allPassed = true;
    for (const c of checks) {
      console.log(`[${c.pass ? "PASS" : "FAIL"}] ${c.name}`);
      if (!c.pass) allPassed = false;
    }

    console.log(`\nH1 Count: ${h1Matches.length}`);
    console.log(`H2 Count: ${h2Matches.length}`);
    console.log(`H3 Count: ${h3Matches.length}`);

    if (!allPassed) {
      process.exit(1);
    } else {
      console.log("\nALL HOMEPAGE CHECKS PASSED SUCCESSFULLY!");
    }
  } catch (err) {
    console.error("Verification failed:", (err as Error).message);
    process.exit(1);
  }
}

runChecks();
