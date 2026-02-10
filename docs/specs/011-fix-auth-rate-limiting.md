# 011 - Fix Auth: Rate Limiting + SSR Session Persistence

## Problem

Two auth issues:

1. **Signup blocked by rate limiter** — The `/api/auth/sign-up/email` endpoint returned "Too many requests" because `getClientIp()` fell back to `'unknown'` (all requests shared one bucket) and the limit of 10 req/15min was too low (session checks on every navigation consumed it).

2. **Dashboard redirect on refresh** — Refreshing `/dashboard` redirected to `/login` because `authClient.getSession()` ran during SSR but couldn't forward browser cookies to the backend API.

## Changes

### Backend: Rate Limiting Fixes

**`apps/backend/src/middleware/rateLimit.ts`**

- Fixed `getClientIp` to use `getConnInfo` from `@hono/node-server/conninfo` as fallback for real IP extraction
- Increased general auth rate limit: 10 → 100 requests per 15 minutes

**`apps/backend/src/routes/auth.ts`**

- Excluded `/status` and `/get-session` from rate limiting (read-only session checks)
- Rate limiting now only applies to `/sign-in/*`, `/sign-up/*`, `/sign-out`

### Frontend: Idiomatic SSR Session Checking

Following the [Better Auth TanStack Start integration docs](https://www.better-auth.com/docs/integrations/tanstack), replaced the HTTP-fetch-based session check with a direct database query.

**`apps/frontend/package.json`**

- Added `@app-template/database` workspace dependency

**`apps/frontend/.env` / `.env.example`**

- Added `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` (server-side only, not exposed to client)

**`apps/frontend/src/lib/auth.ts`** (new)

- Server-side Better Auth instance with Prisma adapter — same database and secret as backend

**`apps/frontend/src/lib/auth-client.ts`**

- Rewrote `getAuthSession` server function: uses `auth.api.getSession({ headers })` with `getRequestHeaders()` instead of HTTP fetch
- Dynamic `import('./auth')` prevents Prisma from leaking into client bundle
- Removed manual `SessionUser`/`SessionData` interfaces (Better Auth provides types)

**`apps/frontend/src/routes/_authed.tsx`** — No changes needed (already calls `getAuthSession` from `beforeLoad`)

## Verification

1. `pnpm install` then `pnpm type-check`
2. Start both servers: `pnpm dev`
3. Sign up — should work without rate limit errors
4. Navigate to `/dashboard`, hard-refresh — should stay on the page
5. Open incognito, go to `/dashboard` — should redirect to `/login`
