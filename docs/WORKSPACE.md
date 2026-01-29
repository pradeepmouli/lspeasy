# Workspace Guide

This template uses **pnpm workspaces** for managing multiple packages in a monorepo structure.

## Directory Structure

```
template-ts/
├── packages/
│   ├── core/          # Core utilities used across packages
│   ├── utils/         # General utility functions
│   ├── test-utils/    # Shared testing utilities
│   └── [your-package]/
├── scripts/           # Build and automation scripts
├── e2e/              # End-to-end tests (Playwright)
├── docs/             # Project documentation
├── pnpm-workspace.yaml
└── package.json      # Root workspace configuration
```

## Key Concepts

### Workspace Protocol

Use the `workspace:*` protocol to reference packages within the monorepo:

```json
{
  "dependencies": {
    "@company/core": "workspace:*"
  }
}
```

This ensures:
- Local packages are always used during development
- Versions stay synchronized
- No need to publish to npm during development

### Package Exports

Each package should define proper exports in its `package.json`:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./utils": {
      "types": "./dist/utils.d.ts",
      "default": "./dist/utils.js"
    }
  }
}
```

This enables:
- Clean import paths: `import { helper } from '@company/utils'`
- Subpath exports: `import { testing } from '@company/utils/testing'`
- Proper TypeScript support

## Common Commands

### Development

```bash
# Install dependencies for all packages
pnpm install

# Start development mode for all packages
pnpm run dev

# Run development for a specific package
pnpm --filter @company/core run dev
```

### Building

```bash
# Build all packages
pnpm run build

# Build a specific package
pnpm --filter @company/utils run build

# Build packages in dependency order
pnpm run build -- --recursive
```

### Testing

```bash
# Run all tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with coverage
pnpm run test:coverage

# Run tests for specific package
pnpm --filter @company/core run test

# Run integration tests
pnpm run test integration.test.ts
```

### Code Quality

```bash
# Lint all packages
pnpm run lint

# Fix linting issues
pnpm run lint:fix

# Check code format
pnpm run format:check

# Format all code
pnpm run format

# Type check all packages
pnpm run type-check

# Watch mode type checking
pnpm run typecheck:watch
```

### Dependency Management

```bash
# Check for outdated packages
pnpm run outdated

# Update dependencies
pnpm run update:deps

# Audit dependencies for security issues
pnpm run audit

# Clean and reinstall (nuclear option)
pnpm run fresh
```

### Versioning & Publishing

```bash
# Create a changeset
pnpm run changeset

# Bump versions based on changesets
pnpm run changeset:version

# Publish to npm
pnpm run changeset:publish
```

## Adding New Packages

1. Create a new directory in `packages/`:

```bash
mkdir packages/my-package
cd packages/my-package
```

2. Create `package.json` with proper exports:

```json
{
  "name": "@company/my-package",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  }
}
```

3. Create `tsconfig.json` extending the root:

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "../../dist/my-package",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

4. Create source files:

```
src/
├── index.ts
└── index.test.ts
```

5. Update workspace references in other packages that depend on it:

```json
{
  "dependencies": {
    "@company/my-package": "workspace:*"
  }
}
```

## Package Dependencies

### Valid Dependency Patterns

```javascript
// ✅ Workspace package (during development)
"@company/core": "workspace:*"

// ✅ Specific version
"zod": "^4.2.1"

// ✅ Latest version
"@types/node": "^25.0.3"

// ❌ Avoid circular dependencies
// Package A depends on B, B depends on A
```

### Checking Dependency Graph

```bash
# See all workspace packages
pnpm ls --depth 0 -r

# Check specific package dependencies
pnpm ls --filter @company/core

# Visualize dependency tree
pnpm --filter @company/utils run type-check
```

## Best Practices

### 1. Keep Packages Focused

- Each package should have a single responsibility
- Avoid bloated monolithic packages
- Share code through dedicated packages

### 2. Consistent Naming

```
✅ @company/core
✅ @company/utils
✅ @company/test-utils
✅ @company/components (if using React)

❌ @company/utils-core
❌ @company/shared-utils-lib
```

### 3. Version Management

- Use changesets for versioning across packages
- Keep related packages at similar versions
- Document breaking changes in CHANGELOG.md

### 4. Testing Cross-Package

- Use integration tests to verify package interactions
- Place integration tests in root `integration.test.ts`
- Mock external dependencies, not workspace packages

### 5. TypeScript Configuration

- All packages extend root `tsconfig.json`
- Use `references` in `tsconfig.json` for proper type checking
- Keep `rootDir` specific to each package

## Troubleshooting

### "Cannot find module" errors

**Problem**: Importing from workspace package fails in IDE

**Solution**:
```bash
# Rebuild all packages
pnpm run build

# Re-index TypeScript in your editor
# In VS Code: Cmd+Shift+P -> "TypeScript: Reload Projects"
```

### Circular dependency errors

**Problem**: Package A depends on B, B depends on A

**Solution**:
1. Extract shared code to a third package
2. Have both A and B depend on the shared package
3. Or restructure packages to break the cycle

### Workspace protocol not resolving

**Problem**: `workspace:*` protocol not recognized during type checking

**Solution**:
```bash
# Ensure pnpm is up to date
pnpm install -g pnpm@latest

# Reinstall all packages
pnpm install
```

### Slow builds

**Problem**: Building all packages takes too long

**Solution**:
```bash
# Build only changed packages
pnpm --filter "...{packages/core}" run build

# Or build specific package
pnpm --filter @company/core run build
```

## Resources

- [pnpm Workspaces](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Monorepo Best Practices](https://monorepo.tools/)
