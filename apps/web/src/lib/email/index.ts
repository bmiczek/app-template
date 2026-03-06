import { env } from '@/env';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface EmailResult {
  id: string;
}

/**
 * Sends a transactional email via Resend.
 * When RESEND_API_KEY is not set (local dev/test), logs the email instead of sending.
 */
export async function sendEmail(payload: EmailPayload): Promise<EmailResult> {
  if (!env.RESEND_API_KEY) {
    const { logger } = await import('@/lib/logger');
    logger.info(
      { to: payload.to, subject: payload.subject },
      '[email] would send (no RESEND_API_KEY configured)'
    );
    return { id: 'dev-noop' };
  }

  const { Resend } = await import('resend');
  const resend = new Resend(env.RESEND_API_KEY);

  const from = env.EMAIL_FROM ?? 'noreply@example.com';
  const { data, error } = await resend.emails.send({ from, ...payload });

  if (error ?? !data) {
    throw new Error(`Failed to send email: ${error?.message ?? 'unknown error'}`);
  }

  return { id: data.id };
}
