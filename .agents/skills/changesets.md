---
name: changesets
description: Use when managing package versions, generating changelogs, publishing releases, or working with monorepo versioning
user-invocable: true
---

# Changesets Versioning & Release Management

## Overview

Changesets is a versioning tool that:
- Tracks changes across commits via changeset files
- Generates changelogs automatically
- Handles monorepo versioning
- Integrates with CI for automated releases

## Setup

### Installation
```bash
# Single package
pnpm add -D @changesets/cli

# Initialize
pnpm changeset init
```

### Configuration
```json
// .changeset/config.json
{
  "$schema": "https://unpkg.com/@changesets/config@3.0.0/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### package.json Scripts
```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

## Core Workflow

### 1. Create a Changeset
After making changes, create a changeset:
```bash
pnpm changeset
```

This prompts for:
1. Which packages changed
2. Bump type (major/minor/patch)
3. Summary of changes

Creates a file like `.changeset/happy-lions-dance.md`:
```markdown
---
"@myorg/core": minor
"@myorg/cli": patch
---

Added new `transform` option to core API.
CLI now supports the `--transform` flag.
```

### 2. Version Packages
When ready to release:
```bash
pnpm changeset version
```

This:
- Consumes all changeset files
- Updates package.json versions
- Generates/updates CHANGELOG.md files
- Handles dependency updates

### 3. Publish
```bash
pnpm changeset publish
```

Publishes all packages with new versions to npm.

## Versioning Rules

### Semantic Versioning
| Type | When to Use | Example |
|------|-------------|---------|
| `patch` | Bug fixes, docs | 1.0.0 → 1.0.1 |
| `minor` | New features, non-breaking | 1.0.0 → 1.1.0 |
| `major` | Breaking changes | 1.0.0 → 2.0.0 |

### Pre-1.0 Handling
For `0.x.y` packages:
- Breaking changes can be `minor` (0.1.0 → 0.2.0)
- Features can be `patch` (0.1.0 → 0.1.1)

## Monorepo Configuration

### Fixed Versioning
All packages in a group share the same version:
```json
{
  "fixed": [
    ["@myorg/core", "@myorg/cli", "@myorg/utils"]
  ]
}
```

### Linked Versioning
Packages bump together but can have different versions:
```json
{
  "linked": [
    ["@myorg/react-*"]
  ]
}
```

### Ignore Packages
Exclude packages from changesets:
```json
{
  "ignore": ["@myorg/internal-tools", "@myorg/docs"]
}
```

### Internal Dependencies
How to handle internal package updates:
```json
{
  "updateInternalDependencies": "patch"  // or "minor"
}
```

## Changelog Customization

### Built-in Formats
```json
{
  "changelog": "@changesets/cli/changelog"
}
```

### GitHub Changelog (with links)
```bash
pnpm add -D @changesets/changelog-github
```

```json
{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "owner/repo" }
  ]
}
```

Generates:
```markdown
## 1.2.0

### Minor Changes

- [#123](https://github.com/owner/repo/pull/123) [`abc1234`](https://github.com/owner/repo/commit/abc1234) Thanks [@username](https://github.com/username)! - Added new feature
```

### Custom Changelog
```javascript
// changelog.cjs
module.exports = {
  async getReleaseLine(changeset, type, options) {
    const [firstLine, ...rest] = changeset.summary.split('\n');
    return `- ${firstLine}`;
  },
  async getDependencyReleaseLine(changesets, dependenciesUpdated, options) {
    if (dependenciesUpdated.length === 0) return '';
    return `- Updated dependencies`;
  }
};
```

## GitHub Actions Integration

### Automated Release PR
```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write
      pull-requests: write
      id-token: write
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v3
        with:
          version: 9

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          registry-url: 'https://registry.npmjs.org'

      - run: pnpm install --frozen-lockfile
      - run: pnpm build

      - name: Create Release PR or Publish
        uses: changesets/action@v1
        with:
          publish: pnpm changeset publish
          version: pnpm changeset version
          title: 'chore: version packages'
          commit: 'chore: version packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### How It Works
1. When changesets exist on `main`, creates a "Version Packages" PR
2. PR updates versions and changelogs
3. When PR is merged, publishes to npm
4. Creates GitHub releases

### Snapshot Releases
For testing pre-release versions:
```yaml
- name: Publish Snapshot
  if: github.event_name == 'pull_request'
  run: |
    pnpm changeset version --snapshot pr${{ github.event.number }}
    pnpm changeset publish --tag pr${{ github.event.number }}
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Pre-releases

### Enter Pre-release Mode
```bash
pnpm changeset pre enter alpha
```

Creates `.changeset/pre.json`:
```json
{
  "mode": "pre",
  "tag": "alpha",
  "initialVersions": {
    "@myorg/core": "1.0.0"
  },
  "changesets": []
}
```

### Pre-release Workflow
```bash
# Enter pre-release mode
pnpm changeset pre enter alpha

# Add changesets as normal
pnpm changeset

# Version (creates 1.1.0-alpha.0)
pnpm changeset version

# Publish with tag
pnpm changeset publish --tag alpha

# More changes...
pnpm changeset
pnpm changeset version  # 1.1.0-alpha.1

# Exit pre-release mode
pnpm changeset pre exit

# Final release
pnpm changeset version  # 1.1.0
pnpm changeset publish
```

### Pre-release Tags
| Tag | Use Case |
|-----|----------|
| `alpha` | Early testing, unstable |
| `beta` | Feature complete, testing |
| `rc` | Release candidate |
| `next` | Upcoming major version |
| `canary` | Per-commit releases |

## Advanced Patterns

### Canary Releases
Publish from every commit:
```yaml
- name: Publish Canary
  run: |
    pnpm changeset version --snapshot canary
    pnpm changeset publish --tag canary --no-git-tag
  env:
    NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Private Packages
For internal packages that shouldn't publish:
```json
// package.json
{
  "private": true
}
```

Or in changeset config:
```json
{
  "ignore": ["@myorg/internal-*"]
}
```

### Workspace Protocol
When using `workspace:*` dependencies:
```json
// package.json
{
  "dependencies": {
    "@myorg/utils": "workspace:*"
  }
}
```

Changesets automatically converts to real versions on publish.

### Version Commands with Scripts
Run scripts during versioning:
```json
// package.json
{
  "scripts": {
    "version": "pnpm changeset version && pnpm install --lockfile-only"
  }
}
```

## CLI Commands Reference

| Command | Description |
|---------|-------------|
| `changeset` | Create new changeset interactively |
| `changeset add` | Create changeset (alias) |
| `changeset version` | Update versions and changelogs |
| `changeset publish` | Publish changed packages |
| `changeset status` | Show pending changesets |
| `changeset pre enter <tag>` | Enter pre-release mode |
| `changeset pre exit` | Exit pre-release mode |
| `changeset tag` | Create git tags for versions |

### Useful Flags
```bash
# Skip prompts in CI
changeset version --no-git-tag

# Publish without git tag
changeset publish --no-git-tag

# Snapshot release
changeset version --snapshot

# Status with verbose output
changeset status --verbose

# Only publish specific packages
changeset publish --filter "@myorg/core"
```

## Troubleshooting

### "No changesets present"
- Check `.changeset/` for `.md` files (not `config.json` or `README.md`)
- Ensure changesets weren't already consumed

### Version Conflicts
```bash
# Reset and re-version
git checkout -- packages/*/package.json packages/*/CHANGELOG.md
pnpm changeset version
```

### Publish Failures
```bash
# Check npm login
npm whoami

# Publish with verbose output
changeset publish --verbose

# Check package access
npm access ls-packages
```

### Workspace Dependencies Not Updating
Ensure `updateInternalDependencies` is set:
```json
{
  "updateInternalDependencies": "patch"
}
```

## Best Practices

1. **Write meaningful summaries** - Changelogs are user-facing documentation
2. **One changeset per logical change** - Don't batch unrelated changes
3. **Include migration notes** - For breaking changes, explain upgrade path
4. **Use conventional format** - Start with verb (Added, Fixed, Removed)
5. **Link to issues/PRs** - Reference related issues in summaries
6. **Review the Version PR** - Check changelog before merging
7. **Keep pre-release cycles short** - Long pre-releases cause confusion
8. **Test before publishing** - CI should build/test before release

## Example Changeset Summaries

### Good
```markdown
---
"@myorg/core": minor
---

Added `timeout` option to `fetch()` that allows setting request timeout in milliseconds.
Defaults to 30000ms for backward compatibility.
```

### Breaking Change
```markdown
---
"@myorg/core": major
---

BREAKING: Removed deprecated `legacyMode` option.

Migration: Replace `legacyMode: true` with the new `compatibility: 'v1'` option.
```

### Bug Fix
```markdown
---
"@myorg/cli": patch
---

Fixed crash when config file contains Unicode characters on Windows.
```
