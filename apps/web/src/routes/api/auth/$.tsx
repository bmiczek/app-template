import { createFileRoute } from '@tanstack/react-router';

/**
 * Catch-all server route for Better Auth.
 * Handles all auth API requests (sign-in, sign-up, sign-out, get-session, etc.)
 * by delegating to Better Auth's universal handler.
 *
 * Dynamic import keeps Prisma out of the client bundle.
 */
export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }): Promise<Response> => {
        const { auth } = await import('../../../lib/auth');
        return auth.handler(request);
      },
      POST: async ({ request }: { request: Request }): Promise<Response> => {
        const { auth } = await import('../../../lib/auth');
        return auth.handler(request);
      },
    },
  },
});
