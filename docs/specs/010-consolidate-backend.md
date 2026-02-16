# 010: Consolidate Backend into TanStack Start

## Context

The project currently runs two apps — a TanStack Start frontend (`apps/frontend/`, port 3000) and a Hono backend (`apps/backend/`, port 3001). The backend serves **only** auth endpoints via Better Auth; there is zero custom business logic. The frontend already has its own Better Auth instance for SSR session checking. This means we're maintaining two servers, two auth configs, two env files, and CORS — all for functionality TanStack Start can handle natively via server routes and server functions.

**Goal**: Collapse into a single TanStack Start app at `apps/web/` that handles both UI rendering and auth API routes. Workspace packages (`packages/database`, `packages/shared`) stay as-is.

**Decisions made**:

- Keep workspace packages as separate packages
- Target Node.js deployment
- Drop rate limiting (add back later via reverse proxy)
- Rename `apps/frontend/` → `apps/web/`

---

## Agent Teams Assessment

**Recommendation: Don't use agent teams for this refactor.** Reasons:

1. **Sequential dependencies** — the API route must exist before the backend can be deleted; auth config must be consolidated before the route works; docs can only be updated after the structure is final
2. **Tight coupling** — nearly every file change depends on knowing the outcome of another (e.g., env var names affect auth config, which affects the API route, which affects the client config)
3. **Modest scope** — ~25-30 file changes across a well-understood codebase. A single agent with TodoWrite tracking will handle this efficiently
4. **Coordination overhead** — agent teams introduce message-passing latency and risk conflicting edits on shared files (CLAUDE.md, package.json, eslint config)

Sub-agents can be used for specific parallel tasks (e.g., updating multiple docs simultaneously at the end) but a full team is overkill.

---

## Implementation Plan

### Step 1: Rename `apps/frontend/` → `apps/web/`

**Files to create/move:**

- `mv apps/frontend apps/web`

**Files to modify:**

- `apps/web/package.json` — rename `@app-template/frontend` → `@app-template/web`, update description
- `package.json` (root) — update all `--filter frontend` → `--filter web` in scripts
- `.github/workflows/ci.yml` — update `--filter frontend` → `--filter web`, update `working-directory` and artifact paths
- `eslint.config.mjs` — update `apps/frontend/**` glob patterns → `apps/web/**`
- `apps/web/playwright.config.ts` — no change (uses relative paths)
- `pnpm-workspace.yaml` — no change (uses `apps/*` glob)

### Step 2: Consolidate Better Auth Instance

**Merge backend auth config into `apps/web/src/lib/auth.ts`:**

Current frontend auth.ts is minimal (no emailAndPassword, no session config). Merge in from `apps/backend/src/lib/auth.ts`:

```typescript
import { prisma } from '@app-template/database';
import { AUTH_PASSWORD, getSecureCookies, validateAuthEnv } from '@app-template/shared';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

validateAuthEnv();

const SESSION_EXPIRES_IN = parseInt(process.env.SESSION_EXPIRES_IN ?? '', 10) || 60 * 60 * 24 * 7;
const SESSION_UPDATE_AGE = parseInt(process.env.SESSION_UPDATE_AGE ?? '', 10) || 60 * 60 * 24;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: AUTH_PASSWORD.MIN_LENGTH,
    maxPasswordLength: AUTH_PASSWORD.MAX_LENGTH,
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN,
    updateAge: SESSION_UPDATE_AGE,
  },
  advanced: {
    useSecureCookies: getSecureCookies(),
  },
});

export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
```

### Step 3: Create Better Auth API Route

**New file: `apps/web/src/routes/api/auth/$.tsx`**

TanStack Start catch-all server route mounting Better Auth's handler:

```typescript
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        const { auth } = await import('../../../lib/auth');
        return auth.handler(request);
      },
      POST: async ({ request }: { request: Request }) => {
        const { auth } = await import('../../../lib/auth');
        return auth.handler(request);
      },
    },
  },
});
```

**Note**: Dynamic import keeps Prisma out of client bundle (same pattern as existing `getAuthSession`).

### Step 4: Update Auth Client

**Modify `apps/web/src/lib/auth-client.ts`:**

```typescript
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { createAuthClient } from 'better-auth/react';

// Same-origin — no need for VITE_API_URL
export const authClient = createAuthClient();

export const getAuthSession = createServerFn({ method: 'GET' }).handler(async () => {
  const { auth } = await import('./auth');
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session;
});
```

Key change: `createAuthClient()` with no `baseURL` defaults to same origin. Remove `VITE_API_URL` entirely.

### Step 5: Update Environment Variables

**Rewrite `apps/web/.env.example`:**

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/app_template"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here-change-in-production-minimum-32-characters"
BETTER_AUTH_URL="http://localhost:3000"

# Optional: Session configuration (in seconds)
# SESSION_EXPIRES_IN=604800  # 7 days (default)
# SESSION_UPDATE_AGE=86400   # 1 day (default)
```

**Removed**: `VITE_API_URL`, `PORT`, `FRONTEND_URL`, `NODE_ENV` (Vite handles this).
**Changed**: `BETTER_AUTH_URL` now points to `localhost:3000` (self).

Also update any existing `apps/web/.env` file with the new `BETTER_AUTH_URL`.

### Step 6: Delete Backend

- Remove entire `apps/backend/` directory
- Run `pnpm install` to update lockfile

### Step 7: Update Root Configuration

**`package.json` (root):**

- Update `description`: remove "Hono" reference
- Update `keywords`: remove "hono"
- Update `dev` script: `pnpm --filter web dev` (no more parallel backend)

**`eslint.config.mjs`:**

- Remove the backend-specific rule block (`apps/backend/**/*.ts` section, lines 94-106)
- Update React rules: `apps/frontend/**` → `apps/web/**`

### Step 8: Update CI Workflow

**`.github/workflows/ci.yml`:**

- Update `--filter frontend` → `--filter web` in rollup workaround and E2E test steps
- Update `working-directory: apps/frontend` → `apps/web`
- Update artifact path: `apps/frontend/playwright-report/` → `apps/web/playwright-report/`
- Remove any backend-specific steps (none currently exist independently)

### Step 9: Update Documentation

**`README.md`:**

- Remove Hono from title, tech stack, description
- Update project structure diagram (remove `backend/`, rename to `web/`)
- Update quick start: single `.env` file, single port (3000)
- Remove backend health check and API verification URLs
- Update "Ports" line: just "App: 3000"

**`CLAUDE.md`:**

- Remove all Hono references throughout
- Update project overview: single TanStack Start app
- Update project structure diagram
- Update `pnpm dev` description (no more backend filter)
- Remove "Adding API Endpoints" section about Hono routes
- Add new section about TanStack Start server routes
- Update environment variable documentation
- Update troubleshooting (remove backend port conflict)
- Update `eslint.config.mjs` description section

**`AGENTS.md`:** — no changes needed (generic)

**Auto memory (`~/.claude/projects/.../memory/MEMORY.md`):**

- Rewrite architecture section: single app, single auth instance
- Remove "dual Better Auth instances" note
- Update SSR auth pattern (no more "both instances")
- Remove rate limiting notes
- Update environment section

### Step 10: Verify & Clean Up

Run these checks in order:

1. `pnpm install` — lockfile updates, no errors
2. `pnpm --filter database db:generate` — Prisma client generates
3. `docker compose up -d` — postgres running
4. Copy new `.env.example` to `.env` in `apps/web/`
5. `pnpm dev` — app starts on port 3000
6. Test auth flow: sign up → sign in → dashboard → sign out
7. `pnpm type-check` — passes
8. `pnpm lint` — passes
9. `pnpm build` — passes
10. `pnpm --filter web test:e2e` — E2E tests pass

---

## Files Changed Summary

| Action | File                                 | Notes                                    |
| ------ | ------------------------------------ | ---------------------------------------- |
| Rename | `apps/frontend/` → `apps/web/`       | Directory rename                         |
| Modify | `apps/web/package.json`              | Rename package                           |
| Modify | `apps/web/src/lib/auth.ts`           | Full auth config (merge from backend)    |
| Modify | `apps/web/src/lib/auth-client.ts`    | Remove VITE_API_URL, same-origin client  |
| Create | `apps/web/src/routes/api/auth/$.tsx` | Better Auth catch-all server route       |
| Modify | `apps/web/.env.example`              | Simplified env vars                      |
| Delete | `apps/backend/` (entire directory)   | No longer needed                         |
| Modify | `package.json` (root)                | Update scripts, description, keywords    |
| Modify | `eslint.config.mjs`                  | Remove backend section, update paths     |
| Modify | `.github/workflows/ci.yml`           | Update filter names and paths            |
| Modify | `README.md`                          | Remove Hono references, update structure |
| Modify | `CLAUDE.md`                          | Major rewrite of AI agent guide          |
| Modify | Memory files                         | Update architecture notes                |
