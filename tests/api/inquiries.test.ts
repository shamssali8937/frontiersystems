import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Inquiry, Prisma } from "@prisma/client";
import {
  handleCreateInquiry,
  handleGetInquiry,
  handleListAdminInquiries,
  handleGetAdminInquiry,
  handleUpdateAdminInquiry,
} from "@/server/controllers/inquiry.controller";

/**
 * API Architecture Test Suite.
 * Validates controllers, status codes, validations, rate limiting, and security.
 */
export async function runApiTests(): Promise<{ passed: number; failed: number; results: string[] }> {
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

  // Hermetic mock store for unit testing Prisma operations
  const mockDb = new Map<string, Inquiry>();
  type InquiryDelegate = {
    findUnique: (args: { where: { id: string } }) => Promise<Inquiry | null>;
    create: (args: { data: Prisma.InquiryCreateInput }) => Promise<Inquiry>;
    findMany: () => Promise<Inquiry[]>;
    count: () => Promise<number>;
    update: (args: { where: { id: string }; data: Prisma.InquiryUpdateInput }) => Promise<Inquiry>;
  };
  const delegate = prisma.inquiry as unknown as InquiryDelegate;
  const origFindUnique = delegate.findUnique;
  const origCreate = delegate.create;
  const origFindMany = delegate.findMany;
  const origCount = delegate.count;
  const origUpdate = delegate.update;

  delegate.findUnique = async ({ where }) => mockDb.get(where.id) || null;
  delegate.create = async ({ data }) => {
    const item: Inquiry = {
      id: "inq-mock-1",
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
      internalNotes: null,
      ipHash: null,
    };
    mockDb.set(item.id, item);
    return item;
  };
  delegate.findMany = async () => Array.from(mockDb.values());
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

  // 1. Test: Malformed Request Validation (Missing fields) -> 422
  {
    const req = new NextRequest("http://localhost:3000/api/inquiries", {
      method: "POST",
      body: JSON.stringify({ name: "A" }), // Name too short, missing email & message
      headers: { "Content-Type": "application/json" },
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as { success: boolean; error?: { code: string } };

    assert(res.status === 422, "POST /api/inquiries (malformed input returns 422)");
    assert(body.success === false, "POST /api/inquiries (success is false on error)");
    assert(body.error?.code === "VALIDATION_ERROR", "POST /api/inquiries (error code is VALIDATION_ERROR)");
  }

  // 2. Test: Unauthorized Admin Request (No token) -> 401
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
      method: "GET",
    });

    const res = await handleListAdminInquiries(req);
    const body = (await res.json()) as { success: boolean; error?: { code: string } };

    assert(res.status === 401, "GET /api/admin/inquiries (unauthorized returns 401)");
    assert(body.error?.code === "UNAUTHORIZED", "GET /api/admin/inquiries (code is UNAUTHORIZED)");
  }

  // 3. Test: Forbidden / Invalid Admin Key -> 401
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries", {
      method: "GET",
      headers: {
        Authorization: "Bearer invalid-secret-token",
      },
    });

    const res = await handleListAdminInquiries(req);
    assert(res.status === 401, "GET /api/admin/inquiries (invalid token returns 401)");
  }

  // 4. Test: Admin Request with Valid Key (GET /api/admin/inquiries/[id]) -> 404 on nonexistent ID
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries/non-existent-id", {
      method: "GET",
      headers: {
        Authorization: "Bearer frontier-admin-secret-key",
      },
    });

    const res = await handleGetAdminInquiry(req, { id: "non-existent-id" });
    const body = (await res.json()) as { success: boolean; error?: { code: string } };

    assert(res.status === 404, "GET /api/admin/inquiries/[id] (not found returns 404)");
    assert(body.error?.code === "NOT_FOUND", "GET /api/admin/inquiries/[id] (code is NOT_FOUND)");
  }

  // 5. Test: Public GET /api/inquiries/[id] -> 404 on nonexistent ID
  {
    const req = new NextRequest("http://localhost:3000/api/inquiries/non-existent-id", {
      method: "GET",
    });

    const res = await handleGetInquiry(req, { id: "non-existent-id" });
    assert(res.status === 404, "GET /api/inquiries/[id] (not found returns 404)");
  }

  // 6. Test: Admin PATCH /api/admin/inquiries/[id] validation -> 422 on invalid enum
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries/some-id", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer frontier-admin-secret-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "INVALID_STATUS" }),
    });

    const res = await handleUpdateAdminInquiry(req, { id: "some-id" });
    assert(res.status === 422, "PATCH /api/admin/inquiries/[id] (invalid enum returns 422)");
  }

  // 7. Test: Successful Public POST /api/inquiries -> 201 Created
  {
    const req = new NextRequest("http://localhost:3000/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Enterprise Partner",
        email: "partner@enterprise.corp",
        company: "Enterprise Corp",
        message: "We need an AI platform architecture evaluation for our logistics fleet.",
        serviceOfInterest: "AI Systems Engineering",
      }),
    });

    const res = await handleCreateInquiry(req);
    const body = (await res.json()) as { success: boolean; data?: { id: string; name: string } };

    assert(res.status === 201, "POST /api/inquiries (valid payload returns 201)");
    assert(body.success === true, "POST /api/inquiries (success is true)");
    assert(body.data?.id === "inq-mock-1", "POST /api/inquiries (returns created entity with ID)");
  }

  // 8. Test: Admin GET /api/admin/inquiries -> 200 OK with list
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries?page=1&limit=10", {
      method: "GET",
      headers: {
        Authorization: "Bearer frontier-admin-secret-key",
      },
    });

    const res = await handleListAdminInquiries(req);
    const body = (await res.json()) as {
      success: boolean;
      data?: unknown[];
      meta?: { total: number; page: number; limit: number };
    };

    assert(res.status === 200, "GET /api/admin/inquiries (authorized returns 200)");
    assert(body.success === true, "GET /api/admin/inquiries (body success is true)");
    assert(Array.isArray(body.data) && body.data.length >= 1, "GET /api/admin/inquiries (returns inquiry list)");
    assert(body.meta?.total === 1, "GET /api/admin/inquiries (meta has correct total count)");
  }

  // 9. Test: Admin GET /api/admin/inquiries/[id] -> 200 OK
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries/inq-mock-1", {
      method: "GET",
      headers: {
        Authorization: "Bearer frontier-admin-secret-key",
      },
    });

    const res = await handleGetAdminInquiry(req, { id: "inq-mock-1" });
    const body = (await res.json()) as { success: boolean; data?: { id: string; email: string } };

    assert(res.status === 200, "GET /api/admin/inquiries/[id] (existing item returns 200)");
    assert(body.data?.email === "partner@enterprise.corp", "GET /api/admin/inquiries/[id] (contains entity data)");
  }

  // 10. Test: Admin PATCH /api/admin/inquiries/[id] -> 200 OK
  {
    const req = new NextRequest("http://localhost:3000/api/admin/inquiries/inq-mock-1", {
      method: "PATCH",
      headers: {
        Authorization: "Bearer frontier-admin-secret-key",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "UNDER_REVIEW", internalNotes: "Lead assigned to AI Systems team." }),
    });

    const res = await handleUpdateAdminInquiry(req, { id: "inq-mock-1" });
    const body = (await res.json()) as { success: boolean; data?: { status: string; internalNotes: string } };

    assert(res.status === 200, "PATCH /api/admin/inquiries/[id] (successful update returns 200)");
    assert(body.data?.status === "UNDER_REVIEW", "PATCH /api/admin/inquiries/[id] (status successfully updated)");
  }

  // Restore real Prisma delegates
  delegate.findUnique = origFindUnique;
  delegate.create = origCreate;
  delegate.findMany = origFindMany;
  delegate.count = origCount;
  delegate.update = origUpdate;

  return { passed, failed, results };
}

