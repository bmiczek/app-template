# CLAUDE.md - AI Agent Guide

## Project Overview

**Esthetically Clear** - Full-stack TypeScript monorepo:
- **Frontend**: TanStack Start (React 19, SSR, Vite-based)
- **Backend**: Hono
- **Database**: PostgreSQL + Prisma
- **Auth**: Better Auth
- **Infra**: Docker Compose, pnpm workspaces

### TanStack Start Version (IMPORTANT)

This project uses **Vite-based TanStack Start** (v1.x with `@tanstack/react-start`), NOT the older Vinxi-based version.

- Package: `@tanstack/react-start` (not `@tanstack/start`)
- Config: `vite.config.ts` with `tanstackStart()` plugin
- Commands: `vite` / `vite build`

When searching docs, look for **Vite-based TanStack Start (2024-2025)**.

---

## Essential Commands

**Always use `pnpm`, never npm/yarn**

```bash
# Dev
pnpm install                              # Install all
pnpm dev                                  # Run frontend + backend
pnpm --filter backend dev                 # Backend only
pnpm --filter frontend dev                # Frontend only

# Database
pnpm --filter database db:migrate         # Run migrations
pnpm --filter database db:generate        # Generate Prisma client
pnpm --filter database db:studio          # Open Prisma Studio

# Build & Check
pnpm build                                # Build all
pnpm type-check                           # Type check all

# Dependencies
pnpm --filter <workspace> add <package>   # Add to workspace
pnpm add -w -D <package>                  # Add to root (build tools only)
```

---

## Project Structure

```
apps/
  frontend/         # TanStack Start (routes in src/routes/)
  backend/          # Hono API (routes in src/routes/)
packages/
  database/         # Prisma schema + client
  shared/           # Shared types & constants
docs/plans/         # development-roadmap.md (task tracking)
```

**Key files:**
- Prisma schema: `packages/database/prisma/schema.prisma`
- Shared types: `packages/shared/src/types.ts`
- Backend entry: `apps/backend/src/index.ts`
- Vite config: `apps/frontend/vite.config.ts`

**Ports:** Frontend: 3000 | Backend: 3001 | PostgreSQL: 5432

---

## Guidelines for AI Agents

### Before Starting
1. Check [docs/plans/development-roadmap.md](docs/plans/development-roadmap.md) for priorities (P0-P3)
2. Use TodoWrite to track multi-step tasks
3. Update roadmap when completing tasks

### Core Principles
- Prefer idiomatic solutions over hacky workarounds
- Put shared types in `packages/shared`
- Use Prisma from `@esthetically-clear/database`
- Ask before major architectural decisions
- Read existing code patterns before adding new code

### Code Style
- PascalCase for interfaces/types, camelCase for functions/variables
- Always type function parameters and return values
- Use `interface` over `type` for object shapes
- Named function components in React (not arrow default exports)
- Never use `any` - prefer `unknown` and narrow

### Database Changes
```bash
# 1. Edit packages/database/prisma/schema.prisma
# 2. Run migration
pnpm --filter database db:migrate
# 3. Commit schema + migration files
```
- Use camelCase for Prisma fields, snake_case for DB columns
- Never manually edit migration files

### Adding API Endpoints
1. Create route in `apps/backend/src/routes/<name>.ts`
2. Register in `apps/backend/src/index.ts`: `app.route('/api/<name>', routes)`
3. Add types to `packages/shared/src/types.ts`
4. Use consistent response format: `{ success: boolean, data?: T, error?: string }`

### Adding Frontend Routes
- Create file in `apps/frontend/src/routes/` (auto-registered)
- Use TanStack Query for data fetching
- Use TanStack Form for forms

### Git Commits
Proactively suggest commits at milestones (features complete, bugs fixed, docs updated). **Always ask before committing.**

Format:
```
<type>: <description>

- Detail 1
- Detail 2

Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
```
Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## Critical Reminders

### Do
- Run `docker compose up -d` before dev
- Copy `.env.example` to `.env` in apps/backend and apps/frontend
- Run `pnpm type-check` before commits
- Generate Prisma client after schema changes

### Don't
- Use `db:push` in production (migrations only)
- Edit migration files manually
- Commit `.env` files
- Use `any` type (use `unknown` and narrow)

---

## Troubleshooting

**"Cannot find module '@esthetically-clear/...'"**
```bash
pnpm install && pnpm --filter database db:generate
```

**Port already in use**
```bash
lsof -i :3000 && kill -9 <PID>
```

**Docker issues**
```bash
docker compose logs -f postgres
docker compose restart postgres
```

---

## Context7 Usage

Always use Context7 MCP tools automatically when needing:
- Code generation
- Setup/configuration steps
- Library/API documentation

---

## Resources

- [TanStack Start](https://tanstack.com/start/latest)
- [Hono](https://hono.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
