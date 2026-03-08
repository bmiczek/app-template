# Authentication Specification

## Overview

Authentication is handled by [Better Auth](https://www.better-auth.com), a self-hosted auth library that runs inside the application process. It stores all auth data (users, sessions, accounts) in the same PostgreSQL database as the rest of the application, using Prisma as its database adapter.

The system currently supports **email/password authentication**. Better Auth's plugin architecture allows adding OAuth providers (Google, GitHub, etc.), two-factor authentication, and other auth methods without changing the core infrastructure.

## Design Decisions

### Self-hosted over third-party

Better Auth runs in-process rather than calling an external service like Auth0 or Clerk. This provides:

- **No external dependency** - auth works offline, in CI, and in air-gapped environments
- **Full data ownership** - user data never leaves the application's database
- **No per-user pricing** - cost scales with infrastructure, not user count
- **Customizable flows** - complete control over sign-up, sign-in, and session behavior

### Server/client module split

Auth code is split across multiple files to enforce the server/client boundary:

| File               | Environment       | Purpose                                                                               |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------- |
| `server.ts`        | Server only       | Better Auth instance with Prisma adapter, session config, password rules              |
| `client.ts`        | Both (isomorphic) | `createAuthClient()` for browser-side calls, `getAuthSession` server function for SSR |
| `config.ts`        | Both              | Shared constants (password length limits, secure cookie logic)                        |
| `schemas.ts`       | Both              | Zod validation schemas for login and signup forms                                     |
| `use-auth-form.ts` | Client only       | React hook wrapping TanStack Form for auth-specific error handling                    |

The `server.ts` module is **never statically imported** in any file that could be included in the client bundle. It is always loaded via dynamic `import('./server')` inside server functions and server route handlers. This prevents Prisma and Node.js built-ins from being bundled into browser code.

There is **no barrel `index.ts`** in the auth directory. A barrel export would pull `server.ts` into the module graph whenever any auth module is imported, defeating the isolation.

## Auth Provider Configuration

The Better Auth instance is configured with:

- **Prisma adapter** - reads/writes auth data through the application's Prisma client
- **Email/password** - enabled with configurable password length (8-128 characters)
- **Session management** - configurable expiration (default 7 days) and refresh window (default 1 day)
- **Secure cookies** - `__Secure-` cookie prefix enabled automatically in production

Session timing is configurable via environment variables (`SESSION_EXPIRES_IN`, `SESSION_UPDATE_AGE`) but has sensible defaults.

## API Surface

All auth API traffic flows through a single catch-all server route at `/api/auth/$`. This route delegates every request (GET and POST) to Better Auth's universal handler, which manages the following endpoints internally:

- `POST /api/auth/sign-up/email` - create account with email/password
- `POST /api/auth/sign-in/email` - authenticate with email/password
- `POST /api/auth/sign-out` - destroy session
- `GET /api/auth/get-session` - return current session

Additional endpoints are automatically available when Better Auth plugins are added.

## Session Handling

### On the server (SSR)

During server-side rendering and in server functions, sessions are retrieved by calling `auth.api.getSession({ headers })` directly with the incoming request headers. This is a direct database query - no HTTP round-trip to the auth endpoint.

The `getAuthSession` server function (defined via `createServerFn`) wraps this pattern for use in route loaders and `beforeLoad` guards.

### On the client (browser)

The Better Auth React client (`authClient`) provides `useSession()` for reactive session state. It calls the auth API endpoints over HTTP and manages client-side caching. The client is configured as same-origin (no base URL needed) since the auth API is served by the same TanStack Start server.

### Session lifecycle

1. **Sign up** - creates a User, Account (provider: `credential`), and Session record
2. **Sign in** - validates credentials, creates a new Session, sets a session cookie
3. **Active use** - session is automatically refreshed when older than `SESSION_UPDATE_AGE`
4. **Sign out** - deletes the Session record and clears the cookie
5. **Expiration** - sessions older than `SESSION_EXPIRES_IN` are rejected

## Route Protection

Protected routes use TanStack Router's `beforeLoad` hook with a layout route pattern:

- `_authed.tsx` - a pathless layout route that checks for a valid session before rendering any child route
- If no session exists, the user is redirected to `/login` with a `redirect` search parameter
- The session object is injected into the route context, making it available to all child routes via `Route.useRouteContext()`

Public routes (login, signup) perform the inverse check: if a session already exists, redirect to the dashboard.

## Input Validation

Auth forms are validated with Zod schemas that enforce:

- **Email** - required, valid email format
- **Password** - minimum 8 characters, maximum 128 characters
- **Name** - required (signup only)
- **Confirm password** - must match password field (signup only, via Zod `.refine()`)

These schemas are validated both on blur (for immediate feedback) and on submit (for final validation). Error messages from Better Auth's server response are mapped to specific form fields (e.g., "user not found" maps to the email field, password errors map to the password field).

## Data Model

Auth uses four Prisma models (see [Database spec](database.md) for full schema):

- **User** - core identity (name, email, email verification status)
- **Session** - active login sessions (token, expiry, IP address, user agent)
- **Account** - auth provider credentials (supports multiple providers per user)
- **Verification** - time-limited tokens for email verification and password reset

All models use `cuid()` primary keys, `camelCase` field names mapped to `snake_case` database columns, and cascade deletes from User to Sessions and Accounts.

## Security Considerations

- Passwords are hashed by Better Auth using its built-in crypto utilities (bcrypt-based)
- Session tokens are cryptographically random and stored hashed
- Secure cookie prefix (`__Secure-`) is enabled in production to prevent cookie injection
- Content Security Policy and other security headers are applied via middleware (see [Routing spec](routing.md))
- The auth module enforces maximum password length to prevent denial-of-service via expensive hashing
