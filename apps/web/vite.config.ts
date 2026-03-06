import { sentryTanstackStart } from '@sentry/tanstackstart-react/vite';
import tailwindcss from '@tailwindcss/vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  server: {
    port: 3000,
  },
  ssr: {
    // pg-boss uses Node.js built-ins; keep it as an external require() in the SSR bundle
    external: ['pg-boss'],
  },
  build: {
    rollupOptions: {
      // pg-boss must not be bundled into the client (browser) output — it's server-only
      external: ['pg-boss'],
    },
  },
  plugins: [
    tailwindcss(),
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({
      srcDirectory: 'src',
    }),
    react(),
    // sentryTanstackStart must be last — handles source map uploads and middleware instrumentation
    sentryTanstackStart({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ['./**/*.map', './dist/**/client/**/*.map'],
      },
      // Skip upload silently when auth token is not configured (local dev)
      silent: !process.env.SENTRY_AUTH_TOKEN,
    }),
    ...(process.env['ANALYZE'] === 'true'
      ? [
          visualizer({
            open: true,
            filename: 'dist/bundle-stats.html',
            gzipSize: true,
            brotliSize: true,
          }),
        ]
      : []),
  ],
});
