import type { Context } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';

/**
 * Extracts the client IP address from the request.
 * Handles X-Forwarded-For header for requests behind a proxy.
 */
function getClientIp(c: Context): string {
  const forwarded = c.req.header('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return c.req.header('x-real-ip') ?? 'unknown';
}

/**
 * General rate limiter for authentication endpoints.
 * Allows 10 requests per 15 minutes per IP address.
 */
export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  standardHeaders: 'draft-6',
  keyGenerator: getClientIp,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
  },
});

/**
 * Strict rate limiter for sign-in endpoints.
 * Provides brute-force protection by allowing only 5 attempts per hour per IP.
 */
export const signInRateLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5,
  standardHeaders: 'draft-6',
  keyGenerator: getClientIp,
  message: {
    success: false,
    error: 'Too many sign-in attempts. Please try again later.',
  },
});
