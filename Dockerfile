# Stage 1: Install all dependencies
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
WORKDIR /app
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# Stage 2: Generate Prisma client and build the app
FROM deps AS builder
COPY . .
RUN pnpm --filter web db:generate
RUN pnpm --filter web build

# Stage 3: Production runtime image
FROM node:22-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate
WORKDIR /app
ENV NODE_ENV=production

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/web/package.json ./apps/web/

# Install production-only dependencies
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

COPY --from=builder /app/apps/web/dist ./apps/web/dist
COPY --from=builder /app/apps/web/prisma ./apps/web/prisma

WORKDIR /app/apps/web
EXPOSE 3000

CMD ["node", "dist/server/server.js"]
