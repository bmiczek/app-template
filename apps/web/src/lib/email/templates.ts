export function welcomeEmailHtml(name: string): string {
  return `<h1>Welcome, ${name}!</h1><p>Your account has been created successfully.</p>`;
}

export function passwordResetEmailHtml(resetUrl: string): string {
  return `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>`;
}

export function verifyEmailHtml(verifyUrl: string): string {
  return `<p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>`;
}
