# Database Specification

## Overview

The application uses PostgreSQL 16 as its sole data store. All data access goes through Prisma 7 with the `@prisma/adapter-pg` driver adapter, which connects to PostgreSQL via the `pg` connection pool rather than Prisma's built-in query engine. This gives better control over connection management and compatibility with edge runtimes.

## Design Decisions

### PostgreSQL as the universal backend

PostgreSQL serves three roles:

1. **Application database** - user data and future domain models
2. **Auth session store** - Better Auth stores users, sessions, accounts, and verification tokens directly in PostgreSQL tables via Prisma
3. **Job queue backend** - pg-boss uses PostgreSQL for reliable background job processing (stored in a separate `pgboss` schema)

This eliminates the need for Redis, RabbitMQ, or any other infrastructure component in the early stages. When scaling demands it, these can be added later without changing application code.

### Driver adapter over query engine

Prisma is configured with `@prisma/adapter-pg` rather than using Prisma's default binary query engine. The driver adapter delegates query execution to the `pg` npm package, which:

- Avoids shipping a platform-specific Prisma engine binary
- Gives direct control over the connection pool
- Improves compatibility with container environments

### Singleton client pattern

The Prisma client is instantiated once and cached on `globalThis` in non-production environments. This prevents the "too many clients" problem during hot module reloading in development, where each reload would otherwise create a new connection pool.

In production, the client is created once when the module first loads and never reassigned.

## Data Model

All models are defined in `apps/web/prisma/schema.prisma` — this is the single source of truth. Read the schema directly for current fields, types, relations, and indexes.

## Naming Conventions

- **Prisma fields** use `camelCase` (e.g., `emailVerified`, `userId`)
- **Database columns** use `snake_case` via `@map()` directives (e.g., `email_verified`, `user_id`)
- **Table names** use singular `snake_case` via `@@map()` (e.g., `user`, `session`, `account`)
- **Primary keys** use `cuid()` for globally unique, sortable, URL-safe identifiers

## Migration Strategy

Migrations are managed by Prisma Migrate and stored as SQL files in `prisma/migrations/`. The workflow:

1. Edit `schema.prisma`
2. Run `pnpm --filter web db:migrate` to generate and apply a migration
3. Commit both the schema change and the generated migration SQL

Migration files are never manually edited. They serve as an auditable, version-controlled record of every schema change. In production, `prisma migrate deploy` applies pending migrations without generating new ones.

The initial migration (`20260101210059_init_better_auth_models`) creates all four auth tables with their indexes and relationships.

## Seeding

The seed script (`prisma/seed.ts`) creates test data for development and E2E testing:

- **Admin user** - `admin@example.com` with a known password
- **Test user** - `test@example.com` for automated tests

The seed is guarded against running in production. It clears existing data before inserting, making it idempotent. Passwords are hashed using Better Auth's `hashPassword` utility to ensure compatibility with the auth system.

Run with: `pnpm --filter web db:seed`

## Connection Management

The database connection is configured via the `DATABASE_URL` environment variable (standard PostgreSQL connection string). The `pg` Pool handles connection pooling with sensible defaults.

In development, query logging is enabled - every SQL query is logged with its duration via Pino. Warnings and errors are always logged regardless of environment.

## Background Jobs (pg-boss)

pg-boss provides PostgreSQL-backed job queues in a separate `pgboss` schema. Like the Prisma client, the pg-boss instance uses a singleton pattern cached on `globalThis`.

The jobs infrastructure provides:

- **Reliable delivery** - jobs survive process restarts because they live in PostgreSQL
- **Retry and scheduling** - pg-boss handles failed job retries, delayed execution, and cron-like scheduling
- **No extra infrastructure** - uses the same PostgreSQL instance as the application

Job workers are started and stopped alongside the application server. Individual job handlers are registered in `startJobWorkers()`. An example job (`send-welcome-email`) demonstrates the pattern of scheduling a job at user signup time and processing it asynchronously with email delivery.

## Database Commands

| Command                               | Purpose                                       |
| ------------------------------------- | --------------------------------------------- |
| `pnpm --filter web db:generate`       | Regenerate Prisma client after schema changes |
| `pnpm --filter web db:migrate`        | Create and apply a new migration              |
| `pnpm --filter web db:migrate:deploy` | Apply pending migrations (production)         |
| `pnpm --filter web db:studio`         | Open Prisma Studio GUI                        |
| `pnpm --filter web db:seed`           | Seed development data                         |
| `pnpm --filter web db:reset`          | Drop database, reapply all migrations, reseed |
