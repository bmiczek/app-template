import { hashPassword } from 'better-auth/crypto';
import 'dotenv/config';
import { prisma } from '../src/index';

async function main(): Promise<void> {
  // Guard: only run in development
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is not allowed in production');
  }

  console.log('Seeding database...');

  // Clear existing data (cascade deletes sessions/accounts)
  await prisma.verification.deleteMany();
  await prisma.user.deleteMany();

  // Hash passwords using Better Auth's utility
  const adminHash = await hashPassword('admin123');
  const testHash = await hashPassword('TestPassword123!');

  // Create admin user with credential account
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      emailVerified: true,
      accounts: {
        create: {
          providerId: 'credential',
          accountId: 'admin@example.com',
          password: adminHash,
        },
      },
    },
    include: { accounts: true },
  });

  // Create test user for e2e tests
  const testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      emailVerified: true,
      accounts: {
        create: {
          providerId: 'credential',
          accountId: 'test@example.com',
          password: testHash,
        },
      },
    },
    include: { accounts: true },
  });

  console.log('Created admin user:', admin.email, '(password: admin123)');
  console.log('Created test user:', testUser.email, '(password: TestPassword123!)');
  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
