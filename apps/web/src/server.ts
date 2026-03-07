import handler, { createServerEntry } from '@tanstack/react-start/server-entry';

// Start background job workers
void import('./lib/jobs').then(({ startJobWorkers }) => startJobWorkers());

// Graceful shutdown
async function shutdown(): Promise<void> {
  const { stopJobWorkers } = await import('./lib/jobs');
  await stopJobWorkers();
  const { disconnectDatabase } = await import('./lib/database');
  await disconnectDatabase();
  process.exit(0);
}

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());

export default createServerEntry({
  fetch(request) {
    return handler.fetch(request);
  },
});
