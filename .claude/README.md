# .claude/ - Claude Code Configuration

This directory contains project-specific configuration for Claude Code (AI agent).

## Files in This Directory

### `rules.md` (Active Rules)
**Automatically loaded into every AI agent's context.**

Contains critical project rules that ALL AI agents must follow:
- Package manager requirements (pnpm only)
- Git commit workflow (proactive suggestions, ask before committing)
- Prisma database conventions
- Type safety requirements
- Code style conventions
- Common commands quick reference

**This file is ALWAYS active** - agents see these rules without needing to explicitly read them.

### Future Files (Optional)

You can add:

**`commands/`** - Custom slash commands
```
.claude/commands/commit.md
.claude/commands/test-feature.md
```

**`prompts/`** - Reusable prompt templates

**Skills** - Complex multi-step workflows (if using Claude Agent SDK)

## How It Works

1. **`rules.md`** is automatically injected into the agent's system prompt
2. Rules are concise and actionable (not comprehensive documentation)
3. Rules reference `CLAUDE.md` for detailed patterns and examples
4. This keeps rules short while maintaining deep documentation elsewhere

## Best Practices

### What Goes in `rules.md`
- ✅ Critical "always do this" instructions
- ✅ Project-specific constraints (use pnpm, not npm)
- ✅ Workflow patterns (when to commit, how to test)
- ✅ Quick command reference
- ❌ Detailed explanations (those go in CLAUDE.md)
- ❌ Examples of code (those go in CLAUDE.md)
- ❌ Troubleshooting guides (those go in CLAUDE.md)

### Documentation Hierarchy

```
.claude/rules.md          → Always active, concise rules
      ↓ references
CLAUDE.md                 → Comprehensive technical guide
      ↓ references
docs/                     → User-facing documentation
  ├── QUICK_START.md      → Setup guide
  └── plans/
      └── development-roadmap.md → Task tracking
```

## Editing Rules

To modify agent behavior:

1. **Edit `.claude/rules.md`** for critical rules that should ALWAYS apply
2. **Edit `CLAUDE.md`** for detailed patterns, examples, and conventions
3. **Commit changes** so future agents see the updates

## Testing Rules

After editing `rules.md`:
1. Start a new Claude Code session
2. Rules are automatically loaded
3. Observe if agent follows the updated rules
4. Refine as needed

## Learn More

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Project CLAUDE.md](../CLAUDE.md) - Comprehensive guide
- [Development Roadmap](../docs/plans/development-roadmap.md) - Current tasks
