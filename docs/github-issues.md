# GitHub Issues for App Template

Generated from `docs/plans/development-roadmap.md`

---

## P0 - Critical

### Issue 1: Frontend Auth Integration

**Title:** Implement frontend authentication with Better Auth

**Labels:** `priority: critical`, `frontend`, `authentication`

**Description:**

The backend authentication is complete (see `apps/backend/src/lib/auth.ts` and `apps/backend/src/routes/auth.ts`). We need to integrate authentication on the frontend.

**Goals:**
- Create an API client that handles CSRF tokens properly when communicating with the backend auth endpoints
- Build React hooks for auth state management (useAuth, useSession, or similar patterns)
- Implement Login and Signup pages/forms
- Handle auth state persistence and session management

**Context:**
- Backend runs on port 3001, frontend on port 3000
- Backend auth endpoints: `/api/auth/signup`, `/api/auth/signin`, `/api/auth/signout`, `/api/auth/session`, `/api/auth/status`
- This is a TanStack Start (Vite-based) frontend with React 19
- Consider how auth state should integrate with TanStack Router for protected routes

**Acceptance Criteria:**
- Users can sign up, sign in, and sign out
- Auth state is accessible throughout the app
- Protected routes redirect unauthenticated users
- Session persists across page refreshes

---

## P1 - High Priority

### Issue 2: API Versioning

**Title:** Add API versioning support with /api/v1 route group

**Labels:** `priority: high`, `backend`, `api`

**Description:**

Implement API versioning to allow for future breaking changes without disrupting existing clients.

**Goals:**
- Restructure backend routes under a versioned path (e.g., `/api/v1/...`)
- Consider how to handle version negotiation or migration paths
- Update any existing endpoints to use the new versioned structure

**Context:**
- Backend uses Hono framework (`apps/backend/src/index.ts`)
- Current routes are registered directly on the app
- Research Hono best practices for route grouping and versioning

**Acceptance Criteria:**
- All API endpoints are accessible under `/api/v1/`
- Structure allows for future `/api/v2/` additions
- Health check endpoint remains accessible (can be unversioned)

---

### Issue 3: Example CRUD Endpoints with Zod Validation

**Title:** Create example CRUD endpoints demonstrating Zod validation patterns

**Labels:** `priority: high`, `backend`, `api`, `documentation`

**Description:**

Build a complete CRUD example that showcases the recommended patterns for this codebase. This will serve as a reference implementation for future development.

**Goals:**
- Create a sample resource (e.g., "posts", "notes", or "tasks") with full CRUD operations
- Implement request validation using Zod
- Demonstrate proper error handling and response formats
- Show how to integrate with Prisma for database operations

**Context:**
- Hono has Zod validation middleware available
- Prisma client is available from `@app-template/database`
- Response format convention: `{ success: boolean, data?: T, error?: string }`
- May need to add a model to the Prisma schema

**Acceptance Criteria:**
- Create, Read (single + list), Update, Delete endpoints work correctly
- All inputs are validated with Zod
- Validation errors return helpful messages
- Database operations use Prisma
- Could serve as a template for future endpoints

---

### Issue 4: TanStack Query Configuration

**Title:** Set up TanStack Query with QueryClient and devtools

**Labels:** `priority: high`, `frontend`, `data-fetching`

**Description:**

Configure TanStack Query for data fetching and caching on the frontend.

**Goals:**
- Install and configure TanStack Query
- Set up QueryClient with sensible defaults
- Add React Query Devtools for development
- Integrate with TanStack Start's SSR capabilities if applicable

**Context:**
- Frontend uses TanStack Start (Vite-based) with React 19
- Consider how Query integrates with TanStack Router loaders
- Research current best practices for TanStack Start + Query integration

**Acceptance Criteria:**
- QueryClient is properly configured and provided to the app
- Devtools are available in development mode
- Basic query functionality works with backend API

---

### Issue 5: API Hooks and Data Fetching Patterns

**Title:** Create reusable API hooks using TanStack Query patterns

**Labels:** `priority: high`, `frontend`, `data-fetching`

**Description:**

Build a set of reusable hooks and patterns for API communication.

**Goals:**
- Create a base API client/fetch wrapper
- Build example useQuery hooks for data fetching
- Build example useMutation hooks for data modification
- Establish patterns for error handling and loading states

**Context:**
- Depends on TanStack Query being configured (Issue 4)
- Should work with the auth integration for authenticated requests
- Backend API follows `{ success, data, error }` response format

**Acceptance Criteria:**
- Clear patterns established for fetching and mutating data
- Hooks handle loading, error, and success states
- Integration with auth for authenticated endpoints
- TypeScript types are properly inferred

---

### Issue 6: TanStack Form Integration

**Title:** Set up TanStack Form for form handling

**Labels:** `priority: high`, `frontend`, `forms`

**Description:**

Integrate TanStack Form for form state management and validation.

**Goals:**
- Install and configure TanStack Form
- Create example forms demonstrating the patterns
- Set up validation (consider Zod integration for schema sharing)
- Integrate with useMutation for form submissions

**Context:**
- TanStack Form is the recommended form library for this stack
- Could share Zod schemas between frontend and backend
- Login/Signup forms from auth integration could use this

**Acceptance Criteria:**
- TanStack Form is configured and working
- At least one example form demonstrates the pattern
- Validation provides good user feedback
- Forms integrate cleanly with API mutations

---

### Issue 7: API Documentation with OpenAPI/Swagger

**Title:** Add OpenAPI/Swagger documentation for the API

**Labels:** `priority: high`, `backend`, `documentation`, `developer-experience`

**Description:**

Generate and serve API documentation to improve developer experience.

**Goals:**
- Choose and integrate an OpenAPI documentation solution for Hono
- Document existing endpoints (auth, health, any CRUD examples)
- Serve interactive documentation (Swagger UI or similar)
- Consider auto-generation from route definitions and Zod schemas

**Context:**
- Hono has several OpenAPI integration options (hono-openapi, zod-openapi, etc.)
- Zod schemas could potentially be converted to OpenAPI specs
- Documentation should be accessible in development

**Acceptance Criteria:**
- OpenAPI spec is generated for all endpoints
- Interactive documentation is accessible at a known URL
- Documentation updates as endpoints change

---

## P2 - Medium Priority

### Issue 8: Railway Deployment Configuration

**Title:** Configure Railway deployment for backend and database

**Labels:** `priority: medium`, `deployment`, `infrastructure`

**Description:**

Set up deployment configuration for Railway to host the backend API and PostgreSQL database.

**Goals:**
- Create Railway configuration files
- Configure environment variables for production
- Set up database connection and migrations
- Document the deployment process

**Context:**
- Backend is a Hono application
- Database uses Prisma with PostgreSQL
- Consider health checks and monitoring
- Research Railway's current deployment patterns for Node.js apps

**Acceptance Criteria:**
- Backend can be deployed to Railway
- Database is provisioned and connected
- Migrations run on deployment
- Environment variables are properly configured

---

### Issue 9: Vercel Deployment Configuration

**Title:** Configure Vercel deployment for frontend

**Labels:** `priority: medium`, `deployment`, `infrastructure`

**Description:**

Set up deployment configuration for Vercel to host the TanStack Start frontend.

**Goals:**
- Create Vercel configuration
- Configure build settings for TanStack Start
- Set up environment variables (API URL, etc.)
- Handle SSR/edge deployment considerations

**Context:**
- Frontend uses TanStack Start (Vite-based)
- Need to configure API proxy or CORS for production
- Research current Vercel support for TanStack Start SSR

**Acceptance Criteria:**
- Frontend can be deployed to Vercel
- SSR works correctly in production
- API communication works with backend on Railway
- Environment variables are properly configured

---

### Issue 10: Email Verification Flow

**Title:** Implement email verification for new user signups

**Labels:** `priority: medium`, `authentication`, `backend`, `frontend`

**Description:**

Add email verification to the authentication flow.

**Goals:**
- Configure email sending (research email providers compatible with Better Auth)
- Implement verification token generation and validation
- Create verification email template
- Add frontend UI for verification status and resend functionality

**Context:**
- Better Auth may have built-in email verification support
- Need to choose an email service provider
- Consider development/testing email capture (e.g., Mailhog, Ethereal)

**Acceptance Criteria:**
- New users receive verification email after signup
- Clicking verification link activates the account
- Users can request new verification emails
- Unverified users have limited access (if applicable)

---

### Issue 11: Password Reset Flow

**Title:** Implement password reset functionality

**Labels:** `priority: medium`, `authentication`, `backend`, `frontend`

**Description:**

Allow users to reset their password via email.

**Goals:**
- Implement "forgot password" endpoint
- Generate secure reset tokens with expiration
- Create password reset email
- Build frontend forms for requesting reset and setting new password

**Context:**
- Better Auth may have built-in password reset support
- Depends on email sending infrastructure (possibly from Issue 10)
- Security considerations: token expiration, rate limiting

**Acceptance Criteria:**
- Users can request a password reset
- Reset email contains a secure, time-limited link
- Users can set a new password via the reset flow
- Old sessions are invalidated after password change

---

### Issue 12: Rate Limiting

**Title:** Add rate limiting to protect API endpoints

**Labels:** `priority: medium`, `backend`, `security`

**Description:**

Implement rate limiting to prevent abuse and protect the API.

**Goals:**
- Research rate limiting solutions for Hono
- Implement rate limiting middleware
- Configure appropriate limits for different endpoint types
- Handle rate limit responses gracefully

**Context:**
- Auth endpoints should have stricter limits
- Consider per-IP vs per-user limits
- May need Redis or similar for distributed rate limiting in production

**Acceptance Criteria:**
- Rate limiting is applied to API endpoints
- Auth endpoints have appropriate stricter limits
- Rate limit exceeded returns proper HTTP 429 response
- Limits are configurable via environment

---

### Issue 13: Structured Logging with Pino

**Title:** Implement structured logging using Pino

**Labels:** `priority: medium`, `backend`, `observability`

**Description:**

Add structured logging for better debugging and monitoring.

**Goals:**
- Install and configure Pino logger
- Replace console.log with structured logging
- Add request/response logging middleware
- Configure log levels and output format

**Context:**
- Pino is a fast, low-overhead logger
- Consider pino-http for request logging
- Different log levels for development vs production

**Acceptance Criteria:**
- All logging uses Pino
- Logs include structured metadata (request ID, user ID, etc.)
- Request/response cycle is logged
- Log level is configurable

---

### Issue 14: UI Component Library Setup

**Title:** Set up shadcn/ui or similar component library

**Labels:** `priority: medium`, `frontend`, `ui`

**Description:**

Integrate a component library for consistent, accessible UI components.

**Goals:**
- Research and choose a component library (shadcn/ui recommended)
- Install and configure the library
- Set up theming and customization
- Create a few example component usages

**Context:**
- shadcn/ui is a popular choice with good accessibility
- May require Tailwind CSS (see Issue 15)
- Components should be customizable to match project design

**Acceptance Criteria:**
- Component library is installed and configured
- At least basic components (Button, Input, Card) are available
- Components are accessible and keyboard-navigable
- Theming/customization is possible

---

### Issue 15: Tailwind CSS Styling Setup

**Title:** Configure Tailwind CSS for styling

**Labels:** `priority: medium`, `frontend`, `ui`

**Description:**

Set up Tailwind CSS as the styling solution for the frontend.

**Goals:**
- Install and configure Tailwind CSS
- Set up with TanStack Start/Vite build
- Configure theme customization
- Add any useful Tailwind plugins

**Context:**
- Tailwind works well with component libraries like shadcn/ui
- Consider dark mode support from the start
- Research current Tailwind v4 vs v3 considerations

**Acceptance Criteria:**
- Tailwind CSS is installed and working
- Tailwind classes work in components
- Theme is customizable via config
- Build process includes Tailwind compilation

---

### Issue 16: Error Boundaries and Toast Notifications

**Title:** Implement error boundaries and toast notification system

**Labels:** `priority: medium`, `frontend`, `ui`, `error-handling`

**Description:**

Add error boundaries for graceful error handling and a toast system for user feedback.

**Goals:**
- Implement React error boundaries for catching render errors
- Set up a toast notification system (success, error, info messages)
- Integrate toasts with API mutation responses
- Create fallback UI for error states

**Context:**
- React 19 has updated error boundary patterns
- Toast library options: react-hot-toast, sonner, shadcn toast, etc.
- Should integrate nicely with TanStack Query error handling

**Acceptance Criteria:**
- Error boundaries catch and display errors gracefully
- Toast notifications appear for user actions
- API errors trigger appropriate toast messages
- Users can dismiss or auto-dismiss toasts

---

## P3 - Low Priority

### Issue 17: WebSocket Support

**Title:** Add WebSocket support for real-time features

**Labels:** `priority: low`, `backend`, `real-time`

**Description:**

Implement WebSocket functionality for real-time communication.

**Goals:**
- Research WebSocket solutions compatible with Hono
- Set up WebSocket server/upgrade handling
- Create example real-time feature (notifications, live updates, etc.)
- Handle authentication for WebSocket connections

**Context:**
- Hono has WebSocket support via adapters
- Consider deployment implications (Railway WebSocket support)
- May need to handle reconnection logic on frontend

**Acceptance Criteria:**
- WebSocket connections can be established
- Messages can be sent/received in real-time
- Authenticated users have WebSocket access
- Example feature demonstrates the capability

---

### Issue 18: File Upload Functionality

**Title:** Implement file upload support

**Labels:** `priority: low`, `backend`, `frontend`

**Description:**

Add the ability to upload and manage files.

**Goals:**
- Set up file upload endpoint with proper validation
- Choose storage solution (local, S3, Cloudflare R2, etc.)
- Handle file type and size restrictions
- Create frontend upload component

**Context:**
- Consider where files will be stored in production
- Need to handle multipart form data
- Consider image optimization if handling images

**Acceptance Criteria:**
- Files can be uploaded via API
- File types and sizes are validated
- Files are stored and retrievable
- Frontend provides upload UI with progress

---

### Issue 19: Background Job Processing

**Title:** Set up background job processing

**Labels:** `priority: low`, `backend`, `infrastructure`

**Description:**

Implement a system for running background jobs and async tasks.

**Goals:**
- Research job queue solutions (BullMQ, Agenda, pg-boss, etc.)
- Set up job processing infrastructure
- Create example job (email sending, data processing, etc.)
- Add monitoring/visibility for job status

**Context:**
- May need Redis or use PostgreSQL-based queues
- Consider retry logic and failure handling
- Jobs should work with existing Prisma database

**Acceptance Criteria:**
- Jobs can be queued and processed
- Failed jobs are retried appropriately
- Job status is visible/monitorable
- Example job demonstrates the pattern

---

### Issue 20: Analytics and Monitoring with Sentry

**Title:** Integrate Sentry for error tracking and monitoring

**Labels:** `priority: low`, `observability`, `frontend`, `backend`

**Description:**

Add Sentry for error tracking, performance monitoring, and debugging.

**Goals:**
- Set up Sentry projects for frontend and backend
- Configure error capture and reporting
- Add performance monitoring
- Set up source maps for readable stack traces

**Context:**
- Sentry has SDKs for both Node.js and React
- Consider what data to include/exclude for privacy
- Set up alerting for critical errors

**Acceptance Criteria:**
- Errors are captured and reported to Sentry
- Stack traces are readable with source maps
- Performance data is tracked
- Alerts notify team of critical issues

---

## Notes for Issue Creation Agent

- Each issue should be created with the specified labels
- Issues are ordered by priority (P0 > P1 > P2 > P3)
- Some issues have dependencies (noted in context) - consider creating GitHub issue links
- The agent should research current best practices before generating implementation plans
- Reference the project's CLAUDE.md for coding standards and conventions
