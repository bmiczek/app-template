# Routing

File-based routing via TanStack Router. Files here are auto-registered. The generated route tree at `src/routeTree.gen.ts` should never be edited.

## Patterns

### Root Layout (`__root.tsx`)
Uses `createRootRouteWithContext` with `authClient` in context. Renders the HTML shell (for SSR), a navbar, and an `<Outlet />`. DevTools included in dev only.

### Protected Routes (`_authed.tsx`)
Layout route that guards children. `beforeLoad` calls `getAuthSession()` and redirects to `/login?redirect=...` if unauthenticated. Session is injected into route context — children access it via `Route.useRouteContext()`.

Place any file under `_authed/` to make it protected.

### Server Routes (API)
Use `createFileRoute` with `server.handlers` containing HTTP method functions. Each handler receives `{ request: Request }` and returns a `Response`. Always dynamic-import server-only dependencies inside handlers.

### Router Config (`router.tsx`)
`defaultPreload: 'intent'`, `scrollRestoration: true`. Router type registered globally for type-safe navigation.

## Adding a Page

1. Create file in this directory — file path maps to URL
2. Export `Route` using `createFileRoute('/path')`
3. For protected pages, place under `_authed/`

## Adding an API Endpoint

1. Create file under `api/` (e.g., `api/health.tsx` → `/api/health`)
2. Use `server.handlers` with method functions
3. Dynamic-import any server-only modules inside handlers
