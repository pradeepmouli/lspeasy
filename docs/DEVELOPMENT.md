# Development Workflow

Guide to the recommended development process for this monorepo.

## Getting Started

### Initial Setup

```bash
# Clone the repository
git clone https://github.com/your-org/ts-template.git
cd ts-template

# Install pnpm if not already installed
npm install -g pnpm@8.15.0

# Install dependencies
pnpm install

# Set up git hooks
pnpm run prepare

# Create a new branch for your work
git checkout -b feat/your-feature-name
```

### Available Commands

**Development:**
```bash
pnpm run dev          # Start dev servers for all packages
pnpm run lint         # Check code style and quality
pnpm run format       # Auto-format all code
pnpm run type-check   # Type-check all packages
```

**Testing:**
```bash
pnpm run test         # Run all unit/integration tests
pnpm run test:watch   # Watch mode for tests
pnpm run test:ui      # Interactive test UI
```

**Building:**
```bash
pnpm run build        # Build all packages
pnpm run clean        # Clean build artifacts
pnpm run fresh        # Clean install (nuclear option)
```

**Versioning:**
```bash
pnpm run changeset    # Create a changeset for version bump
```

## Development Process

### 1. Create a Feature Branch

```bash
# Use descriptive branch names
git checkout -b feat/add-email-validation
git checkout -b fix/circular-dependency-core
git checkout -b docs/update-workspace-guide
git checkout -b refactor/simplify-string-utils
```

### 2. Make Your Changes

Example: Adding a new utility function

```typescript
// packages/utils/src/string.ts
/**
 * Checks if a string is a valid URL
 * @param str - The string to check
 * @returns true if valid URL
 */
export function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}
```

### 3. Write Tests

```typescript
// packages/utils/src/string.test.ts
import { describe, it, expect } from 'vitest';
import { isValidUrl } from './string';

describe('isValidUrl', () => {
  it('should validate correct URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('http://localhost:3000')).toBe(true);
  });

  it('should reject invalid URLs', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('example.com')).toBe(false);
  });
});
```

### 4. Verify Code Quality

```bash
# Lint your changes
pnpm run lint

# Fix linting issues automatically
pnpm run lint:fix

# Check formatting
pnpm run format:check

# Format code
pnpm run format

# Type check
pnpm run type-check

# Run tests
pnpm run test

# Run with coverage
pnpm run test:coverage
```

### 5. Create a Changeset

Before committing, create a changeset describing your changes:

```bash
pnpm run changeset
```

Follow the interactive prompts:
- Select which packages changed
- Choose version bump (major/minor/patch)
- Write a clear description

This creates a file in `.changeset/` like:

```markdown
---
'@company/utils': minor
---

Add isValidUrl utility function for URL validation
```

### 6. Commit Your Changes

Follow conventional commit format:

```bash
# Format: type(scope): description
git add .
git commit -m "feat(utils): add isValidUrl utility function"
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, semicolons)
- `refactor`: Code refactoring
- `test`: Test improvements
- `chore`: Build, dependencies, CI/CD

### 7. Push and Create Pull Request

```bash
git push origin feat/add-email-validation
```

Open a pull request on GitHub with:
- Clear title matching conventional commits
- Description of changes
- Link to any related issues
- Screenshots (if UI changes)

## Code Review

### Before Submitting PR

Checklist:
- [ ] Code passes linting (`pnpm lint`)
- [ ] Code is formatted (`pnpm format`)
- [ ] All tests pass (`pnpm test`)
- [ ] Coverage thresholds met
- [ ] No TypeScript errors (`pnpm type-check`)
- [ ] Updated relevant documentation
- [ ] Added/updated tests for changes
- [ ] Changeset created (`pnpm changeset`)

### During Code Review

- Address reviewer feedback promptly
- Push additional commits as you make fixes
- Re-request review once changes are addressed
- Don't force-push unless explicitly asked

### Merging

Once approved:
1. Squash or rebase commits (clean history)
2. Ensure CI checks pass
3. Merge to main branch
4. Delete feature branch

## Monorepo Specifics

### Adding to Multiple Packages

If your change affects multiple packages:

```bash
# Install in multiple packages
pnpm --filter @company/core add lodash
pnpm --filter @company/utils add lodash

# Or install in all packages
pnpm add -r lodash
```

### Package Dependencies

If package B depends on package A:

```json
{
  "name": "@company/b",
  "dependencies": {
    "@company/a": "workspace:*"
  }
}
```

The `workspace:*` protocol means:
- During development, A is resolved to its source
- Uses the local version, no npm publishing needed
- Ensures versions stay synchronized

### Testing Package Interactions

Use integration tests to verify packages work together:

```typescript
// integration.test.ts
import { isValidEmail } from '@company/core';
import { capitalize } from '@company/utils';

it('should combine core and utils', () => {
  expect(isValidEmail('john@example.com')).toBe(true);
  expect(capitalize('john')).toBe('John');
});
```

## Performance Considerations

### Large Monorepos

For faster builds:

```bash
# Build only changed packages
pnpm --filter "...{packages/core}" run build

# Run tests only for affected packages
pnpm --filter @company/core run test
```

### Type Checking

Faster TypeScript checking in CI:

```bash
# Parallel type checking
pnpm run typecheck:watch

# Check without full rebuild
pnpm run type-check
```

## Common Workflows

### Adding a New Utility Function

```bash
# 1. Locate the relevant package
cd packages/utils

# 2. Add function to src/
# 3. Add tests to src/*.test.ts
# 4. Check everything works
pnpm run lint && pnpm run test

# 5. Create changeset
pnpm run changeset

# 6. Commit
git commit -m "feat(utils): add new utility function"
```

### Fixing a Bug in Core Package

```bash
# 1. Create bug fix branch
git checkout -b fix/core-validation

# 2. Navigate to package
cd packages/core

# 3. Write regression test
# 4. Implement fix
# 5. Verify fix
pnpm run test

# 6. Create changeset
pnpm run changeset

# 7. Commit
git commit -m "fix(core): resolve validation issue"
```

### Adding a New Package

```bash
# 1. Create directory
mkdir packages/my-new-package
cd packages/my-new-package

# 2. Create package.json and src/
# See WORKSPACE.md for template

# 3. Add to root pnpm-workspace.yaml (if needed)

# 4. Install dependencies
pnpm install

# 5. Test it works
pnpm run test

# 6. Commit
git commit -m "chore: add new package @company/my-new-package"
```

## Debugging

### VS Code Debugging

Debug configurations are available in `.vscode/launch.json`:

1. **Debug Main** - Debug the current file
2. **Debug Tests** - Debug test file
3. **Debug Current Test** - Debug specific test
4. **Debug with Node** - Debug Node.js process

Set breakpoints and press F5 to start debugging.

### Common Issues

**"Cannot find module" errors:**
```bash
# Rebuild packages
pnpm run build

# Clear cache
rm -rf node_modules/.vitest
```

**TypeScript not recognizing changes:**
```bash
# Force TypeScript re-index (VS Code)
Cmd+Shift+P → "TypeScript: Reload Projects"
```

**Tests failing locally but passing in CI:**
```bash
# Run tests exactly like CI
pnpm run test:coverage
pnpm run lint
pnpm run type-check
```

## Release Process

See [SECURITY.md](./SECURITY.md) and [CONTRIBUTING.md](../CONTRIBUTING.md) for details on:
- Creating releases
- Versioning strategy
- Publishing packages
- Security policies

## Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Workflow](https://git-scm.com/book/en/v2)
- [pnpm Documentation](https://pnpm.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
