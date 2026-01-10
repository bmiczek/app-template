import type { Context, MiddlewareHandler } from 'hono';
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
      console.error('Session validation error:', error);
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

/**
 * Helper to get the current authenticated user from context.
 * Returns null if not authenticated.
 */
export function getAuthUser(c: Context<{ Variables: AuthVariables }>): AuthUser | null {
  return c.get('user');
}

/**
 * Helper to get the current session from context.
 * Returns null if no session.
 */
export function getAuthSession(c: Context<{ Variables: AuthVariables }>): AuthSession | null {
  return c.get('session');
}
