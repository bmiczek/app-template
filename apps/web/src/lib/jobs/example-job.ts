import { logger } from '@/lib/logger';

/**
 * Processes an expired data cleanup job.
 * Deletes expired sessions and verification tokens from the database.
 * Register with: await boss.schedule('cleanup-expired-data', '0 * * * *', {})
 */
export async function processCleanupExpiredData(): Promise<void> {
  const { prisma } = await import('@/lib/database');
  const now = new Date();

  const [deletedSessions, deletedVerifications] = await Promise.all([
    prisma.session.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.verification.deleteMany({ where: { expiresAt: { lt: now } } }),
  ]);

  logger.info(
    {
      deletedSessions: deletedSessions.count,
      deletedVerifications: deletedVerifications.count,
    },
    'cleanup-expired-data job complete'
  );
}
