# Routing & API Specification

## Overview

The application uses TanStack Start's file-based routing to serve both rendered pages and API endpoints from a single process. Routes are automatically registered based on their file path within `src/routes/`. The router supports SSR with client-side hydration, type-safe navigation, and server functions for RPC-style data access.

## Design Decisions

### File-based routing

Routes are defined by creating files in `src/routes/`. The file path determines the URL path. This convention eliminates manual route registration and makes the URL structure visible in the file tree. TanStack Router generates a typed route tree (`routeTree.gen.ts`) at build time.

### Pages and API routes coexist

Page routes and API routes live in the same routing tree. API routes are distinguished by convention (placed under `src/routes/api/`) and by their use of `server.handlers` instead of a `component`. This keeps the entire application surface in one place.

### Server functions over API routes for internal data

When the client needs data that doesn't require a public API endpoint, `createServerFn` is preferred over creating an API route. Server functions are typed end-to-end, avoid the boilerplate of constructing HTTP requests and responses, and are automatically code-split to the server.

API routes (with `server.handlers`) are reserved for endpoints that need to be called by external systems, need specific HTTP methods/status codes, or serve as webhook targets.

## Route Map

### Page Routes

| Path         | File                    | Auth       | Purpose                                                                      |
| ------------ | ----------------------- | ---------- | ---------------------------------------------------------------------------- |
| `/`          | `index.tsx`             | Public     | Landing page with session-aware welcome message                              |
| `/login`     | `login.tsx`             | Guest only | Email/password sign-in form. Redirects to dashboard if already authenticated |
| `/signup`    | `signup.tsx`            | Public     | Account registration form                                                    |
| `/dashboard` | `_authed/dashboard.tsx` | Required   | Protected user dashboard showing session info                                |

### API Routes (Server Handlers)

| Path           | Method    | Auth   | Purpose                                                             |
| -------------- | --------- | ------ | ------------------------------------------------------------------- |
| `/api/auth/$`  | GET, POST | Varies | Catch-all for Better Auth (sign-in, sign-up, sign-out, get-session) |
| `/api/health`  | GET       | None   | Health check - verifies database connectivity, returns app version  |
| `/api/example` | POST      | None   | Example endpoint demonstrating Zod request body validation          |

### Server Functions

| Function         | Module               | Purpose                                                                   |
| ---------------- | -------------------- | ------------------------------------------------------------------------- |
| `getAuthSession` | `lib/auth/client.ts` | Retrieves the current user's session during SSR via direct database query |

## Route Protection

### Layout route pattern

Protected routes are grouped under a pathless layout route (`_authed.tsx`). The underscore prefix means it doesn't add a URL segment - `/dashboard` is the URL, not `/_authed/dashboard`.

The layout route's `beforeLoad` hook:

1. Calls `getAuthSession()` (a server function) to check for a valid session
2. If no session, throws a `redirect` to `/login?redirect=<current_url>`
3. If authenticated, injects the `session` object into the route context

Any route nested under `_authed/` automatically inherits this protection. New protected routes are added by creating files inside `_authed/` - no additional auth logic needed.

### Guest-only routes

The login page performs the inverse check: if a session already exists, redirect to `/dashboard`. This prevents authenticated users from seeing the login form.

## Server Route Pattern

API endpoints use `createFileRoute` with a `server.handlers` object that maps HTTP methods to handler functions:

```
server: {
  handlers: {
    GET: async ({ request }) => { ... return new Response(...) },
    POST: async ({ request }) => { ... return new Response(...) },
  }
}
```

Handlers receive a standard Web `Request` and must return a standard Web `Response`. This is intentionally low-level - no framework magic, just Web APIs.

Server-only modules (Prisma, auth) are always dynamically imported inside handlers to prevent client bundle contamination.

## Server Functions

`createServerFn` provides type-safe RPC between client and server:

- Defined in shared modules (importable from both client and server code)
- Automatically split: the function body runs only on the server; the client gets a thin HTTP caller
- Return values are serialized and type-checked end-to-end
- Used for data fetching in route loaders and `beforeLoad` hooks

The `getAuthSession` function is the primary example: it dynamically imports the auth server module, reads request headers, and returns the session object. The client never sees the Prisma or Better Auth imports.

## Middleware

TanStack Start middleware is created with `createMiddleware()` and runs on every server-side request. The application uses two middleware layers:

### Security Headers Middleware

Applies HTTP security headers to all responses:

- **Content-Security-Policy** - restricts script, style, image, font, and frame sources
- **X-Frame-Options: DENY** - prevents clickjacking
- **X-Content-Type-Options: nosniff** - prevents MIME type sniffing
- **Referrer-Policy** - limits referrer information leakage
- **Permissions-Policy** - disables camera, microphone, and geolocation by default

### Logging Middleware

Structured request logging via Pino:

- Assigns a unique `requestId` (UUID) to each request
- Logs request start (method, path) and completion (status, duration)
- Attaches `x-request-id` header to responses for tracing
- Logs errors with full context on request failure

## API Response Conventions

API routes use shared helper functions from `lib/api.ts`:

- `jsonResponse(data, status)` - wraps data in `{ data: T }` envelope
- `errorResponse(code, message, status)` - wraps errors in `{ error: { code, message } }` envelope
- `parseRequestBody(request, schema)` - parses JSON body and validates against a Zod schema, returning either `{ data }` or `{ error: Response }`

All API responses follow a consistent envelope format:

```json
// Success
{ "data": { ... } }

// Error
{ "error": { "code": "VALIDATION_ERROR", "message": "..." } }
```

## Router Configuration

The router is configured with:

- **`defaultPreload: 'intent'`** - preloads route data when the user hovers or focuses a link
- **`scrollRestoration: true`** - restores scroll position on back/forward navigation
- **Sentry integration** - browser tracing and session replay (enabled only when `VITE_SENTRY_DSN` is set)
- **Dev tools** - TanStack Router DevTools are included in development builds only

## Root Layout

The root route (`__root.tsx`) defines the HTML document structure:

- `<head>` with meta tags, global CSS (loaded as a `<link>` tag via `?url` import), and favicon
- `<body>` with the NavBar, main content outlet, and hydration scripts
- Error boundary showing a user-friendly message (with stack trace in development)
- 404 handler with a link back to home
