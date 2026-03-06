import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
} from '@sentry/tanstackstart-react';
import { createStart } from '@tanstack/react-start';

import { loggingMiddleware } from './lib/logging-middleware';
import { securityHeadersMiddleware } from './lib/security-headers-middleware';

export const startInstance = createStart(() => ({
  // Sentry middlewares must be first to capture all errors and traces
  requestMiddleware: [sentryGlobalRequestMiddleware, securityHeadersMiddleware, loggingMiddleware],
  functionMiddleware: [sentryGlobalFunctionMiddleware],
}));

void import('./lib/jobs').then(({ startJobWorkers }) => startJobWorkers());

async function shutdown(): Promise<void> {
  const { stopJobWorkers } = await import('./lib/jobs');
  await stopJobWorkers();
  const { disconnectDatabase } = await import('./lib/database');
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
