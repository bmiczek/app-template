import { authClient } from '@/lib/auth/client';
import { createFileRoute, Link } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent(): ReactElement {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="mx-auto mt-8 max-w-2xl">
      <h2 className="text-3xl font-bold">Welcome to App Template</h2>
      <p className="mt-2 text-muted-foreground">A modern full-stack TypeScript application.</p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm">
        <li>TanStack Start - Full-stack React framework</li>
        <li>Prisma - Next-generation ORM</li>
        <li>PostgreSQL - Robust database</li>
        <li>Better Auth - Authentication</li>
      </ul>
      {!isPending && (
        <div className="mt-8">
          {session ? (
            <p className="text-sm">
              Welcome back, <strong>{session.user.name}</strong>!{' '}
              <Link to="/dashboard" className="font-medium hover:underline">
                Go to Dashboard
              </Link>
            </p>
          ) : (
            <p className="text-sm">
              <Link to="/login" className="font-medium hover:underline">
                Login
              </Link>{' '}
              or{' '}
              <Link to="/signup" className="font-medium hover:underline">
                Sign Up
              </Link>{' '}
              to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
