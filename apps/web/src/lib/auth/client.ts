import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { createAuthClient } from 'better-auth/react';

// Same-origin — auth API routes are served by this TanStack Start app
export const authClient = createAuthClient();

/**
 * Server function to check auth session during SSR.
 * Uses a direct database query via Better Auth's server API —
 * no HTTP round-trip to the backend.
 *
 * Dynamic import prevents Prisma/database code from leaking
 * into the client bundle.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export const getAuthSession = createServerFn({ method: 'GET' }).handler(async () => {
  // Dynamic import keeps Prisma out of the client bundle
  const { auth } = await import('./server');
  const headers = getRequestHeaders();
  const session = await auth.api.getSession({ headers });
  return session;
});
/* eslint-enable @typescript-eslint/no-unsafe-assignment */
