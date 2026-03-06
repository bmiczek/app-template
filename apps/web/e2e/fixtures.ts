import { test as base, type Page } from '@playwright/test';
import { LoginPage } from './pages/login-page';

export { expect } from '@playwright/test';

export const TEST_USER = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'TestPassword123!',
} as const;

interface Fixtures {
  authedPage: Page;
  loginPage: LoginPage;
}

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  authedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.signInViaApi(TEST_USER.email, TEST_USER.password);
    await use(page);
  },
});
