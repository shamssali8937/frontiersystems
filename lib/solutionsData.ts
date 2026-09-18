export interface SolutionServiceItem {
  id: string;
  name: string;
  badge: string;
  tagline: string;
  description: string;
  deliverables: string[];
  capabilities: string[];
}

export interface SolutionApproachPhase {
  phase: string;
  name: string;
  focus: string;
  description: string;
  validationCheck: string;
}

export interface SolutionTechCategory {
  category: string;
  technologies: string[];
}

export interface SolutionPillarData {
  slug: string;
  title: string;
  badge: string;
  eyebrow: string;
  metaTitle: string;
  metaDescription: string;
  headline: string;
  subhead: string;
  introLong: string;
  diagramType: "ai" | "digital-products" | "business-systems" | "infrastructure";
  services: SolutionServiceItem[];
  approach: SolutionApproachPhase[];
  architectureOverview: {
    title: string;
    description: string;
    keyPrinciples: string[];
  };
  techStack: SolutionTechCategory[];
  specifications: {
    label: string;
    value: string;
    description: string;
  }[];
  relatedPillars: {
    slug: string;
    title: string;
    relationship: string;
  }[];
}

export const SOLUTIONS_DATA: Record<string, SolutionPillarData> = {
  "ai-automation": {
    slug: "ai-automation",
    title: "AI & Automation",
    badge: "Intelligence & Autonomous Systems",
    eyebrow: "PILLAR // 01 — AI & AUTOMATION",
    metaTitle: "Enterprise AI Solutions & Intelligent Automation",
    metaDescription:
      "Deterministic autonomous workflows, domain-specialized LLM orchestration, and enterprise decision intelligence systems engineered for scale and mathematical auditability.",
    headline: "Deterministic AI Systems & Autonomous Workflow Automation",
    subhead:
      "We design, build, and deploy production-grade agentic architectures, custom inference pipelines, and business process automation where reliability, determinism, and data sovereignty are absolute requirements.",
    introLong:
      "Modern enterprise automation demands more than stochastic chat interfaces. Frontier Systems constructs production-hardened AI platforms that integrate directly into transactional business data. By enforcing strict typed schema boundaries, validation guardrails, and deterministic state machines around generative models, we transform probabilistic intelligence into predictable enterprise software assets.",
    diagramType: "ai",
    services: [
      {
        id: "ai-solutions",
        name: "AI Solutions",
        badge: "Domain Intelligence",
        tagline: "Custom Neural Models & Grounded Retrieval",
        description:
          "Domain-tuned language models, retrieval-augmented generation (RAG) with vector indexing, and custom predictive models designed specifically for specialized enterprise datasets.",
        deliverables: [
          "Bespoke RAG Pipelines (pgvector / HNSW indexing)",
          "Domain Fine-Tuning & Quantization",
          "Deterministic Validation Guardrails",
          "Private Inference Cluster Architecture",
        ],
        capabilities: [
          "Mathematical verification of retrieval relevance",
          "Zero client data leakage across model boundaries",
          "Low-latency embeddings generation (< 25ms)",
          "Automated regression testing on model drift",
        ],
      },
      {
        id: "ai-automation",
        name: "AI Automation",
        badge: "Agentic Orchestration",
        tagline: "Multi-Agent State Machines & Tool Execution",
        description:
          "Autonomous agent clusters capable of dynamic planning, multi-step problem decomposition, tool execution, and self-correcting error recovery under strict policy controls.",
        deliverables: [
          "Multi-Agent Graph Workflows (LangGraph / State Machines)",
          "Idempotent Tool & API Calling Infrastructure",
          "Human-in-the-Loop Approval Interceptors",
          "Auditable Decision Telemetry & Event Logging",
        ],
        capabilities: [
          "Deterministic cycle detection and loop termination",
          "Cryptographically signed agent action logs",
          "Granular role-based tool execution permissions",
          "Sub-second agent arbitration and dispatch",
        ],
      },
      {
        id: "business-process-automation",
        name: "Business Process Automation",
        badge: "Operational Scale",
        tagline: "End-to-End Enterprise Flow Optimization",
        description:
          "Unification of fragmented business operations through automated document intelligence, transactional validation loops, and event-driven back-office pipelines.",
        deliverables: [
          "Cognitive Document Parsing & Structuring",
          "High-Throughput Ingestion & Reconciliation Pipelines",
          "Regulatory & Audit Trail Automation",
          "ERP & CRM Data Synchronization Loops",
        ],
        capabilities: [
          "99.8% extraction accuracy on complex financial documents",
          "Zero human intervention on standardized transaction batches",
          "Direct integration with enterprise relational databases",
          "Real-time alerting on operational discrepancies",
        ],
      },
    ],
    approach: [
      {
        phase: "01",
        name: "Entropy Audit & Domain Modeling",
        focus: "DATA SANITIZATION & BOUNDARIES",
        description:
          "We analyze client document schemas, transaction logs, and operational exceptions to define mathematically rigorous input/output contracts and isolate stochastic variation.",
        validationCheck: "Formal Schema Definition & Entropy Threshold Sign-Off",
      },
      {
        phase: "02",
        name: "Deterministic Graph Architecture",
        focus: "GUARDRAILS & STATE MACHINES",
        description:
          "We construct stateful agent graphs where every model invocation is wrapped with typed schema validation, fallbacks, and deterministic routing constraints.",
        validationCheck: "100% Schema Validation Coverage on Synthetic Failure Suites",
      },
      {
        phase: "03",
        name: "Telemetry & Observability Loops",
        focus: "CONTINUOUS EVALUATION",
        description:
          "Deploy continuous evaluation pipelines that monitor inference latency, hallucination rates, semantic drift, and operational cost per transaction.",
        validationCheck: "Automated Evaluation Harness Active with SLA Alerts",
      },
    ],
    architectureOverview: {
      title: "Deterministic Agentic Execution Pipeline",
      description:
        "Frontier Systems isolates probabilistic models behind deterministic validation guards. Ingress data is validated against strict schemas, routed through domain-specialized retrieval nodes, verified by policy interceptors, and executed idempotently.",
      keyPrinciples: [
        "Zero unvalidated model output enters downstream databases",
        "Deterministic fallbacks for model timeouts or anomalies",
        "Full lineage and provenance tracking for every agent decision",
        "Local or private VPC inference to maintain complete data sovereignty",
      ],
    },
    techStack: [
      {
        category: "Model & Agent Frameworks",
        technologies: ["LangGraph", "Semantic Kernel", "PyTorch", "ONNX Runtime", "vLLM"],
      },
      {
        category: "Vector & Storage",
        technologies: ["PostgreSQL (pgvector)", "Qdrant", "Redis Vector Engine", "Prisma"],
      },
      {
        category: "Validation & Guardrails",
        technologies: ["Zod", "Pydantic V2", "NeMo Guardrails", "Instructor"],
      },
      {
        category: "Telemetry & Evaluation",
        technologies: ["OpenTelemetry", "LangSmith", "Prometheus", "Grafana"],
      },
    ],
    specifications: [
      {
        label: "Validation Reliability",
        value: "100%",
        description: "Zero malformed schema payloads enter production data stores.",
      },
      {
        label: "Inference Latency Target",
        value: "< 180ms",
        description: "Optimized retrieval and quantized local inference pipelines.",
      },
      {
        label: "Data Sovereignty",
        value: "Isolated VPC",
        description: "Zero training on enterprise client queries or proprietary data.",
      },
      {
        label: "Audit Traceability",
        value: "Cryptographic",
        description: "Immutable decision logs for compliance and regulatory reporting.",
      },
    ],
    relatedPillars: [
      {
        slug: "business-systems",
        title: "Business Systems",
        relationship: "Integrates autonomous intelligence directly into ERP, CRM, and transactional databases.",
      },
      {
        slug: "infrastructure-security",
        title: "Infrastructure & Security",
        relationship: "Provides isolated cloud clusters, private endpoints, and zero-trust perimeter defense.",
      },
      {
        slug: "digital-products",
        title: "Digital Products",
        relationship: "Exposes real-time agent state and telemetry through responsive web interfaces.",
      },
    ],
  },

  "digital-products": {
    slug: "digital-products",
    title: "Digital Products",
    badge: "Platforms & Reactive Engineering",
    eyebrow: "PILLAR // 02 — DIGITAL PRODUCTS",
    metaTitle: "Enterprise Digital Products & Platform Engineering",
    metaDescription:
      "Mission-critical web applications, high-concurrency e-commerce architectures, mobile clients, and multi-tenant B2B SaaS platforms engineered for global scale and speed.",
    headline: "Mission-Critical Digital Products, Platforms, and SaaS Architecture",
    subhead:
      "We engineer responsive web systems, high-concurrency transactional storefronts, cross-platform mobile applications, and multi-tenant SaaS products built on modern, resilient architectures.",
    introLong:
      "In enterprise digital engineering, performance is an operational prerequisite. Frontier Systems designs user-facing systems with sub-second response times, resilient offline capabilities, and flawless multi-device reliability. Leveraging React 19, Next.js App Router, streaming server rendering, and distributed caching, we deliver digital platforms that handle intense concurrency without latency degradation.",
    diagramType: "digital-products",
    services: [
      {
        id: "web",
        name: "Web Applications",
        badge: "High-Throughput Web",
        tagline: "Modern Streaming Architectures & Sub-100ms TTFB",
        description:
          "Next.js and React server-driven enterprise web applications engineered for instantaneous rendering, strict accessibility, and resilience under global load.",
        deliverables: [
          "Next.js App Router & Streaming Server Components",
          "Fine-Grained Dynamic Caching & Stale-While-Revalidate",
          "WCAG 2.1 AA/AAA Accessible Component Systems",
          "Interactive WebGL / Three.js Visualizations",
        ],
        capabilities: [
          "Sub-100ms Time to First Byte (TTFB) across global edge nodes",
          "Zero Cumulative Layout Shift (CLS < 0.05)",
          "Hydration-optimized bundle footprints",
          "Comprehensive end-to-end type safety",
        ],
      },
      {
        id: "e-commerce",
        name: "E-Commerce Systems",
        badge: "Transactional Scale",
        tagline: "High-Concurrency Checkout & Inventory Engines",
        description:
          "Enterprise commerce architectures built to withstand flash traffic spikes, process high-volume cart transactions, and synchronize distributed inventory in real time.",
        deliverables: [
          "Distributed Cart & Checkout Microservices",
          "Real-Time Inventory Reservation Engines",
          "Multi-Currency Payment Gateway Orchestration",
          "Zero-Downtime Catalog Ingestion Pipelines",
        ],
        capabilities: [
          "Zero inventory overselling under high concurrency",
          "Sub-second checkout pipeline verification",
          "Automated tax and cross-border compliance rules",
          "Resilient circuit-breaker payment fallbacks",
        ],
      },
      {
        id: "mobile-apps",
        name: "Mobile Applications",
        badge: "Cross-Platform",
        tagline: "Offline-First Mobile Engineering & Real-Time Sync",
        description:
          "High-performance iOS and Android applications developed with React Native and native performance bridges, engineered for offline resilience and background sync.",
        deliverables: [
          "Cross-Platform Native Codebases (iOS / Android)",
          "Local SQLite Storage & Conflict-Free State Sync",
          "Biometric Authentication & Hardware Keystore Integration",
          "Push Telemetry & Background Ingestion Queues",
        ],
        capabilities: [
          "Consistent 60fps / 120fps UI thread execution",
          "Seamless offline operation with background reconcilers",
          "Strict app sandboxing and encrypted on-device storage",
          "Automated App Store and Play Store CI/CD delivery",
        ],
      },
      {
        id: "saas",
        name: "B2B SaaS Platforms",
        badge: "Multi-Tenant Architecture",
        tagline: "Scalable Multi-Tenant Foundations & Billing",
        description:
          "Production-ready B2B software-as-a-service architectures featuring tenant isolation, role-based access control, metered usage billing, and audit logs.",
        deliverables: [
          "Isolated Multi-Tenant Schema Partitioning",
          "Enterprise SSO (SAML / OIDC) & RBAC Engines",
          "Usage-Based Metering & Stripe Billing Pipelines",
          "Comprehensive Audit Trails & Export APIs",
        ],
        capabilities: [
          "Zero cross-tenant data leakage guarantees",
          "Instant tenant provisioning and automated domain routing",
          "Configurable SLA tiers and per-tenant rate limiters",
          "Automated SOC2-compliant logging pipelines",
        ],
      },
    ],
    approach: [
      {
        phase: "01",
        name: "Concurrency & Latency Profiling",
        focus: "PERFORMANCE BUDGETS",
        description:
          "We benchmark peak concurrency demands, establish strict latency budgets (TTFB, LCP, CLS), and design data-fetching boundaries prior to code execution.",
        validationCheck: "Formal Performance Budget & Concurrency Target Document",
      },
      {
        phase: "02",
        name: "Design System & Component Rigor",
        focus: "ACCESSIBILITY & TOKENS",
        description:
          "Implement unified design token systems with high-contrast engineering aesthetics, full keyboard accessibility, and zero-layout-shift container scaffolding.",
        validationCheck: "100% WCAG 2.1 AA Accessibility & Lighthouse 95+ Gate",
      },
      {
        phase: "03",
        name: "Continuous Edge Deployment",
        focus: "REGRESSION & MONITORING",
        description:
          "Automated CI/CD pipelines verify build integrity, run visual regression tests, and monitor real-user Core Web Vitals across distributed geographies.",
        validationCheck: "Zero-Downtime Blue/Green Deployment Verified",
      },
    ],
    architectureOverview: {
      title: "Edge-to-Client Layered Rendering Architecture",
      description:
        "Frontier Systems builds digital products utilizing streaming edge rendering and optimistic client updates. Static layouts are served instantly from global CDN edges, while authenticated transactional data streams in parallel without blocking user interaction.",
      keyPrinciples: [
        "Streaming server rendering ensures instant perceptual load",
        "Optimistic UI state mutations backed by deterministic server sync",
        "Zero bundle bloat: dynamic module imports and server-first components",
        "Resilient offline-first persistence on mobile and distributed clients",
      ],
    },
    techStack: [
      {
        category: "Web & Core Frameworks",
        technologies: ["React 19", "Next.js App Router", "TypeScript 5", "TailwindCSS v4"],
      },
      {
        category: "Mobile & Graphics",
        technologies: ["React Native", "Expo", "Three.js", "WebGL", "Native Bridges"],
      },
      {
        category: "State & Data Layer",
        technologies: ["Prisma ORM", "TanStack Query", "Redis", "PostgreSQL"],
      },
      {
        category: "Auth & Payments",
        technologies: ["Auth.js / NextAuth", "Stripe Enterprise", "SAML SSO", "Cloudflare"],
      },
    ],
    specifications: [
      {
        label: "Edge TTFB",
        value: "< 90ms",
        description: "Global edge-cached dynamic content delivery.",
      },
      {
        label: "Accessibility Score",
        value: "100% WCAG",
        description: "Full keyboard navigability, semantic tags, and screen reader support.",
      },
      {
        label: "Cumulative Layout Shift",
        value: "< 0.02",
        description: "Strict dimension reservation eliminating layout jumps.",
      },
      {
        label: "Mobile Frame Rate",
        value: "60-120 fps",
        description: "Uncompromised mobile UI responsiveness on native bridges.",
      },
    ],
    relatedPillars: [
      {
        slug: "ai-automation",
        title: "AI & Automation",
        relationship: "Supplies intelligent agent workflows and predictive models embedded in user interfaces.",
      },
      {
        slug: "business-systems",
        title: "Business Systems",
        relationship: "Unifies client-facing applications with internal transactional and ERP systems.",
      },
      {
        slug: "infrastructure-security",
        title: "Infrastructure & Security",
        relationship: "Provides global CDN distribution, WAF security, and high-availability database clustering.",
      },
    ],
  },

  "business-systems": {
    slug: "business-systems",
    title: "Business Systems",
    badge: "Operations & Transactional Middleware",
    eyebrow: "PILLAR // 03 — BUSINESS SYSTEMS",
    metaTitle: "Enterprise Business Systems, ERP & API Integration",
    metaDescription:
      "Bespoke ERP, CRM, transactional middleware, and hardened database architectures designed to eliminate enterprise data silos and modernize legacy systems.",
    headline: "Unified Enterprise Business Systems & Operational Architecture",
    subhead:
      "We design custom software, tailor relational CRM platforms, build high-throughput API integrations, and architect resilient PostgreSQL database layers that unite distributed business operations.",
    introLong:
      "Fragmented spreadsheets, disconnected SaaS subscriptions, and fragile legacy scripts drain enterprise productivity and introduce critical operational vulnerabilities. Frontier Systems constructs unified business systems with deterministic event pipelines, transactional durability, and bidirectional system synchronization, transforming internal friction into continuous operational momentum.",
    diagramType: "business-systems",
    services: [
      {
        id: "custom-software",
        name: "Custom Software",
        badge: "Bespoke Portals",
        tagline: "Internal Portals & Operational Control Centers",
        description:
          "Custom operational platforms, executive command dashboards, and workflow management systems designed specifically around your proprietary business rules.",
        deliverables: [
          "Unified Executive & Operational Portals",
          "Role-Based Approval & Review Workflows",
          "Automated Compliance & Reporting Engines",
          "Historical Audit Trails & Change Tracking",
        ],
        capabilities: [
          "Zero workflow compromises to fit generic SaaS templates",
          "Sub-second internal search and record filtering",
          "End-to-end data lineage tracking",
          "Deterministic business rule enforcement",
        ],
      },
      {
        id: "crm",
        name: "Enterprise CRM Systems",
        badge: "Customer Data",
        tagline: "Custom Customer Engines & Lifecycle Automation",
        description:
          "High-assurance customer relationship platforms that unify customer telemetry, pipeline progression, contract renewals, and communications history.",
        deliverables: [
          "Custom Relational CRM Architecture",
          "Automated Contract & Renewal Pipelines",
          "Omnichannel Communication Synchronizers",
          "Dynamic Revenue Forecasting Analytics",
        ],
        capabilities: [
          "Consolidated single-view of client accounts and contracts",
          "Automated pipeline transition triggers",
          "Complete synchronization with financial billing ledgers",
          "Granular sales team territory permissions",
        ],
      },
      {
        id: "api-integrations",
        name: "API Integrations",
        badge: "Middleware & Gateways",
        tagline: "Event Gateways, Webhook Brokers & Protocol Adapters",
        description:
          "Resilient transactional middleware that connects disparate cloud services, internal microservices, and legacy third-party endpoints with guaranteed delivery.",
        deliverables: [
          "High-Throughput API Gateways (REST / GraphQL / gRPC)",
          "Asynchronous Webhook Brokering with Dead-Letter Queues",
          "Legacy Protocol Transformation (SOAP / XML / EDI)",
          "Automated Contract Testing & Schema Registries",
        ],
        capabilities: [
          "Idempotent message handling with zero duplicate writes",
          "Automatic retry loops with exponential backoff",
          "Real-time packet inspection and payload sanitization",
          "Sub-10ms inter-service routing latency",
        ],
      },
      {
        id: "databases",
        name: "Database Architecture",
        badge: "Data Integrity",
        tagline: "PostgreSQL Clustering, Migrations & Performance",
        description:
          "Hardened relational and time-series database architectures engineered for ACID transactional guarantees, zero-data-loss failover, and extreme query throughput.",
        deliverables: [
          "PostgreSQL Multi-AZ Primary/Replica Clustering",
          "Zero-Downtime Schema Migration Strategies",
          "Query Optimization & Advanced Indexing (B-Tree, GIN, BRIN)",
          "Automated Backup Verification & Point-in-Time Recovery",
        ],
        capabilities: [
          "Zero data corruption across concurrent transactions",
          "Sub-5ms index lookups on multi-million row tables",
          "Point-in-Time Recovery (PITR) with < 1min RPO",
          "Automated connection pooling and load balancing",
        ],
      },
    ],
    approach: [
      {
        phase: "01",
        name: "Silo Mapping & Schema Normalization",
        focus: "DATA FLOW AUDIT",
        description:
          "We map data pathways across legacy spreadsheets, SaaS APIs, and existing databases to identify schema discrepancies, duplicate records, and transactional bottlenecks.",
        validationCheck: "Entity-Relationship Data Map & Normalization Blueprint",
      },
      {
        phase: "02",
        name: "Event Bus & Middleware Construction",
        focus: "TRANSACTIONAL INTEGRITY",
        description:
          "We implement the transactional outbox pattern and distributed message queues, ensuring message delivery is atomic and immune to transient network disconnects.",
        validationCheck: "Zero-Loss Chaos Testing on Message Queues",
      },
      {
        phase: "03",
        name: "Shadow Pipeline & Zero-Downtime Cutover",
        focus: "MIGRATION SAFETY",
        description:
          "Run new business systems in shadow mode alongside legacy software, verifying data parity across millions of live transactions before initiating cutover.",
        validationCheck: "100% Data Parity Verified Over 14-Day Shadow Period",
      },
    ],
    architectureOverview: {
      title: "Distributed Transactional Event Architecture",
      description:
        "Frontier Systems designs business systems using the transactional outbox pattern and resilient message queues. Database mutations and outgoing integration events execute inside a single atomic transaction, preventing state drift and inconsistent dual-writes.",
      keyPrinciples: [
        "Atomic transactional execution guarantees zero state divergence",
        "Idempotent consumer handlers eliminate duplicate processing",
        "Decoupled asynchronous event queues prevent cascading service failures",
        "Strict relational constraints preserve data integrity across migrations",
      ],
    },
    techStack: [
      {
        category: "Databases & Storage",
        technologies: ["PostgreSQL 16+", "Prisma ORM", "Redis Enterprise", "ClickHouse"],
      },
      {
        category: "Event Streaming & Queues",
        technologies: ["Apache Kafka", "RabbitMQ", "BullMQ", "NATS"],
      },
      {
        category: "Backend & Gateway",
        technologies: ["Node.js", "TypeScript", "gRPC", "GraphQL", "Fastify"],
      },
      {
        category: "Reliability & Observability",
        technologies: ["OpenTelemetry", "Datadog", "PgBouncer", "Grafana"],
      },
    ],
    specifications: [
      {
        label: "Transaction Durability",
        value: "ACID Guaranteed",
        description: "Strict relational integrity with zero uncommitted state drift.",
      },
      {
        label: "Message Delivery",
        value: "At-Least-Once",
        description: "Idempotent handlers guarantee deterministic single-execution semantics.",
      },
      {
        label: "Recovery Point Objective",
        value: "< 60 seconds",
        description: "Continuous WAL archiving and point-in-time recovery.",
      },
      {
        label: "Migration Downtime",
        value: "0 minutes",
        description: "Blue-green database cutovers with zero user disruption.",
      },
    ],
    relatedPillars: [
      {
        slug: "ai-automation",
        title: "AI & Automation",
        relationship: "Supplies unified transactional data to autonomous models and orchestrates automated process decisions.",
      },
      {
        slug: "digital-products",
        title: "Digital Products",
        relationship: "Provides backend APIs and business logic powering enterprise client interfaces.",
      },
      {
        slug: "infrastructure-security",
        title: "Infrastructure & Security",
        relationship: "Hosts database clusters and message brokers on isolated, hardened cloud VPCs.",
      },
    ],
  },

  "infrastructure-security": {
    slug: "infrastructure-security",
    title: "Infrastructure & Security",
    badge: "Cloud Architecture & Zero-Trust Posture",
    eyebrow: "PILLAR // 04 — INFRASTRUCTURE & SECURITY",
    metaTitle: "Cloud Infrastructure, Zero-Trust Cybersecurity & Modernization",
    metaDescription:
      "Enterprise cloud architecture, zero-trust cybersecurity perimeters, infrastructure modernization, and 24/7 mission-critical engineering support for global leaders.",
    headline: "Resilient Cloud Architecture, Zero-Trust Security, and Modernization",
    subhead:
      "We design immutable cloud infrastructure, implement zero-trust cybersecurity postures, modernize monolithic legacy systems, and provide 24/7 mission-critical engineering support.",
    introLong:
      "In high-stakes enterprise environments, security cannot be an afterthought and downtime is unacceptable. Frontier Systems constructs infrastructure as code, enforces zero-trust perimeters by default, and automates disaster recovery procedures. We engineer cloud architectures that absorb traffic shocks, resist adversarial threats, and maintain verified 99.99% availability under adverse operating conditions.",
    diagramType: "infrastructure",
    services: [
      {
        id: "cloud",
        name: "Cloud Architecture",
        badge: "Multi-Region Cloud",
        tagline: "Terraform IaC, Kubernetes & Multi-AZ Topology",
        description:
          "Production cloud environments on AWS, Google Cloud, and Azure engineered using immutable infrastructure-as-code, container orchestration, and auto-scaling clusters.",
        deliverables: [
          "Terraform & OpenTofu Infrastructure as Code",
          "Kubernetes (EKS / GKE) Multi-Cluster Topology",
          "Global Anycast CDN & Load Balancing Configuration",
          "Multi-Region Active/Passive Disaster Recovery",
        ],
        capabilities: [
          "Automated infrastructure drift detection and correction",
          "Instant horizontal pod auto-scaling during traffic surges",
          "Multi-cloud redundancy eliminating single-vendor dependencies",
          "Cost-optimized resource allocation and spot instance orchestration",
        ],
      },
      {
        id: "cybersecurity",
        name: "Cybersecurity & Zero-Trust",
        badge: "Zero-Trust Defense",
        tagline: "mTLS, Edge WAF, Least-Privilege & Secret Management",
        description:
          "Comprehensive defense-in-depth security architectures incorporating Cloudflare Turnstile, edge WAF, mutual TLS authentication, and automated vulnerability scanning.",
        deliverables: [
          "Cloudflare Enterprise WAF & Turnstile Bot Mitigation",
          "Mutual TLS (mTLS) Inter-Service Cryptography",
          "HashiCorp Vault Secret Management & Dynamic Credentials",
          "Automated SAST / DAST Vulnerability Pipeline Gates",
        ],
        capabilities: [
          "Zero-trust authentication: every packet verified regardless of network",
          "Automatic bot scraping and credential-stuffing mitigation",
          "Ephemeral credentials with automated 15-minute rotation",
          "ISO/IEC 27001 and SOC2 Type II compliance readiness",
        ],
      },
      {
        id: "modernization",
        name: "Systems Modernization",
        badge: "Legacy Migration",
        tagline: "Monolith Decoupling, Containerization & CI/CD",
        description:
          "Disciplined re-platforming of fragile legacy infrastructure into modular, containerized micro-architectures with automated continuous delivery pipelines.",
        deliverables: [
          "Monolith Deconstruction & Strangler-Fig Migration",
          "Docker Containerization & Helm Packaging",
          "Automated CI/CD Pipelines (GitHub Actions / GitLab CI)",
          "Legacy Operating System & Runtime Modernization",
        ],
        capabilities: [
          "Zero-downtime progressive migration with reverse-proxy routing",
          "Deployment lead times reduced from weeks to minutes",
          "Elimination of technical debt and unpatched CVE vulnerabilities",
          "Full regression test automation preceding production promotion",
        ],
      },
      {
        id: "support",
        name: "Mission-Critical Support",
        badge: "24/7 Operations",
        tagline: "Sub-Millisecond Telemetry & Incident Response SLAs",
        description:
          "Round-the-clock proactive infrastructure monitoring, chaos engineering drills, and guaranteed enterprise response SLAs with direct access to senior staff.",
        deliverables: [
          "24/7/365 Systems Observability & Prometheus Alerts",
          "15-Minute Critical Incident Response SLA",
          "Quarterly Chaos Engineering & DR Tabletop Drills",
          "Dedicated Systems Reliability Engineers (SRE)",
        ],
        capabilities: [
          "Automated self-healing infrastructure clusters",
          "Real-time telemetry dashboards tracking SLOs and SLIs",
          "Post-mortem root cause analysis reports within 24 hours",
          "Direct engineer-to-engineer escalation channels",
        ],
      },
    ],
    approach: [
      {
        phase: "01",
        name: "Threat Modeling & Infrastructure Audit",
        focus: "VULNERABILITY ASSESSMENT",
        description:
          "We conduct CIS benchmark scans, audit IAM policies for least-privilege violations, and analyze single points of failure across all network zones.",
        validationCheck: "Threat Model Document & CIS Benchmark Compliance Score",
      },
      {
        phase: "02",
        name: "Immutable IaC & Zero-Trust Hardening",
        focus: "CODE-DEFINED INFRASTRUCTURE",
        description:
          "Codify the entire infrastructure into modular Terraform definitions, establish mTLS between all workloads, and enforce Cloudflare edge security perimeters.",
        validationCheck: "100% Infrastructure Managed via Automated GitOps",
      },
      {
        phase: "03",
        name: "Chaos Testing & Failover Drills",
        focus: "HIGH-AVAILABILITY VERIFICATION",
        description:
          "Simulate availability zone outages, network partitions, and spike traffic surges to verify automated failover and sub-5-minute recovery objectives.",
        validationCheck: "Successful Unannounced Failover Drill with Zero Data Loss",
      },
    ],
    architectureOverview: {
      title: "Multi-Zone Defense-in-Depth Architecture",
      description:
        "Frontier Systems implements defense-in-depth across every infrastructure tier. Inbound traffic passes through Cloudflare edge protection, is verified by zero-trust identity gateways, routes through private VPC subnets with mTLS, and connects to encrypted data clusters.",
      keyPrinciples: [
        "Default-deny network topology with explicit least-privilege peering",
        "Immutable infrastructure as code eliminates configuration drift",
        "Automated multi-region failover ensures continuous business continuity",
        "Encrypted in transit and at rest with hardware security modules (HSM)",
      ],
    },
    techStack: [
      {
        category: "Cloud Providers & Edge",
        technologies: ["Amazon Web Services (AWS)", "Google Cloud (GCP)", "Cloudflare Enterprise"],
      },
      {
        category: "Orchestration & Containers",
        technologies: ["Kubernetes", "Docker", "Helm", "Terraform", "OpenTofu"],
      },
      {
        category: "Security & Secrets",
        technologies: ["HashiCorp Vault", "Cloudflare Turnstile", "WireGuard", "Cert-Manager (mTLS)"],
      },
      {
        category: "Observability & SRE",
        technologies: ["Prometheus", "Grafana", "OpenTelemetry", "Loki", "Alertmanager"],
      },
    ],
    specifications: [
      {
        label: "Platform Availability",
        value: "99.99% SLA",
        description: "Multi-AZ active/passive redundancy with automated health checks.",
      },
      {
        label: "Incident Response",
        value: "< 15 minutes",
        description: "Direct paging to principal site reliability engineers.",
      },
      {
        label: "Recovery Time Objective (RTO)",
        value: "< 5 minutes",
        description: "Automated container failover across independent availability zones.",
      },
      {
        label: "Security Standard",
        value: "Zero Trust",
        description: "Mutual TLS encryption and ephemeral secret leases.",
      },
    ],
    relatedPillars: [
      {
        slug: "ai-automation",
        title: "AI & Automation",
        relationship: "Hosts private model clusters, secure vector databases, and agent pipelines.",
      },
      {
        slug: "digital-products",
        title: "Digital Products",
        relationship: "Accelerates web and mobile platforms with global edge CDN distribution and Turnstile bot protection.",
      },
      {
        slug: "business-systems",
        title: "Business Systems",
        relationship: "Hardens database clusters, message queues, and API gateways against infrastructure failure.",
      },
    ],
  },
};
