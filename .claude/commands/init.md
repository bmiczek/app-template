# Initialize App from Template

You are an app initialization assistant. This is the FIRST command a user runs after forking or copying this app template. Your job is to capture information about their project and transform the entire repository from a generic template into their specific application.

## Step 1: Gather Project Information

Use the AskUserQuestion tool to ask the user the following questions in a SINGLE call (all at once):

1. **App Name** — "What is the name of your app?" (e.g., "PipelineHQ", "Dungeon Crawler Online", "Replit")
   - Options: Let the user type freely (use "Other" for all)
   - Header: "App name"
   - Options (examples only): "My App", "Untitled Project", provide 2 placeholder-style options but the user will almost certainly pick "Other"

2. **App Description** — "Describe your app in one sentence."
   - Header: "Description"
   - Options (examples only): "A project management tool for teams", "An e-commerce platform", again provide 2 example options but user will pick "Other"

3. **App Type** — "What type of application are you building?"
   - Header: "App type"
   - Options:
     - "B2B SaaS" — "Team-based SaaS with workspaces, roles, and subscription billing"
     - "Consumer App" — "User-facing product with profiles, notifications, and personalized content"
     - "Video Game" — "Browser-based game with player accounts, leaderboards, and real-time state"
     - "Developer Tool" — "API-first platform with tokens, usage tracking, and developer docs"

## Step 2: Derive Naming Conventions

From the app name provided, derive ALL naming variants needed:

- **displayName**: The user's exact app name (e.g., "PipelineHQ")
- **kebabCase**: Lowercased, spaces/special chars replaced with hyphens (e.g., "pipeline-hq")
- **snakeCase**: Lowercased, spaces/special chars replaced with underscores (e.g., "pipeline_hq")
- **scopedPackage**: `@{kebabCase}/web` (e.g., "@pipeline-hq/web")

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
   - Replace the generic `<ul>` bullet list (TanStack Start, Prisma, PostgreSQL, Better Auth) with app-type-appropriate value propositions:

   **B2B SaaS:**
   ```
   - Workspace-based team collaboration
   - Role-based access and permissions
   - Subscription management and billing
   ```

   **Consumer App:**
   ```
   - Personalized content tailored to you
   - Real-time notifications and updates
   - Rich user profiles and preferences
   ```

   **Video Game:**
   ```
   - Real-time multiplayer gameplay
   - Persistent leaderboards and achievements
   - Skill-based matchmaking
   ```

   **Developer Tool:**
   ```
   - Powerful API with fine-grained access tokens
   - Real-time usage metrics and dashboards
   - Interactive API documentation and playground
   ```

8. **`apps/web/src/components/navbar.tsx`**:
   - `App Template` (the h1 text) → `{displayName}`

9. **`apps/web/src/routes/_authed/dashboard.tsx`**:
   - Update the page heading and card title to be app-type-appropriate:

   **B2B SaaS:** heading → "Workspace", card title → "Account"
   **Consumer App:** heading → "Home", card title → "Your Profile"
   **Video Game:** heading → "Game Lobby", card title → "Player Info"
   **Developer Tool:** heading → "Console", card title → "Account"

### 3b. Documentation Files (parallelize all of these)

10. **`docs/SPEC.md`**:
    - Replace the HTML comment `<!-- Update this section when you fork the template to describe your project's domain and goals. -->` and the generic purpose paragraph with: `{description}`

11. **`AGENTS.md`**:
    - In the "Project Overview" section, replace `Full-stack TypeScript monorepo:` with `{displayName} — Full-stack TypeScript monorepo:`
    - Replace `docker build -t app .` with `docker build -t {kebabCase} .`

### 3c. Delete Template-Specific Files

12. **Delete `PROGRESS.md`** — This file tracks template hardening progress and is not relevant to the new project. Use Bash `rm` to delete it. If it doesn't exist, skip silently.

### 3d. App-Type-Specific Scaffold

Based on the app type selected, update `docs/SPEC.md` in two ways:

**A) Seed the Features table** with relevant upcoming feature suggestions. Do NOT create actual feature spec files yet — just populate the table as a roadmap.

**B) Add an architectural note** under the "Key Architectural Decisions" section that describes the app-type-specific design direction.

---

**B2B SaaS:**

Features table:
```markdown
| Document | Scope |
| -------- | ----- |
| Workspaces | Team creation, membership, roles, invitations |
| Billing | Stripe integration, subscription plans, usage metering |
| Onboarding | Welcome flow, workspace setup, initial configuration |
```

Architectural note:
```markdown
### Multi-tenant workspace model

All domain data is scoped to a workspace. Users belong to one or more workspaces with role-based permissions (owner, admin, member). Workspace-level isolation is enforced at the query layer via Prisma middleware, ensuring no cross-tenant data leakage. Billing state is tracked per workspace.
```

---

**Consumer App:**

Features table:
```markdown
| Document | Scope |
| -------- | ----- |
| Profiles | User profiles, avatars, preferences, account settings |
| Notifications | In-app and email notifications, digest preferences |
| Content Feed | Personalized feed, recommendations, bookmarks, history |
```

Architectural note:
```markdown
### User-centric data model

All domain data radiates from the user. Profiles, preferences, and content interactions are per-user. The notification system uses pg-boss to queue and deliver both in-app and email notifications with user-controlled digest preferences. Content feeds are assembled server-side to enable personalization without client-side complexity.
```

---

**Video Game:**

Features table:
```markdown
| Document | Scope |
| -------- | ----- |
| Game State | Real-time game loop, state synchronization, session management |
| Leaderboards | Score tracking, rankings, seasons, achievements |
| Matchmaking | Lobby system, player pairing, room management |
```

Architectural note:
```markdown
### Session-based game architecture

Game sessions are short-lived server-managed state objects tied to a lobby or match. Persistent player data (stats, achievements, rankings) is stored in PostgreSQL. Leaderboards use indexed score columns for fast ranking queries. The pg-boss job queue handles async operations like end-of-match scoring, season rollovers, and achievement unlocks.
```

---

**Developer Tool:**

Features table:
```markdown
| Document | Scope |
| -------- | ----- |
| API Keys | Token generation, scoping, rotation, rate limiting |
| Usage | Metering, quota enforcement, usage dashboards |
| Docs | Auto-generated API reference, guides, interactive playground |
```

Architectural note:
```markdown
### API-first with token authentication

External API consumers authenticate via scoped API keys, separate from the session-based web UI auth. Each key has configurable permissions and rate limits. All API calls are metered and logged for usage tracking. The web dashboard serves as the management plane for keys, quotas, and usage analytics.
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
