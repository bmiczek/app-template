import { prisma } from '@app-template/database';
import { AUTH_PASSWORD, getSecureCookies, validateAuthEnv } from '@app-template/shared';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

validateAuthEnv();

// Session configuration (in seconds)
const SESSION_EXPIRES_IN = parseInt(process.env.SESSION_EXPIRES_IN ?? '', 10) || 60 * 60 * 24 * 7; // 7 days default
const SESSION_UPDATE_AGE = parseInt(process.env.SESSION_UPDATE_AGE ?? '', 10) || 60 * 60 * 24; // 1 day default

/**
 * Better Auth instance configured with Prisma adapter and email/password authentication.
 *
 * Environment variables required:
 * - BETTER_AUTH_SECRET: Secret key for signing tokens (min 32 chars)
 * - BETTER_AUTH_URL: Base URL of the backend server
 * - DATABASE_URL: PostgreSQL connection string
 *
 * Optional environment variables:
 * - SESSION_EXPIRES_IN: Session expiry in seconds (default: 7 days)
 * - SESSION_UPDATE_AGE: Session update age in seconds (default: 1 day)
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: AUTH_PASSWORD.MIN_LENGTH,
    maxPasswordLength: AUTH_PASSWORD.MAX_LENGTH,
  },
  session: {
    expiresIn: SESSION_EXPIRES_IN,
    updateAge: SESSION_UPDATE_AGE,
  },
  advanced: {
    useSecureCookies: getSecureCookies(),
  },
});

/**
 * Inferred types from Better Auth for type-safe usage across the application.
 */
export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
