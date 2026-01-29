# ADR-005: Changesets for Versioning

**Date**: 2024-01-01
**Status**: Accepted

## Context

Version management and release automation requires choosing between:
- Manual versioning
- Semantic Release
- Release-Please
- Changesets

Considerations:
- Monorepo support
- Developer control
- Automatic changelog generation
- Flexible versioning
- Simplicity

## Decision

**We chose Changesets for version management and releases** instead of Release-Please or Semantic Release.

## Rationale

1. **Monorepo First**: Designed specifically for monorepos with multiple packages
2. **Developer Control**: Each PR documents its changes explicitly via changesets
3. **Independent Versioning**: Each package can have independent version bumps
4. **Flexible Workflows**: Can be fully automated or manual, as needed
5. **Clear Intent**: Developers explicitly state breaking changes vs features vs fixes
6. **Changelog Quality**: Human-written descriptions, not auto-generated from commits
7. **Coordination**: Handles coordinated releases across multiple packages

## Consequences

### Positive
- ✅ Excellent for monorepos with multiple packages
- ✅ Clear semantic versioning enforcement
- ✅ High-quality changelogs
- ✅ No surprises with automatic releases
- ✅ Better control over release timing
- ✅ Works well with Conventional Commits

### Negative
- ⚠️ Requires developer discipline (must create changesets)
- ⚠️ Additional PR review step
- ⚠️ Not fully hands-off automation
- ⚠️ Smaller community than Semantic Release

## Workflow

```bash
# Developer creates a changeset
pnpm changeset

# Describes:
# - Affected packages
# - Semantic version bump (major/minor/patch)
# - Changelog entry

# This creates a file in .changeset/

# When ready to release:
pnpm changeset:version  # Updates package.json and CHANGELOG
pnpm changeset:publish  # Publishes to npm
```

## Configuration

```typescript
// .changeset/config.json
{
  "changelog": "changeset",
  "commit": false,
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

## Alternatives Considered

1. **Release-Please**: Easier automation but less suitable for monorepos
2. **Semantic Release**: More automated but less control and developer involvement
3. **Manual Versioning**: Full control but error-prone and time-consuming

## Migration Path

To switch to Release-Please or Semantic Release:
1. Remove Changesets configuration
2. Add Release-Please or Semantic-Release config
3. Update CI/CD workflows
4. Migrate existing CHANGELOG.md entries
5. Update developer documentation

## Best Practices

1. **Granular Changesets**: One changeset per logical change
2. **Clear Descriptions**: Explain impact in changelog entry
3. **Breaking Changes**: Always marked with major version
4. **Dependent Packages**: Use `updateInternalDependencies` option

## Example Changeset

```yaml
---
"@company/core": minor
"@company/utils": patch
---

Add new authentication API with JWT support

Breaking changes in core package v2.0.0:
- Removed deprecated login() method
```

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [Release-Please](https://github.com/googleapis/release-please)
- [Semantic Release](https://semantic-release.gitbook.io/)
