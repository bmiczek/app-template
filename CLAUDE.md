# CLAUDE.md - AI Agent Guide

This document provides context and guidelines for AI agents (like Claude Code) working on the Esthetically Clear project. It captures key decisions, workflow patterns, and best practices established during the project's creation.

---

## Project Overview

**Esthetically Clear** is a modern full-stack TypeScript application built with:
- **Frontend**: TanStack Start (React 19 with SSR)
- **Backend**: Hono (ultrafast web framework)
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth (modern, TypeScript-first)
- **Infrastructure**: Docker Compose, pnpm workspaces
- **Deployment**: Railway (backend/db) + Vercel (frontend)

### Key Architecture Decisions

1. **Monorepo Structure**: Using pnpm workspaces for efficient dependency management and code sharing
2. **End-to-End Type Safety**: TypeScript throughout, shared types between frontend and backend
3. **Modern Stack**: Prioritizing developer experience with latest stable tools
4. **Free-Tier Friendly**: All deployment targets have generous free tiers
5. **Production-Ready Patterns**: From the start, not prototypes

---

## Project Structure

```
esthetically-clear/
├── apps/
│   ├── frontend/          # TanStack Start application (with Vite)
│   │   ├── src/
│   │   │   ├── routes/    # File-based routing (TanStack Start convention)
│   │   │   ├── components/
│   │   │   ├── lib/       # Frontend utilities, API client, hooks
│   │   │   └── router.tsx # Router configuration
│   │   ├── vite.config.ts # Vite configuration with TanStack Start plugin
│   │   └── package.json
│   │
│   └── backend/           # Hono API server
│       ├── src/
│       │   ├── routes/    # API route handlers
│       │   ├── middleware/# Auth, CORS, logging, etc.
│       │   ├── lib/       # Utilities, auth config
│       │   └── index.ts   # Entry point
│       └── package.json
│
├── packages/
│   ├── database/          # Prisma ORM package
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/index.ts   # Prisma client singleton
│   │
│   └── shared/            # Shared types, constants, utilities
│       └── src/
│           ├── types.ts
│           └── constants.ts
│
├── docs/
│   ├── QUICK_START.md     # Step-by-step setup guide
│   └── plans/
│       └── development-roadmap.md  # Task tracking and priorities
│
├── docker-compose.yml     # Local PostgreSQL
├── package.json           # Root workspace config
└── pnpm-workspace.yaml    # Workspace definition
```

---

## Working with This Project

### Essential Commands

**Never use `npm` or `yarn` - always use `pnpm`**

```bash
# Install dependencies (from root)
pnpm install

# Run dev servers (both frontend and backend)
pnpm dev

# Run specific workspace
pnpm --filter backend dev
pnpm --filter frontend dev
pnpm --filter database <command>

# Add dependencies
pnpm --filter backend add <package>        # Production dependency
pnpm --filter frontend add -D <package>    # Dev dependency

# Database operations
pnpm --filter database db:migrate          # Run migrations
pnpm --filter database db:generate         # Generate Prisma client
pnpm --filter database db:studio           # Open Prisma Studio
pnpm --filter database db:push             # Push schema (dev only)
pnpm --filter database db:reset            # Reset database (careful!)

# Build all packages
pnpm build

# Type checking
pnpm type-check

# Clean everything
pnpm clean
```

### Development Workflow

1. **Start Docker** (if not already running):
   ```bash
   docker compose up -d
   ```

2. **Environment files must exist**:
   - `apps/backend/.env` (copy from `.env.example`)
   - `apps/frontend/.env` (copy from `.env.example`)

3. **Generate Prisma client** after schema changes:
   ```bash
   pnpm --filter database db:generate
   ```

4. **Start dev servers**:
   ```bash
   pnpm dev
   ```

---

## Guidelines for AI Agents

### Core Principles

1. **Prefer Idiomatic Solutions**: Always consider whether a proposed solution is the idiomatic, standard approach for the technology being used. Avoid hacky workarounds (like excessive dependency overrides, monkey-patching, or version pinning) when a proper migration or upgrade path exists. If the idiomatic solution requires more effort, that effort is usually worthwhile for long-term maintainability.

### Before Starting Any Task

1. **Check the development roadmap**: Read [docs/plans/development-roadmap.md](docs/plans/development-roadmap.md)
2. **Understand current priority**: Tasks are organized by priority (P0-P3)
3. **Update the roadmap**: Mark tasks as completed, add new tasks discovered during work
4. **Use TodoWrite tool**: Track progress within a session

### Task Execution Patterns

#### Pattern 1: Database Schema Changes

```bash
# 1. Edit schema
# Edit: packages/database/prisma/schema.prisma

# 2. Create migration
pnpm --filter database db:migrate

# 3. Verify in Prisma Studio (optional)
pnpm --filter database db:studio

# 4. Commit both schema and migration files
git add packages/database/prisma/
```

**Important**:
- Always include `@@map()` directives if using non-standard table names
- Use camelCase for Prisma fields, snake_case for DB columns
- Never manually edit migration files
- Always generate Prisma client after migrations

#### Pattern 2: Adding Backend API Endpoints

```typescript
// 1. Create route file: apps/backend/src/routes/example.ts
import { Hono } from 'hono';
import { prisma } from '@esthetically-clear/database';

const example = new Hono();

example.get('/', async (c) => {
  const items = await prisma.example.findMany();
  return c.json({ data: items });
});

export default example;

// 2. Register route in apps/backend/src/index.ts
import exampleRoutes from './routes/example';
app.route('/api/example', exampleRoutes);

// 3. Add types to packages/shared/src/types.ts if needed
```

**Best Practices**:
- Use Hono's context (`c`) for all responses
- Always handle errors with try-catch
- Return consistent response format (see `shared/types.ts`)
- Use Prisma from `@esthetically-clear/database`
- Apply auth middleware for protected routes

#### Pattern 3: Adding Frontend Routes

```typescript
// 1. Create route: apps/frontend/app/routes/example.tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/example')({
  component: ExampleComponent,
});

function ExampleComponent() {
  // Use TanStack Query for data fetching
  // Use TanStack Form for forms
  return <div>Example</div>;
}

// 2. Route is automatically registered (TanStack Start convention)
```

**Best Practices**:
- Use file-based routing (TanStack Start handles registration)
- Co-locate data fetching with route definitions
- Use TanStack Query for server state
- Use TanStack Form for form state
- Keep components focused and small

#### Pattern 4: Shared Types

```typescript
// packages/shared/src/types.ts
export interface NewType {
  id: string;
  // ... fields
}

// Backend usage
import { NewType } from '@esthetically-clear/shared';

// Frontend usage
import { NewType } from '@esthetically-clear/shared';
```

**Best Practices**:
- Put ALL shared types in `packages/shared`
- Never duplicate types between frontend and backend
- Export Prisma types from database package if needed
- Use shared constants for API endpoints, status codes, etc.

### Code Style Guidelines

#### TypeScript

```typescript
// ✅ Good
export interface User {
  id: string;
  email: string;
  name: string | null;
}

export const getUser = async (id: string): Promise<User> => {
  // implementation
};

// ❌ Avoid
export interface user {  // Use PascalCase for interfaces
  // ...
}

export function getUser(id) {  // Always type parameters and returns
  // ...
}
```

#### React Components

```typescript
// ✅ Good - Named function with types
interface Props {
  userId: string;
  onUpdate?: () => void;
}

function UserProfile({ userId, onUpdate }: Props) {
  // implementation
}

// ❌ Avoid - Arrow function default export
export default ({ userId }) => {
  // ...
};
```

#### API Responses

```typescript
// ✅ Good - Consistent response structure
return c.json({
  success: true,
  data: result,
});

// Or for errors
return c.json({
  success: false,
  error: 'Something went wrong',
}, 400);

// ❌ Avoid - Inconsistent responses
return c.json(result);
return c.json({ result });
```

### When Adding Dependencies

```bash
# Always specify workspace
pnpm --filter <workspace> add <package>

# Common workspaces:
# - backend
# - frontend
# - database
# - shared

# Consider if it should be in workspace root
pnpm add -w <package>  # Only for tools used by all workspaces
```

**Decision Tree**:
- **Frontend-only**: `pnpm --filter frontend add`
- **Backend-only**: `pnpm --filter backend add`
- **Used by both**: Add to `shared` package or both workspaces
- **Build tool**: `pnpm add -w -D`

### Git Commit Guidelines

**When to Commit** (Proactive Approach):

AI agents should **proactively suggest commits** at these milestones:
- ✅ After completing a feature or major task
- ✅ After creating/updating significant documentation
- ✅ After fixing bugs or issues
- ✅ Before switching to a different area of work
- ✅ At natural breakpoints in development (e.g., schema changes, new routes, UI components)

**Always ask the user before committing** - Suggest the commit, explain what will be included, and wait for confirmation.

**Commit Message Format**:
```
<type>: <brief description>

<detailed description>
- Bullet point 1
- Bullet point 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks
- `style`: Code style changes (formatting, etc.)
- `perf`: Performance improvements

**Example**:
```bash
git commit -m "$(cat <<'EOF'
feat: Add user authentication with Better Auth

- Integrate Better Auth in backend
- Create auth middleware for protected routes
- Add login/signup pages in frontend
- Configure session management
- Add auth context and hooks

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

**Commit Best Practices**:
- Keep commits focused and atomic
- Write descriptive messages that explain the "why" not just the "what"
- Group related changes together
- Don't commit broken code
- Run `pnpm type-check` before committing when possible

---

## Critical Reminders

### Prisma

- ✅ **Always run migrations in development**: `pnpm --filter database db:migrate`
- ✅ **Generate client after schema changes**: Happens automatically with migrate
- ❌ **Never use `db:push` in production**: Only for rapid prototyping
- ❌ **Never edit migration files manually**: Let Prisma handle it

### Environment Variables

- ✅ **Check `.env.example` files**: Templates for all required variables
- ✅ **Backend**: `apps/backend/.env`
- ✅ **Frontend**: `apps/frontend/.env`
- ❌ **Never commit `.env` files**: Already in `.gitignore`
- ❌ **Never hardcode secrets**: Use environment variables

### TypeScript

- ✅ **Run type checking before commits**: `pnpm type-check`
- ✅ **Fix type errors immediately**: Don't use `@ts-ignore` unless absolutely necessary
- ✅ **Use strict mode**: Already configured in all `tsconfig.json` files
- ❌ **Don't use `any`**: Use `unknown` and narrow the type

### Docker

- ✅ **Start PostgreSQL before dev**: `docker compose up -d`
- ✅ **Check logs if issues**: `docker compose logs -f postgres`
- ❌ **Don't use `down -v` unless you want to delete data**: Removes volumes

---

## Common Workflows

### Adding Authentication (Better Auth)

**Status**: Planned (P0 priority in roadmap)

**Steps**:
1. Add Better Auth to Prisma schema (User, Session, Account tables)
2. Run migration
3. Create auth config in `apps/backend/src/lib/auth.ts`
4. Create auth routes in `apps/backend/src/routes/auth.ts`
5. Create auth middleware in `apps/backend/src/middleware/auth.ts`
6. Add auth API client in `apps/frontend/app/lib/api.ts`
7. Create auth context in `apps/frontend/app/lib/auth.tsx`
8. Build login/signup UI components
9. Test the flow

**Reference**: Better Auth documentation at https://www.better-auth.com/

### Adding a New API Resource

**Example**: Adding a "posts" resource

1. **Database**: Add Post model to Prisma schema
   ```bash
   pnpm --filter database db:migrate
   ```

2. **Shared types**: Add PostDTO types to `packages/shared/src/types.ts`

3. **Backend**: Create `apps/backend/src/routes/posts.ts`
   ```typescript
   import { Hono } from 'hono';
   import { prisma } from '@esthetically-clear/database';

   const posts = new Hono();

   posts.get('/', async (c) => { /* list */ });
   posts.post('/', async (c) => { /* create */ });
   posts.get('/:id', async (c) => { /* get one */ });
   posts.put('/:id', async (c) => { /* update */ });
   posts.delete('/:id', async (c) => { /* delete */ });

   export default posts;
   ```

4. **Register route**: In `apps/backend/src/index.ts`
   ```typescript
   import postsRoutes from './routes/posts';
   app.route('/api/posts', postsRoutes);
   ```

5. **Frontend**: Create TanStack Query hooks in `apps/frontend/app/lib/api/posts.ts`
   ```typescript
   import { useQuery, useMutation } from '@tanstack/react-query';

   export const usePosts = () => {
     return useQuery({
       queryKey: ['posts'],
       queryFn: async () => {
         const res = await fetch('http://localhost:3001/api/posts');
         return res.json();
       },
     });
   };
   ```

6. **Frontend routes**: Create pages in `apps/frontend/src/routes/posts/`

7. **Test**: Verify CRUD operations work

### Deployment

**Not yet implemented - see roadmap for P2 tasks**

When ready:
- **Backend + DB**: Railway
- **Frontend**: Vercel
- Update environment variables in each platform
- Run migrations on Railway: `pnpm --filter database db:migrate:deploy`

---

## Troubleshooting Guide

### "Cannot find module '@esthetically-clear/...'"

```bash
# Reinstall dependencies
pnpm install

# If Prisma-related, generate client
pnpm --filter database db:generate
```

### "Port already in use"

```bash
# Find process
lsof -i :3000  # or :3001, :5432

# Kill process
kill -9 <PID>
```

### "Prisma Client not initialized"

```bash
# Generate Prisma client
pnpm --filter database db:generate

# Restart dev server
```

### "Type errors after adding dependency"

```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

### Docker Issues

```bash
# View logs
docker compose logs -f postgres

# Restart
docker compose restart postgres

# Nuclear option (deletes data!)
docker compose down -v
docker compose up -d
```

---

## Testing Strategy

**Not yet implemented - see roadmap**

When adding tests:
- **Unit tests**: Vitest (already in devDependencies)
- **Backend**: Test route handlers, middleware, utilities
- **Frontend**: Test components, hooks, utilities
- **Integration**: Test API endpoints with test database
- **E2E**: Consider Playwright for critical user flows

---

## Documentation Updates

### When to Update Documentation

- **CLAUDE.md** (this file): When establishing new patterns or making architectural decisions
- **README.md**: When changing installation steps or adding major features
- **QUICK_START.md**: When changing setup process or prerequisites
- **development-roadmap.md**: Continuously as tasks are completed or priorities change

### Documentation Philosophy

- **README.md**: High-level overview, quick reference
- **QUICK_START.md**: Step-by-step for new developers
- **development-roadmap.md**: Living document for task management
- **CLAUDE.md**: Deep context for AI agents
- **Code comments**: Only for non-obvious logic

---

## Key Learnings from Project Bootstrap

### What Worked Well

1. **Starting with complete structure**: All folders and configs from the start
2. **Documentation-first**: Created README and guides early
3. **Type safety from day one**: TypeScript everywhere prevents issues later
4. **Modern tools**: Latest stable versions of everything
5. **Monorepo**: Sharing code between frontend/backend is seamless
6. **Development roadmap**: Clear priorities and task tracking

### Patterns Established

1. **Incremental progress**: Build in small, testable chunks
2. **Git commits**: Frequent commits with detailed messages
3. **Todo tracking**: Using TodoWrite for session task management
4. **Roadmap updates**: Keeping the roadmap current as work progresses
5. **Ask before major decisions**: When multiple approaches exist, ask the user

### AI Agent Workflow

The pattern that emerged:
1. **Understand the goal**: Ask clarifying questions upfront
2. **Make recommendations**: Provide options with pros/cons
3. **Create todo list**: Use TodoWrite for multi-step tasks
4. **Execute systematically**: One step at a time, mark completed
5. **Document decisions**: Update roadmap and this file
6. **Commit frequently**: Don't batch too many changes
7. **Summarize progress**: Clear update after each major milestone

---

## Future Considerations

### When the Project Grows

- **Split routes**: Group related endpoints in subdirectories
- **Add middleware**: Error handling, request validation, rate limiting
- **Testing**: Add comprehensive test coverage
- **CI/CD**: Automate testing and deployment
- **Monitoring**: Add logging, error tracking, analytics
- **Performance**: Caching, optimization, CDN
- **Security**: Rate limiting, input validation, CSP headers

### Scaling the Monorepo

If the project grows significantly:
- Consider splitting into multiple repos (microfrontends, microservices)
- Add Turborepo for better build caching
- Implement shared UI component library
- Add E2E testing across all apps

---

## Quick Reference

### File Locations

- **Prisma schema**: `packages/database/prisma/schema.prisma`
- **Shared types**: `packages/shared/src/types.ts`
- **Backend entry**: `apps/backend/src/index.ts`
- **Backend routes**: `apps/backend/src/routes/`
- **Frontend router**: `apps/frontend/src/router.tsx`
- **Frontend routes**: `apps/frontend/src/routes/`
- **Frontend components**: `apps/frontend/src/components/`
- **Vite config**: `apps/frontend/vite.config.ts`
- **Environment examples**: `apps/*/`.env.example`
- **Task roadmap**: `docs/plans/development-roadmap.md`

### Port Assignments

- **Frontend**: 3000
- **Backend**: 3001
- **PostgreSQL**: 5432
- **Prisma Studio**: 5555 (when running)

### Important URLs

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api
- Backend Health: http://localhost:3001/health
- Prisma Studio: http://localhost:5555 (after running `db:studio`)

---

## Contact & Resources

### Official Documentation

- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Hono](https://hono.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [pnpm](https://pnpm.io/)

### When Stuck

1. Check this file (CLAUDE.md) for patterns and examples
2. Review [development-roadmap.md](docs/plans/development-roadmap.md) for context
3. Read the [QUICK_START.md](docs/QUICK_START.md) for setup issues
4. Check official documentation for the specific tool
5. Review git history for how similar features were implemented

---

## Version History

- **v0.1.0** (2025-11-23): Initial project bootstrap, comprehensive documentation created

---

**Last Updated**: 2025-11-23
**Maintained By**: Project team + AI agents (Claude Code)

This document should be updated whenever significant architectural decisions are made or new patterns are established.
