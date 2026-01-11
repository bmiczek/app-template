import type { MiddlewareHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { auth, type AuthSession, type AuthUser } from '../lib/auth';

/**
 * Type definition for auth-related context variables.
 * These are attached to every request by the authMiddleware.
 */
export interface AuthVariables {
  user: AuthUser | null;
  session: AuthSession | null;
}

/**
 * Auth middleware that attaches session and user to the Hono context.
 *
 * This middleware runs on ALL routes and extracts the session from request headers.
 * If no valid session is found, user and session are set to null.
 *
 * Individual routes can use `requireAuth()` to enforce authentication.
 */
export function authMiddleware(): MiddlewareHandler<{ Variables: AuthVariables }> {
  return async (c, next) => {
    try {
      const session = await auth.api.getSession({
        headers: c.req.raw.headers,
      });

      c.set('user', session?.user ?? null);
      c.set('session', session?.session ?? null);
    } catch (error) {
      // Log sanitized error to prevent information leakage in production
      console.error(
        'Session validation error:',
        error instanceof Error ? error.message : 'Unknown error'
      );
      if (process.env.NODE_ENV === 'development') {
        console.error(error); // Full stack trace in dev
      }
      c.set('user', null);
      c.set('session', null);
    }

    await next();
  };
}

/**
 * Middleware that requires authentication for a route.
 * Throws 401 Unauthorized if no valid session is present.
 *
 * Must be used AFTER authMiddleware() in the middleware chain.
 *
 * @example
 * ```typescript
 * app.get('/api/profile', requireAuth(), (c) => {
 *   const user = getAuthUser(c);
 *   return c.json({ success: true, data: { user } });
 * });
 * ```
 */
export function requireAuth(): MiddlewareHandler<{ Variables: AuthVariables }> {
  return async (c, next) => {
    const user = c.get('user');
    const session = c.get('session');

    if (!user || !session) {
      throw new HTTPException(401, {
        message: 'Unauthorized - Please sign in to access this resource',
      });
    }

    await next();
  };
}
