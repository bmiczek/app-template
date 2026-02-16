// Shared auth configuration constants and validation

export const AUTH_PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
} as const;

export const AUTH_SECRET_MIN_LENGTH = 32;

/**
 * Validates that required auth environment variables are present and valid.
 * Call at startup in both backend and frontend SSR auth modules.
 * Throws with a descriptive message on failure.
 */
export function validateAuthEnv(): void {
  const requiredEnvVars = ['BETTER_AUTH_SECRET', 'BETTER_AUTH_URL'] as const;
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }

  const secret = process.env.BETTER_AUTH_SECRET!;
  if (secret.length < AUTH_SECRET_MIN_LENGTH) {
    throw new Error(
      `BETTER_AUTH_SECRET must be at least ${AUTH_SECRET_MIN_LENGTH} characters. Current: ${secret.length}`
    );
  }
}

/**
 * Returns whether secure cookies should be used.
 * Must match between backend and frontend auth instances so both
 * resolve the same cookie name (e.g. `__Secure-` prefix in production).
 */
export function getSecureCookies(): boolean {
  return process.env.NODE_ENV === 'production';
}
