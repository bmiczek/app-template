import { authClient } from '@/lib/auth/client';
import { createFileRoute, Link } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent(): ReactElement {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div>
      <h2>Welcome to App Template</h2>
      <p>A modern full-stack TypeScript application.</p>
      <ul>
        <li>TanStack Start - Full-stack React framework</li>
        <li>Hono - Ultrafast web framework</li>
        <li>Prisma - Next-generation ORM</li>
        <li>PostgreSQL - Robust database</li>
      </ul>
      {!isPending && (
        <div style={{ marginTop: '2rem' }}>
          {session ? (
            <p>
              Welcome back, <strong>{session.user.name}</strong>!{' '}
              <Link to="/dashboard">Go to Dashboard</Link>
            </p>
          ) : (
            <p>
              <Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to get started.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
