import { routeTree } from '@/routeTree.gen';
import * as Sentry from '@sentry/tanstackstart-react';
import { createRouter } from '@tanstack/react-router';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
  });

  if (!router.isServer) {
    Sentry.init({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- VITE_SENTRY_DSN is typed in env.d.ts, which ESLint's project service excludes
      dsn: import.meta.env.VITE_SENTRY_DSN,
      sendDefaultPii: false,
      integrations: [
        Sentry.tanstackRouterBrowserTracingIntegration(router),
        Sentry.replayIntegration(),
      ],
      tracesSampleRate: import.meta.env.PROD ? 0.2 : 1.0,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      enabled: !!import.meta.env.VITE_SENTRY_DSN,
    });
  }

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
