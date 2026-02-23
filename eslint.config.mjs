// @ts-check
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/.output/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
      // Generated files
      '**/*.gen.ts',
      '**/routeTree.gen.ts',
      // Config files outside tsconfig (parsed without type info)
      '**/playwright.config.ts',
      '**/vitest.config.ts',
      '**/prisma.config.ts',
      // Script files run via tsx (not part of TS project)
      'apps/web/prisma/seed.ts',
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript rules for all TS files
  {
    files: ['**/*.ts', '**/*.tsx'],
    extends: [...tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Align with project code style from CLAUDE.md
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    },
  },

  // React-specific rules for frontend
  {
    files: ['apps/web/**/*.tsx', 'apps/web/**/*.ts'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
      // React 19 with new JSX transform doesn't need React in scope
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off', // Using TypeScript for prop validation
    },
  },

  // Database rules
  // Note: Prisma client types are generated, so some type-checking rules may
  // fail if the client hasn't been generated yet. Run `pnpm db:generate` first.
  {
    files: ['apps/web/src/lib/database.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Prisma client is generated code, so type inference can be unreliable
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },

  // Config files (vite, playwright, etc.)
  {
    files: ['**/*.config.ts', '**/*.config.mjs', '**/vite.config.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  // Unit test files
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
    rules: {
      // Relaxed rules for tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // E2E test files (Playwright runs in Node)
  {
    files: ['**/e2e/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Relaxed rules for E2E tests
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
    },
  },

  // Prettier must be last to override formatting rules
  eslintConfigPrettier
);
