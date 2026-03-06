import { createMiddleware } from '@tanstack/react-start';

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // React hydration requires unsafe-inline; tighten with nonce in prod
  "style-src 'self' 'unsafe-inline'", // Tailwind v4 inline styles
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "frame-ancestors 'none'",
].join('; ');

export const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  result.response.headers.set('Content-Security-Policy', CSP);
  result.response.headers.set('X-Frame-Options', 'DENY');
  result.response.headers.set('X-Content-Type-Options', 'nosniff');
  result.response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  result.response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return result;
});
