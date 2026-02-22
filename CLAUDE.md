# CLAUDE.md - AI Agent Guide

## Project Overview

**App Template** - Full-stack TypeScript monorepo:

- **App**: TanStack Start (React 19, SSR, Vite-based, server routes)
- **Database**: PostgreSQL + Prisma
- **Auth**: Better Auth
- **Infra**: Docker Compose, pnpm workspaces

### TanStack Start Version (IMPORTANT)

This project uses **Vite-based TanStack Start** (v1.x with `@tanstack/react-start`), NOT the older Vinxi-based version.

- Package: `@tanstack/react-start` (not `@tanstack/start`)
- Config: `vite.config.ts` with `tanstackStart()` plugin
- Commands: `vite` / `vite build`

When searching docs, look for **Vite-based TanStack Start (2024-2025)**.

---

## Essential Commands

**Always use `pnpm`, never npm/yarn**

```bash
# Dev
pnpm install                              # Install all
pnpm dev                                  # Run app (port 3000)
pnpm --filter web dev                     # Explicit filter

# Database
pnpm --filter database db:migrate         # Run migrations
pnpm --filter database db:generate        # Generate Prisma client
pnpm --filter database db:studio          # Open Prisma Studio

# Build & Check
pnpm build                                # Build all
pnpm type-check                           # Type check all
pnpm lint                                 # Run ESLint
pnpm format                               # Format with Prettier

# Dependencies
pnpm --filter <workspace> add <package>   # Add to workspace
pnpm add -w -D <package>                  # Add to root (build tools only)
```

---

## Project Structure

```
apps/
  web/              # TanStack Start (pages + API server routes)
    src/routes/     # File-based routing (auto-registered)
    src/lib/        # Auth, utilities
packages/
  database/         # Prisma schema + client
```

**Key files:**

- Prisma schema: `packages/database/prisma/schema.prisma`
- Auth config: `apps/web/src/lib/auth.ts`
- Auth client: `apps/web/src/lib/auth-client.ts`
- Auth API route: `apps/web/src/routes/api/auth/$.tsx`
- Vite config: `apps/web/vite.config.ts`

**Port:** App: 3000 | PostgreSQL: 5432

---

## Guidelines for AI Agents

### Before Starting

1. Use TodoWrite to track multi-step tasks
2. **Validate approach**: Before implementing, verify the solution follows idiomatic patterns and best practices for the relevant technology. When in doubt, research current recommendations rather than assuming.

### Plan Mode (CRITICAL - Use Frequently!)

**Enter plan mode for ANY non-trivial task.** This project has multiple packages with interdependencies—jumping straight to implementation often leads to mistakes.

**ALWAYS use plan mode when:**

- Adding or modifying features (even "simple" ones like buttons or forms)
- Making changes that touch multiple packages (web + database)
- Working with database schema changes
- Implementing authentication or authorization logic
- Adding new server routes or API endpoints
- Refactoring existing code
- Fixing bugs that aren't immediately obvious one-liners
- Any task where you're unsure about the approach

**In plan mode, you should:**

1. Identify all files that will need changes
2. Check for existing similar implementations to follow
3. Use Context7 MCP tools for up-to-date library documentation

**Only skip plan mode for:** typo fixes, single-line changes, or when user gives extremely detailed step-by-step instructions.

### Keeping Specs Current

Some directories contain a `SPEC.md` describing the patterns and decisions for that area of code. When you modify code in a directory that has a `SPEC.md`, review it and update if your changes affect the documented patterns. Don't update specs for routine additions (new routes, new fields) — only when patterns, architecture, or conventions change.

### Core Principles (IMPORTANT!)

- Prefer idiomatic solutions over hacky workarounds
- Use Prisma from `@app-template/database`
- Ask before major architectural decisions
- Read existing code patterns before adding new code
- Always use Context7 MCP tools automatically when needing code generation, setup/configuration steps, library/API documentation
- Ask any clarifying questions one by one, and always propose a recommendation

### Code Style

- PascalCase for interfaces/types, camelCase for functions/variables
- Always type function parameters and return values
- Use `interface` over `type` for object shapes
- Named function components in React (not arrow default exports)
- Never use `any` - prefer `unknown` and narrow
- Use `@/` path alias for cross-directory imports (e.g., `import { auth } from '@/lib/auth'`). Keep same-directory sibling imports relative (`./foo`).

### Database Changes

```bash
# 1. Edit packages/database/prisma/schema.prisma
# 2. Run migration
pnpm --filter database db:migrate
# 3. Commit schema + migration files
```

- Use camelCase for Prisma fields, snake_case for DB columns
- Never manually edit migration files

### Adding Server Routes (API Endpoints)

TanStack Start handles API routes via server routes in the file-based routing system:

1. Create route file in `apps/web/src/routes/api/<name>.tsx`
2. Use `createFileRoute` with `server.handlers` for HTTP methods
3. Use dynamic imports for server-only modules (Prisma, auth) to prevent client bundle leaks

Example:

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/example')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }): Promise<Response> => {
        return new Response(JSON.stringify({ data: 'hello' }), {
          headers: { 'Content-Type': 'application/json' },
        });
      },
    },
  },
});
```

### Adding Server Functions

For data fetching that doesn't need a public API endpoint, use `createServerFn`:

```typescript
import { createServerFn } from '@tanstack/react-start';

export const getData = createServerFn({ method: 'GET' }).handler(async () => {
  // Server-only code here (direct DB access, etc.)
});
```

### Adding Frontend Routes

- Create file in `apps/web/src/routes/` (auto-registered)
- Use TanStack Query for data fetching
- Use TanStack Form for forms

### Git Commits

Proactively suggest commits at milestones (features complete, bugs fixed, docs updated). **Always ask before committing.**

Format:

```
<type>: <description>

- Detail 1
- Detail 2

Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## Critical Reminders

### Do

- Run `docker compose up -d` before dev
- Copy `.env.example` to `.env` in `apps/web/`
- Run `pnpm type-check` before commits (pre-commit hooks run lint automatically)
- Generate Prisma client after schema changes

### Don't

- Use `db:push` in production (migrations only)
- Edit migration files manually
- Commit `.env` files
- Use `any` type (use `unknown` and narrow)

---

## Troubleshooting

**"Cannot find module '@app-template/...'"**

```bash
pnpm install && pnpm --filter database db:generate
```

**Port already in use**

```bash
lsof -i :3000 && kill -9 <PID>
```

**Docker issues**

```bash
docker compose logs -f postgres
docker compose restart postgres
```

---

## E2E Testing & PR Screenshots

### Running E2E Tests

```bash
pnpm --filter web test:e2e           # Run all E2E tests (headless)
pnpm --filter web test:e2e:headed    # Run with visible browser
pnpm --filter web test:e2e:ui        # Run with Playwright UI
```

### PR Screenshot Workflow

When completing frontend tasks, use the Playwright MCP server to capture screenshots:

1. Start the dev server: `pnpm dev`
2. Use the MCP Playwright tools to navigate and screenshot
3. Include screenshots in the PR description under a "Screenshots" section

The MCP Playwright server is configured in `.claude/mcp.json` and provides browser automation capabilities for validation and documentation.

### CI Integration

E2E tests run automatically on every PR. Test reports are uploaded as artifacts and available for 30 days.

---

## Resources

- [TanStack Start](https://tanstack.com/start/latest)
- [Prisma](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
