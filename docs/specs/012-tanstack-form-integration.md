# 012 — TanStack Form Integration

**Issue:** #22 — Set up TanStack Form for form handling
**Status:** Spec

## Context

The app has two forms (login, signup) using manual `useState` + inline validation functions. This works but doesn't scale — each form re-implements state management, validation, error display, and submission handling from scratch. TanStack Form provides a structured, type-safe approach that integrates naturally with the existing TanStack stack (Router, Query) and enables sharing Zod schemas between client validation and server logic.

## Decisions

| Decision              | Choice                                                  |
| --------------------- | ------------------------------------------------------- |
| Scope                 | Convert existing login + signup forms                   |
| Validation library    | Zod (with native TanStack Form Standard Schema support) |
| Schema location       | `apps/web/src/lib/schemas/`                             |
| Server error handling | Map to field errors when possible, form-level fallback  |
| Validation timing     | `onBlur` + `onSubmit`                                   |

## Dependencies to Install

```bash
pnpm --filter web add @tanstack/react-form zod
```

> Note: TanStack Form v1+ supports Zod natively via Standard Schema — no separate `@tanstack/zod-form-adapter` needed.

## Files to Create/Modify

### New Files

#### 1. `apps/web/src/lib/schemas/auth.ts` — Shared Zod schemas

Define schemas that encode the same constraints currently in `auth-config.ts` and the inline validation functions:

```ts
import { z } from 'zod';
import { AUTH_PASSWORD } from '../auth-config';

export const emailSchema = z
  .string()
  .min(1, 'Email is required.')
  .email('Please enter a valid email address.');

export const passwordSchema = z
  .string()
  .min(
    AUTH_PASSWORD.MIN_LENGTH,
    `Password must be at least ${AUTH_PASSWORD.MIN_LENGTH} characters.`
  )
  .max(
    AUTH_PASSWORD.MAX_LENGTH,
    `Password must be at most ${AUTH_PASSWORD.MAX_LENGTH} characters.`
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
```

### Modified Files

#### 2. `apps/web/src/routes/login.tsx` — Refactor to TanStack Form

Replace manual `useState`/`validate`/`handleSubmit` with `useForm`:

- **`useForm`** with `defaultValues: { email: '', password: '' }`
- **`validators.onBlur`**: `loginSchema` (Zod via Standard Schema)
- **`onSubmit`**: calls `authClient.signIn.email()`, maps server errors to fields or form-level
- **`form.Field`** for each input with `field.handleBlur` on the `<input>` `onBlur` event
- **`form.Subscribe`** to show form-level errors (unmappable server errors)
- **`form.Subscribe`** to disable submit button when `isSubmitting`

#### 3. `apps/web/src/routes/signup.tsx` — Refactor to TanStack Form

Same pattern as login but with `signupSchema` and additional fields (name, confirmPassword).

Server error mapping: e.g., "User already exists" → `{ fields: { email: 'An account with this email already exists.' } }`.

### Summary of Changes

| File                               | Action                                                   |
| ---------------------------------- | -------------------------------------------------------- |
| `apps/web/src/lib/schemas/auth.ts` | **Create** — Zod schemas for login/signup                |
| `apps/web/src/routes/login.tsx`    | **Modify** — Refactor to useForm + Zod onBlur validation |
| `apps/web/src/routes/signup.tsx`   | **Modify** — Refactor to useForm + Zod onBlur validation |
| `apps/web/package.json`            | **Modify** — Add `@tanstack/react-form`, `zod`           |

## Verification

1. **Install & type-check**: `pnpm install && pnpm type-check` — should pass
2. **Login form**: Start dev server, go to `/login`, verify:
   - Leaving empty email field and blurring shows "Email is required."
   - Typing invalid email and blurring shows "Please enter a valid email address."
   - Short password shows length error on blur
   - Submit with valid data calls Better Auth and navigates on success
   - Wrong credentials show error mapped to the appropriate field
3. **Signup form**: Go to `/signup`, verify:
   - All field validations fire on blur
   - Password mismatch shows error on confirmPassword field
   - Successful signup navigates to `/dashboard`
   - "User already exists" maps to email field error
4. **Build**: `pnpm build` — should pass (no client bundle issues with Zod)
