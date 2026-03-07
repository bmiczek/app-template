import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/client';
import { Link, useNavigate } from '@tanstack/react-router';
import * as React from 'react';

export function NavBar(): React.ReactElement {
  const { data: session, isPending } = authClient.useSession();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const navigate = useNavigate();

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true);
    try {
      await authClient.signOut();
      void navigate({ to: '/login' });
    } catch (error) {
      console.error('Sign out failed:', error);
      setIsSigningOut(false);
    }
  }

  return (
    <nav className="flex items-center justify-between border-b px-4 py-3">
      <Link to="/" className="text-foreground no-underline">
        <h1 className="m-0 text-xl font-semibold">App Template</h1>
      </Link>
      <div className="flex items-center gap-4">
        {isPending ? null : session ? (
          <>
            <span className="text-sm text-muted-foreground">{session.user.name}</span>
            <Link to="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Button asChild size="sm">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}
