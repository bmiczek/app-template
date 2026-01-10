import { prisma } from '@app-template/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

// Validate required environment variables at startup
const requiredEnvVars = ['BETTER_AUTH_SECRET', 'BETTER_AUTH_URL'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

/**
 * Better Auth instance configured with Prisma adapter and email/password authentication.
 *
 * Environment variables required:
 * - BETTER_AUTH_SECRET: Secret key for signing tokens (min 32 chars)
 * - BETTER_AUTH_URL: Base URL of the backend server
 * - DATABASE_URL: PostgreSQL connection string
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === 'production',
  },
});

/**
 * Inferred types from Better Auth for type-safe usage across the application.
 */
export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
