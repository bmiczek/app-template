import { FormErrorBanner, FormField, SubmitButton } from '@/components/forms/components';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { authClient, getAuthSession } from '@/lib/auth/client';
import { loginSchema } from '@/lib/auth/schemas';
import { useAuthForm } from '@/lib/auth/use-auth-form';
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router';
import type { ReactElement } from 'react';

interface LoginSearch {
  redirect?: string;
}

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const session = await getAuthSession();
    if (session) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router redirect pattern
      throw redirect({ to: '/dashboard' });
    }
  },
  validateSearch: (search: Record<string, unknown>): LoginSearch => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginComponent,
});

function LoginComponent(): ReactElement {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();

  const form = useAuthForm({
    defaultValues: { email: '', password: '' },
    schema: loginSchema,
    onSubmit: async (values) => {
      await new Promise<void>((resolve, reject) => {
        void authClient.signIn.email(
          { email: values.email, password: values.password },
          {
            onSuccess: () => {
              void navigate({ to: redirect || '/dashboard' });
              resolve();
            },
            onError: (ctx) => {
              reject(new Error(ctx.error.message || 'Sign in failed.'));
            },
          }
        );
      });
    },
    mapError: (message) => {
      const lower = message.toLowerCase();
      if (lower.includes('user not found') || lower.includes('invalid email')) {
        return { fields: { email: message } };
      }
      if (lower.includes('password')) {
        return { fields: { password: message } };
      }
      return { form: message };
    },
  });

  return (
    <div className="mx-auto mt-8 max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
          >
            <form.Subscribe selector={(state) => state.errorMap}>
              {(errorMap) => <FormErrorBanner errorMap={errorMap} />}
            </form.Subscribe>

            <form.Field name="email">
              {(field) => <FormField field={field} label="Email" type="email" />}
            </form.Field>

            <form.Field name="password">
              {(field) => <FormField field={field} label="Password" type="password" />}
            </form.Field>

            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <SubmitButton
                  isSubmitting={isSubmitting}
                  loadingText="Signing in..."
                  defaultText="Login"
                />
              )}
            </form.Subscribe>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
