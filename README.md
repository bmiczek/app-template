# Esthetically Clear

A modern full-stack TypeScript application built with TanStack Start, Hono, Prisma, and PostgreSQL.

## 🚀 Quick Start

**New to this project?** Check out the [Quick Start Guide](docs/QUICK_START.md) for step-by-step setup instructions.

**TL;DR:**
```bash
pnpm install                    # Install dependencies
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
docker compose up -d            # Start PostgreSQL
pnpm dev                        # Start dev servers
```

Visit http://localhost:3000 for frontend and http://localhost:3001 for backend.

## Tech Stack

### Frontend
- **[TanStack Start](https://tanstack.com/start)** - Full-stack React framework with SSR
- **[TanStack Query](https://tanstack.com/query)** - Powerful data fetching and caching
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing (integrated with Start)
- **[TanStack Form](https://tanstack.com/form)** - Type-safe form management
- **[TanStack Table](https://tanstack.com/table)** - Headless table library
- **React 19** - Latest React with Server Components
- **TypeScript** - Type safety throughout

### Backend
- **[Hono](https://hono.dev/)** - Ultrafast web framework for the Edge
- **[Prisma](https://www.prisma.io/)** - Next-generation ORM
- **PostgreSQL** - Robust relational database
- **[Better Auth](https://www.better-auth.com/)** - Modern authentication library
- **TypeScript** - End-to-end type safety

### Infrastructure
- **Docker Compose** - Local development environment
- **pnpm Workspaces** - Monorepo management
- **Railway** - Backend and database hosting
- **Vercel** - Frontend hosting

## Project Structure

```
esthetically-clear/
├── apps/
│   ├── frontend/          # TanStack Start application
│   │   ├── app/
│   │   │   ├── routes/    # File-based routing
│   │   │   ├── components/
│   │   │   └── utils/
│   │   └── package.json
│   │
│   └── backend/           # Hono API server
│       ├── src/
│       │   ├── routes/    # API routes
│       │   ├── middleware/
│       │   ├── db/        # Prisma client
│       │   └── index.ts
│       └── package.json
│
├── packages/
│   ├── shared/            # Shared types and utilities
│   └── database/          # Prisma schema and migrations
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── docker-compose.yml     # Local PostgreSQL setup
├── package.json           # Root package.json
├── pnpm-workspace.yaml    # Workspace configuration
└── README.md
```

## Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x (install with `npm install -g pnpm`)
- **Docker** and **Docker Compose** (for local database)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Start Local Database

```bash
docker compose up -d
```

This starts a PostgreSQL container accessible at `localhost:5432`.

### 3. Configure Environment Variables

Create `.env` files in the appropriate locations:

**`apps/backend/.env`:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/esthetically_clear"
NODE_ENV="development"
PORT=3001
FRONTEND_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key-here-change-in-production"
BETTER_AUTH_URL="http://localhost:3001"
```

**`apps/frontend/.env`:**
```env
VITE_API_URL="http://localhost:3001"
```

### 4. Run Database Migrations

```bash
pnpm --filter database db:migrate
```

### 5. Start Development Servers

```bash
# Start all services
pnpm dev

# Or start individually:
pnpm --filter frontend dev    # Frontend on http://localhost:3000
pnpm --filter backend dev     # Backend on http://localhost:3001
```

## Development Scripts

### Root Level
- `pnpm dev` - Start all development servers
- `pnpm build` - Build all apps
- `pnpm test` - Run all tests
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages

### Database (packages/database)
- `pnpm db:migrate` - Run Prisma migrations
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Seed the database
- `pnpm db:reset` - Reset database (careful!)

### Backend (apps/backend)
- `pnpm dev` - Start dev server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests

### Frontend (apps/frontend)
- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm start` - Preview production build
- `pnpm test` - Run tests

## Docker Compose Services

### PostgreSQL
- **Port:** 5432
- **Username:** postgres
- **Password:** postgres
- **Database:** esthetically_clear
- **Volume:** `postgres-data` (persisted)

To manage the database:
```bash
docker compose up -d      # Start database
docker compose down       # Stop database
docker compose down -v    # Stop and remove volumes (deletes data!)
docker compose logs -f    # View logs
```

## Authentication

The app uses **Better Auth** for authentication with the following features:

- Email/Password authentication
- Session management
- CSRF protection
- Secure cookie handling
- Social providers (configurable)
- Two-factor authentication (optional)

See the Better Auth documentation for configuration options.

## API Documentation

The Hono backend exposes the following endpoints:

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session

### Protected Routes
All routes under `/api/*` (except auth) require authentication.

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Framework Preset:** TanStack Start (or Vite)
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `pnpm build`
   - **Output Directory:** `.output` or `dist`
3. Add environment variables:
   - `VITE_API_URL` - Your Railway backend URL

### Backend + Database (Railway)

1. Create a new project on Railway
2. Add PostgreSQL database service
3. Add web service from GitHub:
   - **Root Directory:** `apps/backend`
   - **Build Command:** `pnpm install && pnpm build`
   - **Start Command:** `pnpm start`
4. Add environment variables:
   - `DATABASE_URL` - Automatically set by Railway
   - `FRONTEND_URL` - Your Vercel URL
   - `BETTER_AUTH_SECRET` - Generate a secure secret
   - `BETTER_AUTH_URL` - Your Railway backend URL
5. Run migrations in Railway terminal:
   ```bash
   pnpm --filter database db:migrate
   ```

## Database Schema

The Prisma schema is located in `packages/database/prisma/schema.prisma`.

To modify the schema:
1. Edit `schema.prisma`
2. Create a migration: `pnpm db:migrate`
3. The Prisma client will auto-regenerate

## Type Safety

This project maintains end-to-end type safety:

- **Shared types** in `packages/shared` used by both frontend and backend
- **Prisma** generates types from database schema
- **Hono RPC** enables type-safe API calls from frontend
- **TanStack Router** provides type-safe routing and params

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Run tests and type checking: `pnpm test && pnpm type-check`
4. Commit your changes
5. Push and create a pull request

## Environment Variables Reference

### Required for Backend
- `DATABASE_URL` - PostgreSQL connection string
- `BETTER_AUTH_SECRET` - Secret key for auth tokens (32+ characters)
- `BETTER_AUTH_URL` - Backend URL for auth callbacks

### Required for Frontend
- `VITE_API_URL` - Backend API URL

### Optional
- `NODE_ENV` - Environment (development/production)
- `PORT` - Backend port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS

## Troubleshooting

### Database connection issues
```bash
# Check if PostgreSQL is running
docker compose ps

# Restart database
docker compose restart postgres

# View logs
docker compose logs postgres
```

### Port already in use
```bash
# Find process using port 3000 or 3001
lsof -i :3000
lsof -i :3001

# Kill the process
kill -9 <PID>
```

### Prisma client not found
```bash
# Regenerate Prisma client
pnpm --filter database db:generate
```

### Type errors after dependency updates
```bash
# Clean install
pnpm store prune
rm -rf node_modules
rm pnpm-lock.yaml
pnpm install
```

## Resources

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Hono Documentation](https://hono.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## License

MIT

## Support

For questions or issues, please open a GitHub issue.
