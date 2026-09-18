import { PrismaClient, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Frontier Systems database with development fixtures...");

  // 1. Fixture Admin User
  const defaultAdminPassword = process.env.ADMIN_INITIAL_PASSWORD || "AdminPassword123!";
  const passwordHash = bcrypt.hashSync(defaultAdminPassword, 10);

  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@frontiersystems.co" },
    update: {
      passwordHash,
      role: "SUPERADMIN",
    },
    create: {
      email: "admin@frontiersystems.co",
      passwordHash,
      role: "SUPERADMIN",
    },
  });
  console.log(`[Seed] Fixture AdminUser created: ${admin.email} (Role: ${admin.role})`);

  // 2. Fixture Won Inquiry
  const wonInquiry = await prisma.inquiry.upsert({
    where: { id: "inq_demo_won_001" },
    update: {
      status: "WON",
    },
    create: {
      id: "inq_demo_won_001",
      name: "Test Customer Lead",
      email: "fixture-client@test-frontier.example",
      company: "DEMO-CORP-FIXTURE",
      phone: "+44 20 7946 0999",
      service: "Scale",
      budget: "£100,000+",
      message: "FIXTURE: Architectural brief for high-throughput distributed telemetry mesh.",
      status: "WON",
    },
  });
  console.log(`[Seed] Fixture Won Inquiry created: ${wonInquiry.id}`);

  // 3. Fixture Customer
  const customer = await prisma.customer.upsert({
    where: { email: "fixture-client@test-frontier.example" },
    update: {
      name: "Test Customer",
      companyName: "DEMO-CORP-FIXTURE",
    },
    create: {
      name: "Test Customer",
      email: "fixture-client@test-frontier.example",
      companyName: "DEMO-CORP-FIXTURE",
    },
  });
  console.log(`[Seed] Fixture Customer created: ${customer.name} (${customer.email})`);

  // 4. Fixture Project originating from Won Inquiry
  let project = await prisma.project.findFirst({
    where: { customerId: customer.id, name: "DEMO High-Throughput Telemetry Mesh" },
  });

  if (!project) {
    project = await prisma.project.create({
      data: {
        customerId: customer.id,
        inquiryId: wonInquiry.id,
        name: "DEMO High-Throughput Telemetry Mesh",
        status: "IN_PROGRESS",
        summary: "Fixture project for local verification of portal workflows and milestone tracking.",
      },
    });
  }
  console.log(`[Seed] Fixture Project created: ${project.name} (${project.id})`);

  // 5. Fixture Project Milestones
  const existingMilestone = await prisma.projectMilestone.findFirst({
    where: { projectId: project.id, title: "DEMO Milestone 01: Core Architecture Ingestion" },
  });

  if (!existingMilestone) {
    await prisma.projectMilestone.create({
      data: {
        projectId: project.id,
        title: "DEMO Milestone 01: Core Architecture Ingestion",
        description: "Initial topology validation and data ingestion baseline benchmarks.",
        status: "COMPLETE",
        completedAt: new Date(),
      },
    });
    await prisma.projectMilestone.create({
      data: {
        projectId: project.id,
        title: "DEMO Milestone 02: High-Assurance Consensus Node Deployment",
        description: "Deploying multi-region node mesh with sub-millisecond heartbeat telemetry.",
        status: "IN_PROGRESS",
        dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000),
      },
    });
  }
  console.log(`[Seed] Fixture Milestones created for project ${project.id}`);

  // 6. Fixture Document
  const existingDoc = await prisma.projectDocument.findFirst({
    where: { projectId: project.id, fileName: "DEMO-specs-v1.pdf" },
  });

  if (!existingDoc) {
    await prisma.projectDocument.create({
      data: {
        projectId: project.id,
        fileName: "DEMO-specs-v1.pdf",
        storageKey: "frontiersystems/demo/specs-demo.pdf",
        mimeType: "application/pdf",
        fileSize: 1048576,
        uploadedBy: "ADMIN",
      },
    });
  }
  console.log(`[Seed] Fixture Document created for project ${project.id}`);

  // 7. Fixture Invoice
  const invoice = await prisma.invoice.upsert({
    where: { invoiceNumber: "FS-2026-DEMO-0001" },
    update: {
      amountDue: new Prisma.Decimal("15000.00"),
      status: "SENT",
    },
    create: {
      projectId: project.id,
      invoiceNumber: "FS-2026-DEMO-0001",
      status: "SENT",
      amountDue: new Prisma.Decimal("15000.00"),
      currency: "GBP",
      issuedAt: new Date(),
      dueAt: new Date(Date.now() + 30 * 24 * 3600 * 1000),
    },
  });
  console.log(`[Seed] Fixture Invoice created: ${invoice.invoiceNumber} (${invoice.amountDue} ${invoice.currency})`);

  // 8. Fixture Lead Activity
  await prisma.leadActivity.create({
    data: {
      inquiryId: wonInquiry.id,
      type: "CONVERTED_TO_PROJECT",
      description: `Inquiry converted to Project "${project.name}" (Customer: ${customer.name})`,
      metadata: JSON.stringify({ projectId: project.id, customerId: customer.id }),
    },
  });
  console.log(`[Seed] Fixture Lead Activity recorded.`);

  console.log("\nDatabase seeded successfully with fake development fixtures!");
  console.log("NOTE: In production, change the default admin password immediately.\n");
}

main()
  .catch((e) => {
    console.error("Error executing seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
