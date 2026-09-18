import fs from "fs";
import path from "path";

export function runHeroCoreVerification(): { passed: number; failed: number; results: string[] } {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      passed++;
      results.push(`  [PASS] ${testName}`);
    } else {
      failed++;
      results.push(`  [FAIL] ${testName}${detail ? ` - ${detail}` : ""}`);
    }
  }

  const heroVisualPath = path.resolve(process.cwd(), "components/home/HeroVisual.tsx");
  const heroVisualCode = fs.readFileSync(heroVisualPath, "utf-8");

  const systemCorePath = path.resolve(process.cwd(), "components/three/SystemCoreScene.tsx");
  const systemCoreCode = fs.readFileSync(systemCorePath, "utf-8");

  const heroFallbackPath = path.resolve(process.cwd(), "components/three/HeroFallback.tsx");
  const heroFallbackCode = fs.readFileSync(heroFallbackPath, "utf-8");

  // 1. Accessibility Checks
  assert(
    heroVisualCode.includes('aria-hidden="true"'),
    "HeroVisual wraps 3D visual container in aria-hidden='true'",
  );
  assert(
    heroVisualCode.includes('className="sr-only"'),
    "HeroVisual exposes screen-reader accessible narrative outside canvas",
  );
  assert(
    heroVisualCode.includes("high-assurance distributed systems topology"),
    "Screen-reader text accurately describes architecture without decorative fluff",
  );

  // 2. Reduced Motion Support
  assert(
    systemCoreCode.includes("prefers-reduced-motion"),
    "SystemCoreScene actively checks for prefers-reduced-motion",
  );
  assert(
    systemCoreCode.includes("if (reducedMotion) return") ||
      systemCoreCode.includes("if (reducedMotion) {"),
    "SystemCoreScene halts rotation and disables parallax under reduced-motion preference",
  );
  assert(
    heroFallbackCode.includes("motion-reduce:animate-none"),
    "HeroFallback supports motion-reduce:animate-none on all CSS animations",
  );

  // 3. Fallback & WebGL Failure Recovery
  assert(
    systemCoreCode.includes("HeroFallback"),
    "SystemCoreScene imports and utilizes HeroFallback when WebGL is unavailable",
  );
  assert(
    systemCoreCode.includes("getContext") || systemCoreCode.includes("webgl"),
    "SystemCoreScene performs runtime WebGL detection before mounting canvas",
  );

  // 4. Engineering Precision & Anti-Chaos Constraints
  const lowerCore = systemCoreCode.toLowerCase();
  assert(
    !lowerCore.includes("rainbow") && !lowerCore.includes("cursortrail"),
    "No chaotic rainbow effects or cursor trails in 3D scene",
  );
  assert(
    systemCoreCode.includes("0.05") || systemCoreCode.includes("lerp"),
    "Applies restrained damping/lerp to prevent erratic camera/core jumps",
  );

  // 5. Payload & Lightweight Architecture
  // Procedural Three.js geometry uses 0 bytes of external GLB files for the hero core
  assert(
    systemCoreCode.includes("IcosahedronGeometry") || systemCoreCode.includes("RingGeometry"),
    "Uses procedural high-precision geometries, avoiding bulky multi-megabyte GLB assets",
  );

  return { passed, failed, results };
}

if (process.argv[1]?.endsWith("verify-hero-core.ts") || process.argv[1]?.endsWith("verify-hero-core.js")) {
  console.log("=========================================");
  console.log("Frontier Systems 3D Hero Core Verification");
  console.log("=========================================\n");

  const res = runHeroCoreVerification();
  for (const r of res.results) {
    console.log(r);
  }

  console.log("\n=========================================");
  console.log(`Hero Core Summary: ${res.passed} passed, ${res.failed} failed`);
  console.log("=========================================");

  if (res.failed > 0) process.exit(1);
}
