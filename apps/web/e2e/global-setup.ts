import { execSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export default function globalSetup(): void {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const workspaceRoot = resolve(currentDir, '../../..');

  console.log('Seeding database for e2e tests...');
  execSync('pnpm --filter database db:seed', {
    cwd: workspaceRoot,
    stdio: 'inherit',
  });
}
