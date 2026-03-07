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
