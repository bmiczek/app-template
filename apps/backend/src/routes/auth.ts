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
 * - All auth routes: 10 requests per 15 minutes
 * - Sign-in routes: 5 attempts per hour (brute-force protection)
 */
export const authRoutes = new Hono<{ Variables: AuthVariables }>();

// Apply general rate limiting to all auth routes
authRoutes.use('/*', authRateLimiter);

// Apply stricter rate limiting to sign-in routes
authRoutes.use('/sign-in/*', signInRateLimiter);

/**
 * Custom endpoint to check auth status with consistent API format.
 * Defined before the catch-all handler so it takes precedence.
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
 * Mount Better Auth's built-in handler for all auth routes.
 * This catch-all must be defined after specific routes.
 * Includes OPTIONS for CORS preflight requests.
 *
 * Note: Better Auth responses use their own format, not the standard ApiResponse format.
 * Frontend clients should handle both formats appropriately.
 */
authRoutes.on(['POST', 'GET', 'OPTIONS'], '/*', (c) => {
  return auth.handler(c.req.raw);
});
