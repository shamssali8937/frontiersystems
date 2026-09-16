if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {
      // ignore
    }
  }
}

import { runApiTests } from "./api/inquiries.test";

async function main() {
  console.log("=========================================");
  console.log("Running Frontier Systems API Architecture Tests");
  console.log("=========================================\n");

  const { passed, failed, results } = await runApiTests();

  for (const res of results) {
    console.log(res);
  }

  console.log("\n=========================================");
  console.log(`Summary: ${passed} passed, ${failed} failed`);
  console.log("=========================================");

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
