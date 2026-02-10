/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';
import { authClient } from '../lib/auth-client';
import type { RouterContext } from '../router';

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'App Template',
      },
      {
        name: 'description',
        content: 'A modern full-stack TypeScript application',
      },
    ],
    links: [{ rel: 'icon', href: '/favicon.ico' }],
  }),
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function NavBar(): React.ReactElement {
  const { data: session, isPending } = authClient.useSession();

  return (
    <nav
      style={{
        padding: '1rem',
        borderBottom: '1px solid #ccc',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <h1 style={{ margin: 0 }}>App Template</h1>
      </Link>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {isPending ? null : session ? (
          <>
            <span>{session.user.name}</span>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={() => {
                void authClient.signOut();
              }}
              style={{ cursor: 'pointer' }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}

function RootComponent(): React.ReactElement {
  return (
    <>
      <div>
        <NavBar />
        <main style={{ padding: '1rem' }}>
          <Outlet />
        </main>
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}

function NotFound(): React.ReactElement {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>404 - Page Not Found</h2>
      <p>The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/">Go back home</Link>
    </div>
  );
}
