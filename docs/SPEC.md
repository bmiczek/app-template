# Project Specification

## Purpose

<!-- Update this section when you fork the template to describe your project's domain and goals. -->

A full-stack TypeScript web application with authentication, database access, background jobs, transactional email, observability, and CI/CD.

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

### Foundation

These specs describe the platform's built-in systems. They are stable and change only when the underlying infrastructure changes.

| Document                            | Scope                                                                                |
| ----------------------------------- | ------------------------------------------------------------------------------------ |
| [Authentication](auth.md)           | Auth provider, session management, server/client split, validation, route protection |
| [Database](database.md)             | Data model, Prisma configuration, migrations, seeding, connection management         |
| [Routing & API](routing.md)         | File-based routing, server routes, server functions, middleware, API patterns        |
| [Frontend](frontend.md)             | UI component system, styling, forms, layout, client-side state                       |
| [Infrastructure](infrastructure.md) | Monorepo structure, Docker, CI/CD, environment config, observability, dev tooling    |

### Features

As domain-specific features are built, each gets its own spec in this directory. Add new feature specs to the table below.

<!-- Example:
| [Billing](billing.md)               | Stripe integration, subscription plans, usage tracking, invoicing                    |
| [Teams](teams.md)                   | Team creation, membership, roles, invitations                                        |
-->

| Document | Scope |
| -------- | ----- |
|          |       |

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
