# Development & Release Process

## Branch model

- `develop` — integration branch. All feature/fix work merges here first.
- `master` — release branch. Kept in sync with `develop` via a standing "Sync develop into master" PR.

Work happens on short-lived branches off `develop`, merged via PR. Once `develop` is in a good state, the develop→master PR is merged to promote it.

## Packages

- `@lspeasy/core`
- `@lspeasy/client`
- `@lspeasy/server`
- `@lsproxy/polyfill`
- `@lsproxy/cli` (`apps/cli`)
- `@lsproxy/proxy` (`apps/proxy`)

`@lspeasy/docs` (`apps/docs`) is private, not published.

## Adding a changeset

```bash
pnpm changeset
```

Select the affected package(s) and bump type, write a real summary, commit the generated `.changeset/*.md` alongside your change.

If you forget, the "Auto-generate Changeset" workflow (`.github/workflows/changeset.yml`) will synthesize one from your commit messages when your PR opens/updates — but a hand-written changeset with a real summary is always better for the CHANGELOG.

## Release automation (fully automatic once a changeset lands)

The `Release` workflow (`.github/workflows/release.yml`) runs on every push to `develop` or `master`. When it finds pending changesets, it:

1. Opens or updates a **"chore: version packages"** PR from `changeset-release/<branch>` targeting that same branch. This PR contains the version bumps + CHANGELOG updates across all affected packages — don't edit it by hand, just let it accumulate changesets.
2. Attempts to enable GitHub's native auto-merge on that PR (needs "Allow auto-merge" on in repo settings — if it's off, the PR just sits there and needs a manual merge).
3. When that Version Packages PR merges, the *next* run of the Release workflow (triggered by that merge) runs `pnpm changeset:publish`, which publishes every bumped package to npm with provenance.

So: merge your PR to `develop` → Version Packages PR appears → merge it (or let auto-merge do it) → packages publish. No manual `npm publish` ever.

The `Release` job uses **Node 22** specifically — keep this in sync if you copy the workflow to another repo.

## CI

`.github/workflows/ci.yml` runs the matrix (Node 24.x, 26.x): install, build, type-check, test, lint. `CodeQL` and `Dependency Security Audit` run as separate checks on the same PR.

**Watch for prototype pollution when merging arbitrary JSON into an object** — `apps/cli/src/zod-to-commander.ts`'s `deepMergeInto` used to copy every key from a `JSON.parse`'d `--params` value into the base object with no guard, which CodeQL correctly flagged as a real vulnerability (`__proto__`/`constructor`/`prototype` keys reach `Object.prototype`). Any function that merges parsed-JSON keys into a plain object needs an explicit skip-list for those three keys; see `UNSAFE_KEYS` in that file for the pattern.

**Prefer letting a filesystem operation fail over checking existence first** — `existsSync(p)` followed by a separate `readFileSync`/`writeFileSync`/`copyFileSync` on the same path is a real check-then-use race (CodeQL: `js/file-system-race`) even in single-user local tooling like this CLI. Do the operation directly and catch `ENOENT` instead (see `readSettings`/the backup-copy step in `apps/cli/src/config/adapters/claude-code.ts`).

If CodeQL flags something and you're confident it's a false positive, dismiss it from the repo's Security → Code scanning tab with a specific reason — don't silence it in code just to turn the check green.

## Local commands

```bash
pnpm install --frozen-lockfile   # match CI exactly
pnpm build
pnpm test
pnpm type-check
pnpm lint
```

`pnpm run <script>` and `pnpm --filter <pkg> <script>` re-verify the lockfile against pnpm's `minimumReleaseAge` policy even with a fresh install — this repo sets `minimumReleaseAge: 0` in `pnpm-workspace.yaml` so a freshly-published transitive dependency never blocks a local install or CI run.

If a git hook (pre-commit/pre-push) is getting in the way of something you've already verified manually, bypass it with `SKIP_SIMPLE_GIT_HOOKS=1` rather than `--no-verify` — it's the hook's own documented escape hatch and shows up explicitly in its output.

## Current gap: branch protection

Branch protection on `master`/`develop` is currently **disabled** (as of 2026-07-30) — the auto-changeset bot's `GITHUB_TOKEN` couldn't push past it (only `RELEASE_TOKEN`, a real user PAT, can), and GitHub's newer Rulesets don't support bot bypass on personal (non-org) repos either. If you re-enable protection, expect the `Auto-generate Changeset` workflow to start failing again unless you also switch it to use `RELEASE_TOKEN` (or an equivalent PAT/GitHub App) instead of the default `GITHUB_TOKEN`.
