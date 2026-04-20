import { prisma } from '@app-template/database';
import { logger } from './logger';

export * from '@app-template/database';

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) =>
    logger.debug({ query: e.query, duration: e.duration }, 'prisma query')
  );
}
prisma.$on('warn', (e) => logger.warn(e, 'prisma warning'));
prisma.$on('error', (e) => logger.error(e, 'prisma error'));
