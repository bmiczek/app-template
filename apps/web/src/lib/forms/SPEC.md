# Forms

TanStack Form for state, Zod for validation. Generic components here, domain-specific logic lives with its domain (e.g., auth schemas in `lib/auth/schemas.ts`).

## The Form Pattern

1. **Schema** — Zod schema defining the form shape and validation rules
2. **Hook** — `useAuthForm()` (or a similar wrapper) calls `useForm` with onBlur + onSubmit validation and a `mapError` callback
3. **Components** — `FormField`, `FormErrorBanner`, `SubmitButton` from this directory

The `mapError` function is the key design choice — it inspects server error messages and routes them to specific fields (e.g., "user not found" → email field) or to a form-level banner. This keeps error presentation logic in the page, not in the components.

## Components

- **`FormField`** — Label + input + inline error. Wires TanStack Form's field API to HTML.
- **`FormErrorBanner`** — Shows form-level error from `errorMap.onSubmit`.
- **`SubmitButton`** — Loading/default text states, disabled during submission.

These are intentionally simple. Extend or create new ones as the app grows.
