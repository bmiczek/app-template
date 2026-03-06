// Shared auth configuration constants and validation

export const AUTH_PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const;

/**
 * Returns whether secure cookies should be used.
 * Enables `__Secure-` cookie prefix in production.
 */
export function getSecureCookies(): boolean {
  return process.env.NODE_ENV === 'production';
}
