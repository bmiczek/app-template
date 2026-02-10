import { Hono } from 'hono';
import { auth } from '../lib/auth';
import type { AuthVariables } from '../middleware/auth';
import { authRateLimiter, signInRateLimiter } from '../middleware/rateLimit';

/**
 * Auth routes powered by Better Auth.
 *
 * These routes handle:
 * - POST /api/auth/sign-up/email - Create new account with email/password
 * - POST /api/auth/sign-in/email - Sign in with email/password
 * - POST /api/auth/sign-out - Sign out and invalidate session
 * - GET  /api/auth/get-session - Get current session info
 *
 * Rate limiting:
 * - Sign-up/sign-out routes: 100 requests per 15 minutes
 * - Sign-in routes: 100/15min general + 5 attempts per hour (brute-force protection)
 * - Session reads (get-session, status): not rate-limited
 */
export const authRoutes = new Hono<{ Variables: AuthVariables }>();

/**
 * Custom endpoint to check auth status with consistent API format.
 * Defined before rate-limited routes — session reads should not be throttled.
 */
authRoutes.get('/status', (c) => {
  const user = c.get('user');
  const session = c.get('session');

  if (!user || !session) {
    return c.json({
      success: true,
      data: {
        authenticated: false,
        user: null,
        session: null,
      },
    });
  }

  return c.json({
    success: true,
    data: {
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        emailVerified: user.emailVerified,
        image: user.image,
      },
      session: {
        expiresAt: session.expiresAt,
      },
    },
  });
});

/**
 * Better Auth's get-session endpoint — not rate-limited (called on every navigation).
 */
authRoutes.get('/get-session', (c) => {
  return auth.handler(c.req.raw);
});

// Apply rate limiting to mutating auth routes (sign-up, sign-in, sign-out)
authRoutes.use('/sign-in/*', authRateLimiter, signInRateLimiter);
authRoutes.use('/sign-up/*', authRateLimiter);
authRoutes.use('/sign-out', authRateLimiter);

/**
 * Mount Better Auth's built-in handler for all remaining auth routes.
 * This catch-all must be defined after specific routes.
 * Includes OPTIONS for CORS preflight requests.
 *
 * Note: Better Auth responses use their own format, not the standard ApiResponse format.
 * Frontend clients should handle both formats appropriately.
 */
authRoutes.on(['POST', 'GET', 'OPTIONS'], '/*', (c) => {
  return auth.handler(c.req.raw);
});
