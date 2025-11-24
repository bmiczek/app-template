# Esthetically Clear

A modern full-stack TypeScript application built with TanStack Start, Hono, Prisma, and PostgreSQL.

---

## 🚀 Quick Start

**New to this project?** Check out the [Quick Start Guide](docs/QUICK_START.md) for detailed setup instructions.

**Already set up?** Start developing:
```bash
docker compose up -d            # Start PostgreSQL
pnpm dev                        # Start all dev servers
```

Visit http://localhost:3000 (frontend) and http://localhost:3001 (backend).

---

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - First-time setup, prerequisites, and installation
- **[Development Roadmap](docs/plans/development-roadmap.md)** - Project tasks, priorities, and progress
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive guide for AI agents and developers

---

## 🛠️ Tech Stack

### Frontend
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework with SSR
- **[TanStack Query](https://tanstack.com/query)** - Data fetching and caching
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[TanStack Form](https://tanstack.com/form)** - Form management
- **[TanStack Table](https://tanstack.com/table)** - Headless tables
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety throughout

### Backend
- **[Hono](https://hono.dev/)** - Ultrafast web framework
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication (planned)
- **TypeScript** - End-to-end type safety

### Infrastructure
- **Docker Compose** - Local PostgreSQL
- **pnpm Workspaces** - Monorepo management
- **Railway** - Backend and database hosting (planned)
- **Vercel** - Frontend hosting (planned)

---

## 📁 Project Structure

```
esthetically-clear/
├── apps/
│   ├── frontend/          # TanStack Start application
│   │   ├── app/
│   │   │   ├── routes/    # File-based routing
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── backend/           # Hono API server
│       ├── src/
│       │   ├── routes/    # API routes
│       │   ├── middleware/
│       │   ├── lib/
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── database/          # Prisma ORM
│   │   ├── prisma/
│   │   │   └── schema.prisma
│   │   └── src/index.ts
│   │
│   └── shared/            # Shared types and constants
│       └── src/
│
├── docs/                  # Documentation
│   ├── QUICK_START.md
│   └── plans/
│       └── development-roadmap.md
│
├── docker-compose.yml     # Local PostgreSQL
├── CLAUDE.md              # AI agent guide
└── README.md              # This file
```

---

## ⚡ Essential Commands

### Development
```bash
pnpm dev                              # Start all dev servers
pnpm --filter backend dev             # Backend only
pnpm --filter frontend dev            # Frontend only
```

### Database
```bash
pnpm --filter database db:migrate     # Run migrations
pnpm --filter database db:studio      # Open Prisma Studio
pnpm --filter database db:generate    # Generate Prisma client
```

### Other
```bash
pnpm build                            # Build all packages
pnpm type-check                       # Type check everything
pnpm test                             # Run all tests
```

**More commands**: See [CLAUDE.md](CLAUDE.md#essential-commands)

---

## 🎯 Key Features

### End-to-End Type Safety
- Shared TypeScript types between frontend and backend
- Prisma generates types from database schema
- Type-safe API calls with Hono RPC (planned)
- Type-safe routing with TanStack Router

### Modern Development Experience
- Hot module replacement in both frontend and backend
- Monorepo with shared code
- Docker Compose for local database
- Comprehensive TypeScript configuration

### Production-Ready Architecture
- Server-side rendering with TanStack Start
- Efficient data fetching with TanStack Query
- Scalable API with Hono
- Robust database with Prisma and PostgreSQL

---

## 🚦 Current Status

**Project Phase:** Initial Bootstrap Complete ✅

**Implemented:**
- ✅ Monorepo structure with pnpm workspaces
- ✅ Frontend skeleton with TanStack Start
- ✅ Backend skeleton with Hono
- ✅ Docker Compose for PostgreSQL
- ✅ TypeScript configuration for all packages
- ✅ Comprehensive documentation

**Next Steps:** (See [development-roadmap.md](docs/plans/development-roadmap.md))
- Create Prisma schema with initial models
- Integrate Better Auth for authentication
- Build first API endpoints
- Add TanStack Query configuration
- Implement authentication UI

---

## 🤝 Contributing

### For Developers

1. Read the [Quick Start Guide](docs/QUICK_START.md) to set up your environment
2. Review [CLAUDE.md](CLAUDE.md) for coding patterns and conventions
3. Check [development-roadmap.md](docs/plans/development-roadmap.md) for current priorities
4. Create a feature branch: `git checkout -b feature/my-feature`
5. Make your changes following established patterns
6. Run `pnpm type-check` and `pnpm test` before committing
7. Commit with descriptive messages
8. Push and create a pull request

### For AI Agents

Read [CLAUDE.md](CLAUDE.md) for comprehensive context including:
- Architecture decisions and rationale
- Task execution patterns with code examples
- Common workflows and best practices
- Troubleshooting guide
- Project conventions

---

## 📖 Resources

### Official Documentation
- [TanStack Start](https://tanstack.com/start/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [Hono](https://hono.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Better Auth](https://www.better-auth.com/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Project Documentation
- [Quick Start Guide](docs/QUICK_START.md) - Setup and installation
- [Development Roadmap](docs/plans/development-roadmap.md) - Tasks and priorities
- [CLAUDE.md](CLAUDE.md) - Developer and AI agent guide

---

## 🐛 Troubleshooting

For common issues and solutions, see:
- [Quick Start Guide - Common Issues](docs/QUICK_START.md#common-issues-and-solutions)
- [CLAUDE.md - Troubleshooting](CLAUDE.md#troubleshooting-guide)

**Quick fixes:**
```bash
# Can't find module
pnpm install && pnpm --filter database db:generate

# Port in use
lsof -i :3000  # Find process, then: kill -9 <PID>

# Docker issues
docker compose logs -f postgres
```

---

## 📄 License

MIT

---

## 💬 Support

For questions or issues:
- Check the [documentation](#-documentation) first
- Review [troubleshooting guides](#-troubleshooting)
- Open a GitHub issue for bugs or feature requests

---

**Built with [Claude Code](https://claude.com/claude-code)**

---

*Version 0.1.0 - Initial Bootstrap*
