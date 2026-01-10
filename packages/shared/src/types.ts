// Shared TypeScript types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// User types (will be extended with Prisma types)
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  expiresAt: Date;
}

// Auth request types
export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

// Auth response types
export interface AuthStatusResponse {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
  } | null;
  session: {
    expiresAt: Date;
  } | null;
}
