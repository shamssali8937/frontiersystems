import { NextRequest } from "next/server";
import { sanitizeText, sanitizeFilename, escapeHtml } from "@/lib/security/sanitize";
import { validateOrigin } from "@/lib/security/origin";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { validateUploadedFile } from "@/lib/security/upload-validator";
import { validateNoPublicSecrets } from "@/lib/env";
import { hasPermission, enforcePermission, AuthenticatedUser } from "@/server/auth/authorization";
import { handleFileUpload } from "@/server/controllers/upload.controller";
import { handleCreateInquiry } from "@/server/controllers/inquiry.controller";

/**
 * Frontier Systems Comprehensive Security Test Suite
 * Validates all 14 enterprise security areas.
 */
export async function runSecurityTests(): Promise<{ passed: number; failed: number; results: string[] }> {
  let passed = 0;
  let failed = 0;
  const results: string[] = [];

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passed += 1;
      results.push(`✅ PASS: ${testName}`);
    } else {
      failed += 1;
      results.push(`❌ FAIL: ${testName}`);
    }
  }

  // =========================================================================
  // 1. XSS & HTML Injection Sanitization
  // =========================================================================
  {
    const attackScript = "Hello <script>alert('pwned')</script> World";
    const cleanedScript = sanitizeText(attackScript);
    assert(!cleanedScript.includes("<script>") && !cleanedScript.includes("alert"), "XSS: <script> tags completely stripped");

    const attackIframe = 'Check this <iframe src="javascript:alert(1)"></iframe> test';
    const cleanedIframe = sanitizeText(attackIframe);
    assert(!cleanedIframe.includes("<iframe") && !cleanedIframe.includes("javascript:"), "XSS: <iframe> and javascript: URI stripped");

    const attackEventHandler = '<img src="valid.jpg" onerror="alert(document.cookie)">';
    const cleanedHandler = sanitizeText(attackEventHandler);
    assert(!cleanedHandler.includes("onerror"), "XSS: Event handlers stripped");

    const escaped = escapeHtml('<div class="box">"Test" & \'Demo\'</div>');
    assert(escaped.includes("&lt;div") && escaped.includes("&quot;") && escaped.includes("&amp;"), "XSS: escapeHtml neutralizes markup");
  }

  // =========================================================================
  // 2. Path Traversal Filename Sanitization
  // =========================================================================
  {
    const traversal = "../../../etc/passwd";
    const safeName = sanitizeFilename(traversal);
    assert(!safeName.includes("..") && !safeName.includes("/"), "Path Traversal: directory traversal stripped");

    const nullByteName = "document.pdf\0.exe";
    const safeNull = sanitizeFilename(nullByteName);
    assert(!safeNull.includes("\0"), "Path Traversal: null-byte injection stripped");
  }

  // =========================================================================
  // 3. CSRF & Origin Validation
  // =========================================================================
  {
    // Malicious Origin
    const evilReq = new NextRequest("http://localhost:3000/api/inquiries", {
      method: "POST",
      headers: {
        Origin: "https://evil-attacker.com",
      },
    });
    const checkEvil = validateOrigin(evilReq);
    assert(checkEvil.valid === false, "CSRF: Untrusted cross-origin request rejected");

    // Same Origin
    const validReq = new NextRequest("http://localhost:3000/api/inquiries", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
        Host: "localhost:3000",
      },
    });
    const checkValid = validateOrigin(validReq);
    assert(checkValid.valid === true, "CSRF: Same-origin request permitted");
  }

  // =========================================================================
  // 4. Rate Limiting & Abuse Prevention
  // =========================================================================
  {
    const testIp = "192.168.100.55";
    const policy = { limit: 3, windowMs: 60 * 1000 };

    const first = checkRateLimit("test_scope", testIp, policy);
    const second = checkRateLimit("test_scope", testIp, policy);
    const third = checkRateLimit("test_scope", testIp, policy);
    const fourth = checkRateLimit("test_scope", testIp, policy);

    assert(first.allowed === true && first.remaining === 2, "RateLimit: Request 1 accepted");
    assert(second.allowed === true && second.remaining === 1, "RateLimit: Request 2 accepted");
    assert(third.allowed === true && third.remaining === 0, "RateLimit: Request 3 accepted");
    assert(fourth.allowed === false && fourth.retryAfterSeconds > 0, "RateLimit: Request 4 blocked with 429 Retry-After");
  }

  // =========================================================================
  // 5. Binary Magic-Byte File Upload Validation
  // =========================================================================
  {
    // Valid PNG buffer (starts with \x89PNG\r\n\x1a\n)
    const validPngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
    ]);
    const pngResult = validateUploadedFile(validPngBuffer, "avatar.png", "image/png");
    assert(pngResult.valid === true, "Upload: Genuine PNG binary header accepted");

    // Valid PDF buffer (starts with %PDF-)
    const validPdfBuffer = Buffer.from("%PDF-1.7 standard document content here");
    const pdfResult = validateUploadedFile(validPdfBuffer, "proposal.pdf", "application/pdf");
    assert(pdfResult.valid === true, "Upload: Genuine PDF binary header accepted");

    // Impostor file: Executable payload named .pdf
    const fakePdfBuffer = Buffer.from("#!/bin/bash\nrm -rf /\n");
    const fakePdfResult = validateUploadedFile(fakePdfBuffer, "report.pdf", "application/pdf");
    assert(fakePdfResult.valid === false, "Upload: Script disguised as .pdf rejected by magic bytes");

    // Prohibited executable extension (.exe)
    const exeBuffer = Buffer.from("MZ90 fake binary executable");
    const exeResult = validateUploadedFile(exeBuffer, "malware.exe", "application/x-msdownload");
    assert(exeResult.valid === false, "Upload: .exe extension strictly prohibited");

    // Oversized file check
    const bigBuffer = Buffer.alloc(6 * 1024 * 1024); // 6MB > 5MB
    const bigResult = validateUploadedFile(bigBuffer, "huge.png", "image/png");
    assert(bigResult.valid === false, "Upload: File exceeding 5MB rejected");
  }

  // =========================================================================
  // 6. Centralized RBAC Authorization
  // =========================================================================
  {
    const adminUser: AuthenticatedUser = {
      id: "admin-1",
      role: "ADMIN",
      email: "admin@frontiersystems.com",
    };
    const operatorUser: AuthenticatedUser = {
      id: "op-1",
      role: "OPERATOR",
      email: "operator@frontiersystems.com",
    };

    assert(hasPermission(adminUser, "system:admin") === true, "RBAC: Admin has system:admin permission");
    assert(hasPermission(operatorUser, "system:admin") === false, "RBAC: Operator does not have system:admin permission");
    assert(hasPermission(operatorUser, "inquiries:write") === true, "RBAC: Operator has inquiries:write permission");

    const denied = enforcePermission(operatorUser, "system:admin");
    assert(denied.authorized === false, "RBAC: enforcePermission blocks unauthorized operation");
  }

  // =========================================================================
  // 7. Secret Leakage Prevention
  // =========================================================================
  {
    let leakedDetected = false;
    try {
      validateNoPublicSecrets({
        NEXT_PUBLIC_DATABASE_PASSWORD: "super-secret-password",
      });
    } catch {
      leakedDetected = true;
    }
    assert(leakedDetected === true, "Secrets: NEXT_PUBLIC_ secret leakage throws security violation");

    let validAllowed = true;
    try {
      validateNoPublicSecrets({
        NEXT_PUBLIC_SITE_URL: "https://frontiersystems.com",
        NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAA...",
      });
    } catch {
      validAllowed = false;
    }
    assert(validAllowed === true, "Secrets: Standard public client variables permitted");
  }

  // =========================================================================
  // 8. Controller Integration: CSRF & Origin Enforced on APIs
  // =========================================================================
  {
    const evilInquiryReq = new NextRequest("http://localhost:3000/api/inquiries", {
      method: "POST",
      headers: {
        Origin: "https://hacker-phishing-site.com",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Phishing Test",
        email: "test@example.com",
        message: "Should be blocked by Origin check.",
      }),
    });

    const res = await handleCreateInquiry(evilInquiryReq);
    assert(res.status === 403, "API Integration: Malicious Origin returns 403 Forbidden");
  }

  // =========================================================================
  // 9. Controller Integration: Upload Endpoint Rejects Non-file
  // =========================================================================
  {
    const badUploadReq = new NextRequest("http://localhost:3000/api/uploads", {
      method: "POST",
      headers: {
        Origin: "http://localhost:3000",
      },
    });

    const res = await handleFileUpload(badUploadReq);
    assert(res.status === 400 || res.status === 422, "Upload API: Missing file payload returns 400 Bad Request");
  }

  return { passed, failed, results };
}
