# Development Roadmap

**Last Updated:** 2025-12-31

## Priority Levels

- 🔴 **P0**: Critical - Required for basic functionality
- 🟡 **P1**: High - Important features needed soon
- 🟢 **P2**: Medium - Nice to have, can be deferred
- 🔵 **P3**: Low - Future enhancements

---

## ✅ Completed

- [x] Monorepo structure (pnpm workspaces, apps/, packages/)
- [x] Frontend skeleton (TanStack Start with file-based routing)
- [x] Backend skeleton (Hono with health check endpoint)
- [x] Docker Compose for PostgreSQL
- [x] Environment variable templates (.env.example)
- [x] GitHub Actions CI (build, type-check, test)
- [x] E2E testing infrastructure (Playwright)
- [x] CI E2E test integration with artifact uploads
- [x] ESLint + Prettier configuration
- [x] Pre-commit hooks (lint-staged)

---

## 🔴 P0 - Critical

### Database & ORM

- [ ] **Create Prisma schema** - BLOCKING CI (Prisma generate commented out)
  - User, Session, Account, Verification models for Better Auth
  - Run migration: `pnpm --filter database db:migrate`
  - Re-enable Prisma generate in `.github/workflows/ci.yml`

- [ ] **Database seed file** (`packages/database/prisma/seed.ts`)

### Authentication

- [ ] **Backend auth setup**
  - Config: `apps/backend/src/lib/auth.ts`
  - Routes: `apps/backend/src/routes/auth.ts` (signup, signin, signout, session)
  - Middleware: `apps/backend/src/middleware/auth.ts`

- [ ] **Frontend auth integration**
  - API client with CSRF handling
  - Auth hooks (useAuth, useSession)
  - Login/Signup forms and routes

---

## 🟡 P1 - High Priority

### API Development

- [ ] API versioning (`/api/v1` route group)
- [ ] Example CRUD endpoints with Zod validation
- [ ] Global error handler middleware

### Frontend Development

- [ ] TanStack Query configuration (QueryClient, devtools)
- [ ] API hooks (useQuery, useMutation patterns)
- [ ] TanStack Form integration

### Developer Experience

- [ ] API documentation (OpenAPI/Swagger)

---

## 🟢 P2 - Medium Priority

### Deployment

- [ ] Railway configuration (backend + database)
- [ ] Vercel configuration (frontend)

### Enhanced Features

- [ ] Email verification flow
- [ ] Password reset
- [ ] Rate limiting
- [ ] Structured logging (Pino)

### UI/UX

- [ ] UI component library (shadcn/ui or similar)
- [ ] Styling solution (Tailwind CSS)
- [ ] Error boundaries and toast notifications

---

## 🔵 P3 - Low Priority

- [ ] WebSocket support
- [ ] File upload functionality
- [ ] Background job processing
- [ ] Analytics/monitoring (Sentry)

---

## ⏸️ Deferred

- Database backup strategy
- Multi-tenancy support
- Internationalization (i18n)
- Advanced caching
- Security audit
- Accessibility improvements
