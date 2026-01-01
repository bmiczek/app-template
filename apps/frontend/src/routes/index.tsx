import { createFileRoute } from '@tanstack/react-router';
import type { ReactElement } from 'react';

export const Route = createFileRoute('/')({
  component: HomeComponent,
});

function HomeComponent(): ReactElement {
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
    </div>
  );
}
