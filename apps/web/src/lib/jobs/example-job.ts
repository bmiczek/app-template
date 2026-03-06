import { boss } from './index';

interface WelcomeEmailPayload {
  userId: string;
  email: string;
  name: string;
}

/**
 * Schedules a welcome email job to be processed asynchronously.
 * Call this after user signup.
 */
export async function scheduleWelcomeEmail(payload: WelcomeEmailPayload): Promise<void> {
  await boss.send('send-welcome-email', payload);
}

/**
 * Processes a welcome email job.
 * Register with: await boss.work('send-welcome-email', processWelcomeEmail)
 */
export async function processWelcomeEmail(job: { data: WelcomeEmailPayload }): Promise<void> {
  const { email, name } = job.data;
  const { sendEmail } = await import('@/lib/email');
  const { welcomeEmailHtml } = await import('@/lib/email/templates');
  await sendEmail({
    to: email,
    subject: `Welcome, ${name}!`,
    html: welcomeEmailHtml(name),
  });
}
