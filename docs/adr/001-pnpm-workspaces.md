# ADR-001: pnpm Workspaces

**Date**: 2024-01-01
**Status**: Accepted

## Context

For a monorepo, we need to choose a package manager that:
- Efficiently handles multiple packages
- Prevents dependency duplication
- Provides clear workspace management
- Has good tooling support
- Maintains fast installation times

Three main candidates were considered:
- npm with workspaces
- Yarn with workspaces
- pnpm with workspaces

## Decision

**We chose pnpm with workspaces** as the primary package manager for this monorepo.

## Rationale

1. **Disk Efficiency**: pnpm uses a content-addressable filesystem, reducing disk space by 50-70% compared to npm/yarn
2. **Installation Speed**: 2-3x faster than npm, faster than yarn in most cases
3. **Strict Dependency Resolution**: pnpm enforces stricter dependency management, preventing "phantom dependencies"
4. **Workspace Protocol**: `workspace:*` allows explicit workspace dependencies
5. **Lock File Quality**: Deterministic lock files that are easy to review in diffs
6. **Community Adoption**: Growing adoption in monorepo projects
7. **Performance**: Better caching and concurrent operations

## Consequences

### Positive
- ✅ Fast, efficient monorepo management
- ✅ Smaller CI/CD caches
- ✅ Reduced node_modules size (saves ~60% space)
- ✅ Better package isolation
- ✅ Clear dependency relationships

### Negative
- ⚠️ Requires pnpm installation (not pre-installed like npm)
- ⚠️ Some legacy tools may have compatibility issues
- ⚠️ Steeper learning curve for npm-only developers

## Alternatives Considered

1. **npm workspaces**: Simpler, included with Node, but slower and less efficient
2. **Yarn**: Good performance but added complexity; pnpm offers same benefits with better disk efficiency

## Migration Path

To switch to npm/yarn in future:
1. Convert `pnpm-workspace.yaml` to npm workspaces format
2. Generate new `package-lock.json` or `yarn.lock`
3. Update CI/CD pipelines
4. Update documentation

## References

- [pnpm Documentation](https://pnpm.io/)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
