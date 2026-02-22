# Database

PostgreSQL + Prisma with `@prisma/adapter-pg` (native pg pool). Consumed by `apps/web` as `@app-template/database`.

## Patterns

- **Field naming:** camelCase in Prisma models, snake_case in the database via `@map`.
- **IDs:** `cuid()` for all primary keys.
- **Client singleton:** Global instance in `src/index.ts` prevents multiple connections during hot reload. Re-exports all Prisma types.
- **Better Auth models:** User, Session, Account, Verification follow Better Auth's expected structure. Don't rename fields without checking Better Auth compatibility.
- **Seeding:** `prisma/seed.ts` creates a dev admin user (`admin@example.com` / `admin123`). Guarded against running in production.

## Changing the Schema

1. Edit `prisma/schema.prisma`
2. `pnpm --filter database db:migrate` (creates migration + regenerates client)
3. Commit both schema and migration file — never manually edit migrations
