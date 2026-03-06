import { createStart } from '@tanstack/react-start';

import { loggingMiddleware } from './lib/logging-middleware';

export const startInstance = createStart(() => ({
  requestMiddleware: [loggingMiddleware],
}));
