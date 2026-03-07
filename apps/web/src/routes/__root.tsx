/// <reference types="vite/client" />
import { NavBar } from '@/components/navbar';
import globalsCss from '@/styles/globals.css?url';
import {
  type ErrorComponentProps,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import * as React from 'react';

export const Route = createRootRouteWithContext()({
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
    links: [
      { rel: 'stylesheet', href: globalsCss },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
  errorComponent: RootErrorComponent,
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

function RootComponent(): React.ReactElement {
  return (
    <>
      <div>
        <NavBar />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </>
  );
}

function RootErrorComponent({ error }: ErrorComponentProps): React.ReactElement {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold text-destructive">Something went wrong</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        An unexpected error occurred. Please try refreshing the page.
      </p>
      {import.meta.env.DEV && (
        <pre className="mt-4 overflow-auto rounded bg-muted p-4 text-xs">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      )}
    </div>
  );
}

function NotFound(): React.ReactElement {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold">404 - Page Not Found</h2>
      <p className="mt-2 text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link to="/" className="mt-4 inline-block text-sm font-medium hover:underline">
        Go back home
      </Link>
    </div>
  );
}
