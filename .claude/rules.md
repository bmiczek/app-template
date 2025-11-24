# Project-Specific Rules for AI Agents

**These rules are automatically loaded for all AI agents working on this project.**

---

## Required Reading

Before starting any task, AI agents MUST read:
1. **[CLAUDE.md](../CLAUDE.md)** - Comprehensive technical guide with patterns and conventions
2. **[docs/plans/development-roadmap.md](../docs/plans/development-roadmap.md)** - Current priorities and task status

---

## Critical Project Rules

### Package Manager
- ✅ **ALWAYS use `pnpm`** - Never use npm or yarn
- ✅ Use `pnpm --filter <workspace>` for workspace-specific commands
- ✅ Example: `pnpm --filter backend add hono`

### Git Commits
- ✅ **Proactively suggest commits** at logical milestones (feature complete, docs updated, bug fixed)
- ✅ **Always ask before committing** - Explain what will be committed and wait for user confirmation
- ✅ Use conventional commit format: `type: description` (see CLAUDE.md for details)
- ✅ Include footer: "🤖 Generated with [Claude Code](https://claude.com/claude-code)\n\nCo-Authored-By: Claude <noreply@anthropic.com>"

### Prisma Database
- ✅ After schema changes: Always run `pnpm --filter database db:migrate`
- ✅ Never edit migration files manually
- ✅ Use `db:push` only for rapid prototyping, never in production

### Type Safety
- ✅ Maintain end-to-end type safety
- ✅ Put shared types in `packages/shared/src/types.ts`
- ✅ Never use `any` - prefer `unknown` and type narrowing
- ✅ Run `pnpm type-check` before suggesting commits

### Documentation
- ✅ Update `docs/plans/development-roadmap.md` as tasks are completed
- ✅ Add new tasks discovered during work to the roadmap
- ✅ Update CLAUDE.md when establishing new patterns or conventions

### Task Management
- ✅ Use TodoWrite tool for multi-step tasks within a session
- ✅ Mark todos complete immediately after finishing
- ✅ Keep exactly ONE todo in_progress at a time

---

## Code Style Conventions

### File Locations
- Backend routes: `apps/backend/src/routes/`
- Frontend routes: `apps/frontend/app/routes/` (file-based routing)
- Shared types: `packages/shared/src/`
- Prisma schema: `packages/database/prisma/schema.prisma`

### TypeScript
- Use PascalCase for interfaces and types
- Use camelCase for functions and variables
- Always type function parameters and return values
- Use `interface` over `type` for object shapes

### React Components
- Use named function components
- Define Props interface above component
- Export component as default only for routes

### API Responses
- Use consistent response format from `packages/shared/src/types.ts`
- Structure: `{ success: boolean, data?: T, error?: string }`

---

## Workflow

1. **Start**: Read CLAUDE.md and development-roadmap.md
2. **Plan**: Use TodoWrite for multi-step tasks
3. **Execute**: Follow patterns in CLAUDE.md
4. **Test**: Verify changes work (run type-check when applicable)
5. **Update**: Mark todos complete, update roadmap
6. **Commit**: Suggest commit at logical breakpoint
7. **Document**: Update docs if patterns changed

---

## Common Commands (Quick Reference)

```bash
# Development
pnpm dev                              # All servers
pnpm --filter backend dev             # Backend only
pnpm --filter frontend dev            # Frontend only

# Database
pnpm --filter database db:migrate     # Run migrations
pnpm --filter database db:studio      # Open Prisma Studio
pnpm --filter database db:generate    # Generate client

# Quality
pnpm type-check                       # Type check all
pnpm build                            # Build all
pnpm test                             # Test all
```

---

## What Makes a Good Commit

✅ **Good commit moments**:
- Completed a full feature (auth, new endpoint, UI component)
- Created or significantly updated documentation
- Fixed a bug
- Completed a set of related changes
- About to switch to a different area of work

❌ **Bad commit moments**:
- Code is broken or has type errors
- In the middle of a feature
- Made only trivial changes

---

## Remember

- **Ask, don't assume** - When in doubt about approach, ask the user
- **Document decisions** - Update CLAUDE.md when establishing new patterns
- **Keep roadmap current** - It's a living document
- **Commit frequently** - At logical breakpoints, not just at end of session
- **Read before writing** - Check existing code patterns before adding new code

---

**For detailed patterns and examples, always refer to [CLAUDE.md](../CLAUDE.md)**
