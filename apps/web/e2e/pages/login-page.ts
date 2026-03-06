import type { Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto('/login');
  }

  async signInViaApi(email: string, password: string): Promise<void> {
    const response = await this.page.request.post('/api/auth/sign-in/email', {
      data: { email, password },
    });
    if (!response.ok()) {
      throw new Error(`Sign-in API call failed: ${response.status()}`);
    }
  }

  async fillAndSubmit(email: string, password: string): Promise<void> {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: /sign in/i }).click();
  }
}
