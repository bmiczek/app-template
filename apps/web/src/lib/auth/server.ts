import { env } from '@/env';
import { prisma } from '@/lib/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { AUTH_PASSWORD, getSecureCookies } from './config';

// Session configuration (in seconds)
const SESSION_EXPIRES_IN = env.SESSION_EXPIRES_IN ?? 60 * 60 * 24 * 7; // 7 days default
const SESSION_UPDATE_AGE = env.SESSION_UPDATE_AGE ?? 60 * 60 * 24; // 1 day default

/**
 * Better Auth instance with Prisma adapter and email/password authentication.
 *
 * This module is server-only. It is dynamically imported inside
 * createServerFn handlers and server routes to prevent Prisma
 * from leaking into the client bundle.
 */
export const auth = betterAuth({
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
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

export type AuthSession = typeof auth.$Infer.Session.session;
export type AuthUser = typeof auth.$Infer.Session.user;
