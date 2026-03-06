import { createMiddleware } from '@tanstack/react-start';

import { logger } from './logger';

export const loggingMiddleware = createMiddleware().server(async ({ request, next }) => {
  const requestId = crypto.randomUUID();
  const start = Date.now();
  const { method } = request;
  const path = new URL(request.url).pathname;
  const reqLogger = logger.child({ requestId });

  reqLogger.info({ method, path }, 'request started');

  try {
    const result = await next();
    reqLogger.info(
      { method, path, status: result.response.status, duration: Date.now() - start },
      'request completed'
    );
    return result;
  } catch (error) {
    reqLogger.error({ method, path, duration: Date.now() - start, error }, 'request failed');
    throw error;
  }
});
