# Spec: Frontend Authentication with Better Auth (Issue #18)

## Context

The backend authentication is fully implemented with Better Auth v1.4.2 (email/password, session management, rate limiting, CORS with credentials). The frontend has zero auth integration — no client, no hooks, no login/signup pages, no route protection. This spec covers wiring up the frontend to the existing backend auth.

---

## Approach

Use the **Better Auth React client** (`better-auth/react`) which provides:

- `createAuthClient()` → typed client with `signIn.email()`, `signUp.email()`, `signOut()`, `getSession()`
- `useSession()` hook → reactive session state with `isPending`, `error`, `refetch`
- Automatic CSRF token handling and cookie management

Use **TanStack Router's `_authed` layout route** pattern for route protection via `beforeLoad`.

No React Context needed — Better Auth's `useSession()` uses a shared nanostore internally, so all call sites share state.

---

## Files to Create

### 1. `apps/frontend/src/lib/auth-client.ts` — Better Auth client instance

```ts
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});
```

Single source of truth. Import from `better-auth/react` (not `better-auth/client`) to get React hooks.

### 2. `apps/frontend/src/routes/login.tsx` — Login page

- `createFileRoute('/login')` with `validateSearch` for `?redirect=` param
- Controlled form: email + password fields via `useState`
- Submit via `authClient.signIn.email({ email, password }, { onSuccess, onError })`
- Client-side validation: non-empty fields, password >= 8 chars
- On success: navigate to `redirect` search param or `/dashboard`
- On error: display error message from Better Auth
- Link to `/signup`

### 3. `apps/frontend/src/routes/signup.tsx` — Signup page

- `createFileRoute('/signup')`
- Controlled form: name + email + password + confirm password
- Submit via `authClient.signUp.email({ name, email, password }, { onSuccess, onError })`
- Client-side validation: email format, password 8-128 chars, passwords match
- On success: navigate to `/dashboard` (Better Auth auto-signs in after signup)
- On error: display error message
- Link to `/login`

### 4. `apps/frontend/src/routes/_authed.tsx` — Protected layout route

```ts
export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ context, location }) => {
    const { data: session } = await context.authClient.getSession();
    if (!session) {
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
    return { session };
  },
  component: () => <Outlet />,
});
```

- `beforeLoad` uses `authClient.getSession()` (promise-based, not a hook — safe outside React)
- Redirects to `/login?redirect=<current_url>` if unauthenticated
- Passes `session` to child routes via route context

### 5. `apps/frontend/src/routes/_authed/dashboard.tsx` — Example protected page

- Accesses `session` from `Route.useRouteContext()`
- Displays user info (name, email, session expiry)
- Demonstrates the protected route pattern works

---

## Files to Modify

### 6. `apps/frontend/package.json` — Add dependency

```bash
pnpm --filter frontend add better-auth
```

### 7. `apps/frontend/src/routes/__root.tsx` — Auth-aware root layout

Changes:

- `createRootRoute` → `createRootRouteWithContext<RouterContext>()`
- Define `RouterContext` interface: `{ authClient: typeof authClient }`
- Replace static nav with `NavBar` component that calls `authClient.useSession()`
- Nav shows: `Login | Sign Up` when unauthenticated, `{user name} | Dashboard | Sign Out` when authenticated

### 8. `apps/frontend/src/router.tsx` — Inject auth client into router context

Changes:

- Import `authClient` from `./lib/auth-client`
- Add `context: { authClient }` to `createRouter()` options
- This makes `authClient` available in all `beforeLoad` hooks via `context.authClient`

### 9. `apps/frontend/src/routes/index.tsx` — Auth-aware home page

Minor update:

- Use `authClient.useSession()` to show conditional content
- Authenticated: welcome message + link to dashboard
- Unauthenticated: links to login/signup

---

## Session Flow

```
Page load → NavBar renders → useSession() checks cookie → fetches GET /api/auth/get-session
  ├─ Has session → shows user name + Sign Out
  └─ No session → shows Login + Sign Up links

Navigate to /dashboard → _authed.tsx beforeLoad → authClient.getSession()
  ├─ Has session → render dashboard with session in context
  └─ No session → redirect to /login?redirect=/dashboard

Login form submit → authClient.signIn.email() → POST /api/auth/sign-in/email
  ├─ Success → cookie set, useSession() reactively updates, navigate to redirect or /dashboard
  └─ Error → display error message

Sign Out → authClient.signOut() → POST /api/auth/sign-out
  → cookie cleared, useSession() reactively updates to null
```

---

## Known Limitation: SSR

TanStack Start runs `beforeLoad` on both server and client. During SSR (hard refresh), the server doesn't have browser cookies, so `authClient.getSession()` returns null. This means a hard refresh on a protected page will redirect to `/login`, then the client re-checks and navigates back if the cookie is valid. This is acceptable for the initial implementation. Forwarding cookies during SSR is a future enhancement.

---

## Verification Plan

1. `docker compose up -d && pnpm dev`
2. Visit `http://localhost:3000` — see Login/Sign Up links in nav
3. Visit `/dashboard` — redirects to `/login?redirect=...`
4. Go to `/signup`, create account (name, email, password >= 8 chars)
5. After signup → redirected to `/dashboard`, nav shows user name + Sign Out
6. Click Sign Out → nav reverts to Login/Sign Up
7. Go to `/login`, sign in with created credentials → redirected to `/dashboard`
8. Hard refresh on `/dashboard` → session persists (cookie-based)
9. Test validation: empty fields, short password, mismatched passwords, invalid credentials
10. Run `pnpm type-check` — no type errors
