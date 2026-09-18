if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}

import crypto from "crypto";
import { prisma } from "../lib/prisma";
import {
  requestCustomerMagicLink,
  verifyCustomerMagicLink,
  CUSTOMER_COOKIE_NAME,
} from "../server/services/portal-auth.service";
import {
  getCustomerProjectDetails,
  uploadCustomerProjectDoc,
  getCustomerInvoiceDetails,
  getCustomerDocumentSignedUrl,
  getCustomerInvoicePdfSignedUrl,
} from "../server/services/portal.service";
import { createProjectDocument } from "../server/repositories/project.repository";
import { createInvoice } from "../server/repositories/invoice.repository";
import { resetRateLimits } from "../lib/security/rate-limit";
import { lastSentMagicLinks } from "../server/services/email.service";
import { middleware } from "../middleware";
import { NextRequest } from "next/server";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { getOrganizationJsonLd } from "../lib/seo";

export async function runPortalIntegrationTests(): Promise<{
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

  console.log("\n========================================================");
  console.log("   FRONTIER SYSTEMS // CUSTOMER PORTAL INTEGRATION TESTS");
  console.log("========================================================\n");

  resetRateLimits();

  // -------------------------------------------------------------------------
  // Setup: Create two distinct customers for tenant isolation testing
  // -------------------------------------------------------------------------
  const customerA = await prisma.customer.upsert({
    where: { email: "acme-corp-client@enterprise.com" },
    update: { name: "Acme Corp Lead", companyName: "Acme Corporation" },
    create: {
      email: "acme-corp-client@enterprise.com",
      name: "Acme Corp Lead",
      companyName: "Acme Corporation",
    },
  });

  const customerB = await prisma.customer.upsert({
    where: { email: "globex-client@enterprise.com" },
    update: { name: "Globex Client Lead", companyName: "Globex International" },
    create: {
      email: "globex-client@enterprise.com",
      name: "Globex Client Lead",
      companyName: "Globex International",
    },
  });

  // Setup projects and invoices
  const projectA = await prisma.project.create({
    data: {
      customerId: customerA.id,
      name: "Acme High-Frequency AI Pipeline",
      status: "IN_PROGRESS",
      summary: "Mission-critical AI pipeline for automated settlement.",
    },
  });

  const projectB = await prisma.project.create({
    data: {
      customerId: customerB.id,
      name: "Globex Distributed Telemetry Mesh",
      status: "IN_PROGRESS",
      summary: "Private cluster mesh for Globex.",
    },
  });

  const docB = await createProjectDocument({
    projectId: projectB.id,
    fileName: "globex-confidential-brief.pdf",
    storageKey: `globex_doc_${Date.now()}.pdf`,
    mimeType: "application/pdf",
    fileSize: 1024 * 150,
    uploadedBy: "ADMIN",
  });

  const invoiceB = await createInvoice({
    projectId: projectB.id,
    invoiceNumber: `INV-GLOBEX-${Date.now().toString().slice(-6)}`,
    status: "SENT",
    amountDue: new (await import("@prisma/client")).Prisma.Decimal("85000.00"),
    currency: "GBP",
    dueAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    pdfStorageKey: `invoice_globex_${Date.now()}.pdf`,
  });

  // -------------------------------------------------------------------------
  // 1. Passwordless Magic Link Request (Existing & Non-Existent)
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing Passwordless Magic Link Dispatch ---");

  lastSentMagicLinks.length = 0;
  const reqResA = await requestCustomerMagicLink(customerA.email, "192.168.20.1");
  assert(reqResA.success === true, "Magic link requested for existing customer returns success");
  assert(lastSentMagicLinks.length > 0, "Magic link email recorded in dispatch queue");

  const sentEmail = lastSentMagicLinks[lastSentMagicLinks.length - 1];
  assert(
    Boolean(sentEmail?.verifyUrl.includes("/portal/verify?token=")),
    "Dispatched email contains signed verify URL",
  );

  // Non-existent email request (Zero Enumeration Test)
  const reqResNonExistent = await requestCustomerMagicLink(
    "completely-unknown-email@nonexistent.domain",
    "192.168.20.2",
  );
  assert(
    reqResNonExistent.success === true,
    "Non-existent customer email returns identical success without leaking existence",
  );

  // -------------------------------------------------------------------------
  // 2. Token Verification & Single-Use Enforcement
  // -------------------------------------------------------------------------
  console.log("--- 2. Testing Token Verification, Expiry & Single-Use ---");

  const urlObj = new URL(sentEmail!.verifyUrl);
  const rawToken = urlObj.searchParams.get("token")!;

  const verifyResult = await verifyCustomerMagicLink(rawToken, "192.168.20.1");
  assert(verifyResult.success === true, "Valid raw token successfully verified");
  assert(Boolean(verifyResult.sessionToken), "Signed customer session token issued");
  assert(verifyResult.customer?.id === customerA.id, "Authenticated customer profile matched");

  // Reused token rejection
  const reuseResult = await verifyCustomerMagicLink(rawToken, "192.168.20.1");
  assert(
    reuseResult.success === false && reuseResult.error === "REUSED",
    "Consumed token is strictly rejected on second attempt (single-use invariant)",
  );

  // Expired token rejection
  const expiredRaw = crypto.randomBytes(32).toString("hex");
  const expiredHash = crypto.createHash("sha256").update(expiredRaw).digest("hex");
  await prisma.magicLinkToken.create({
    data: {
      customerId: customerA.id,
      tokenHash: expiredHash,
      expiresAt: new Date(Date.now() - 60 * 1000), // 1 minute in the past
    },
  });

  const expiredResult = await verifyCustomerMagicLink(expiredRaw, "192.168.20.1");
  assert(
    expiredResult.success === false && expiredResult.error === "EXPIRED",
    "Expired magic link token is strictly rejected",
  );

  // -------------------------------------------------------------------------
  // 3. Strict Server-Side IDOR Prevention Tests
  // -------------------------------------------------------------------------
  console.log("--- 3. Testing Strict Server-Side IDOR Defense ---");

  // Customer A attempts to view Customer B's project
  let idorProjectBlocked = false;
  try {
    await getCustomerProjectDetails(customerA.id, projectB.id);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && ("statusCode" in err || "code" in err)) {
      const e = err as { statusCode?: number; code?: string };
      if (e.statusCode === 404 || e.code === "NOT_FOUND") {
        idorProjectBlocked = true;
      }
    }
  }
  assert(
    idorProjectBlocked,
    "IDOR Blocked: Customer A cannot view Customer B's project even with valid project UUID",
  );

  // Customer A attempts to view Customer B's invoice
  let idorInvoiceBlocked = false;
  try {
    await getCustomerInvoiceDetails(customerA.id, invoiceB.id);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && ("statusCode" in err || "code" in err)) {
      const e = err as { statusCode?: number; code?: string };
      if (e.statusCode === 404 || e.code === "NOT_FOUND") {
        idorInvoiceBlocked = true;
      }
    }
  }
  assert(
    idorInvoiceBlocked,
    "IDOR Blocked: Customer A cannot view Customer B's invoice statement",
  );

  // Customer A attempts to generate signed URL for Customer B's document
  let idorDocUrlBlocked = false;
  try {
    await getCustomerDocumentSignedUrl(customerA.id, docB.id);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && ("statusCode" in err || "code" in err)) {
      const e = err as { statusCode?: number; code?: string };
      if (e.statusCode === 404 || e.code === "NOT_FOUND") {
        idorDocUrlBlocked = true;
      }
    }
  }
  assert(
    idorDocUrlBlocked,
    "IDOR Blocked: Customer A cannot generate signed download URL for Customer B's document",
  );

  // Customer A attempts to generate signed URL for Customer B's invoice PDF
  let idorPdfUrlBlocked = false;
  try {
    await getCustomerInvoicePdfSignedUrl(customerA.id, invoiceB.id);
  } catch (err: unknown) {
    if (typeof err === "object" && err !== null && ("statusCode" in err || "code" in err)) {
      const e = err as { statusCode?: number; code?: string };
      if (e.statusCode === 404 || e.code === "NOT_FOUND") {
        idorPdfUrlBlocked = true;
      }
    }
  }
  assert(
    idorPdfUrlBlocked,
    "IDOR Blocked: Customer A cannot generate signed PDF link for Customer B's invoice",
  );

  // Verify Customer A CAN view their own project
  const ownProject = await getCustomerProjectDetails(customerA.id, projectA.id);
  assert(ownProject.id === projectA.id, "Customer A successfully accesses their own project");

  // -------------------------------------------------------------------------
  // 4. Customer Document Upload & Signed URL Generation
  // -------------------------------------------------------------------------
  console.log("--- 4. Testing Document Upload & Secure Download ---");

  const testPdfBuffer = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
  const uploadedDoc = await uploadCustomerProjectDoc(
    customerA.id,
    projectA.id,
    testPdfBuffer,
    "Architecture_Brief_2026.pdf",
    "application/pdf",
  );
  assert(uploadedDoc.uploadedBy === "CUSTOMER", "Uploaded document records uploadedBy as CUSTOMER");

  const downloadInfo = await getCustomerDocumentSignedUrl(customerA.id, uploadedDoc.id);
  assert(
    Boolean(downloadInfo.signedUrl),
    "Short-lived signed download URL successfully generated for customer document",
  );
  assert(
    downloadInfo.expiresInSeconds === 300,
    "Signed URL enforces short-lived 5-minute (300s) TTL",
  );

  // -------------------------------------------------------------------------
  // 5. Middleware & Session Isolation Tests
  // -------------------------------------------------------------------------
  console.log("--- 5. Testing Middleware & Route Separation ---");

  const customerSession = verifyResult.sessionToken!;

  // Customer session accessing /portal/dashboard -> Allowed
  const portalReq = new NextRequest("http://localhost:3000/portal/dashboard", {
    headers: { cookie: `${CUSTOMER_COOKIE_NAME}=${customerSession}` },
  });
  const portalRes = await middleware(portalReq);
  assert(
    portalRes.status !== 307 && portalRes.status !== 401,
    "Customer session granted access to /portal/dashboard",
  );

  // Customer session attempting to access /admin -> Blocked & redirected to /admin/login
  const adminWithCustomerReq = new NextRequest("http://localhost:3000/admin/dashboard", {
    headers: { cookie: `${CUSTOMER_COOKIE_NAME}=${customerSession}` },
  });
  const adminWithCustomerRes = await middleware(adminWithCustomerReq);
  assert(
    adminWithCustomerRes.status === 307 &&
      Boolean(adminWithCustomerRes.headers.get("location")?.includes("/admin/login")),
    "Customer session is strictly blocked from /admin routes (redirected to /admin/login)",
  );

  // Customer session attempting to access /api/admin/* -> 401 UNAUTHORIZED
  const adminApiWithCustomerReq = new NextRequest("http://localhost:3000/api/admin/inquiries", {
    headers: { cookie: `${CUSTOMER_COOKIE_NAME}=${customerSession}` },
  });
  const adminApiWithCustomerRes = await middleware(adminApiWithCustomerReq);
  assert(
    adminApiWithCustomerRes.status === 401,
    "Customer session is strictly blocked from /api/admin/* with 401 UNAUTHORIZED",
  );

  // Unauthenticated request to /portal/dashboard -> Redirected to /portal/login
  const unauthPortalReq = new NextRequest("http://localhost:3000/portal/dashboard");
  const unauthPortalRes = await middleware(unauthPortalReq);
  assert(
    unauthPortalRes.status === 307 &&
      Boolean(unauthPortalRes.headers.get("location")?.includes("/portal/login")),
    "Unauthenticated request to /portal/dashboard redirected to /portal/login",
  );

  // -------------------------------------------------------------------------
  // 6. Rate Limiting Tests
  // -------------------------------------------------------------------------
  console.log("--- 6. Testing Rate Limiting on Magic Link & Auth Endpoints ---");

  resetRateLimits();
  let wasRateLimited = false;
  // Trigger rate limit for single IP (limit is 10)
  for (let i = 0; i < 15; i++) {
    const res = await requestCustomerMagicLink(`user${i}@domain.com`, "10.0.0.99");
    if (res.rateLimited) {
      wasRateLimited = true;
      break;
    }
  }
  assert(wasRateLimited, "Sliding-window rate limiter triggered on repeated requests from same IP");
  resetRateLimits();

  // -------------------------------------------------------------------------
  // 7. SEO, Robots & Sitemap Exclusion Tests
  // -------------------------------------------------------------------------
  console.log("--- 7. Testing SEO, Robots & Sitemap Exclusions ---");

  const robotsData = robots();
  const disallows = Array.isArray(robotsData.rules)
    ? (robotsData.rules[0] as { disallow: string[] })?.disallow || []
    : [];
  assert(
    disallows.includes("/portal/") && disallows.includes("/api/portal/"),
    "robots.txt disallows /portal/ and /api/portal/",
  );
  assert(
    disallows.includes("/admin/") && disallows.includes("/api/"),
    "robots.txt disallows /admin/ and /api/",
  );

  const sitemapData = await sitemap();
  const sitemapUrls = sitemapData.map((e) => e.url);

  assert(
    !sitemapUrls.some((u) => u.includes("/portal")),
    "sitemap.xml strictly omits all /portal routes",
  );
  assert(
    !sitemapUrls.some((u) => u.includes("/admin")),
    "sitemap.xml strictly omits all /admin routes",
  );
  assert(
    sitemapUrls.some((u) => u.endsWith("/privacy-policy")),
    "sitemap.xml includes /privacy-policy",
  );
  assert(
    sitemapUrls.some((u) => u.endsWith("/cookie-policy")),
    "sitemap.xml includes /cookie-policy",
  );
  assert(
    sitemapUrls.some((u) => u.endsWith("/terms")),
    "sitemap.xml includes /terms",
  );

  // Structured Data Validation
  const orgJsonLd = getOrganizationJsonLd();
  assert(
    orgJsonLd["@type"] === "Organization",
    "Organization JSON-LD has valid Schema.org @type",
  );
  assert(
    orgJsonLd.address?.addressCountry === "GB" && orgJsonLd.address?.addressLocality === "London",
    "Organization JSON-LD contains UK address specification",
  );
  assert(
    Array.isArray(orgJsonLd.areaServed) &&
      orgJsonLd.areaServed.some((a) => a.name === "United Kingdom"),
    "Organization JSON-LD declares UK areaServed",
  );

  // Cleanup test artifacts from DB
  await prisma.projectDocument.deleteMany({ where: { projectId: projectA.id } });
  await prisma.projectDocument.deleteMany({ where: { projectId: projectB.id } });
  await prisma.invoice.deleteMany({ where: { projectId: projectB.id } });
  await prisma.project.deleteMany({ where: { id: { in: [projectA.id, projectB.id] } } });
  await prisma.magicLinkToken.deleteMany({ where: { customerId: customerA.id } });

  console.log("\n========================================================");
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log("========================================================\n");

  for (const r of results) {
    console.log(r);
  }

  return { passed, failed, results };
}

if (require.main === module || process.argv[1]?.includes("portal-integration.test")) {
  runPortalIntegrationTests()
    .then((res) => {
      if (res.failed > 0) process.exit(1);
    })
    .catch((err) => {
      console.error("Test execution failed:", err);
      process.exit(1);
    });
}
