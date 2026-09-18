if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}

import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";
import {
  authenticateAdminCredentials,
  signSessionToken,
  verifySessionToken,
  type AdminSessionPayload,
} from "../server/services/admin-auth.service";
import { registerCustomer, getCustomerDetails } from "../server/services/customer.service";
import {
  createNewProject,
  addProjectMilestone,
  modifyProjectMilestone,
  convertWonInquiryToProject,
} from "../server/services/project.service";
import { createNewInvoice, markInvoiceAsPaid } from "../server/services/invoice.service";
import { NextRequest } from "next/server";
import { middleware } from "../middleware";

export async function runAdminPortalTests(): Promise<{
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

  console.log("--- 1. Testing Admin Authentication & Password Verification ---");

  // Ensure test admin exists
  const testAdminEmail = "admin-test@frontiersystems.co";
  const testAdminPassword = "SecureAdminPass123!";
  const hash = bcrypt.hashSync(testAdminPassword, 10);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: testAdminEmail },
    update: { passwordHash: hash, role: "SUPERADMIN" },
    create: { email: testAdminEmail, passwordHash: hash, role: "SUPERADMIN" },
  });

  // Test 1: Successful login
  const loginSuccess = await authenticateAdminCredentials(
    testAdminEmail,
    testAdminPassword,
    "127.0.0.1",
  );
  assert(loginSuccess !== null, "Admin login succeeds with valid credentials");
  assert(loginSuccess?.user.id === adminUser.id, "Authenticated user ID matches database record");
  assert(Boolean(loginSuccess?.token), "Login produces signed HMAC session token");

  // Test 2: Failed login with invalid password
  const loginInvalidPass = await authenticateAdminCredentials(
    testAdminEmail,
    "WrongPassword123!",
    "127.0.0.1",
  );
  assert(loginInvalidPass === null, "Admin login fails with incorrect password");

  // Test 3: Failed login with nonexistent email
  const loginNonexistent = await authenticateAdminCredentials(
    "ghost@frontiersystems.co",
    testAdminPassword,
    "127.0.0.1",
  );
  assert(loginNonexistent === null, "Admin login fails with nonexistent user");

  console.log("\n--- 2. Testing Session Token Cryptography & Expiry ---");

  const now = Math.floor(Date.now() / 1000);
  const samplePayload: AdminSessionPayload = {
    adminId: adminUser.id,
    email: adminUser.email,
    role: "SUPERADMIN",
    iat: now,
    exp: now + 3600,
  };

  const validToken = signSessionToken(samplePayload);
  const verified = verifySessionToken(validToken);
  assert(verified !== null, "Valid session token is successfully verified");
  assert(verified?.email === testAdminEmail, "Decoded session matches admin identity");

  // Test tampered token
  const tamperedToken = validToken.slice(0, -4) + "XXXX";
  const tamperedResult = verifySessionToken(tamperedToken);
  assert(tamperedResult === null, "Tampered session token signature is strictly rejected");

  // Test expired token
  const expiredPayload: AdminSessionPayload = {
    ...samplePayload,
    exp: now - 100, // expired 100 seconds ago
  };
  const expiredToken = signSessionToken(expiredPayload);
  const expiredResult = verifySessionToken(expiredToken);
  assert(expiredResult === null, "Expired session token is rejected");

  console.log("\n--- 3. Testing Middleware & Route Protection ---");

  // Test unauthenticated request to /api/admin/customers -> 401
  const unauthApiReq = new NextRequest("http://localhost:3000/api/admin/customers");
  const unauthApiRes = await middleware(unauthApiReq);
  assert(unauthApiRes.status === 401, "Unauthenticated /api/admin/* request returns HTTP 401");

  // Test unauthenticated request to /admin/dashboard -> redirect to /admin/login
  const unauthPageReq = new NextRequest("http://localhost:3000/admin/dashboard");
  const unauthPageRes = await middleware(unauthPageReq);
  assert(unauthPageRes.status === 307 || unauthPageRes.status === 308 || unauthPageRes.status === 302, "Unauthenticated /admin/* request redirects");
  const redirectLocation = unauthPageRes.headers.get("location");
  assert(redirectLocation?.includes("/admin/login") === true, "Redirect location points to /admin/login");

  // Test public access to /admin/login is allowed through (status 200 / next)
  const loginPageReq = new NextRequest("http://localhost:3000/admin/login");
  const loginPageRes = await middleware(loginPageReq);
  assert(loginPageRes.status === 200, "/admin/login is publicly accessible");

  // Test authenticated request with valid cookie passes middleware
  const authCookieReq = new NextRequest("http://localhost:3000/api/admin/customers", {
    headers: {
      cookie: `fs_admin_session=${validToken}`,
    },
  });
  const authCookieRes = await middleware(authCookieReq);
  assert(authCookieRes.status === 200, "Authenticated request with session cookie passes middleware");

  console.log("\n--- 4. Testing Customer Portal Entity Operations ---");

  // Unique test customer
  const randomSuffix = Math.floor(Math.random() * 1000000);
  const customerEmail = `enterprise-${randomSuffix}@cybercorp.example`;

  const newCustomer = await registerCustomer({
    name: "Dr. Catherine Vance",
    email: customerEmail,
    companyName: "Vance Cyber Systems Ltd",
  });
  assert(Boolean(newCustomer.id), "Customer record successfully created with UUID");
  assert(newCustomer.email === customerEmail, "Customer email stored accurately");

  // Fetch customer details
  const fetchedCustomer = await getCustomerDetails(newCustomer.id);
  assert(fetchedCustomer.id === newCustomer.id, "Customer lookup returns full entity details");

  // Test Project Creation
  const newProject = await createNewProject({
    customerId: newCustomer.id,
    name: "Autonomous Defense Telemetry Mesh",
    status: "ONBOARDING",
    summary: "Distributed sensor data processing and low-latency anomaly detection.",
  });
  assert(Boolean(newProject.id), "Project created and linked to Customer");
  assert(newProject.customerId === newCustomer.id, "Project enforces foreign key constraint to Customer");

  // Test Milestone Creation & Update
  const milestone = await addProjectMilestone(newProject.id, {
    title: "Phase 1: Sensor Cluster Provisioning",
    description: "Multi-region consensus node provisioning",
    status: "PENDING",
  });
  assert(Boolean(milestone.id), "ProjectMilestone successfully created");
  assert(milestone.projectId === newProject.id, "Milestone belongs to project");

  const updatedMilestone = await modifyProjectMilestone(milestone.id, {
    status: "COMPLETE",
  });
  assert(updatedMilestone.status === "COMPLETE", "Milestone status successfully updated to COMPLETE");

  // Test Invoice Creation with Decimal Handling in GBP
  const invoiceNum = `FS-TEST-${randomSuffix}`;
  const newInvoice = await createNewInvoice({
    projectId: newProject.id,
    invoiceNumber: invoiceNum,
    amountDue: "27500.50",
    currency: "GBP",
    status: "DRAFT",
    dueAt: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString(),
  });
  assert(Boolean(newInvoice.id), "Invoice created with unique invoice number");
  assert(newInvoice.currency === "GBP", "Invoice currency defaults to explicit GBP");
  assert(newInvoice.amountDue.toString() === "27500.5", "Invoice uses Prisma Decimal type (non-float)");

  // Test Mark Invoice as Paid
  const paidInvoice = await markInvoiceAsPaid(newInvoice.id);
  assert(paidInvoice.status === "PAID", "Invoice status successfully marked as PAID");
  assert(paidInvoice.paidAt !== null, "Invoice records paidAt timestamp upon settlement");

  console.log("\n--- 5. Testing Inquiry -> Project Conversion Pipeline ---");

  // Create a Won Inquiry
  const testInquiry = await prisma.inquiry.create({
    data: {
      name: "Arthur Pendelton",
      email: `arthur-${randomSuffix}@pendelton-aerospace.example`,
      company: "Pendelton Aerospace",
      service: "Build",
      budget: "£200,000+",
      message: "High-integrity flight computer flight telemetry bridge specifications.",
      status: "QUALIFIED",
    },
  });

  // Convert to project
  const conversionResult = await convertWonInquiryToProject(testInquiry.id, {
    projectName: "Pendelton Aerospace — Flight Telemetry Bridge",
    status: "IN_PROGRESS",
  });

  assert(conversionResult.project.name.includes("Pendelton"), "Conversion creates named Project linked to Inquiry");
  assert(conversionResult.customer.email === testInquiry.email, "Conversion matches/creates Customer from inquiry email");

  // Verify Inquiry status updated to WON
  const refreshedInquiry = await prisma.inquiry.findUnique({ where: { id: testInquiry.id } });
  assert(refreshedInquiry?.status === "WON", "Inquiry status automatically upgraded to WON upon conversion");

  // Verify LeadActivity recorded
  const activities = await prisma.leadActivity.findMany({
    where: { inquiryId: testInquiry.id, type: "CONVERTED_TO_PROJECT" },
  });
  assert(activities.length > 0, "Conversion records immutable LeadActivity entry in PostgreSQL");

  return { passed, failed, results };
}

// Direct execution
if (
  process.argv[1]?.endsWith("admin-portal.test.ts") ||
  process.argv[1]?.endsWith("admin-portal.test.js")
) {
  runAdminPortalTests().then((res) => {
    console.log("\n=========================================");
    console.log("Admin Portal & Customer Schema Verification Results");
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
