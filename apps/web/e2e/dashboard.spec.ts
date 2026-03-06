import { expect, test, TEST_USER } from './fixtures';

test.describe('dashboard', () => {
  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForURL('**/login**');

    expect(page.url()).toContain('/login');
    expect(page.url()).toContain('dashboard');
  });

  test('shows user info when authenticated', async ({ authedPage }) => {
    await authedPage.goto('/dashboard');

    await expect(authedPage.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(authedPage.getByText(TEST_USER.name)).toBeVisible();
    await expect(authedPage.getByText(TEST_USER.email)).toBeVisible();
  });
});
