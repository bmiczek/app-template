import { jsonResponse, parseRequestBody } from '@/lib/api';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const echoSchema = z.object({
  message: z.string().min(1).max(500),
});

/**
 * Example API route demonstrating Zod input validation and typed responses.
 * POST /api/example with { "message": "hello" } returns { "data": { "echo": "hello" } }
 */
export const Route = createFileRoute('/api/example')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }): Promise<Response> => {
        const parsed = await parseRequestBody(request, echoSchema);
        if ('error' in parsed) return parsed.error;

        return jsonResponse({ echo: parsed.data.message });
      },
    },
  },
});
