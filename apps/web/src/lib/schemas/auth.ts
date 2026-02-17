import { AUTH_PASSWORD } from '@/lib/auth-config';
import { z } from 'zod';

export const emailSchema = z
  .string()
  .min(1, 'Email is required.')
  .email('Please enter a valid email address.');

export const passwordSchema = z
  .string()
  .min(
    AUTH_PASSWORD.MIN_LENGTH,
    `Password must be at least ${AUTH_PASSWORD.MIN_LENGTH} characters.`
  )
  .max(
    AUTH_PASSWORD.MAX_LENGTH,
    `Password must be at most ${AUTH_PASSWORD.MAX_LENGTH} characters.`
  );

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupSchema = z
  .object({
    name: z.string().min(1, 'Name is required.'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
