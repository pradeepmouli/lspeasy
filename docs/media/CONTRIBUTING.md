# Contributing to TypeScript Template

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/template-ts.git
   cd template-ts
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Workflow

### Available Commands

```bash
# Development
pnpm dev              # Start development mode

# Testing
pnpm test            # Run tests once
pnpm test:watch      # Run tests in watch mode
pnpm test:coverage   # Generate coverage report
pnpm test:ui         # Run tests with UI

# Linting & Formatting
pnpm lint            # Run linter
pnpm lint:fix        # Fix linting issues
pnpm format          # Format code
pnpm format:check    # Check formatting

# Type Checking
pnpm type-check      # Type check the code

# Building
pnpm build           # Build for production
pnpm clean           # Remove build artifacts

# Monorepo
pnpm audit           # Security audit
pnpm outdated        # Check outdated dependencies
pnpm update:deps     # Update dependencies
```

## Coding Standards

### TypeScript

- Use **strict mode** (already enabled in tsconfig.json)
- Prefer `const` over `let` over `var`
- Use explicit return types for functions
- Avoid `any` type - use proper typing
- Use generics for reusable components

### File & Naming Conventions

- **Components/Classes:** PascalCase (e.g., `UserService.ts`)
- **Functions/Variables:** camelCase (e.g., `calculateTotal()`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- **Test files:** `*.test.ts` or `*.spec.ts`

### Code Style

- 2 spaces for indentation (configured in .editorconfig)
- Single quotes for strings
- Semicolons at end of statements
- No trailing commas in object/array literals
- Max line length: 100 characters (soft)

### Imports Organization

```typescript
// 1. External dependencies
import axios from 'axios';
import { describe, it, expect } from 'vitest';

// 2. Internal modules
import { config } from '@/config';

// 3. Relative imports
import { helper } from '../utils';

// 4. Type imports (if not inline)
import type { UserType } from './types';
```

## Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).

### Format

```
type(scope): description

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to build process, dependencies, or CI/CD
- `ci`: Changes to CI/CD configuration
- `build`: Changes to build system

### Examples

```bash
feat(auth): add JWT authentication support
fix(api): resolve race condition in data fetching
docs(readme): update installation instructions
refactor(core): simplify event handler logic
perf(parser): optimize regex patterns for 30% speed improvement
```

## Pull Request Process

1. **Keep PRs focused:** Each PR should address a single concern
2. **Write clear description:** Explain what and why
3. **Link issues:** Reference related issues with `Closes #123`
4. **Keep it small:** Aim for <400 lines of changes
5. **Request reviews:** Assign reviewers when ready

### PR Title Format

Follow the same convention as commits:
```
feat(scope): clear description
fix(core): clear description
docs: update README
```

### PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No console.log or debug code
- [ ] Linting passes (`pnpm lint`)
- [ ] Formatting passes (`pnpm format:check`)
- [ ] All tests pass (`pnpm test`)
- [ ] Type check passes (`pnpm type-check`)

## Testing

### Writing Tests

- Place tests alongside source files or in a `test/` directory
- Use `.test.ts` or `.spec.ts` extension
- Use descriptive test names
- Aim for >80% code coverage

### Test Structure

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { myFunction } from './myFunction';

describe('MyFunction', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should return expected result', () => {
    const result = myFunction(input);
    expect(result).toEqual(expected);
  });

  it('should handle edge cases', () => {
    expect(() => myFunction(null)).toThrow();
  });
});
```

### Running Tests

```bash
pnpm test                 # Run all tests
pnpm test:watch          # Watch mode
pnpm test:coverage       # With coverage
pnpm test -- --ui        # With UI
```

## Documentation

### JSDoc Comments

Document public APIs with JSDoc:

```typescript
/**
 * Calculates the sum of two numbers.
 * @param a - The first number
 * @param b - The second number
 * @returns The sum of a and b
 * @throws {TypeError} If either parameter is not a number
 */
export function add(a: number, b: number): number {
  return a + b;
}
```

### README Updates

- Update README.md if you add new features
- Include code examples for new functionality
- Keep it clear and concise

## Monorepo Guidelines

If working with multiple packages:

1. **Workspace Protocol:** Use `workspace:*` for dependencies
2. **Package Independence:** Each package should be self-contained
3. **Shared Dependencies:** Keep versions synchronized
4. **Cross-Package Imports:** Use proper path exports

## Performance Considerations

- Be mindful of bundle size
- Avoid unnecessary dependencies
- Profile before optimizing
- Document performance-critical code
- Use appropriate data structures

## Accessibility

- Write semantic HTML (if applicable)
- Ensure proper contrast ratios
- Use ARIA labels appropriately
- Test with assistive technologies

## Security

- Never commit secrets or API keys
- Use environment variables for sensitive data
- Validate and sanitize user input
- Keep dependencies updated
- Report security issues privately (see SECURITY.md)

## Getting Help

- **Questions:** Open a discussion
- **Bug Reports:** Open an issue with reproduction steps
- **Feature Requests:** Open an issue with detailed explanation
- **Security Issues:** See SECURITY.md

## Licensing

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub contributors page
- CHANGELOG.md
- Project documentation

---

Thank you for making this project better! 🎉
