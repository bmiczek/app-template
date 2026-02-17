import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import type { ReactElement } from 'react';
import { authClient } from '../lib/auth-client';
import { FormErrorBanner, FormField, SubmitButton } from '../lib/forms/form-components';
import { useAuthForm } from '../lib/forms/use-auth-form';
import { signupSchema } from '../lib/schemas/auth';

export const Route = createFileRoute('/signup')({
  component: SignupComponent,
});

function SignupComponent(): ReactElement {
  const navigate = useNavigate();

  const form = useAuthForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    schema: signupSchema,
    onSubmit: async (values) => {
      await new Promise<void>((resolve, reject) => {
        void authClient.signUp.email(
          { name: values.name, email: values.email, password: values.password },
          {
            onSuccess: () => {
              void navigate({ to: '/dashboard' });
              resolve();
            },
            onError: (ctx) => {
              reject(new Error(ctx.error.message || 'Sign up failed.'));
            },
          }
        );
      });
    },
    mapError: (message) => {
      const lower = message.toLowerCase();
      if (lower.includes('already') || lower.includes('exists') || lower.includes('email')) {
        return { fields: { email: message } };
      }
      return { form: message };
    },
  });

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Sign Up</h2>
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

        <form.Field name="name">{(field) => <FormField field={field} label="Name" />}</form.Field>

        <form.Field name="email">
          {(field) => <FormField field={field} label="Email" type="email" />}
        </form.Field>

        <form.Field name="password">
          {(field) => <FormField field={field} label="Password" type="password" />}
        </form.Field>

        <form.Field name="confirmPassword">
          {(field) => <FormField field={field} label="Confirm Password" type="password" />}
        </form.Field>

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <SubmitButton
              isSubmitting={isSubmitting}
              loadingText="Creating account..."
              defaultText="Sign Up"
            />
          )}
        </form.Subscribe>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
