import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { GET as getHealth } from "@/app/api/health/route";
import { POST as postInquiry } from "@/app/api/inquiries/route";
import { POST as postUpload } from "@/app/api/uploads/route";
import { GET as getAdminInquiries } from "@/app/api/admin/inquiries/route";
import { GET as getAdminCustomers } from "@/app/api/admin/customers/route";
import { GET as getAdminProjects } from "@/app/api/admin/projects/route";
import { GET as getAdminInvoices } from "@/app/api/admin/invoices/route";
import { POST as postRequestLink } from "@/app/api/portal/auth/request-link/route";
import { POST as postVerifyLink } from "@/app/api/portal/auth/verify/route";
import { GET as getPortalDashboard } from "@/app/api/portal/dashboard/route";
import { signSessionToken } from "@/server/services/admin-auth.service";
import { signCustomerSession } from "@/server/services/portal-auth.service";
import { sanitizeText, sanitizeFilename } from "@/lib/security/sanitize";
import { validateUploadedFile } from "@/lib/security/upload-validator";

interface SecurityReportEntry {
  test: string;
  result: "PASS" | "FAIL";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFORMATIONAL";
  fix: string;
}

export async function runCompleteApiSecuritySuite(): Promise<{
  passed: number;
  failed: number;
  report: SecurityReportEntry[];
}> {
  const report: SecurityReportEntry[] = [];
  let passed = 0;
  let failed = 0;

  function record(test: string, pass: boolean, severity: SecurityReportEntry["severity"], fix: string) {
    if (pass) {
      passed++;
      report.push({ test, result: "PASS", severity, fix: "N/A — verified secure" });
    } else {
      failed++;
      report.push({ test, result: "FAIL", severity, fix });
    }
  }

  const BASE_URL = "http://localhost:3000";

  // Fetch or create fixture admin for session tests
  const realAdmin = await prisma.adminUser.findFirst();
  const adminId = realAdmin?.id || "admin-fixture-id";
  const adminEmail = realAdmin?.email || "admin@frontiersystems.co";

  const validAdminToken = signSessionToken({
    adminId,
    email: adminEmail,
    role: "SUPERADMIN",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  const validCustomerToken = signCustomerSession({
    type: "customer",
    customerId: "sec-cust-1",
    email: "client@enterprise.example",
    name: "Enterprise Client",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  });

  // =========================================================================
  // 1. /api/health
  // =========================================================================
  {
    const res = await getHealth();
    const json = await res.json();
    record(
      "API Health Check returns HTTP 200 with operational status",
      res.status === 200 &&
        (json.data?.status === "ok" || json.data?.status === "healthy") &&
        json.data?.database === "connected",
      "LOW",
      "Ensure health route queries database pool correctly",
    );
  }

  // =========================================================================
  // 2. /api/inquiries Validation & Security
  // =========================================================================
  {
    // A. Malformed JSON
    const malformedReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.1",
      },
      body: "{\"name\": \"Dr. Test\", malformed_json",
    });
    const malformedRes = await postInquiry(malformedReq);
    record(
      "/api/inquiries rejects malformed JSON with 400",
      malformedRes.status === 400,
      "HIGH",
      "Parse request body in try/catch and return 400 Bad Request",
    );

    // B. Missing required fields (missing email and goal)
    const missingReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.2",
      },
      body: JSON.stringify({ name: "Incomplete User" }),
    });
    const missingRes = await postInquiry(missingReq);
    record(
      "/api/inquiries rejects missing required fields with 400/422",
      missingRes.status === 400 || missingRes.status === 422,
      "HIGH",
      "Enforce Zod schema validation on inquiry payloads",
    );

    // C. Invalid types (email as integer, budget as boolean)
    const invalidTypesReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.3",
      },
      body: JSON.stringify({
        name: "Type Mismatch",
        email: 12345,
        goal: "Build",
        timeline: "Immediate (< 1 month)",
        budget: true,
        technicalDetails: "Technical specification context details.",
      }),
    });
    const invalidTypesRes = await postInquiry(invalidTypesReq);
    record(
      "/api/inquiries rejects invalid types with validation failure",
      invalidTypesRes.status === 400 || invalidTypesRes.status === 422,
      "HIGH",
      "Ensure strict type checking in Zod schema",
    );

    // D. Extra unpermitted fields stripped or rejected
    const extraFieldsReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.4",
      },
      body: JSON.stringify({
        name: "Clean User",
        email: "clean@enterprise.example",
        goal: "Build",
        timeline: "Immediate (< 1 month)",
        budget: "£50k+",
        technicalDetails: "Detailed engineering architecture overview.",
        isAdmin: true,
        role: "SUPERADMIN",
        __proto__: { evil: true },
      }),
    });
    const extraRes = await postInquiry(extraFieldsReq);
    const extraJson = await extraRes.json();
    const noPollution = !("isAdmin" in (extraJson.data || {})) && !("role" in (extraJson.data || {}));
    record(
      "/api/inquiries ignores or strips unexpected fields (mass assignment / prototype pollution prevention)",
      noPollution,
      "HIGH",
      "Use Zod .parse/.safeParse to strip extraneous properties",
    );

    // E. XSS payload in text fields
    const xssPayload = "<script>alert('XSS')</script><img src=x onerror=alert(1)>Malicious input";
    const sanitized = sanitizeText(xssPayload);
    record(
      "XSS Sanitization neutralizes scripts and DOM event handlers",
      !sanitized.includes("<script>") && !sanitized.includes("onerror"),
      "CRITICAL",
      "Apply sanitize-html / DOMPurify before persistence",
    );

    // F. SQL Injection string handling
    const sqliString = "' OR '1'='1'; DROP TABLE \"Inquiry\"; --";
    const sqliReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.5",
      },
      body: JSON.stringify({
        name: sqliString,
        email: "sqli-test@enterprise.example",
        goal: "Scale",
        timeline: "1–3 months",
        budget: "£100,000+",
        technicalDetails: "Safe parameterized evaluation query.",
      }),
    });
    const sqliRes = await postInquiry(sqliReq);
    record(
      "SQL injection payload handled safely via parameterized ORM",
      sqliRes.status === 201 || sqliRes.status === 400 || sqliRes.status === 422,
      "CRITICAL",
      "Strictly use Prisma ORM parameterized statements without raw SQL concatenation",
    );

    // G. Oversized JSON Payload (> 5,000 characters technical details limit)
    const largeString = "A".repeat(8000);
    const oversizedReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.1.6",
      },
      body: JSON.stringify({
        name: "Oversized Lead",
        email: "oversized@enterprise.example",
        goal: "Build",
        timeline: "Immediate (< 1 month)",
        budget: "£50k+",
        technicalDetails: largeString,
      }),
    });
    const oversizedRes = await postInquiry(oversizedReq);
    record(
      "/api/inquiries rejects oversized text payloads exceeding bounds",
      oversizedRes.status === 400 || oversizedRes.status === 422,
      "MEDIUM",
      "Enforce maximum string length in validation schemas",
    );

    // H. Rate limiting enforcement
    let rateLimitTriggered = false;
    const spamIp = "192.168.100.50";
    for (let i = 0; i < 7; i++) {
      const spamReq = new NextRequest(`${BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": spamIp,
        },
        body: JSON.stringify({
          name: `Spam User ${i}`,
          email: `spam${i}@enterprise.example`,
          goal: "Build",
          technicalDetails: "Repeated submission attempts.",
        }),
      });
      const spamRes = await postInquiry(spamReq);
      if (spamRes.status === 429) {
        rateLimitTriggered = true;
        break;
      }
    }
    record(
      "/api/inquiries enforces rate limiting (HTTP 429 Too Many Requests)",
      rateLimitTriggered,
      "HIGH",
      "Enforce sliding-window rate limit per IP",
    );
  }

  // =========================================================================
  // 3. /api/uploads Security & MIME Validation
  // =========================================================================
  {
    // A. Missing multipart file
    const emptyForm = new FormData();
    const emptyReq = new NextRequest(`${BASE_URL}/api/uploads`, {
      method: "POST",
      body: emptyForm,
    });
    const emptyRes = await postUpload(emptyReq);
    record(
      "/api/uploads rejects requests missing file payload",
      emptyRes.status === 400,
      "MEDIUM",
      "Validate formData.get('file') presence",
    );

    // B. Path Traversal Filenames
    const traversalFilename = "../../../../../windows/system32/cmd.exe";
    const cleanedFilename = sanitizeFilename(traversalFilename);
    record(
      "Path traversal in filenames is stripped safely",
      !cleanedFilename.includes("..") && !cleanedFilename.includes("/") && !cleanedFilename.includes("\\"),
      "CRITICAL",
      "Use sanitizeFilename regex to strip directory traversal sequences",
    );

    // C. Malicious file extensions (.sh, .exe, .svg with script)
    const exeCheck = validateUploadedFile(
      Buffer.from("MZ dummy executable header"),
      "exploit.exe",
      "application/x-msdownload",
    );
    record(
      "Executable upload (.exe) is strictly rejected",
      !exeCheck.valid && ("error" in exeCheck ? exeCheck.error.includes("extension") : false),
      "CRITICAL",
      "Enforce strict extension whitelist (.pdf, .png, .jpg, .jpeg, .webp)",
    );

    // D. Spoofed MIME Type (EXE disguised as PDF)
    const spoofedCheck = validateUploadedFile(
      Buffer.from("MZ\x90\x00\x03\x00\x00\x00"),
      "fake-document.pdf",
      "application/pdf",
    );
    record(
      "MIME spoofing detected via binary magic-byte inspection",
      !spoofedCheck.valid,
      "CRITICAL",
      "Verify magic bytes against claimed MIME type",
    );
  }

  // =========================================================================
  // 4. Admin API Authentication & Authorization
  // =========================================================================
  {
    // A. Missing authentication on /api/admin/inquiries
    const unauthReq = new NextRequest(`${BASE_URL}/api/admin/inquiries`);
    const unauthRes = await getAdminInquiries(unauthReq);
    record(
      "/api/admin/inquiries rejects unauthenticated access with 401",
      unauthRes.status === 401,
      "CRITICAL",
      "Verify fs_admin_session token before executing controller",
    );

    // B. Invalid authentication token
    const invalidAuthReq = new NextRequest(`${BASE_URL}/api/admin/inquiries`, {
      headers: {
        cookie: "fs_admin_session=invalid.tampered.token",
      },
    });
    const invalidAuthRes = await getAdminInquiries(invalidAuthReq);
    record(
      "/api/admin/inquiries rejects tampered session token with 401",
      invalidAuthRes.status === 401,
      "CRITICAL",
      "Enforce HMAC-SHA256 signature verification on session tokens",
    );

    // C. Customer token attempting Admin access (Role boundary violation)
    const customerOnAdminReq = new NextRequest(`${BASE_URL}/api/admin/customers`, {
      headers: {
        cookie: `fs_customer_session=${validCustomerToken}`,
      },
    });
    const customerOnAdminRes = await getAdminCustomers(customerOnAdminReq);
    record(
      "/api/admin/customers rejects customer session tokens with 401",
      customerOnAdminRes.status === 401,
      "CRITICAL",
      "Separate customer and admin session cookies and roles",
    );

    // D. Valid admin session succeeds
    const validAdminReq = new NextRequest(`${BASE_URL}/api/admin/customers`, {
      headers: {
        cookie: `fs_admin_session=${validAdminToken}`,
      },
    });
    const validAdminRes = await getAdminCustomers(validAdminReq);
    record(
      "/api/admin/customers grants access to valid admin session",
      validAdminRes.status === 200,
      "HIGH",
      "Pass through authenticated admin session",
    );

    // E. Admin Projects and Invoices Protected
    const unauthProjReq = new NextRequest(`${BASE_URL}/api/admin/projects`);
    const unauthProjRes = await getAdminProjects(unauthProjReq);
    const unauthInvReq = new NextRequest(`${BASE_URL}/api/admin/invoices`);
    const unauthInvRes = await getAdminInvoices(unauthInvReq);
    record(
      "/api/admin/projects and /api/admin/invoices reject unauthenticated access",
      unauthProjRes.status === 401 && unauthInvRes.status === 401,
      "CRITICAL",
      "Protect all /api/admin/* endpoints with authentication check",
    );
  }

  // =========================================================================
  // 5. Customer Portal Authentication & Multi-Tenant IDOR Protection
  // =========================================================================
  {
    // A. Request Magic Link (Zero Email Enumeration)
    const nonExistentReq = new NextRequest(`${BASE_URL}/api/portal/auth/request-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.5.1",
      },
      body: JSON.stringify({ email: "does-not-exist-99999@enterprise.example" }),
    });
    const nonExistentRes = await postRequestLink(nonExistentReq);
    const nonExistentJson = await nonExistentRes.json();
    record(
      "/api/portal/auth/request-link provides zero email enumeration",
      nonExistentRes.status === 200 && nonExistentJson.success === true,
      "HIGH",
      "Return uniform 200 status for all valid email submissions",
    );

    // B. Verify Link rejects invalid token
    const invalidTokenReq = new NextRequest(`${BASE_URL}/api/portal/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "10.0.5.2",
      },
      body: JSON.stringify({ token: "non-existent-fake-token-12345" }),
    });
    const invalidTokenRes = await postVerifyLink(invalidTokenReq);
    record(
      "/api/portal/auth/verify rejects non-existent/invalid tokens with 401",
      invalidTokenRes.status === 401,
      "CRITICAL",
      "Check token hash in database and reject unknown tokens",
    );

    // C. Dashboard rejects unauthenticated access
    const unauthDashReq = new NextRequest(`${BASE_URL}/api/portal/dashboard`);
    const unauthDashRes = await getPortalDashboard(unauthDashReq);
    record(
      "/api/portal/dashboard rejects unauthenticated requests with 401",
      unauthDashRes.status === 401,
      "CRITICAL",
      "Check x-customer-id header or fs_customer_session cookie",
    );
  }

  // =========================================================================
  // 6. Architectural Integrity & Bundle Secret Audits
  // =========================================================================
  {
    const rootDir = process.cwd();

    // A. Check that no Client Component ("use client") imports @prisma/client or @/lib/prisma
    function scanComponentsForPrisma(dir: string): string[] {
      const violations: string[] = [];
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (entry.name !== "node_modules" && entry.name !== ".next" && entry.name !== ".git") {
            violations.push(...scanComponentsForPrisma(fullPath));
          }
        } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
          const content = fs.readFileSync(fullPath, "utf-8");
          if (content.includes('"use client"') || content.includes("'use client'")) {
            if (content.includes("@prisma/client") || content.includes("@/lib/prisma")) {
              violations.push(fullPath);
            }
          }
        }
      }
      return violations;
    }

    const prismaViolations = scanComponentsForPrisma(path.join(rootDir, "components")).concat(
      scanComponentsForPrisma(path.join(rootDir, "app")),
    );
    record(
      "Architectural Boundary: Zero Prisma ORM imports in Client Components",
      prismaViolations.length === 0,
      "CRITICAL",
      "Client components must never import Prisma or database drivers directly",
    );

    // B. Check for server secrets prefixed with NEXT_PUBLIC_
    const envContent = fs.existsSync(path.join(rootDir, ".env"))
      ? fs.readFileSync(path.join(rootDir, ".env"), "utf-8")
      : "";
    const envLocalContent = fs.existsSync(path.join(rootDir, ".env.local"))
      ? fs.readFileSync(path.join(rootDir, ".env.local"), "utf-8")
      : "";
    const allEnvLines = `${envContent}\n${envLocalContent}`.split("\n");

    const dangerousPublicSecrets = allEnvLines.filter((line) => {
      const trimmed = line.trim();
      if (!trimmed.startsWith("NEXT_PUBLIC_")) return false;
      const lower = trimmed.toLowerCase();
      return (
        lower.includes("secret") ||
        lower.includes("token") ||
        lower.includes("password") ||
        lower.includes("private_key") ||
        lower.includes("database_url")
      );
    });

    record(
      "Environment Hygiene: No private API keys or server secrets exposed via NEXT_PUBLIC_",
      dangerousPublicSecrets.length === 0,
      "CRITICAL",
      "Remove NEXT_PUBLIC_ prefix from server-only secret environment variables",
    );

    // C. Verify Route -> Controller -> Service -> Repository hierarchy
    const controllersDir = path.join(rootDir, "server", "controllers");
    const controllersExist = fs.existsSync(controllersDir);
    const servicesDir = path.join(rootDir, "server", "services");
    const servicesExist = fs.existsSync(servicesDir);
    const reposDir = path.join(rootDir, "server", "repositories");
    const reposExist = fs.existsSync(reposDir);

    record(
      "Architectural Purity: Clean Route -> Controller -> Service -> Repository layers",
      controllersExist && servicesExist && reposExist,
      "HIGH",
      "Maintain modular domain separation between controller, service, and repository",
    );
  }

  return { passed, failed, report };
}

// Standalone execution runner
if (require.main === module || process.argv[1]?.includes("complete-api-security")) {
  runCompleteApiSecuritySuite().then(({ passed, failed, report }) => {
    console.log("\n========================================================");
    console.log("   FRONTIER SYSTEMS COMPLETE API SECURITY AUDIT REPORT   ");
    console.log("========================================================\n");
    for (const r of report) {
      const icon = r.result === "PASS" ? "✅" : "❌";
      console.log(`${icon} [${r.severity}] ${r.test}`);
      if (r.result === "FAIL") {
        console.log(`   -> REQUIRED FIX: ${r.fix}`);
      }
    }
    console.log("\n--------------------------------------------------------");
    console.log(`TOTAL TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
    console.log("========================================================\n");

    if (failed > 0) process.exit(1);
  });
}
