import { authClient } from '@/lib/auth/client';
import { routeTree } from '@/routeTree.gen';
import { createRouter } from '@tanstack/react-router';

export interface RouterContext {
  authClient: typeof authClient;
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getRouter() {
  const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: { authClient },
  });
  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
