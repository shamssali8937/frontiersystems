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
import { runSecurityTests } from "./security/security.test";
import { runUploadSecurityTests } from "./upload-security.test";
import { runEmailNotificationTests } from "./email-notification.test";

async function main() {
  console.log("=========================================");
  console.log("Running Frontier Systems API Architecture Tests");
  console.log("=========================================\n");

  const apiRes = await runApiTests();
  for (const res of apiRes.results) {
    console.log(res);
  }

  console.log("\n=========================================");
  console.log("Running Frontier Systems Enterprise Security Tests");
  console.log("=========================================\n");

  const secRes = await runSecurityTests();
  for (const res of secRes.results) {
    console.log(res);
  }

  const uploadRes = await runUploadSecurityTests();

  console.log("\n=========================================");
  console.log("Running Frontier Systems Lead Notification Tests");
  console.log("=========================================\n");

  const emailRes = await runEmailNotificationTests();
  for (const res of emailRes.results) {
    console.log(res);
  }

  const totalPassed = apiRes.passed + secRes.passed + uploadRes.passed + emailRes.passed;
  const totalFailed = apiRes.failed + secRes.failed + uploadRes.failed + emailRes.failed;

  console.log("\n=========================================");
  console.log(`Global Suite Summary: ${totalPassed} passed, ${totalFailed} failed`);
  console.log("=========================================");

  if (totalFailed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
