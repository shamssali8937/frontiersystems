import { NextRequest } from "next/server";
import { handleCreateInquiry } from "../server/controllers/inquiry.controller";
import { submitInquiry, ServiceError } from "../server/services/inquiry.service";
import { processSecureUpload } from "../server/services/upload.service";
import { resetRateLimits } from "../lib/security/rate-limit";

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

import { prisma } from "../lib/prisma";
import type { Inquiry, Prisma } from "@prisma/client";

export async function runProductionInquiryTests(): Promise<{
  passed: number;
  failed: number;
  results: string[];
}> {
  (process.env as Record<string, string | undefined>).NODE_ENV = "test";
  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  // Hermetic mock store for unit & integration testing Prisma operations
  const mockDb = new Map<string, Inquiry>();
  type InquiryDelegate = {
    findUnique: (args: { where: { id: string } }) => Promise<Inquiry | null>;
    create: (args: { data: Prisma.InquiryCreateInput }) => Promise<Inquiry>;
    findMany: (args?: Prisma.InquiryFindManyArgs) => Promise<Inquiry[]>;
    count: () => Promise<number>;
    update: (args: { where: { id: string }; data: Prisma.InquiryUpdateInput }) => Promise<Inquiry>;
  };
  const delegate = prisma.inquiry as unknown as InquiryDelegate;
  delegate.findUnique = async ({ where }) => mockDb.get(where.id) || null;
  delegate.create = async ({ data }) => {
    const item: Inquiry = {
      id: `inq-test-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: "NEW",
      name: data.name,
      email: data.email,
      company: typeof data.company === "string" ? data.company : null,
      phone: typeof data.phone === "string" ? data.phone : null,
      service: typeof data.service === "string" ? data.service : null,
      budget: typeof data.budget === "string" ? data.budget : null,
      message: data.message,
      internalNotes: typeof data.internalNotes === "string" ? data.internalNotes : null,
      ipHash: typeof data.ipHash === "string" ? data.ipHash : null,
    };
    mockDb.set(item.id, item);
    return item;
  };
  delegate.findMany = async (args?: Prisma.InquiryFindManyArgs) => {
    let items = Array.from(mockDb.values());
    if (args?.where?.email && typeof args.where.email === "string") {
      const emailFilter = args.where.email.toLowerCase();
      items = items.filter((i) => i.email.toLowerCase() === emailFilter);
    }
    return items;
  };
  delegate.count = async () => mockDb.size;
  delegate.update = async ({ where, data }) => {
    const existing = mockDb.get(where.id);
    if (!existing) throw new Error("Record not found");
    const updated: Inquiry = {
      ...existing,
      ...(typeof data.status === "string" ? { status: data.status as Inquiry["status"] } : {}),
      ...(typeof data.internalNotes === "string" ? { internalNotes: data.internalNotes } : {}),
      updatedAt: new Date(),
    };
    mockDb.set(where.id, updated);
    return updated;
  };

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed += 1;
      const msg = `✅ PASS: ${testName}`;
      results.push(msg);
      console.log(msg);
    } else {
      failed += 1;
      const msg = `❌ FAIL: ${testName}`;
      results.push(msg);
      console.error(msg);
    }
  }

  console.log("=========================================");
  console.log("RUNNING PRODUCTION INQUIRY API INTEGRATION TESTS");
  console.log("=========================================\n");

  const BASE_URL = "http://localhost:3000";

  // 1. Valid Request (Canonical SRS payload) -> HTTP 201 Created
  {
    const req = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.41",
      },
      body: JSON.stringify({
        client_name: "Eleanor Vance",
        email: "eleanor.vance@aerospace-systems.co.uk",
        project_type: "Automate",
        timeline: "1–3 months",
        custom_budget: "£100,000 – £250,000",
        technical_details:
          "High-throughput autonomous agent orchestration for avionics telemetry validation.",
      }),
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as {
      success: boolean;
      data?: { id: string; referenceId: string; status: string; createdAt: string; message: string };
    };

    assert(res.status === 201, "Valid request returns HTTP 201");
    assert(body.success === true, "Valid request returns success: true");
    assert(Boolean(body.data?.id), "Valid request returns safe inquiry id");
    assert(Boolean(body.data?.referenceId), "Valid request returns referenceId");
    assert(body.data?.status === "NEW", "Initial inquiry status is NEW");
    // Ensure sensitive fields are NOT exposed
    assert(
      !("ipHash" in (body.data || {})) && !("internalNotes" in (body.data || {})),
      "Sensitive internal database fields are not exposed",
    );
  }

  // 2. Missing Required Fields -> HTTP 422
  {
    const req = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.42",
      },
      body: JSON.stringify({
        client_name: "Missing Email and Details",
      }),
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as { success: boolean; error?: { code: string; details?: unknown[] } };

    assert(res.status === 422, "Missing required fields returns HTTP 422");
    assert(body.success === false, "Missing fields returns success: false");
    assert(body.error?.code === "VALIDATION_ERROR", "Error code is VALIDATION_ERROR");
  }

  // 3. Invalid Email Format -> HTTP 422
  {
    const req = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.43",
      },
      body: JSON.stringify({
        client_name: "Arthur Pendelton",
        email: "not-a-valid-email-format",
        project_type: "Build",
        technical_details: "Valid technical scope specification with sufficient length.",
      }),
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as { success: boolean; error?: { code: string } };

    assert(res.status === 422, "Invalid email format returns HTTP 422");
    assert(body.error?.code === "VALIDATION_ERROR", "Invalid email code is VALIDATION_ERROR");
  }

  // 4. Invalid Project Type (Untrusted Input) -> HTTP 422
  {
    const req = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.44",
      },
      body: JSON.stringify({
        client_name: "Marcus Aurelius",
        email: "marcus@rome.org",
        project_type: "UntrustedInjectedCategory",
        technical_details: "Attempting to submit an untrusted project category enum.",
      }),
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as { success: boolean; error?: { code: string } };

    assert(res.status === 422, "Untrusted project category returns HTTP 422");
    assert(body.error?.code === "VALIDATION_ERROR", "Untrusted category code is VALIDATION_ERROR");
  }

  // 5. Oversized Input (> 5,000 chars) -> HTTP 422
  {
    const oversizedMessage = "X".repeat(5001);
    const req = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.45",
      },
      body: JSON.stringify({
        client_name: "Data Flooder",
        email: "flooder@example.com",
        project_type: "Build",
        technical_details: oversizedMessage,
      }),
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as { success: boolean; error?: { code: string } };

    assert(res.status === 422, "Oversized technical details (> 5000 chars) returns HTTP 422");
    assert(body.error?.code === "VALIDATION_ERROR", "Oversized payload code is VALIDATION_ERROR");
  }

  // 6. Turnstile Failure -> HTTP 400
  {
    // Test service layer with simulated Turnstile failure
    try {
      const prevEnv = process.env.NODE_ENV;
      const prevSecret = process.env.TURNSTILE_SECRET_KEY;
      // Temporarily simulate production Turnstile check requiring real token
      (process.env as Record<string, string | undefined>).NODE_ENV = "production";
      process.env.TURNSTILE_SECRET_KEY = "real-turnstile-secret-key-enforced";

      let threwTurnstile = false;
      try {
        await submitInquiry(
          {
            client_name: "Bot User",
            email: "bot@spam-cluster.net",
            technical_details: "Automated submission attempt without token.",
            attachment_references: [],
          },
          "198.51.100.46",
        );
      } catch (err) {
        if (err instanceof ServiceError && err.code === "TURNSTILE_FAILED" && err.statusCode === 400) {
          threwTurnstile = true;
        }
      }

      (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
      process.env.TURNSTILE_SECRET_KEY = prevSecret;

      assert(threwTurnstile, "Turnstile challenge failure returns HTTP 400 TURNSTILE_FAILED");
    } catch {
      assert(false, "Turnstile challenge test exception");
    }
  }

  // 7. Rate Limiting Enforced -> HTTP 429
  {
    resetRateLimits();
    const rateLimitIp = "198.51.100.99";
    let hitRateLimit = false;

    // Send 6 rapid requests from the same IP (limit is 5 per window)
    for (let i = 0; i < 6; i++) {
      const req = new NextRequest(`${BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: BASE_URL,
          "X-Forwarded-For": rateLimitIp,
        },
        body: JSON.stringify({
          client_name: `Rate Test User ${i}`,
          email: `ratetest${i}@example.com`,
          project_type: "Modernize",
          technical_details: "Testing IP rate limiter boundaries under burst traffic.",
        }),
      });

      const res = await handleCreateInquiry(req);
      if (res.status === 429) {
        hitRateLimit = true;
        const body = (await res.json()) as { error?: { code: string } };
        assert(body.error?.code === "RATE_LIMITED", "Rate limit error code is RATE_LIMITED");
        assert(res.headers.has("Retry-After"), "Rate limit response includes Retry-After header");
        break;
      }
    }

    assert(hitRateLimit, "Excessive inquiry submissions trigger HTTP 429 Rate Limit");
    resetRateLimits();
  }

  // 8. Database Error / Safe Error Sanitization
  {
    // Ensure that handleControllerError never leaks stack traces or SQL
    const errorReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://malicious-origin.com", // Trigger origin forbidden
      },
      body: JSON.stringify({
        client_name: "Origin Test",
        email: "origin@test.com",
        technical_details: "Testing origin rejection sanitization.",
      }),
    });

    const res = await handleCreateInquiry(errorReq);
    const body = (await res.json()) as { success: boolean; error?: { code: string; message: string } };

    assert(res.status === 403, "Untrusted origin returns HTTP 403");
    assert(!JSON.stringify(body).includes("stack"), "Error response contains no stack traces");
    assert(!JSON.stringify(body).includes("Prisma"), "Error response contains no Prisma internals");
    assert(!JSON.stringify(body).includes("SELECT"), "Error response contains no SQL statements");
  }

  // 9. Sensible Duplicate Strategy (Idempotency within 2-minute window)
  {
    const duplicateEmail = "duplicate.test@enterprisecorp.co.uk";
    const duplicateScope = "Exact same duplicate project scope to verify idempotency.";

    const req1 = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.101",
      },
      body: JSON.stringify({
        client_name: "Duplicate Tester",
        email: duplicateEmail,
        project_type: "Scale",
        technical_details: duplicateScope,
      }),
    });

    const res1 = await handleCreateInquiry(req1);
    const body1 = (await res1.json()) as { data?: { id: string } };
    const firstId = body1.data?.id;

    // Send identical request immediately
    const req2 = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.102",
      },
      body: JSON.stringify({
        client_name: "Duplicate Tester",
        email: duplicateEmail,
        project_type: "Scale",
        technical_details: duplicateScope,
      }),
    });

    const res2 = await handleCreateInquiry(req2);
    const body2 = (await res2.json()) as { data?: { id: string; message: string } };

    assert(res2.status === 201, "Duplicate submission within 2m returns HTTP 201");
    assert(body2.data?.id === firstId, "Idempotent duplicate returns existing inquiry ID");
  }

  // 10. Attachment References Verification
  {
    // First, upload a valid test file through upload service to register it
    const testBuffer = Buffer.from("%PDF-1.4 test document content");
    const uploaded = await processSecureUpload(testBuffer, "valid_spec.pdf", "application/pdf");

    // Submit inquiry referencing the registered attachment
    const validAttachReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.103",
      },
      body: JSON.stringify({
        client_name: "Attachment Tester",
        email: "attachments@enterprisecorp.co.uk",
        project_type: "Build",
        technical_details: "Submitting verified attachment reference.",
        attachment_references: [uploaded.id],
      }),
    });

    const validAttachRes = await handleCreateInquiry(validAttachReq);
    assert(validAttachRes.status === 201, "Verified attachment reference is accepted (HTTP 201)");

    // Submit inquiry with a spoofed / nonexistent attachment ID -> 422
    const fakeAttachReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: BASE_URL,
        "X-Forwarded-For": "198.51.100.104",
      },
      body: JSON.stringify({
        client_name: "Spoof Tester",
        email: "spoof@enterprisecorp.co.uk",
        project_type: "Build",
        technical_details: "Attempting to inject unverified attachment reference.",
        attachment_references: ["nonexistent_spoofed_file_id_9999"],
      }),
    });

    const fakeAttachRes = await handleCreateInquiry(fakeAttachReq);
    const fakeBody = (await fakeAttachRes.json()) as { error?: { code: string } };
    assert(fakeAttachRes.status === 422, "Spoofed / nonexistent attachment reference is rejected (HTTP 422)");
    assert(fakeBody.error?.code === "INVALID_ATTACHMENT", "Spoofed attachment error code is INVALID_ATTACHMENT");
  }

  console.log("\n=========================================");
  console.log(`Integration Test Summary: ${passed} passed, ${failed} failed`);
  console.log("=========================================");

  return { passed, failed, results };
}

// Direct execution when invoked via CLI
if (process.argv[1]?.includes("api-inquiries-production.test")) {
  runProductionInquiryTests().then(({ failed }) => {
    if (failed > 0) process.exit(1);
  });
}

export {};
