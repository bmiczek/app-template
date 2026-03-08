import { env } from '@/env';
import { PgBoss } from 'pg-boss';

const globalForBoss = globalThis as unknown as { boss: PgBoss | undefined };

function createBoss(): PgBoss {
  return new PgBoss({
    connectionString: env.DATABASE_URL,
    schema: 'pgboss',
  });
}

export const boss = globalForBoss.boss ?? createBoss();

if (env.NODE_ENV !== 'production') {
  globalForBoss.boss = boss;
}

export async function startJobWorkers(): Promise<void> {
  await boss.start();
  // Register job handlers here, for example:
  // const { processCleanupExpiredData } = await import('./example-job');
  // await boss.schedule('cleanup-expired-data', '0 * * * *', {});
  // await boss.work('cleanup-expired-data', processCleanupExpiredData);
}

export async function stopJobWorkers(): Promise<void> {
  await boss.stop();
}
