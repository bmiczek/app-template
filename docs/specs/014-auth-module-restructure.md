# 014: Restructure lib/ into Auth Module

## Context

The `apps/web/src/lib/` directory held 7 files across 3 locations, all auth-related. The flat structure mixed auth-specific code with generic utilities and relied on comments (not file paths) to communicate the server/client bundle boundary. As the app grows, this wouldn't scale.

## Changes

### Before

```
lib/
├── auth.ts              # Server-only Better Auth instance
├── auth-client.ts       # Client auth + SSR session getter
├── auth-config.ts       # Config constants & env validation
├── schemas/
│   └── auth.ts          # Zod validation schemas
└── forms/
    ├── use-auth-form.ts      # Auth-specific form hook
    ├── form-components.tsx   # Generic form UI components
    └── form-utils.ts         # Generic error formatting
```

### After

```
lib/
├── auth/
│   ├── server.ts            # Server-only Better Auth instance + types
│   ├── client.ts            # Client auth client + SSR session getter
│   ├── config.ts            # Configuration constants & env validation
│   ├── schemas.ts           # Zod validation schemas
│   └── use-auth-form.ts     # Auth-specific form hook
└── forms/
    ├── components.tsx        # Generic form UI (FormField, SubmitButton, FormErrorBanner)
    └── utils.ts              # Generic error formatting utilities
```

## Key Decisions

- **`server.ts` / `client.ts` naming** makes the bundle boundary explicit in the file system
- **No barrel `index.ts`** — prevents accidental re-export of server code into client bundle
- **`use-auth-form` moved into `auth/`** — tightly coupled to auth error patterns
- **Generic form components stay in `lib/forms/`** — zero auth-specific logic, reusable by future forms
- **`schemas/` directory collapsed** — single-file directory was premature indirection

## Files Modified

- `apps/web/src/routes/login.tsx` — updated imports
- `apps/web/src/routes/signup.tsx` — updated imports
- `apps/web/src/routes/__root.tsx` — updated imports
- `apps/web/src/routes/index.tsx` — updated imports
- `apps/web/src/routes/_authed.tsx` — updated imports
- `apps/web/src/routes/api/auth/$.tsx` — updated imports
- `apps/web/src/router.tsx` — updated imports
