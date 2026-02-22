# Authentication

Better Auth with email/password, backed by Prisma. Split across multiple files to enforce a hard server/client boundary.

## The Bundle Safety Rule

`server.ts` imports Prisma and creates the Better Auth instance. It must **never** be imported at the top level of any client-reachable file. Always use dynamic imports inside handlers:

```typescript
// CORRECT — inside a handler
const { auth } = await import('@/lib/auth/server');

// WRONG — at module top level
import { auth } from '@/lib/auth/server';
```

There is **no barrel `index.ts`** in this directory. A barrel would re-export `server.ts` and break the boundary.

## Module Split

| File | Runs On | Role |
|------|---------|------|
| `server.ts` | Server only | Better Auth instance (dynamic import only) |
| `client.ts` | Both | Auth client + `getAuthSession` server function |
| `config.ts` | Both | Constants, env validation |
| `schemas.ts` | Both | Zod validation schemas |
| `use-auth-form.ts` | Browser | Form hook for auth pages |

## SSR Session Pattern

`getAuthSession()` in `client.ts` is a `createServerFn` that dynamically imports the auth server and calls `auth.api.getSession({ headers })` with request headers from `getRequestHeaders()`.

**Do not** use `authClient.getSession()` during SSR — it can't access browser cookies from the server.

## API Route

The catch-all at `src/routes/api/auth/$.tsx` delegates all requests to `auth.handler(request)` via dynamic import. Better Auth handles the actual endpoints.
