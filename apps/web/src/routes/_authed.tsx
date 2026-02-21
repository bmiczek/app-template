import { getAuthSession } from '@/lib/auth/client';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const session = await getAuthSession();
    if (!session) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router redirect pattern
      throw redirect({ to: '/login', search: { redirect: location.href } });
    }
    return { session };
  },
  component: AuthedLayout,
});

function AuthedLayout(): ReactElement {
  return <Outlet />;
}
