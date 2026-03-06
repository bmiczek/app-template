import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/_authed/dashboard')({
  component: DashboardComponent,
});

function DashboardComponent(): ReactElement {
  const { session } = Route.useRouteContext();

  return (
    <div className="mx-auto mt-8 max-w-xl">
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>User Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-medium">Name:</span> {session.user.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {session.user.email}
          </p>
          <p>
            <span className="font-medium">Session Expires:</span>{' '}
            {new Date(session.session.expiresAt).toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
