# 011: Remove packages/shared — Inline into Web App

## Context

After consolidating the Hono backend into TanStack Start (010), `packages/shared/` has only one consumer: `apps/web/`. The package was designed to share code between frontend and backend — that second consumer no longer exists.

**What's used:**

- `auth-config.ts` (`AUTH_PASSWORD`, `validateAuthEnv`, `getSecureCookies`) — imported by `auth.ts`, `login.tsx`, `signup.tsx`

**What's dead code:**

- `constants.ts` (`API_VERSION`, `HTTP_STATUS`, `PAGINATION_DEFAULTS`) — zero imports
- `types.ts` (`ApiResponse`, `PaginatedResponse`, `User`, `Session`, `AuthStatusResponse`) — zero imports

**Goal:** Move `auth-config.ts` into `apps/web/src/lib/`, delete everything else, remove the workspace package.

---

## Implementation Plan

### Step 1: Move auth-config into web app

Copy `packages/shared/src/auth-config.ts` → `apps/web/src/lib/auth-config.ts` (no changes to file content).

### Step 2: Update imports (3 files)

| File                             | Old import                    | New import                  |
| -------------------------------- | ----------------------------- | --------------------------- |
| `apps/web/src/lib/auth.ts`       | `from '@app-template/shared'` | `from './auth-config'`      |
| `apps/web/src/routes/login.tsx`  | `from '@app-template/shared'` | `from '../lib/auth-config'` |
| `apps/web/src/routes/signup.tsx` | `from '@app-template/shared'` | `from '../lib/auth-config'` |

### Step 3: Remove `@app-template/shared` dependency

- `apps/web/package.json` — remove `"@app-template/shared": "workspace:*"` from dependencies

### Step 4: Delete `packages/shared/` directory

Remove the entire directory.

### Step 5: Clean up configuration references

- `eslint.config.mjs` — remove the shared package rules block (lines 112-115)
- `pnpm-workspace.yaml` — no change needed (uses `packages/*` glob, `database` still exists)

### Step 6: Update documentation

- `CLAUDE.md` — remove shared package references
- `README.md` — remove shared from structure diagram
- Auto memory (`MEMORY.md`) — remove workspace dependency note

### Step 7: Verify

1. `pnpm install` — lockfile updates cleanly
2. `pnpm type-check` — passes
3. `pnpm lint` — passes
4. `pnpm build` — passes
