# Frontier Systems

> Production-grade B2B technology and AI company website.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 (strict) |
| Styling | Tailwind CSS 4 |
| Package Manager | pnpm |
| Database | PostgreSQL |
| ORM | Prisma |
| CMS | Sanity |
| 3D / Animation | React Three Fiber, Three.js, GSAP / ScrollTrigger |
| Forms | React Hook Form + Zod |
| Bot Protection | Cloudflare Turnstile |
| Deployment | Vercel |

---

## Architecture

### Directory Structure

```
frontiersystems/
├── app/                         # Next.js App Router
│   ├── api/                     # Route Handlers (HTTP entry points only)
│   ├── layout.tsx               # Root layout — Server Component
│   ├── page.tsx                 # Home page stub — Server Component
│   └── globals.css
│
├── components/
│   ├── ui/                      # Shared primitive UI components
│   └── three/                   # 3D Client Components (isolated, dynamic-import only)
│
├── server/                      # Server-side architecture layers
│   ├── controllers/             # HTTP concerns — no Prisma, no business logic
│   ├── services/                # Business logic — no HTTP, no Prisma
│   └── repositories/            # Data access — Prisma only
│
├── lib/                         # Infrastructure singletons and utilities
│   ├── prisma.ts                # Prisma client singleton
│   ├── sanity.ts                # Sanity CMS client
│   ├── turnstile.ts             # Cloudflare Turnstile verifier
│   ├── rate-limit.ts            # Rate limiter
│   └── logger.ts                # Structured server-side logger
│
├── prisma/
│   └── schema.prisma            # Prisma schema
│
├── sanity/
│   ├── schemas/                 # Sanity content-type schemas
│   └── config.ts                # Sanity configuration
│
├── types/
│   ├── api.ts                   # Shared API response types
│   └── index.ts                 # Barrel re-exports
│
├── tests/                       # Unit, integration, and e2e tests
├── public/                      # Static assets
├── .env.example                 # Environment variable documentation
└── README.md                    # This file
```

---

## API Layer — Strict Architecture Rules

Every HTTP API **must** follow this chain. No shortcuts.

```
Route Handler  (app/api/**/route.ts)
     ↓  parse request, call controller, return response
Controller     (server/controllers/*.controller.ts)
     ↓  HTTP concerns, status codes, response shaping
Service        (server/services/*.service.ts)
     ↓  business logic, validation, security checks
Repository     (server/repositories/*.repository.ts)
     ↓  Prisma queries only
Prisma
     ↓
PostgreSQL
```

### Route Handler Responsibilities
- HTTP entry point only
- Parse request (body, params, headers)
- Call controller function
- Return `NextResponse`
- **NO** business logic
- **NO** direct Prisma calls

### Controller Responsibilities
- HTTP concerns: status codes, response shaping
- Call services
- Format `ApiResponse<T>` envelope
- **NO** direct Prisma calls
- **NO** business logic

### Service Responsibilities
- All business logic lives here
- Validation orchestration (Zod)
- Security checks (auth, authz, rate limits, Turnstile)
- Business rules
- Call repositories and external services
- **NO** HTTP objects (`Request`, `Response`)
- **NO** direct Prisma calls

### Repository Responsibilities
- Database access only via Prisma
- One repository per domain entity/aggregate
- **NO** HTTP logic
- **NO** UI logic
- **NO** business rules

---

## Next.js Component Rules

| Rule | Why |
|------|-----|
| Prefer Server Components | Performance, SEO, security |
| `"use client"` only when browser APIs needed | Minimize client bundle |
| 3D must be isolated in `components/three/` | WebGL cannot run server-side |
| Dynamic import 3D with `ssr: false` | Prevent SSR of WebGL |
| No database queries in React components | Violates layered architecture |
| No secrets in `NEXT_PUBLIC_*` variables | Security |

---

## Security Rules

- **Never** expose secrets to the browser
- **Never** put private secrets in `NEXT_PUBLIC_*` variables
- Validate all untrusted input server-side with **Zod**
- All public write endpoints **must** be rate limited
- Inquiry submission **must** use Cloudflare Turnstile
- File uploads must use strict validation (type, size, extension)
- Authentication and authorization are **server-side only**
- **Never** trust client-provided roles or permissions
- **Never** construct raw SQL from user input (use Prisma parameterized queries)
- Avoid `dangerouslySetInnerHTML` for user-generated content
- Use secure, `HttpOnly` cookies where auth cookies are required
- Implement security headers via `next.config.ts`
- **Do not** expose internal errors (stack traces, SQL errors) to clients
- Log useful server-side errors with `lib/logger.ts` without logging secrets

---

## Code Quality Rules

- **Strict TypeScript** — `"strict": true` in `tsconfig.json`
- No `any` unless genuinely unavoidable and justified in a comment
- Reusable, focused, small modules
- Clear, descriptive naming — no abbreviations
- No duplicated business logic
- No unnecessary dependencies
- No giant components (extract into sub-components)
- No giant `route.ts` files (delegate to controller immediately)
- No business logic inside `page.tsx`
- No database queries inside React components

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in your values.

> **Security**: Never commit `.env.local` or any file containing real credentials.

See `.env.example` for full documentation of each variable.

---

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run lint
pnpm lint

# Run type check
pnpm typecheck

# Build for production
pnpm build
```

---

## Database

```bash
# Generate Prisma client after schema changes
pnpm prisma generate

# Push schema to database (development)
pnpm prisma db push

# Run migrations (production)
pnpm prisma migrate deploy

# Open Prisma Studio
pnpm prisma studio
```

---

## Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Architecture scaffold, directory structure, placeholder files |
| 2 | 🔜 Next | Full Prisma schema, database migrations |
| 3 | 🔜 | Sanity CMS setup, content schemas |
| 4 | 🔜 | Visual website — components, pages, 3D experience |
| 5 | 🔜 | Inquiry form, Turnstile, email |
| 6 | 🔜 | Authentication, admin panel |
| 7 | 🔜 | Testing (unit, integration, e2e) |
| 8 | 🔜 | Vercel deployment, security headers, monitoring |

---

## Contributing

All contributors must adhere to the architecture rules documented in this README.
Violations of the layered architecture or security rules will be rejected in code review.
