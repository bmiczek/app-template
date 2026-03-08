# App Template - Project Specification

## Purpose

App Template is a production-ready starter for full-stack TypeScript web applications. It provides the foundational infrastructure that every SaaS or internal tool needs - authentication, database access, background jobs, transactional email, observability, and CI/CD - so that teams can skip boilerplate and start building domain-specific features immediately.

The template is opinionated by design: it makes technology choices up front and wires them together correctly, trading flexibility for a fast, coherent starting point.

## Goals

1. **Zero-to-feature in minutes.** Clone, install, `docker compose up`, `pnpm dev` - a working app with auth, database, and a deployable Docker image.
2. **Full-stack TypeScript.** One language across client, server, database queries, validation schemas, and build tooling.
3. **Server-side rendering with hydration.** Pages render on the server for performance and SEO, then hydrate on the client for interactivity.
4. **Production-ready defaults.** Security headers, structured logging, error tracking, health checks, and CI pipelines are included from day one.
5. **Extensible monorepo structure.** Start with one app; add packages or services to `apps/` as the product grows.

## Non-Goals

- **Not a component library.** UI components are provided only as building blocks for the auth flows and example pages.
- **Not a deployment platform.** The template produces a Docker image and runs anywhere containers run, but does not prescribe a hosting provider.
- **Not a multi-tenant SaaS framework.** Tenant isolation, billing, and subscription management are out of scope.

## Technology Choices

| Layer            | Technology                         | Why                                                                                         |
| ---------------- | ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Framework        | TanStack Start (Vite-based, v1.x)  | Full-stack React with SSR, file-based routing, server functions, and first-class TypeScript |
| Language         | TypeScript 5.x                     | Type safety across the entire stack                                                         |
| UI               | React 19                           | Latest concurrent features, server component readiness                                      |
| Styling          | Tailwind CSS v4 + shadcn/ui        | Utility-first CSS with accessible, composable component primitives                          |
| Database         | PostgreSQL 16                      | Battle-tested relational database                                                           |
| ORM              | Prisma 7 with `@prisma/adapter-pg` | Type-safe database access with migration management                                         |
| Auth             | Better Auth                        | Lightweight, self-hosted auth with email/password and extensible provider support           |
| Forms            | TanStack Form + Zod                | Type-safe form state management with schema validation                                      |
| Background Jobs  | pg-boss                            | PostgreSQL-backed job queue - no extra infrastructure                                       |
| Email            | Resend                             | Transactional email with graceful dev-mode fallback (log to console)                        |
| Logging          | Pino                               | Structured JSON logging in production, pretty-printed in development                        |
| Error Tracking   | Sentry                             | Client + server error capture with source map uploads                                       |
| Monorepo         | pnpm workspaces                    | Fast, disk-efficient package management with workspace filtering                            |
| CI/CD            | GitHub Actions                     | Lint, type-check, unit test, build, and E2E test on every PR                                |
| Containerization | Docker (multi-stage)               | Minimal production image based on `node:22-alpine`                                          |

## Architecture Overview

```
┌──────────────────────────────────────────────────┐
│                    Browser                       │
│  React 19 + TanStack Router + TanStack Query     │
│  Better Auth client + TanStack Form              │
└──────────────────┬───────────────────────────────┘
                   │ HTTP (same origin)
┌──────────────────▼───────────────────────────────┐
│              TanStack Start Server               │
│  ┌─────────────┐ ┌──────────────┐ ┌───────────┐ │
│  │ SSR Engine  │ │ Server Fns   │ │ API Routes│ │
│  │ (React DOM) │ │ (createSrvFn)│ │ (handlers)│ │
│  └──────┬──────┘ └──────┬───────┘ └─────┬─────┘ │
│         │               │               │       │
│  ┌──────▼───────────────▼───────────────▼─────┐ │
│  │           Server-Only Boundary             │ │
│  │  Prisma · Better Auth · pg-boss · Resend   │ │
│  └──────────────────┬────────────────────────┘ │
└─────────────────────┼────────────────────────────┘
                      │
         ┌────────────▼────────────┐
         │     PostgreSQL 16       │
         │  App tables + pgboss   │
         └─────────────────────────┘
```

The application is a single deployable unit. The TanStack Start server handles SSR, serves the client bundle, and exposes API routes - all from the same process. Server-only code (Prisma, auth, jobs) is isolated behind dynamic imports to prevent it from leaking into the client bundle.

## Specification Documents

Each area of the system is documented in its own spec:

| Document                            | Scope                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| [Authentication](auth.md)           | Auth provider, session management, server/client split, validation, route protection |
| [Database](database.md)             | Data model, Prisma configuration, migrations, seeding, connection management         |
| [Routing & API](routing.md)         | File-based routing, server routes, server functions, middleware, API patterns        |
| [Frontend](frontend.md)             | UI component system, styling, forms, layout, client-side state                       |
| [Infrastructure](infrastructure.md) | Monorepo structure, Docker, CI/CD, environment config, observability, dev tooling    |

## Key Architectural Decisions

### Single-process server

TanStack Start serves both the rendered HTML and the API from one Node.js process. This simplifies deployment and eliminates CORS. API routes live alongside page routes in the same file-based routing tree.

### Dynamic imports for server isolation

Server-only modules (Prisma, Better Auth, pg-boss) are never statically imported at the top level of files that participate in the client module graph. Instead, they are dynamically imported inside `createServerFn` handlers and server route handlers. This prevents Vite from bundling Node.js code into the browser bundle.

### PostgreSQL as the universal backend

PostgreSQL serves as the application database, the auth session store (via Prisma), and the job queue backend (via pg-boss). This eliminates the need for Redis or a separate message broker in the early stages of a project.

### Self-hosted authentication

Better Auth runs inside the application process and stores its data in the same PostgreSQL database. There is no external auth service dependency. This gives full control over the auth flow, data residency, and session configuration.

### Validation at the boundary

Zod schemas validate all external input: environment variables on startup, API request bodies in server routes, and form data on the client. Internal code trusts typed interfaces and does not redundantly validate.
