# Infrastructure Specification

## Overview

The project is a pnpm monorepo with a single application workspace (`apps/web`). Infrastructure includes Docker for local services and production deployment, GitHub Actions for CI/CD, and a comprehensive dev tooling chain for linting, formatting, and testing.

## Design Decisions

### Monorepo with single workspace

The project uses pnpm workspaces with `apps/*` as the workspace glob. Currently only `apps/web` exists, but the structure supports adding shared packages (`packages/`) or additional services (`apps/`) without restructuring.

Root-level tooling (ESLint, Prettier, Husky, commitlint) is shared across all workspaces. Application-specific tooling (Vite, Prisma, Playwright) lives within the workspace.

### Single-process deployment

The TanStack Start server handles SSR, API routes, and static asset serving in one Node.js process. This simplifies deployment: one container, one port (3000), one health check endpoint.

### PostgreSQL for everything

Local development uses Docker Compose to run PostgreSQL. The same database backs the application, auth sessions, and background job queue. No Redis, no message broker, no additional services needed at this stage.

## Monorepo Structure

```
app-template/
├── apps/
│   └── web/                    # TanStack Start application
│       ├── prisma/             # Schema, migrations, seed
│       ├── src/
│       │   ├── components/     # UI components
│       │   ├── lib/            # Server and shared libraries
│       │   ├── routes/         # File-based routes
│       │   └── styles/         # Global CSS
│       ├── e2e/                # Playwright E2E tests
│       ├── package.json        # Workspace dependencies
│       ├── vite.config.ts      # Vite + TanStack Start config
│       └── components.json     # shadcn/ui config
├── .github/workflows/          # CI pipelines
├── docker-compose.yml          # Local services
├── Dockerfile                  # Production image
├── package.json                # Root scripts and shared dev deps
└── pnpm-workspace.yaml         # Workspace definition
```

## Environment Configuration

Environment variables are validated at startup with a Zod schema (`src/env.ts`). The application fails fast with clear error messages if required variables are missing or malformed.

### Required Variables

| Variable             | Purpose                                               |
| -------------------- | ----------------------------------------------------- |
| `DATABASE_URL`       | PostgreSQL connection string                          |
| `BETTER_AUTH_SECRET` | Auth signing secret (min 32 characters)               |
| `BETTER_AUTH_URL`    | Application's public URL (used by auth for redirects) |

### Optional Variables

| Variable             | Default                       | Purpose                                            |
| -------------------- | ----------------------------- | -------------------------------------------------- |
| `NODE_ENV`           | `development`                 | Runtime environment                                |
| `SESSION_EXPIRES_IN` | `604800` (7 days)             | Session lifetime in seconds                        |
| `SESSION_UPDATE_AGE` | `86400` (1 day)               | Session refresh window in seconds                  |
| `LOG_LEVEL`          | `debug` (dev) / `info` (prod) | Pino log level                                     |
| `VITE_SENTRY_DSN`    | -                             | Sentry DSN for client-side error tracking          |
| `SENTRY_DSN`         | -                             | Sentry DSN for server-side error tracking          |
| `SENTRY_AUTH_TOKEN`  | -                             | Sentry auth token for source map uploads (CI only) |
| `SENTRY_ORG`         | -                             | Sentry organization slug (CI only)                 |
| `SENTRY_PROJECT`     | -                             | Sentry project slug (CI only)                      |
| `RESEND_API_KEY`     | -                             | Resend API key for transactional email             |
| `EMAIL_FROM`         | `noreply@example.com`         | Sender address for outbound email                  |

When optional integrations (Sentry, Resend) are not configured, the application runs normally - errors are logged locally, and emails are printed to the console.

## Docker

### Local Development (docker-compose.yml)

Two services:

1. **postgres** - PostgreSQL 16 Alpine with health checks, persistent volume, and default credentials (`postgres:postgres`, database `app_template`)
2. **prisma-studio** - Prisma Studio web UI exposed on port 5555, connected to the same database

Services communicate over a dedicated bridge network (`app-network`).

### Production Image (Dockerfile)

Multi-stage build with three stages:

| Stage     | Base             | Purpose                                       |
| --------- | ---------------- | --------------------------------------------- |
| `deps`    | `node:22-alpine` | Install all dependencies (dev + prod)         |
| `builder` | (from deps)      | Generate Prisma client, build the application |
| `runner`  | `node:22-alpine` | Production-only dependencies + build output   |

Key details:

- **pnpm** is activated via `corepack` at a pinned version (`9.12.3`)
- **Production install** uses `--ignore-scripts` to skip the `husky prepare` script (Husky is a devDependency not present in the production image)
- **Build output** is `dist/` (Vite-based TanStack Start convention)
- **Server entry** is `dist/server/server.js`
- **Prisma migrations** are copied into the image for `prisma migrate deploy` at runtime
- **Exposed port** is 3000

## CI/CD (GitHub Actions)

The CI pipeline (`.github/workflows/ci.yml`) runs on every push to `main` and every PR targeting `main`. It uses concurrency groups to cancel superseded runs.

### Jobs

| Job              | Depends On | Purpose                                                                           |
| ---------------- | ---------- | --------------------------------------------------------------------------------- |
| `lint-typecheck` | -          | ESLint, Prettier format check, TypeScript type check, production dependency audit |
| `test`           | -          | Vitest unit tests                                                                 |
| `build`          | -          | Full production build (Vite build + TypeScript emit check)                        |
| `e2e`            | `build`    | Playwright E2E tests against a real PostgreSQL service container                  |

All jobs run on `ubuntu-latest` with Node.js 20 and pnpm (auto-detected from `packageManager` field).

### E2E Test Infrastructure

The E2E job provisions a PostgreSQL service container with test credentials. Playwright browsers are cached between runs. Test reports are uploaded as artifacts with 30-day retention.

## Observability

### Logging

[Pino](https://getpino.io) provides structured JSON logging:

- **Development** - pretty-printed with colors via `pino-pretty`, at `debug` level
- **Production** - raw JSON output at `info` level (suitable for log aggregation)
- **Log level** is configurable via `LOG_LEVEL` environment variable

The logging middleware assigns a UUID to each request and logs start/completion with method, path, status, and duration.

### Error Tracking

[Sentry](https://sentry.io) is integrated for both client and server:

- **Client** - TanStack Router browser tracing, session replay (10% sampling, 100% on error)
- **Server** - TanStack Start middleware instrumentation via `@sentry/tanstackstart-react`
- **Source maps** - uploaded during build via the Sentry Vite plugin, then deleted from the output
- **Graceful degradation** - Sentry is silently disabled when `VITE_SENTRY_DSN` is not set

### Health Check

`GET /api/health` verifies database connectivity and returns the application version. Returns 200 with `{ status: "ok", db: "ok" }` when healthy, or 503 with `{ status: "error", db: "error" }` when the database is unreachable.

## Dev Tooling

### Linting

ESLint 9 with flat config. Plugins:

- `typescript-eslint` - TypeScript-specific rules
- `eslint-plugin-react` / `eslint-plugin-react-hooks` - React best practices
- `eslint-plugin-jsx-a11y` - accessibility checks
- `eslint-config-prettier` - disables rules that conflict with Prettier

### Formatting

Prettier with `prettier-plugin-organize-imports` for automatic import sorting.

### Git Hooks

- **Husky** - manages Git hooks
- **lint-staged** - runs ESLint and Prettier on staged files before commit
- **commitlint** - enforces [Conventional Commits](https://www.conventionalcommits.org) format (`feat:`, `fix:`, `chore:`, etc.)

### Type Checking

`tsc --noEmit` via the `type-check` script. Run across all workspaces with `pnpm type-check`. Also runs as part of the build (`vite build && tsc --noEmit`).

### Testing

| Type            | Tool        | Command                             |
| --------------- | ----------- | ----------------------------------- |
| Unit            | Vitest      | `pnpm --filter web test`            |
| Unit (coverage) | Vitest + v8 | `pnpm --filter web test:coverage`   |
| E2E             | Playwright  | `pnpm --filter web test:e2e`        |
| E2E (headed)    | Playwright  | `pnpm --filter web test:e2e:headed` |
| E2E (UI)        | Playwright  | `pnpm --filter web test:e2e:ui`     |

### Bundle Analysis

`pnpm analyze` builds the application with `rollup-plugin-visualizer`, producing an interactive bundle size report at `dist/bundle-stats.html`.

## Build System

Vite 7 with the following plugins:

| Plugin                              | Purpose                                                   |
| ----------------------------------- | --------------------------------------------------------- |
| `@tailwindcss/vite`                 | Tailwind CSS v4 compilation                               |
| `vite-tsconfig-paths`               | TypeScript path alias resolution (`@/`)                   |
| `@tanstack/react-start/plugin/vite` | TanStack Start SSR, routing, server functions             |
| `@vitejs/plugin-react`              | React Fast Refresh, JSX transform                         |
| `@sentry/tanstackstart-react/vite`  | Source map uploads, server instrumentation (must be last) |
| `rollup-plugin-visualizer`          | Bundle analysis (conditional, only when `ANALYZE=true`)   |

Server-only packages (`pg-boss`) are externalized from both the SSR and client bundles to prevent Node.js built-in errors in the browser.

## Platform Requirements

| Requirement | Version                                   |
| ----------- | ----------------------------------------- |
| Node.js     | >= 20.0.0                                 |
| pnpm        | >= 9.0.0 (pinned to 9.12.3)               |
| Docker      | For local PostgreSQL and production image |
| PostgreSQL  | 16 (via Docker)                           |
