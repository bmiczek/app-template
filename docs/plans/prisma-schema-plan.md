# Plan: Create Prisma Schema for Better Auth

## Summary

Create the Prisma schema with User, Session, Account, and Verification models required for Better Auth integration. This is a P0 blocker that's currently preventing CI from running.

## Files to Create/Modify

1. **Create**: `packages/database/prisma/schema.prisma` - Main Prisma schema file
2. **Modify**: `.github/workflows/ci.yml` - Uncomment Prisma generate step (lines 40-42)

## Schema Design (Based on Better Auth Documentation)

The schema follows Better Auth's official model structure from Context7 documentation, adapted for Prisma with PostgreSQL:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false) @map("email_verified")
  image         String?
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  sessions      Session[]
  accounts      Account[]

  @@map("user")
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime @map("expires_at")
  token     String   @unique
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  ipAddress String?  @map("ip_address")
  userAgent String?  @map("user_agent")

  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id @default(cuid())
  accountId             String    @map("account_id")
  providerId            String    @map("provider_id")
  userId                String    @map("user_id")
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?   @map("access_token")
  refreshToken          String?   @map("refresh_token")
  idToken               String?   @map("id_token")
  accessTokenExpiresAt  DateTime? @map("access_token_expires_at")
  refreshTokenExpiresAt DateTime? @map("refresh_token_expires_at")
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime @map("expires_at")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  @@index([identifier])
  @@map("verification")
}
```

## Key Design Decisions

1. **ID Strategy**: Using `cuid()` for IDs (Better Auth compatible, collision-resistant)
2. **Field Naming**: camelCase in Prisma, snake_case in DB (per CLAUDE.md)
3. **Table Naming**: Singular (`user`, `session`, etc.) matching Better Auth's default `usePlural: false`
4. **Cascade Deletes**: Sessions and Accounts cascade delete when User is deleted
5. **Indexes**: Added on foreign keys (`userId`) and lookup fields (`identifier`)
6. **All required Better Auth fields included** per official documentation

## Implementation Steps

1. Create `packages/database/prisma/schema.prisma` with the schema above
2. Run `pnpm --filter database db:migrate` to create initial migration
3. Run `pnpm --filter database db:generate` to generate Prisma client
4. Uncomment Prisma generate in `.github/workflows/ci.yml` (lines 40-42)
5. Run `pnpm type-check` to verify everything compiles

## Post-Implementation Verification

- [ ] `pnpm --filter database db:generate` succeeds
- [ ] `pnpm type-check` passes
- [ ] Prisma types are exported from `@app-template/database`
