import type { ApiResponse } from '@app-template/shared';
import type { ErrorHandler, NotFoundHandler } from 'hono';
import { HTTPException } from 'hono/http-exception';

/**
 * Global error handler for the Hono application.
 * Catches all unhandled errors and returns consistent ApiResponse format.
 */
export const errorHandler: ErrorHandler = (err, c) => {
  // Handle HTTPException (intentional errors thrown by routes/middleware)
  if (err instanceof HTTPException) {
    const response: ApiResponse = {
      success: false,
      error: err.message,
    };
    return c.json(response, err.status);
  }

  // Log unexpected errors
  const isDev = process.env.NODE_ENV === 'development';
  console.error('[Error]', isDev ? err : err.message);

  // Return generic error response (hide details in production)
  const response: ApiResponse = {
    success: false,
    error: isDev ? err.message : 'Internal Server Error',
  };
  return c.json(response, 500);
};

/**
 * Custom 404 handler for unknown routes.
 * Returns consistent ApiResponse format for not found errors.
 */
export const notFoundHandler: NotFoundHandler = (c) => {
  const response: ApiResponse = {
    success: false,
    error: `Not Found: ${c.req.path}`,
  };
  return c.json(response, 404);
};
