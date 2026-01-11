// Shared TypeScript types

/**
 * Standard API response wrapper for consistent response format across all endpoints.
 * @template T - The type of the data payload
 */
export interface ApiResponse<T = unknown> {
  /** Indicates whether the request was successful */
  success: boolean;
  /** The response payload (present on success) */
  data?: T;
  /** Error message (present on failure) */
  error?: string;
}

/**
 * Parameters for paginated list requests.
 */
export interface PaginationParams {
  /** The page number (1-indexed) */
  page: number;
  /** Number of items per page */
  limit: number;
}

/**
 * Paginated response wrapper for list endpoints.
 * @template T - The type of items in the data array
 */
export interface PaginatedResponse<T> {
  /** Array of items for the current page */
  data: T[];
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    page: number;
    /** Items per page */
    limit: number;
    /** Total number of items */
    total: number;
    /** Total number of pages */
    totalPages: number;
  };
}

/**
 * Base user type (will be extended with Prisma types).
 */
export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Session information with associated user.
 */
export interface Session {
  user: User;
  expiresAt: Date;
}

/**
 * Response from the /api/auth/status endpoint.
 */
export interface AuthStatusResponse {
  /** Whether the user is currently authenticated */
  authenticated: boolean;
  /** User details (null if not authenticated) */
  user: {
    id: string;
    email: string;
    name: string | null;
    emailVerified: boolean | null;
    image?: string | null;
  } | null;
  /** Session details (null if not authenticated) */
  session: {
    expiresAt: Date;
  } | null;
}
