import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Esthetically Clear/i);
});

test('homepage has main content', async ({ page }) => {
  await page.goto('/');
  // Verify the page has loaded with some content
  await expect(page.locator('body')).toBeVisible();
});
