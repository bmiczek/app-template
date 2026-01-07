import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use process.env with fallback to allow prisma generate
    // to run in CI without DATABASE_URL (it doesn't need a connection)
    url: process.env.DATABASE_URL ?? '',
  },
});
