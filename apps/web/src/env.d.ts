/// <reference types="vite/client" />

// Server-side environment variables are validated at startup via `src/env.ts`.
// Only add client-side (VITE_*) variables here.

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
