# Consolidate Dependency Updates

Consolidates all open Dependabot pull requests into a single branch, runs CI locally, pushes a consolidated PR, monitors CI until green, merges it, and closes the original Dependabot PRs.

## Step 1: Discover open Dependabot PRs

Use `mcp__github__list_pull_requests` with `state: "open"` on the current repo. Filter the results to only include PRs authored by `dependabot[bot]`. Record each PR's number, title, and head branch name.

If there are no open Dependabot PRs, report "No open Dependabot PRs found." and stop.

## Step 2: Read the diff for each PR

For each Dependabot PR, call `mcp__github__pull_request_read` with `method: "get_diff"` to fetch its diff. From each diff, extract the exact version changes made to:

- `package.json` (root)
- `apps/web/package.json` (or any other workspace `package.json`)
- `.github/workflows/*.yml` (GitHub Actions versions)
- Any other non-lockfile files changed

Ignore `pnpm-lock.yaml` diffs entirely — the lockfile will be regenerated cleanly in Step 4.

## Step 3: Set up the consolidation branch

Determine the current default branch (usually `main`). Create and check out a new branch named `consolidate-deps-YYYYMMDD` based on the latest `main`:

```bash
git fetch origin main
git checkout -B consolidate-deps-$(date +%Y%m%d) origin/main
```

If a branch with that name already exists locally, use `consolidate-deps-$(date +%Y%m%d-%H%M)` to avoid conflicts.

## Step 4: Apply all version bumps

Apply every version change extracted in Step 2 directly to the appropriate files using the Edit tool. Do NOT attempt to git-merge the Dependabot branches — applying changes by hand avoids lockfile merge conflicts entirely.

Group the changes by file and apply them all before running install:

- Root `package.json` changes (e.g. `@types/node`, `lint-staged`, build tools)
- `apps/web/package.json` changes (app-level deps: frameworks, UI, etc.)
- `.github/workflows/` changes (GitHub Actions pinned versions)

## Step 5: Regenerate the lockfile

```bash
pnpm install
```

This produces a single authoritative lockfile incorporating all bumps at once. If the install fails due to a peer dependency conflict, diagnose the conflict, adjust the version specifiers, and re-run.

## Step 6: Run local CI checks

Generate the Prisma client first (required for type-checking):

```bash
pnpm --filter web db:generate
```

Then run all checks in sequence:

```bash
pnpm lint
pnpm format:check
pnpm type-check
pnpm test
pnpm build
```

If any check fails:

- For lint/format errors: run `pnpm lint:fix` and `pnpm format`, then re-check
- For type errors: diagnose and fix the type issue before continuing
- For test failures: investigate and fix before continuing
- Do NOT proceed until all checks pass locally

## Step 7: Commit and push

Stage all changed files and commit with a conventional commit message listing every PR being consolidated:

```bash
git add .
git commit -m "chore(deps): consolidate dependabot dependency updates

Merges PRs #N, #N, ... into a single lockfile update:

- <package>: <old> → <new>
- ...
"
git push -u origin <branch-name>
```

## Step 8: Create the consolidated PR

Use `mcp__github__create_pull_request` targeting `main`. The PR body should:

- List each original Dependabot PR number and what it updates
- Note that all local CI checks passed
- Note that the lockfile was regenerated cleanly

## Step 9: Subscribe to CI and comment on original PRs

In parallel:

1. Call `mcp__github__subscribe_pr_activity` on the new consolidated PR to receive CI events
2. For each original Dependabot PR, call `mcp__github__add_issue_comment` explaining it is superseded by the consolidated PR, then call `mcp__github__update_pull_request` with `state: "closed"` to close it

## Step 10: Monitor CI and merge when green

When CI check events arrive via `<github-webhook-activity>`:

- If a job fails: read the job output via `mcp__github__pull_request_read` with `method: "get_check_runs"`, diagnose the failure, fix it locally, push an additional commit, and wait for CI to re-run
- If all jobs pass: call `mcp__github__merge_pull_request` to merge the consolidated PR

After merging, call `mcp__github__unsubscribe_pr_activity` to stop listening to events on this PR.

## Notes

- This command only consolidates version bumps in `package.json` files and GitHub Actions YAML. Major version upgrades that require code changes should be handled separately with a dedicated branch.
- Always verify local CI before pushing — the cost of a broken PR is much higher than the cost of a local test run.
- If `pnpm install` installs a newer patch/minor version than the Dependabot PR specified (because `^` ranges allow it), that is expected and fine — pnpm resolves to the latest compatible version.
