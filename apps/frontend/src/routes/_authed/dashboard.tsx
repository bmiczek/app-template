import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardComponent,
});

function DashboardComponent(): ReactElement {
  const { session } = Route.useRouteContext();

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Dashboard</h2>
      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '1rem',
        }}
      >
        <h3>User Info</h3>
        <p>
          <strong>Name:</strong> {session.user.name}
        </p>
        <p>
          <strong>Email:</strong> {session.user.email}
        </p>
        <p>
          <strong>Session Expires:</strong> {new Date(session.session.expiresAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
