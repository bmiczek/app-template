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

### Issue 2: Example CRUD Endpoints with Zod Validation

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

### Issue 3: TanStack Query Configuration

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

### Issue 4: API Hooks and Data Fetching Patterns

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
- Depends on TanStack Query being configured (Issue 3)
- Should work with the auth integration for authenticated requests
- Backend API follows `{ success, data, error }` response format

**Acceptance Criteria:**
- Clear patterns established for fetching and mutating data
- Hooks handle loading, error, and success states
- Integration with auth for authenticated endpoints
- TypeScript types are properly inferred

---

### Issue 5: TanStack Form Integration

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

## P2 - Medium Priority

### Issue 6: Email Verification Flow

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

### Issue 7: Password Reset Flow

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
- Depends on email sending infrastructure (possibly from Issue 6)
- Security considerations: token expiration, rate limiting

**Acceptance Criteria:**
- Users can request a password reset
- Reset email contains a secure, time-limited link
- Users can set a new password via the reset flow
- Old sessions are invalidated after password change

---

### Issue 8: Structured Logging with Pino

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

### Issue 9: UI Component Library Setup

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
- May require Tailwind CSS (see Issue 10)
- Components should be customizable to match project design

**Acceptance Criteria:**
- Component library is installed and configured
- At least basic components (Button, Input, Card) are available
- Components are accessible and keyboard-navigable
- Theming/customization is possible

---

### Issue 10: Tailwind CSS Styling Setup

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

### Issue 11: Error Boundaries and Toast Notifications

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

### Issue 12: Analytics and Monitoring with Sentry

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
