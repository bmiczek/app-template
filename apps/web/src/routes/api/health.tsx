import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/api/health')({
  server: {
    handlers: {
      GET: async (): Promise<Response> => {
        const { prisma } = await import('@/lib/database');
        try {
          await prisma.$queryRaw`SELECT 1`;
          const body = JSON.stringify({
            status: 'ok',
            db: 'ok',
            version: process.env['npm_package_version'] ?? 'unknown',
          });
          return new Response(body, {
            headers: { 'Content-Type': 'application/json' },
          });
        } catch {
          const body = JSON.stringify({ status: 'error', db: 'error' });
          return new Response(body, {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
      },
    },
  },
});
