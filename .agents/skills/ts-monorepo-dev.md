---
name: ts-monorepo-dev
description: TypeScript monorepo development with pnpm workspaces, Vitest testing, oxlint/oxfmt, and changesets releases
---

# TypeScript Monorepo Development

Use this skill when working with TypeScript monorepo projects using pnpm workspaces, setting up new packages, configuring testing, or managing releases.

## Monorepo Structure Pattern

Standard workspace layout:
```
my-monorepo/
├── package.json              # Root workspace config
├── pnpm-workspace.yaml       # Workspace definition
├── packages/
│   ├── core/                # Core library package
│   ├── utils/               # Shared utilities
│   └── [feature]/           # Feature packages
├── apps/                    # Application packages
│   └── [app-name]/
├── tools/                   # Development tools
└── tsconfig.json            # Shared TypeScript config
```

## Initial Setup Checklist

When creating a new monorepo:

1. **Root package.json**:
```json
{
  "name": "my-monorepo",
  "type": "module",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "build": "pnpm -r build",
    "test": "pnpm -r test",
    "lint": "oxlint",
    "lint:fix": "oxlint --fix",
    "format": "oxfmt",
    "format:check": "oxfmt --check",
    "type-check": "tsc --noEmit",
    "clean": "pnpm -r clean && rimraf node_modules"
  },
  "devDependencies": {
    "@changesets/cli": "^2.27.0",
    "oxlint": "^0.15.0",
    "typescript": "^5.6.0",
    "vitest": "^2.0.0",
    "@vitest/coverage-v8": "^2.0.0",
    "simple-git-hooks": "^2.12.0",
    "lint-staged": "^15.3.0",
    "rimraf": "^6.0.0"
  }
}
```

2. **pnpm-workspace.yaml**:
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'
```

3. **tsconfig.json** (root):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

4. **vitest.config.ts** (root or per-package):
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.spec.ts', '**/*.test.ts']
    }
  }
});
```

## Adding a New Package

When creating `packages/new-feature`:

1. **Create directory structure**:
```bash
mkdir -p packages/new-feature/{src,tests}
```

2. **Package package.json**:
```json
{
  "name": "@scope/new-feature",
  "version": "0.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "clean": "rimraf dist"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "workspace:*",
    "vitest": "workspace:*"
  }
}
```

3. **Package tsconfig.json**:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

4. **Create src/index.ts** as entry point

5. **Install from root**: `pnpm install`

## Cross-Package Dependencies

To use `@scope/core` in `@scope/feature`:

```json
{
  "dependencies": {
    "@scope/core": "workspace:*"
  }
}
```

The `workspace:*` protocol ensures local workspace resolution.

## Testing Patterns

### Unit Tests (tests/unit/)
```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../src/index.js';

describe('myFunction', () => {
  it('should return expected value', () => {
    expect(myFunction('input')).toBe('expected');
  });
});
```

### Integration Tests (tests/integration/)
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupTestEnvironment, teardownTestEnvironment } from './test-utils.js';

describe('Integration: Feature X', () => {
  beforeEach(async () => {
    await setupTestEnvironment();
  });

  afterEach(async () => {
    await teardownTestEnvironment();
  });

  it('should integrate with dependency Y', async () => {
    // Integration test logic
  });
});
```

### Run Tests
```bash
# All packages
pnpm -r test

# Specific package
pnpm --filter @scope/feature test

# With coverage
pnpm -r test:coverage

# Watch mode
pnpm --filter @scope/feature test:watch
```

## Linting and Formatting

### oxlint Configuration
Create `.oxlintrc.json` at root:
```json
{
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn"
  }
}
```

### Format Configuration
Create `.oxfmtrc.json` at root:
```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 100,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "none"
}
```

### Pre-commit Hooks
Add to `package.json`:
```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*.ts": [
      "oxlint --fix",
      "oxfmt"
    ]
  }
}
```

Install hooks: `pnpm exec simple-git-hooks`

## Release Management with Changesets

### Setup Changesets
```bash
pnpm add -D @changesets/cli
pnpm changeset init
```

### Create a Changeset
When making changes:
```bash
pnpm changeset
```

Follow prompts:
1. Select packages to bump
2. Choose bump type (major/minor/patch)
3. Write changelog entry

### Version and Publish
```bash
# Bump versions and update changelogs
pnpm changeset version

# Build all packages
pnpm -r build

# Publish to npm
pnpm changeset publish
```

### Changeset Workflow
1. Make changes to packages
2. Create changeset: `pnpm changeset`
3. Commit changeset file
4. On release:
   - Run `pnpm changeset version`
   - Commit version bumps
   - Run `pnpm -r build && pnpm changeset publish`

## Common Workflows

### Adding a Dependency
```bash
# Add to specific package
pnpm --filter @scope/feature add lodash

# Add dev dependency to root
pnpm add -Dw vitest

# Add to all packages
pnpm -r add date-fns
```

### Building
```bash
# Build all packages (respects dependency order)
pnpm -r build

# Build specific package
pnpm --filter @scope/feature build

# Clean and rebuild
pnpm -r clean && pnpm -r build
```

### Running Scripts in Parallel
```bash
# Run tests in all packages concurrently
pnpm -r --parallel test

# Run dev mode in specific packages
pnpm --filter @scope/app --filter @scope/server dev
```

### Debugging Dependency Graph
```bash
# Show why a package is installed
pnpm why lodash

# List all packages
pnpm -r list

# Show dependency tree
pnpm -r list --depth=1
```

## TypeScript Coding Standards

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Variables & Functions | camelCase | `handleClick()`, `isActive` |
| Classes, Types, Interfaces, Enums | PascalCase | `MyClass`, `UserInterface` |
| Private Class Members | ES2022 `#` syntax | `#privateField`, `#privateMethod()` |
| Internal Class Members | `$` prefix | `$internalMethod()`, `$helper` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRIES`, `API_BASE_URL` |
| Files (application code) | PascalCase | `UserService.ts`, `ApiClient.ts` |
| Files (scripts/tests/fixtures) | kebab-case | `test-utils.ts`, `api-client.spec.ts` |

### Code Style Rules

- **Explicit return types**: Always specify return types for functions
- **No `any` type**: Use `unknown` or proper types instead
- **Async/await**: Prefer over raw Promises
- **Strict equality**: Use `===` and `!==` only
- **Arrow functions**: Use for callbacks and functional components
- **Template literals**: Use for string concatenation
- **Destructuring**: Use for objects and arrays
- **Spread/rest operators**: Use for copying and merging

### Class Members Example

```typescript
class UserService {
  // Constants
  static readonly MAX_RETRIES = 3;

  // Private fields (ES2022 syntax)
  #apiClient: ApiClient;
  #cache: Map<string, User>;

  // Internal members (exposed to subclasses/same module)
  $logger: Logger;

  constructor(apiClient: ApiClient, logger: Logger) {
    this.#apiClient = apiClient;
    this.#cache = new Map();
    this.$logger = logger;
  }

  // Public method with explicit return type
  async getUser(id: string): Promise<User> {
    return this.#fetchWithCache(id);
  }

  // Private method
  async #fetchWithCache(id: string): Promise<User> {
    if (this.#cache.has(id)) {
      return this.#cache.get(id)!;
    }
    const user = await this.#apiClient.fetch(`/users/${id}`);
    this.#cache.set(id, user);
    return user;
  }
}
```

### Preferred Technologies

| Use Case | Technology |
|----------|------------|
| Package Management | pnpm |
| Monorepo | pnpm workspaces |
| Version Management | pnpm changesets |
| Testing | vitest |
| Linting | oxlint |
| Formatting | oxfmt |
| Schema Validation | Zod |
| Logging | pino |
| Environment Variables | dotenvx |
| Script Automation | tsx |
| Advanced Types | type-fest |
| Documentation | TypeDoc |
| Utilities | sindresorhus packages |
| Date/Time | date-fns or Day.js |
| HTTP Client | Axios |
| WebSocket | ws |

### JSDoc Documentation

Only document **public APIs**. If unclear whether something is public, ask.

```typescript
/**
 * Fetches a user by their unique identifier.
 * @param id - The user's unique identifier
 * @returns The user object if found
 * @throws {UserNotFoundError} If the user doesn't exist
 */
async getUser(id: string): Promise<User> {
  // Implementation
}
```

## TypeScript Best Practices

### Barrel Exports (src/index.ts)
```typescript
export { Feature } from './feature.js';
export { Helper } from './utils/helper.js';
export type { FeatureConfig, FeatureOptions } from './types.js';
```

### Type-only Imports
```typescript
import type { Config } from './types.js';
import { processConfig } from './processor.js';
```

### Project References (Advanced)
For large monorepos, use TypeScript project references in root tsconfig.json:
```json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" },
    { "path": "./apps/app" }
  ]
}
```

Each package tsconfig.json:
```json
{
  "compilerOptions": {
    "composite": true
  },
  "references": [
    { "path": "../core" }
  ]
}
```

## Troubleshooting

### "Cannot find module" in tests
- Ensure `vitest.config.ts` has correct `resolve.alias` or use full relative paths
- Check that `package.json` has `"type": "module"`
- Use `.js` extensions in imports for ESM: `import { x } from './file.js'`

### Dependency version conflicts
```bash
# Check for duplicate versions
pnpm list lodash

# Override specific version
pnpm.overrides:
{
  "lodash": "^4.17.21"
}
```

### Build failures after adding package
```bash
# Rebuild entire workspace
pnpm install
pnpm -r clean
pnpm -r build
```

### Circular dependencies
- Use `pnpm why <package>` to trace dependency path
- Refactor shared code into separate package
- Consider dependency inversion

## Performance Optimization

### Parallel Builds
Use `--parallel` flag:
```bash
pnpm -r --parallel build
```

### Incremental Builds
Enable in tsconfig.json:
```json
{
  "compilerOptions": {
    "incremental": true,
    "tsBuildInfoFile": "./dist/.tsbuildinfo"
  }
}
```

### Cache Test Results
Vitest caches by default. Force re-run:
```bash
pnpm test --no-cache
```

## Migration from npm/yarn

### Convert to pnpm
```bash
# Remove old lock files
rm package-lock.json yarn.lock

# Install with pnpm
pnpm install

# Update scripts to use pnpm
# Replace "npm run" with "pnpm"
```

### Update CI/CD
```yaml
- uses: pnpm/action-setup@v2
  with:
    version: 10
- run: pnpm install --frozen-lockfile
- run: pnpm -r build
- run: pnpm -r test
```

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `pnpm install` |
| Add package dependency | `pnpm --filter <pkg> add <dep>` |
| Add dev dependency (root) | `pnpm add -Dw <dep>` |
| Build all packages | `pnpm -r build` |
| Test all packages | `pnpm -r test` |
| Lint code | `pnpm lint` |
| Format code | `pnpm format` |
| Create changeset | `pnpm changeset` |
| Version packages | `pnpm changeset version` |
| Publish packages | `pnpm changeset publish` |
| Clean workspace | `pnpm -r clean` |
| Why is package installed? | `pnpm why <package>` |

## Next Steps

After setting up your monorepo:
1. Configure CI/CD with GitHub Actions or similar
2. Set up automatic releases with Changesets bot
3. Add code coverage thresholds
4. Configure VSCode workspace settings for consistency
5. Document package APIs in README files
6. Set up Storybook for component libraries (if applicable)
