import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export default function globalSetup(): void {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = resolve(currentDir, '../../..');

  const isCI = !!process.env.CI;
  const hasTestEnv = existsSync(resolve(currentDir, '../.env.test'));

  if (!isCI && !hasTestEnv) {
    throw new Error(
      'E2E tests require a dedicated test database to avoid wiping your dev data.\n' +
        'Create apps/web/.env.test with DATABASE_URL pointing at a separate test database.\n' +
        'See apps/web/.env.test.example if one exists, or copy .env and change the DB name.'
    );
  }

  console.log('Running migrations for e2e tests...');
  execSync('pnpm --filter web db:migrate:deploy', {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: { ...process.env },
  });

  console.log('Seeding database for e2e tests...');
  execSync('pnpm --filter web db:seed', {
    cwd: workspaceRoot,
    stdio: 'inherit',
    env: { ...process.env },
  });
}
