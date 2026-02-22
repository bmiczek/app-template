import { expect, test, type Page } from '@playwright/test';

/** Seed user credentials (must match packages/database/prisma/seed.ts) */
const TEST_NAME = 'Test User';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'TestPassword123!';

/** Sign in the seed test user via the Better Auth API. */
async function signInViaApi(page: Page): Promise<void> {
  const response = await page.request.post('/api/auth/sign-in/email', {
    data: { email: TEST_EMAIL, password: TEST_PASSWORD },
  });
  expect(response.ok()).toBe(true);
}

test.describe('dashboard', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login**');

    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('dashboard');
  });

  test('shows user info when authenticated', async ({ page }) => {
    await signInViaApi(page);
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(TEST_NAME)).toBeVisible();
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  });
});
