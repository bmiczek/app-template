import type { ApiResponse } from '@app-template/shared';
import type { Context, TypedResponse } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

/**
 * Wraps a successful response in the standard API format.
 *
 * @example
 * ```typescript
 * app.get('/api/users', (c) => {
 *   const users = await getUsers();
 *   return successResponse(c, users);
 * });
 * ```
 */
export function successResponse<T>(
  c: Context,
  data: T,
  status: ContentfulStatusCode = 200
): TypedResponse<ApiResponse<T>> {
  return c.json<ApiResponse<T>>({ success: true, data }, status);
}

/**
 * Wraps an error response in the standard API format.
 *
 * @example
 * ```typescript
 * app.get('/api/users/:id', (c) => {
 *   const user = await getUser(c.req.param('id'));
 *   if (!user) {
 *     return errorResponse(c, 'User not found', 404);
 *   }
 *   return successResponse(c, user);
 * });
 * ```
 */
export function errorResponse(
  c: Context,
  error: string,
  status: ContentfulStatusCode = 400
): TypedResponse<ApiResponse<never>> {
  return c.json<ApiResponse<never>>({ success: false, error }, status);
}
