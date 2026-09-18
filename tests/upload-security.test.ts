import { NextRequest } from "next/server";
import { handleFileUpload, handleGetAttachment, handleGetSignedUrl } from "../server/controllers/upload.controller";
import { SecureDiskStorageProvider } from "../server/storage/storage.provider";
import { findAttachmentsByInquiryId } from "../server/repositories/attachment.repository";
import { handleCreateInquiry } from "../server/controllers/inquiry.controller";
import { resetRateLimits } from "../lib/security/rate-limit";

if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    try {
      process.loadEnvFile(".env");
    } catch {}
  }
}

// Ensure test environment
(process.env as Record<string, string | undefined>).NODE_ENV = "test";
const TEST_ADMIN_KEY = process.env.ADMIN_API_KEY || "frontier-admin-secret-key";

// Binary fixtures
const VALID_PDF_HEADER = Buffer.concat([
  Buffer.from("%PDF-1.4\n%âãÏÓ\n"),
  Buffer.alloc(500, 0x20),
  Buffer.from("\n%%EOF\n"),
]);

const VALID_PNG_HEADER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

const VALID_JPEG_HEADER = Buffer.from(
  "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/wAALCAABAAEBAREA/8QAFAABAAAAAAAAAAAAAAAAAAAAAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAD8AP//Z",
  "base64",
);

const FAKE_SCRIPT_DISGUISED_AS_PDF = Buffer.from(
  "#!/bin/bash\necho 'Malicious script payload execution attempt'\nrm -rf /\n",
);

const EXECUTABLE_BINARY_PE = Buffer.concat([
  Buffer.from("MZ\x90\x00\x03\x00\x00\x00\x04\x00\x00\x00\xff\xff\x00\x00"),
  Buffer.alloc(200, 0x00),
]);

function createMultipartUploadRequest(
  fileBuffer: Buffer,
  filename: string,
  mimeType: string,
  ip: string = "198.51.100.99",
): NextRequest {
  const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;

  const body = Buffer.concat([
    Buffer.from(header, "utf-8"),
    fileBuffer,
    Buffer.from(footer, "utf-8"),
  ]);

  return new NextRequest("http://localhost:3000/api/uploads", {
    method: "POST",
    headers: {
      "content-type": `multipart/form-data; boundary=${boundary}`,
      "origin": "http://localhost:3000",
      "x-forwarded-for": ip,
    },
    body,
  });
}

export async function runUploadSecurityTests(): Promise<{ passed: number; failed: number }> {
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${description}`);
      failed++;
    }
  }

  console.log("\n=========================================");
  console.log("RUNNING SECURE FILE UPLOAD SPECIFICATION TESTS");
  console.log("=========================================\n");

  resetRateLimits();

  // -------------------------------------------------------------------------
  // SECTION 1: ALLOWED FILES
  // -------------------------------------------------------------------------
  console.log("--- 1. Testing Allowed Files & Integrity ---");

  // Test 1.1: Valid PDF Upload
  const pdfReq = createMultipartUploadRequest(VALID_PDF_HEADER, "System_Architecture_RFP.pdf", "application/pdf", "10.0.0.1");
  const pdfRes = await handleFileUpload(pdfReq);
  assert(pdfRes.status === 201, "Valid PDF binary uploads successfully (HTTP 201)");

  const pdfJson = (await pdfRes.json()) as {
    success: boolean;
    data: { id: string; storageKey: string; mimeType: string; sizeBytes: number; sha256: string };
  };
  assert(pdfJson.success === true, "Upload response returns success: true");
  assert(typeof pdfJson.data.id === "string" && pdfJson.data.id.length > 0, "Upload returns opaque attachment ID");
  assert(pdfJson.data.mimeType === "application/pdf", "Upload confirms verified MIME type (application/pdf)");
  assert(typeof pdfJson.data.sha256 === "string" && pdfJson.data.sha256.length === 64, "Upload computes 64-char SHA-256 integrity hash");

  // Test 1.2: Valid PNG Upload
  const pngReq = createMultipartUploadRequest(VALID_PNG_HEADER, "Network_Diagram.png", "image/png", "10.0.0.2");
  const pngRes = await handleFileUpload(pngReq);
  assert(pngRes.status === 201, "Valid PNG binary uploads successfully (HTTP 201)");

  // Test 1.3: Valid JPEG Upload
  const jpgReq = createMultipartUploadRequest(VALID_JPEG_HEADER, "Server_Rack_Spec.jpg", "image/jpeg", "10.0.0.3");
  const jpgRes = await handleFileUpload(jpgReq);
  assert(jpgRes.status === 201, "Valid JPEG binary uploads successfully (HTTP 201)");

  // -------------------------------------------------------------------------
  // SECTION 2: REJECTED EXECUTABLE & DANGEROUS FILES
  // -------------------------------------------------------------------------
  console.log("\n--- 2. Testing Prohibited & Dangerous Extensions ---");

  // Test 2.1: .exe file prohibited
  const exeReq = createMultipartUploadRequest(EXECUTABLE_BINARY_PE, "malware.exe", "application/x-msdownload", "10.0.0.4");
  const exeRes = await handleFileUpload(exeReq);
  assert(exeRes.status === 422, "Executable .exe upload strictly prohibited (HTTP 422)");

  // Test 2.2: .sh script prohibited
  const shReq = createMultipartUploadRequest(Buffer.from("#!/bin/bash\necho test"), "exploit.sh", "application/x-sh", "10.0.0.5");
  const shRes = await handleFileUpload(shReq);
  assert(shRes.status === 422, "Shell script .sh upload strictly prohibited (HTTP 422)");

  // Test 2.3: .php file prohibited
  const phpReq = createMultipartUploadRequest(Buffer.from("<?php phpinfo(); ?>"), "backdoor.php", "application/x-php", "10.0.0.6");
  const phpRes = await handleFileUpload(phpReq);
  assert(phpRes.status === 422, "PHP script upload strictly prohibited (HTTP 422)");

  // Test 2.4: .html / .svg prohibited (XSS prevention)
  const htmlReq = createMultipartUploadRequest(Buffer.from("<script>alert(1)</script>"), "payload.html", "text/html", "10.0.0.7");
  const htmlRes = await handleFileUpload(htmlReq);
  assert(htmlRes.status === 422, "HTML file upload strictly prohibited (HTTP 422)");

  // -------------------------------------------------------------------------
  // SECTION 3: INVALID & SPOOFED MIME VERIFICATION (MAGIC BYTES)
  // -------------------------------------------------------------------------
  console.log("\n--- 3. Testing Magic-Byte & Spoofed Content Inspection ---");

  // Test 3.1: Script disguised as .pdf
  const spoofPdfReq = createMultipartUploadRequest(FAKE_SCRIPT_DISGUISED_AS_PDF, "architecture.pdf", "application/pdf", "10.0.0.8");
  const spoofPdfRes = await handleFileUpload(spoofPdfReq);
  assert(spoofPdfRes.status === 422, "Script disguised as .pdf rejected by magic-byte inspection (HTTP 422)");

  // Test 3.2: Disguised text disguised as .png
  const spoofPngReq = createMultipartUploadRequest(Buffer.from("This is plain text disguised as a png image"), "diagram.png", "image/png", "10.0.0.9");
  const spoofPngRes = await handleFileUpload(spoofPngReq);
  assert(spoofPngRes.status === 422, "Text disguised as .png rejected by magic-byte inspection (HTTP 422)");

  // Test 3.3: Mismatched extension vs true content (PNG binary named .pdf)
  const extMismatchReq = createMultipartUploadRequest(VALID_PNG_HEADER, "document.pdf", "application/pdf", "10.0.0.10");
  const extMismatchRes = await handleFileUpload(extMismatchReq);
  assert(extMismatchRes.status === 422, "Extension/content mismatch (PNG in .pdf extension) rejected (HTTP 422)");

  // -------------------------------------------------------------------------
  // SECTION 4: SIZE LIMIT ENFORCEMENT
  // -------------------------------------------------------------------------
  console.log("\n--- 4. Testing File Size Limits ---");

  // Test 4.1: Empty file rejected
  const emptyReq = createMultipartUploadRequest(Buffer.alloc(0), "empty.pdf", "application/pdf", "10.0.0.11");
  const emptyRes = await handleFileUpload(emptyReq);
  assert(emptyRes.status === 422, "Zero-byte empty file upload rejected (HTTP 422)");

  // Test 4.2: Oversized file (> 5MB)
  const oversizedBuffer = Buffer.concat([
    Buffer.from("%PDF-1.4\n"),
    Buffer.alloc(5.2 * 1024 * 1024, 0x41),
    Buffer.from("\n%%EOF\n"),
  ]);
  const oversizedReq = createMultipartUploadRequest(oversizedBuffer, "large_file.pdf", "application/pdf", "10.0.0.12");
  const oversizedRes = await handleFileUpload(oversizedReq);
  assert(oversizedRes.status === 422, "File exceeding 5MB strictly rejected (HTTP 422)");

  // -------------------------------------------------------------------------
  // SECTION 5: UNAUTHORIZED ACCESS CONTROL (PRIVACY)
  // -------------------------------------------------------------------------
  console.log("\n--- 5. Testing Unauthorized & Private File Access ---");

  const uploadedPdfId = pdfJson.data.id;

  // Test 5.1: Unauthenticated request to /api/uploads/[id]
  const unauthReq = new NextRequest(`http://localhost:3000/api/uploads/${uploadedPdfId}`, {
    method: "GET",
  });
  const unauthRes = await handleGetAttachment(unauthReq, uploadedPdfId);
  assert(unauthRes.status === 401, "Unauthenticated GET /api/uploads/[id] returns HTTP 401 Unauthorized");

  // Test 5.2: Invalid Bearer token
  const badTokenReq = new NextRequest(`http://localhost:3000/api/uploads/${uploadedPdfId}`, {
    method: "GET",
    headers: { authorization: "Bearer invalid-tampered-token-xyz" },
  });
  const badTokenRes = await handleGetAttachment(badTokenReq, uploadedPdfId);
  assert(badTokenRes.status === 401, "Invalid Bearer token returns HTTP 401 Unauthorized");

  // Test 5.3: Tampered signature on signed URL
  const tamperedUrlReq = new NextRequest(
    `http://localhost:3000/api/uploads/${uploadedPdfId}?token=0000000000000000000000000000000000000000000000000000000000000000&expires=${Math.floor(Date.now() / 1000) + 300}&fn=test.pdf`,
    { method: "GET" },
  );
  const tamperedRes = await handleGetAttachment(tamperedUrlReq, uploadedPdfId);
  assert(tamperedRes.status === 403, "Tampered cryptographic signature returns HTTP 403 Forbidden");

  // Test 5.4: Expired signature on signed URL
  const expiredTimestamp = Math.floor(Date.now() / 1000) - 100; // 100s in the past
  const expiredUrlReq = new NextRequest(
    `http://localhost:3000/api/uploads/${uploadedPdfId}?token=abcdef&expires=${expiredTimestamp}&fn=test.pdf`,
    { method: "GET" },
  );
  const expiredRes = await handleGetAttachment(expiredUrlReq, uploadedPdfId);
  assert(expiredRes.status === 403, "Expired signed URL returns HTTP 403 Forbidden");

  // -------------------------------------------------------------------------
  // SECTION 6: AUTHORIZED PRIVATE FILE ACCESS & SHORT-LIVED SIGNED URLS
  // -------------------------------------------------------------------------
  console.log("\n--- 6. Testing Authorized Access & Short-Lived Signed URLs ---");

  // Test 6.1: Admin access via valid Bearer token
  const adminReq = new NextRequest(`http://localhost:3000/api/uploads/${uploadedPdfId}`, {
    method: "GET",
    headers: { authorization: `Bearer ${TEST_ADMIN_KEY}` },
  });
  const adminRes = await handleGetAttachment(adminReq, uploadedPdfId);
  assert(adminRes.status === 200, "Admin with valid Bearer token successfully downloads file (HTTP 200)");
  assert(adminRes.headers.get("x-content-type-options") === "nosniff", "Response enforces X-Content-Type-Options: nosniff");
  assert(adminRes.headers.get("cache-control")?.includes("private") === true, "Response enforces Cache-Control: private, no-store");
  assert(adminRes.headers.get("content-disposition")?.includes("attachment") === true, "Response enforces Content-Disposition: attachment");

  // Test 6.2: Signed URL Generation via Admin Endpoint
  const signGenReq = new NextRequest(`http://localhost:3000/api/uploads/${uploadedPdfId}/signed-url`, {
    method: "GET",
    headers: { authorization: `Bearer ${TEST_ADMIN_KEY}` },
  });
  const signGenRes = await handleGetSignedUrl(signGenReq, uploadedPdfId);
  assert(signGenRes.status === 200, "Admin can generate short-lived signed URL (HTTP 200)");

  const signGenJson = (await signGenRes.json()) as {
    success: boolean;
    data: { signedUrl: string; expiresInSeconds: number };
  };
  assert(typeof signGenJson.data.signedUrl === "string" && signGenJson.data.signedUrl.length > 0, "Signed URL successfully generated");
  assert(signGenJson.data.expiresInSeconds === 300, "Signed URL enforces 300-second (5-minute) short-lived TTL");

  // Test 6.3: Accessing file using the generated signed URL
  if (signGenJson.data.signedUrl.startsWith("http")) {
    const cloudFetchRes = await fetch(signGenJson.data.signedUrl);
    assert(cloudFetchRes.status === 200, "Client successfully accesses file using short-lived signed URL (HTTP 200)");
  }

  // Test 6.4: Local HMAC-signed token validation on /api/uploads/[id]
  const diskProvider = new SecureDiskStorageProvider();
  const diskSignedUrl = await diskProvider.getSignedDownloadUrl(pdfJson.data.storageKey, "System_Architecture_RFP.pdf", 300);
  const diskFetchReq = new NextRequest(diskSignedUrl, { method: "GET" });
  const diskFetchRes = await handleGetAttachment(diskFetchReq, uploadedPdfId);
  assert(diskFetchRes.status === 200, "Client successfully downloads file via signed HMAC token on /api/uploads/[id] (HTTP 200)");

  // -------------------------------------------------------------------------
  // SECTION 7: INQUIRY LINKING & DATABASE RELATIONSHIP
  // -------------------------------------------------------------------------
  console.log("\n--- 7. Testing Inquiry Association & Database Relationships ---");

  // Submit inquiry referencing the uploaded PDF
  const inquiryReq = new NextRequest("http://localhost:3000/api/inquiries", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "origin": "http://localhost:3000",
      "x-forwarded-for": "10.0.0.50",
    },
    body: JSON.stringify({
      client_name: "Defense Systems Architecture Corp",
      email: `procurement-${Date.now()}@defensesystems.example`,
      project_type: "Modernize",
      timeline: "Within 3 months",
      custom_budget: "$250,000+",
      technical_details: "Detailed defense avionics RFP attached for review.",
      turnstile_token: "mock-turnstile-token",
      attachment_references: [uploadedPdfId],
    }),
  });

  const inquiryRes = await handleCreateInquiry(inquiryReq);
  assert(inquiryRes.status === 201, "Inquiry with valid attachment reference accepted (HTTP 201)");

  const inqJson = (await inquiryRes.json()) as { data: { id: string } };
  const inquiryId = inqJson.data.id;

  // Verify attachment record is linked to the inquiry
  const linkedAttachments = await findAttachmentsByInquiryId(inquiryId);
  assert(linkedAttachments.length === 1, "Attachment record successfully linked to inquiry in database");
  assert(linkedAttachments[0]?.id === uploadedPdfId || linkedAttachments[0]?.storageKey === pdfJson.data.storageKey, "Linked attachment matches uploaded attachment ID");

  console.log("\n=========================================");
  console.log(`Upload Security Test Summary: ${passed} passed, ${failed} failed`);
  console.log("=========================================\n");

  return { passed, failed };
}

if (process.argv[1]?.includes("upload-security.test")) {
  runUploadSecurityTests().then(({ failed }) => {
    if (failed > 0) process.exit(1);
  });
}

export {};
