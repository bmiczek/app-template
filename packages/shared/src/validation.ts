import { z } from 'zod';

/**
 * Password validation schema.
 * Enforces minimum and maximum length requirements.
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

/**
 * Email validation schema.
 */
export const emailSchema = z.string().email('Invalid email address');

/**
 * Validation schema for user sign-up requests.
 */
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
});

/**
 * Validation schema for user sign-in requests.
 */
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

/**
 * Inferred type for sign-up request validation.
 */
export type SignUpInput = z.infer<typeof signUpSchema>;

/**
 * Inferred type for sign-in request validation.
 */
export type SignInInput = z.infer<typeof signInSchema>;
