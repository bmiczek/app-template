import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

import { env } from '@/env';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  const client = new PrismaClient({
    adapter,
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'warn' },
      { emit: 'event', level: 'error' },
    ],
  });

  if (process.env.NODE_ENV === 'development') {
    client.$on('query', (e) =>
      logger.debug({ query: e.query, duration: e.duration }, 'prisma query')
    );
  }
  client.$on('warn', (e) => logger.warn({ message: e.message }, 'prisma warning'));
  client.$on('error', (e) => logger.error({ message: e.message }, 'prisma error'));

  return client;
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export * from '@prisma/client';

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
