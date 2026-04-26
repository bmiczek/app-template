import { ScryptOptions, randomBytes, scrypt } from 'node:crypto';

import 'dotenv/config';
import { prisma } from '../src/index';

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const SCRYPT_OPTIONS: ScryptOptions = { cost: 16384, blockSize: 8, parallelization: 1 };

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString('hex');
  const key = await new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, KEY_LENGTH, SCRYPT_OPTIONS, (err, derivedKey) =>
      err ? reject(err) : resolve(derivedKey)
    )
  );
  return `${salt}:${key.toString('hex')}`;
}

async function main(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Seeding is not allowed in production');
  }

  console.log('Seeding database...');

  await Promise.all([prisma.verification.deleteMany(), prisma.user.deleteMany()]);

  const [adminHash, testHash] = await Promise.all([
    hashPassword('admin123'),
    hashPassword('TestPassword123!'),
  ]);

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
