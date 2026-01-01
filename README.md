# Esthetically Clear

Full-stack TypeScript monorepo with TanStack Start, Hono, Prisma, and PostgreSQL.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 24+ (project includes `.nvmrc` - run `nvm install` to use correct version)
- pnpm 9+ (`npm install -g pnpm`)
- Docker

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 3. Start PostgreSQL
docker compose up -d

# 4. Start development servers
pnpm dev
```

**Ports:** Frontend: 3000 | Backend: 3001

### Verify Installation

- Frontend: http://localhost:3000
- Backend health: http://localhost:3001/health
- Backend API: http://localhost:3001/api

---

## 📁 Project Structure

```
apps/
  frontend/           # TanStack Start (React 19, SSR)
    src/routes/       # File-based routing
  backend/            # Hono API server
    src/routes/       # API routes
packages/
  database/           # Prisma ORM
  shared/             # Shared types
```

---

## 📚 Documentation

| Document                                                    | Purpose                                          |
| ----------------------------------------------------------- | ------------------------------------------------ |
| [CLAUDE.md](CLAUDE.md)                                      | AI agent guide - commands, patterns, conventions |
| [development-roadmap.md](docs/plans/development-roadmap.md) | Task priorities and progress                     |

---

## 🛠️ Tech Stack

**Frontend:** TanStack Start, TanStack Query/Router/Form, React 19, TypeScript
**Backend:** Hono, Prisma, PostgreSQL, Better Auth
**Infrastructure:** Docker Compose, pnpm workspaces

---

## 🐛 Common Issues

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

## 📄 License

MIT
