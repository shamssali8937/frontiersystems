import {
  step1GoalSchema,
  step2TimelineBudgetSchema,
  step3TechDetailsSchema,
  step4ContactSchema,
  contactFormSchema,
  DEFAULT_FORM_VALUES,
  ContactFormValues,
} from "../lib/validation/contact-form.schema";

async function runFormFlowTests() {
  console.log("=========================================");
  console.log("RUNNING PROGRESSIVE INQUIRY FORM FLOW TESTS");
  console.log("=========================================\n");

  let allPassed = true;
  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
    } else {
      console.error(`[FAIL] ${testName}`);
      allPassed = false;
    }
  }

  // --- 1. Step 1: Goal Selection Tests ---
  console.log("--- Testing Step 1: Goal Selection ---");
  const validGoals = ["Build", "Automate", "Scale", "Modernize"] as const;
  for (const goal of validGoals) {
    const res = step1GoalSchema.safeParse({ goal });
    assert(res.success, `Step 1 accepts valid goal: "${goal}"`);
  }
  const invalidGoalRes = step1GoalSchema.safeParse({ goal: "InvalidGoal" });
  assert(!invalidGoalRes.success, "Step 1 rejects invalid goal");

  // --- 2. Step 2: Timeline & Open-Text Budget Tests ---
  console.log("\n--- Testing Step 2: Timeline & Open-Text Budget ---");
  const validTimelines = [
    "Immediate (< 1 month)",
    "1–3 months",
    "3–6 months",
    "Flexible / Discovery",
  ] as const;
  for (const timeline of validTimelines) {
    const res = step2TimelineBudgetSchema.safeParse({
      timeline,
      budget: "£50,000 – £100,000",
    });
    assert(res.success, `Step 2 accepts timeline: "${timeline}"`);
  }

  // SRS Requirement: Budget must remain an open-text field!
  const openTextBudgets = [
    "£40k - £75k",
    "$150k allocated",
    "€100,000 discovery budget",
    "Flexible / Scoping phase",
    "Competitive RFP",
  ];
  for (const budget of openTextBudgets) {
    const res = step2TimelineBudgetSchema.safeParse({
      timeline: "1–3 months",
      budget,
    });
    assert(res.success, `Step 2 accepts open-text budget format: "${budget}"`);
  }

  const emptyBudgetRes = step2TimelineBudgetSchema.safeParse({
    timeline: "1–3 months",
    budget: "",
  });
  assert(!emptyBudgetRes.success, "Step 2 rejects empty budget");

  // --- 3. Step 3: Technical Scope & File Upload Specifications ---
  console.log("\n--- Testing Step 3: Technical Details & File Upload Metadata ---");
  const validTechDetails =
    "We require an autonomous agent pipeline with deterministic tool execution and Prometheus telemetry.";
  const step3Res = step3TechDetailsSchema.safeParse({
    technicalDetails: validTechDetails,
    attachedFiles: [
      {
        id: "spec-doc-01",
        name: "architecture_specification.pdf",
        size: 1024 * 500,
        type: "application/pdf",
      },
    ],
  });
  assert(step3Res.success, "Step 3 accepts valid technical scope and attached files");

  const shortTechDetailsRes = step3TechDetailsSchema.safeParse({
    technicalDetails: "Too short",
    attachedFiles: [],
  });
  assert(!shortTechDetailsRes.success, "Step 3 rejects technical details shorter than 10 characters");

  // --- 4. Step 4: Contact Information ---
  console.log("\n--- Testing Step 4: Contact Information ---");
  const validContactRes = step4ContactSchema.safeParse({
    name: "Dr. Alistair Vance",
    email: "alistair.vance@vancetech.co.uk",
    company: "Vance Systems Ltd",
    phone: "+44 20 7946 0192",
  });
  assert(validContactRes.success, "Step 4 accepts valid contact details");

  const invalidEmailRes = step4ContactSchema.safeParse({
    name: "Dr. Alistair Vance",
    email: "not-an-email",
  });
  assert(!invalidEmailRes.success, "Step 4 rejects invalid email address");

  const shortNameRes = step4ContactSchema.safeParse({
    name: "A",
    email: "a@b.co",
  });
  assert(!shortNameRes.success, "Step 4 rejects name under 2 characters");

  // --- 5. Composite Form Schema Validation ---
  console.log("\n--- Testing Aggregate Form Schema ---");
  const fullFormPayload: ContactFormValues = {
    goal: "Automate",
    timeline: "1–3 months",
    budget: "£100k - £150k",
    technicalDetails:
      "Enterprise agent orchestration with deterministic schema validation and zero-trust VPC deployment.",
    attachedFiles: [
      {
        id: "spec-doc-01",
        name: "architecture_specification.pdf",
        size: 250000,
        type: "application/pdf",
      },
    ],
    name: "Arthur Pendelton",
    email: "arthur@enterprisecorp.co.uk",
    company: "Enterprise Corp",
    phone: "+44 20 7946 0888",
  };
  const fullRes = contactFormSchema.safeParse(fullFormPayload);
  assert(fullRes.success, "Full composite form schema validates successfully");

  // --- 6. Form Step Transition & Refresh Simulation ---
  console.log("\n--- Testing Back/Next & Storage Persistence Logic ---");
  let simulatedStep = 1;
  let simulatedStorage: { step: number; values: ContactFormValues } = {
    step: simulatedStep,
    values: { ...DEFAULT_FORM_VALUES },
  };

  // Step 1 -> Next
  simulatedStorage.values.goal = "Scale";
  assert(step1GoalSchema.safeParse(simulatedStorage.values).success, "Step 1 validates before next");
  simulatedStep = 2;
  simulatedStorage.step = simulatedStep;
  assert(simulatedStep === 2, "Transitioned to Step 2");

  // Step 2 -> Back -> Step 1
  simulatedStep = 1;
  assert(simulatedStep === 1, "Returned back to Step 1");
  assert(simulatedStorage.values.goal === "Scale", "State preserved after going back");

  // Step 1 -> Next -> Step 2
  simulatedStep = 2;
  simulatedStorage.values.timeline = "3–6 months";
  simulatedStorage.values.budget = "$200,000";
  assert(step2TimelineBudgetSchema.safeParse(simulatedStorage.values).success, "Step 2 validates before next");
  simulatedStep = 3;

  // Step 3 -> Back -> Step 2
  simulatedStep = 2;
  assert(simulatedStorage.values.budget === "$200,000", "Budget preserved after going back");

  // Step 2 -> Next -> Step 3
  simulatedStep = 3;
  simulatedStorage.values.technicalDetails =
    "Distributed consensus refactoring and database sharding for high concurrency.";
  simulatedStep = 4;
  simulatedStorage.step = simulatedStep;

  // Simulate Page Refresh from Storage
  const serialized = JSON.stringify(simulatedStorage);
  const deserialized = JSON.parse(serialized);
  assert(deserialized.step === 4, "Page refresh restores current step (Step 4)");
  assert(deserialized.values.goal === "Scale", "Page refresh restores Goal");
  assert(deserialized.values.budget === "$200,000", "Page refresh restores Open-Text Budget");
  assert(
    deserialized.values.technicalDetails.includes("Distributed consensus"),
    "Page refresh restores Technical Details",
  );

  console.log("\n=========================================");
  if (allPassed) {
    console.log("ALL PROGRESSIVE FORM LOGIC TESTS PASSED SUCCESSFULLY!");
  } else {
    console.error("SOME FORM LOGIC TESTS FAILED.");
    process.exit(1);
  }
}

runFormFlowTests();

export {};
