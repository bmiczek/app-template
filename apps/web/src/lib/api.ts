import { z } from 'zod';

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}

export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify({ data } satisfies ApiResponse<T>), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(code: string, message: string, status = 400): Response {
  return new Response(JSON.stringify({ error: { code, message } } satisfies ApiResponse<never>), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function parseRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ data: T } | { error: Response }> {
  let raw: unknown;
  try {
    raw = (await request.json()) as unknown;
  } catch {
    return { error: errorResponse('INVALID_JSON', 'Request body must be valid JSON') };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
    return { error: errorResponse('VALIDATION_ERROR', message) };
  }

  return { data: result.data };
}
