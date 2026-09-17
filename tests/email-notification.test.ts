if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}

import {
  sendLeadInquiryNotifications,
  buildLeadEmailPayloadFromInquiry,
  getFailedNotificationsQueue,
  clearFailedNotificationsQueue,
  type LeadEmailPayload,
} from "../server/services/email.service";
import type { Inquiry } from "@prisma/client";

export async function runEmailNotificationTests(): Promise<{
  passed: number;
  failed: number;
  results: string[];
}> {
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

  clearFailedNotificationsQueue();

  const sampleInquiry: Inquiry = {
    id: "inq_test_12345",
    name: "Elena Rostova",
    email: "elena@vanguard-holdings.co.uk",
    company: "Vanguard Systems Ltd",
    phone: "+44 20 7946 0912",
    service: "Scale",
    budget: "£150,000 - £250,000",
    message: "High-throughput distributed telemetry processing cluster specifications.",
    internalNotes: null,
    ipHash: "ip_127.0.0",
    status: "NEW",
    createdAt: new Date("2026-09-17T12:00:00Z"),
    updatedAt: new Date("2026-09-17T12:00:00Z"),
  };

  // Test 1: Payload extraction
  try {
    const payload = buildLeadEmailPayloadFromInquiry(sampleInquiry, 2, {
      timeline: "Q1 2027",
      budget: "£150,000 - £250,000",
      technicalDetails: "High-throughput distributed telemetry processing cluster specifications.",
    });

    assert(payload.inquiryId === "inq_test_12345", "Payload extracts correct inquiryId");
    assert(payload.clientName === "Elena Rostova", "Payload extracts correct clientName");
    assert(payload.email === "elena@vanguard-holdings.co.uk", "Payload extracts correct email");
    assert(payload.company === "Vanguard Systems Ltd", "Payload extracts organization/company");
    assert(payload.phone === "+44 20 7946 0912", "Payload extracts phone number");
    assert(payload.projectType === "Scale", "Payload extracts service pillar");
    assert(payload.timeline === "Q1 2027", "Payload preserves specified timeline");
    assert(payload.budget === "£150,000 - £250,000", "Payload preserves custom budget");
    assert(payload.attachmentsCount === 2, "Payload counts verified attachments");
    assert(
      payload.technicalDetails.includes("telemetry processing"),
      "Payload preserves full technical brief",
    );
    assert(payload.submittedAt.getTime() === sampleInquiry.createdAt.getTime(), "Payload preserves timestamp");
  } catch (err) {
    assert(false, "Payload building threw unexpected error", String(err));
  }

  // Test 2: Notification dispatch simulation
  try {
    const payload: LeadEmailPayload = {
      inquiryId: "inq_mock_001",
      clientName: "David Sterling",
      email: "david@sterling-defense.com",
      company: "Sterling Cyber",
      phone: "+1 415 555 0199",
      projectType: "Automate",
      timeline: "Immediate (30-60 days)",
      budget: "Open Architecture",
      technicalDetails: "Autonomous verification harness for mission-critical software pipelines.",
      attachmentsCount: 1,
      submittedAt: new Date(),
    };

    const dispatchResult = await sendLeadInquiryNotifications(payload);

    assert(dispatchResult.internalAlertSent === true, "Dispatches internal engineering desk notification");
    assert(dispatchResult.clientConfirmationSent === true, "Dispatches client receipt confirmation");
    assert(!dispatchResult.queuedForRetry, "No failure logged to retry queue on healthy dispatch");
    assert(getFailedNotificationsQueue().length === 0, "Dead-letter retry queue is clean on success");
  } catch (err) {
    assert(false, "Notification dispatch failed", String(err));
  }

  // Test 3: Client template is strictly non-promissory
  try {
    const fs = await import("fs");
    const path = await import("path");
    const emailSource = fs.readFileSync(
      path.resolve(process.cwd(), "server/services/email.service.ts"),
      "utf-8",
    );

    // Verify absence of promissory commitments
    const lowerSource = emailSource.toLowerCase();
    const hasPromiseTime = lowerSource.includes("within 24 hours") || lowerSource.includes("within 48 hours");
    const hasPromisePricing = lowerSource.includes("guaranteed price") || lowerSource.includes("discount");
    const hasPromiseAccept = lowerSource.includes("we have accepted your project");

    assert(!hasPromiseTime, "Client confirmation does NOT promise response times (e.g. 24h / 48h)");
    assert(!hasPromisePricing, "Client confirmation does NOT promise fixed pricing or discounts");
    assert(!hasPromiseAccept, "Client confirmation does NOT promise automatic project acceptance");
    assert(
      emailSource.includes("Consultation Inquiry Received"),
      "Client confirmation sets respectful receipt acknowledgment tone",
    );
  } catch (err) {
    assert(false, "Non-promissory verification check failed", String(err));
  }

  // Test 4: Secret and credential isolation
  try {
    const fs = await import("fs");
    const path = await import("path");
    const emailSource = fs.readFileSync(
      path.resolve(process.cwd(), "server/services/email.service.ts"),
      "utf-8",
    );

    // Verify no hardcoded credentials or private storage keys leaked in HTML templates
    assert(!emailSource.includes("CLOUDINARY_API_SECRET"), "Does not leak storage API secrets in email code");
    assert(!emailSource.includes("SMTP_PASSWORD ="), "Does not leak hardcoded SMTP credentials");
    assert(emailSource.includes("CONFIDENTIALITY NOTICE"), "Internal template includes enterprise confidentiality notice");
  } catch (err) {
    assert(false, "Credential isolation check failed", String(err));
  }

  return { passed, failed, results };
}

// Standalone execution
if (process.argv[1]?.endsWith("email-notification.test.ts") || process.argv[1]?.endsWith("email-notification.test.js")) {
  runEmailNotificationTests().then((res) => {
    console.log("=========================================");
    console.log("Enterprise Lead Notification Pipeline Tests");
    console.log("=========================================\n");
    for (const r of res.results) {
      console.log(r);
    }
    console.log("\n=========================================");
    console.log(`Summary: ${res.passed} passed, ${res.failed} failed`);
    console.log("=========================================");
    if (res.failed > 0) process.exit(1);
  });
}
