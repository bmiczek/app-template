# Frontend Specification

## Overview

The frontend is a React 19 application rendered on the server by TanStack Start and hydrated on the client. It uses Tailwind CSS v4 for styling, shadcn/ui for component primitives, TanStack Form for form state management, and TanStack Query (via Better Auth's React client) for session state.

## Design Decisions

### Tailwind CSS v4 with CSS-first configuration

Tailwind v4 is configured entirely in CSS (`globals.css`) rather than a JavaScript config file. The `@tailwindcss/vite` plugin handles compilation. This approach:

- Eliminates `tailwind.config.ts` and `postcss.config.js`
- Keeps the design token system (colors, radii) in standard CSS custom properties
- Supports the `@theme inline` directive for mapping CSS variables to Tailwind utilities

### shadcn/ui as a component foundation

shadcn/ui provides accessible, unstyled component primitives that are copied into the project (not installed as a package). Components live in `src/components/ui/` and are generated via `npx shadcn@latest add <component>`. They should not be hand-edited - customization happens through Tailwind classes at the point of use, or by modifying the CSS variables in `globals.css`.

Current primitives: Button, Input, Label, Card, Alert.

### Forms with TanStack Form + Zod

Form state is managed by TanStack Form, which provides:

- Field-level validation on blur and submit
- Typed form values derived from Zod schemas
- Subscription-based rendering (only re-renders components that depend on changed state)
- Server error mapping (auth errors are routed to specific fields)

The `useAuthForm` hook encapsulates the common pattern of creating a form with dual validation (onBlur + onSubmit), async submission, and error mapping.

### No global state management

The application does not use Redux, Zustand, or a global state library. State needs are covered by:

- **TanStack Query** (via Better Auth client) - server state (sessions)
- **TanStack Form** - form state (validation, submission)
- **TanStack Router** - URL state (search params, route context)
- **React `useState`** - local component state (loading flags)

This approach is deliberate: the template avoids introducing global state management until domain complexity demands it.

## Component Architecture

### Layout

```
RootDocument (html, head, body)
  └── RootComponent
        ├── NavBar
        └── <main>
              └── Outlet (page content)
```

The root layout is defined in `__root.tsx`. It provides the HTML document shell, global CSS, meta tags, and the persistent NavBar. Page content renders into the `<Outlet />`.

### Component Categories

| Directory           | Purpose                                                         | Editing policy                                            |
| ------------------- | --------------------------------------------------------------- | --------------------------------------------------------- |
| `components/ui/`    | shadcn/ui primitives (Button, Input, etc.)                      | Do not hand-edit; regenerate with `npx shadcn@latest add` |
| `components/forms/` | Form building blocks (FormField, FormErrorBanner, SubmitButton) | Edit as needed                                            |
| `components/`       | Application components (NavBar)                                 | Edit as needed                                            |

### NavBar

The navigation bar is session-aware:

- **Unauthenticated** - shows Login link and Sign Up button
- **Authenticated** - shows user name, Dashboard link, and Sign Out button
- **Loading** - renders nothing while session status is being determined

Sign-out is handled client-side via `authClient.signOut()` with loading state and error handling.

### Form Components

Three reusable form components standardize form rendering:

- **FormField** - renders a labeled input with error display. Connects to TanStack Form's field API for value binding, blur handling, and validation state.
- **FormErrorBanner** - renders a destructive Alert when there are form-level submission errors (as opposed to field-level errors).
- **SubmitButton** - renders a full-width button that shows loading text while the form is submitting.

These components abstract away the wiring between TanStack Form's render-prop API and the shadcn/ui primitives.

## Styling System

### CSS Custom Properties

The design system is defined as CSS custom properties in `globals.css` using the OKLCH color space. Tokens include:

- **Colors** - background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, chart (1-5), sidebar variants
- **Radii** - sm, md, lg, xl derived from a base `--radius` variable
- **Dark mode** - complete set of color overrides in a `.dark` class (activated via `&:is(.dark *)` custom variant)

### Utility Function

The `cn()` utility (from `lib/utils.ts`) merges Tailwind classes using `clsx` and `tailwind-merge`. This prevents class conflicts when composing component styles:

```typescript
cn('px-4 py-2', condition && 'bg-primary', className);
```

### Global Styles

The base layer applies:

- `border-border` and `outline-ring/50` to all elements
- `bg-background text-foreground` to the body

### CSS Loading for SSR

Global CSS is imported with Vite's `?url` suffix in the root route and injected as a `<link>` tag in the document head. This is required for SSR - a bare CSS import would not produce a `<link>` tag during server rendering, causing a flash of unstyled content.

## Pages

### Home (`/`)

Public landing page. Shows a project description and feature list. Session-aware: displays "Welcome back, [name]" with a Dashboard link for authenticated users, or Login/Sign Up links for guests.

### Login (`/login`)

Email/password sign-in form. Validates input with `loginSchema` (Zod). On success, navigates to the redirect URL (if provided in search params) or to `/dashboard`. Server errors are mapped to specific fields (email or password) for contextual feedback.

Redirects to `/dashboard` if the user is already authenticated (checked in `beforeLoad`).

### Sign Up (`/signup`)

Registration form with name, email, password, and confirm password fields. Validates with `signupSchema` (Zod), including a refinement that checks password confirmation match. On success, navigates to `/dashboard`.

### Dashboard (`/_authed/dashboard`)

Protected route (requires authentication). Displays the user's name, email, and session expiration time in a Card component. Accesses session data from the route context provided by the `_authed` layout route.

## Client-Side Data Patterns

### Session state

Session state is managed by Better Auth's React client (`authClient.useSession()`), which wraps TanStack Query internally. This provides:

- Automatic session refresh
- Reactive updates when session state changes (sign in, sign out)
- `isPending` flag for loading states
- Cached session data to avoid redundant API calls

### Data loading in routes

Route data is loaded in `beforeLoad` hooks using server functions. This runs on the server during SSR and on the client during client-side navigation. The pattern ensures data is available before the component renders, avoiding loading spinners for critical data.

### Form submission

Forms use an async `onSubmit` handler that calls the Better Auth client methods (`signIn.email`, `signUp.email`). These methods use a callback pattern with `onSuccess` and `onError`, which are wrapped in a Promise to integrate with TanStack Form's async submission flow.

## Error Handling

### Form errors

Two levels of error display:

1. **Field-level** - validation errors shown directly below the relevant input
2. **Form-level** - server errors that don't map to a specific field shown as an Alert banner above the form

The `mapError` function in each form translates server error messages (e.g., "user not found") into structured errors that target specific fields.

### Route errors

The root error component catches unhandled errors and displays a user-friendly message. In development, the full error message is shown in a pre-formatted block for debugging. In production, only the generic message is shown.

### 404 handling

The root route's `notFoundComponent` renders a simple page with a link back to home.
