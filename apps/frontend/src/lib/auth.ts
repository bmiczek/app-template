import { prisma } from '@app-template/database';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

/**
 * Server-side Better Auth instance for SSR session checking.
 * Uses the same database and secret as the backend — both instances
 * read/write the same session table.
 *
 * This module is server-only. It is dynamically imported inside
 * createServerFn handlers to prevent Prisma from leaking into
 * the client bundle.
 */
export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
});
