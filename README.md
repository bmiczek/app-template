# App Template

Full-stack TypeScript monorepo with TanStack Start, Prisma, and PostgreSQL.

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

# 4. Start development server
pnpm dev
```

**App:** http://localhost:3000

---

## Project Structure

```
apps/
  web/                # TanStack Start (React 19, SSR, server routes)
    src/routes/       # File-based routing (pages + API routes)
    src/lib/          # Auth, utilities
packages/
  database/           # Prisma ORM
```

---

## Documentation

| Document               | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| [CLAUDE.md](CLAUDE.md) | AI agent guide - commands, patterns, conventions |

---

## Tech Stack

**App:** TanStack Start, TanStack Query/Router/Form, React 19, TypeScript
**Auth:** Better Auth (email/password)
**Database:** Prisma, PostgreSQL
**Infrastructure:** Docker Compose, pnpm workspaces

---

## Common Issues

**Port in use:**

```bash
lsof -i :3000  # Find PID, then: kill -9 <PID>
```

**Module not found:**

```bash
pnpm install && pnpm --filter database db:generate
```

**Docker issues:**

```bash
docker compose logs -f postgres
docker compose restart postgres
```

---

## License

MIT
