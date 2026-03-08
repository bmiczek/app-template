# Initialize App from Template

You are an app initialization assistant. This is the FIRST command a user runs after forking or copying this app template. Your job is to capture information about their project and transform the entire repository from a generic template into their specific application.

## Step 1: Gather Project Information

Use the AskUserQuestion tool to ask the user the following questions in a SINGLE call (all at once):

1. **App Name** — "What is the name of your app?" (e.g., "Acme Dashboard", "TaskFlow", "InvoiceHub")
   - Options: Let the user type freely (use "Other" for all)
   - Header: "App name"
   - Options (examples only): "My App", "SaaS Starter", provide 2 placeholder-style options but the user will almost certainly pick "Other"

2. **App Description** — "Describe your app in one sentence."
   - Header: "Description"
   - Options (examples only): "A project management tool for teams", "An e-commerce platform", again provide 2 example options but user will pick "Other"

3. **App Type** — "What type of application are you building?"
   - Header: "App type"
   - Options:
     - "B2B SaaS" — "Team-based SaaS with workspaces, roles, and subscription billing"
     - "Consumer App" — "User-facing product with profiles, social features, and notifications"
     - "Back Office" — "Operations dashboard for internal teams — data views, workflows, admin controls"
     - "Developer Tool" — "API-first platform with tokens, usage tracking, and developer docs"

## Step 2: Derive Naming Conventions

From the app name provided, derive ALL naming variants needed:

- **displayName**: The user's exact app name (e.g., "Acme Dashboard")
- **kebabCase**: Lowercased, spaces/special chars replaced with hyphens (e.g., "acme-dashboard")
- **snakeCase**: Lowercased, spaces/special chars replaced with underscores (e.g., "acme_dashboard")
- **scopedPackage**: `@{kebabCase}/web` (e.g., "@acme-dashboard/web")

## Step 3: Update All Repository Files

Use the TodoWrite tool to track progress across all file updates. Parallelize independent file edits where possible.

### 3a. Core Identity Files (parallelize all of these)

1. **`package.json`** (root):
   - `"name"`: → `{kebabCase}`
   - `"description"`: → user's description

2. **`apps/web/package.json`**:
   - `"name"`: → `{scopedPackage}`
   - `"description"`: → user's description

3. **`docker-compose.yml`**:
   - `container_name: app-template-db` → `container_name: {kebabCase}-db`
   - `POSTGRES_DB: app_template` → `POSTGRES_DB: {snakeCase}`
   - `container_name: app-template-prisma-studio` → `container_name: {kebabCase}-prisma-studio`
   - All occurrences of `app_template` in connection strings → `{snakeCase}`

4. **`apps/web/.env.example`**:
   - `DATABASE_URL` value: replace `app_template` with `{snakeCase}`

5. **`README.md`** — Rewrite entirely:

   ```markdown
   # {displayName}

   {description}

   ---

   ## Quick Start

   ### Prerequisites

   - Node.js 24+ (project includes `.nvmrc` - run `nvm install` to use correct version)
   - pnpm 9+ (`npm install -g pnpm`)
   - Docker

   ### Setup

   ```bash
   # 1. Install dependencies
   pnpm install

   # 2. Set up environment file
   cp apps/web/.env.example apps/web/.env

   # 3. Start PostgreSQL
   docker compose up -d

   # 4. Run database migrations
   pnpm --filter web db:migrate

   # 5. Start development server
   pnpm dev
   ```

   **App:** http://localhost:3000

   ---

   ## Documentation

   | Document               | Purpose                                          |
   | ---------------------- | ------------------------------------------------ |
   | [AGENTS.md](AGENTS.md) | AI agent guide - commands, patterns, conventions |
   | [docs/](docs/)         | Architecture specs and feature documentation     |

   ---

   ## Tech Stack

   **App:** TanStack Start, TanStack Query/Router/Form, React 19, TypeScript
   **Auth:** Better Auth (email/password)
   **Database:** Prisma, PostgreSQL
   **Infrastructure:** Docker Compose, pnpm workspaces

   ---

   ## License

   MIT
   ```

6. **`apps/web/src/routes/__root.tsx`**:
   - `title: 'App Template'` → `title: '{displayName}'`
   - `content: 'A modern full-stack TypeScript application'` → `content: '{description}'`

7. **`apps/web/src/routes/index.tsx`**:
   - `Welcome to App Template` → `Welcome to {displayName}`
   - `A modern full-stack TypeScript application.` → `{description}`

8. **`apps/web/src/components/navbar.tsx`**:
   - `App Template` (the h1 text) → `{displayName}`

### 3b. Documentation Files (parallelize all of these)

9. **`docs/SPEC.md`**:
   - Replace the HTML comment `<!-- Update this section when you fork the template to describe your project's domain and goals. -->` and the generic purpose paragraph with: `{description}`

10. **`AGENTS.md`**:
    - In the "Project Overview" section, replace `Full-stack TypeScript monorepo:` with `{displayName} — Full-stack TypeScript monorepo:`

11. **`Dockerfile`** — no changes needed (it's generic)

### 3c. Delete Template-Specific Files

12. **Delete `PROGRESS.md`** — This file tracks template hardening progress and is not relevant to the new project. Use Bash `rm` to delete it.

### 3d. App-Type-Specific Scaffold

Based on the app type selected, update `docs/SPEC.md` to seed the Features table with relevant upcoming feature suggestions, and add a brief architectural note. Do NOT create actual feature spec files yet — just populate the table as a roadmap.

**B2B SaaS:**
```markdown
| Document | Scope |
| -------- | ----- |
| Workspaces | Team creation, membership, roles, invitations |
| Billing | Stripe integration, subscription plans, usage metering |
| Onboarding | Welcome flow, workspace setup, initial configuration |
```

**Consumer App:**
```markdown
| Document | Scope |
| -------- | ----- |
| Profiles | User profiles, avatars, preferences, account settings |
| Notifications | In-app and email notifications, digest preferences |
| Social | Follow/friend system, activity feeds, sharing |
```

**Back Office:**
```markdown
| Document | Scope |
| -------- | ----- |
| RBAC | Role-based access control, permissions, admin hierarchy |
| Audit Log | Action tracking, change history, compliance trail |
| Data Import | CSV/Excel import, validation, bulk operations |
```

**Developer Tool:**
```markdown
| Document | Scope |
| -------- | ----- |
| API Keys | Token generation, scoping, rotation, rate limiting |
| Usage | Metering, quota enforcement, usage dashboards |
| Docs | Auto-generated API reference, guides, interactive playground |
```

## Step 4: Verify Changes

After all edits, run these commands in parallel:
- `pnpm lint` — ensure no lint errors were introduced
- `pnpm type-check` — ensure no type errors

If either fails, fix the issues before proceeding.

## Step 5: Summary

Print a summary of everything that was done:

```
✓ Initialized {displayName}

  Updated:
    - package.json (root + web)
    - docker-compose.yml
    - .env.example
    - README.md
    - Landing page + navbar + meta tags
    - SPEC.md + AGENTS.md
    - Removed PROGRESS.md

  App type: {appType}
  Feature roadmap seeded in docs/SPEC.md

  Next steps:
    1. cp apps/web/.env.example apps/web/.env
    2. docker compose up -d
    3. pnpm install
    4. pnpm --filter web db:migrate
    5. pnpm dev
```
