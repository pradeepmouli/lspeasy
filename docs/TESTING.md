# Testing Guide

This template includes comprehensive testing setup with Vitest for unit/integration tests and Playwright for E2E tests.

## Unit & Integration Testing

### Running Tests

```bash
# Run all tests once
pnpm run test

# Watch mode (re-run on file changes)
pnpm run test:watch

# Run with coverage
pnpm run test:coverage

# Run specific test file
pnpm run test src/core.test.ts

# Run tests matching pattern
pnpm run test -- --grep "string utility"

# Interactive UI
pnpm run test:ui
```

### Writing Tests

Create a test file next to your source:

```typescript
// src/string-utils.ts
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// src/string-utils.test.ts
import { describe, it, expect } from 'vitest';
import { capitalize } from './string-utils';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle empty strings', () => {
      expect(capitalize('')).toBe('');
    });
  });
});
```

### Coverage Thresholds

Current configuration requires:
- **80%** line coverage
- **80%** function coverage
- **75%** branch coverage
- **80%** statement coverage

Configure in [vitest.config.ts](../vitest.config.ts).

### Using Test Utilities

The `@company/test-utils` package provides mocks and fixtures:

```typescript
import { describe, it, expect } from 'vitest';
import {
  createMockUser,
  createMockApiResponse,
  createMockFn,
  spyOn,
} from '@company/test-utils';

describe('User API', () => {
  it('should fetch user', async () => {
    const mockUser = createMockUser({ name: 'John' });
    const mockFn = createMockFn();

    mockFn.mockResolvedValue(mockUser);

    const result = await mockFn();
    expect(result.name).toBe('John');
  });

  it('should spy on console', () => {
    const consoleSpy = spyOn(console, 'log');

    console.log('test');

    expect(consoleSpy).toHaveBeenCalledWith('test');
  });
});
```

### Cross-Package Testing

Test integration between packages in `integration.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { isValidEmail, createSuccessResponse } from '@company/core';
import { capitalize } from '@company/utils';

describe('Cross-Package Integration', () => {
  it('should combine utilities', () => {
    const response = createSuccessResponse({
      email: 'john@example.com',
      isValid: isValidEmail('john@example.com'),
      displayName: capitalize('john'),
    });

    expect(response.success).toBe(true);
    expect(response.data?.isValid).toBe(true);
  });
});
```

## Performance Benchmarking

### Running Benchmarks

```bash
# Run all benchmarks
pnpm run test vitest.benchmark.config.ts

# Run specific benchmark
pnpm run test -- bench "Array Operations"
```

### Writing Benchmarks

Create benchmark files (usually separate from unit tests):

```typescript
// vitest.benchmark.config.ts
import { bench, describe } from 'vitest';
import { unique, flatten } from '@company/utils';

describe('Benchmarks', () => {
  const largeArray = Array.from({ length: 10000 }, (_, i) => i % 100);

  bench('unique - large array', () => {
    unique(largeArray);
  });

  bench('flatten - deep array', () => {
    flatten(Array(100).fill([1, [2, [3]]]), 2);
  });
});
```

## End-to-End Testing

### Running E2E Tests

```bash
# Run all E2E tests
pnpm exec playwright test

# Run in headed mode (see browser)
pnpm exec playwright test --headed

# Run specific file
pnpm exec playwright test e2e/example.spec.ts

# Run in debug mode
pnpm exec playwright test --debug

# View test report
pnpm exec playwright show-report
```

### Writing E2E Tests

Create test files in `e2e/` directory:

```typescript
// e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should login successfully', async ({ page }) => {
    // Fill login form
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'password123');

    // Submit form
    await page.click('button[type="submit"]');

    // Wait for redirect and verify
    await page.waitForURL('/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com');
    await page.fill('input[name="password"]', 'wrong');
    await page.click('button[type="submit"]');

    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toContainText('Invalid credentials');
  });
});
```

### Multi-Browser Testing

Tests run against Chromium, Firefox, and WebKit by default. Configure in [playwright.config.ts](../playwright.config.ts).

### Visual Regression Testing

```typescript
test('should render correctly', async ({ page }) => {
  await page.goto('/');

  // Take screenshot
  await expect(page).toHaveScreenshot();
});
```

Run with `--update-snapshots` to create baseline screenshots.

## Testing Best Practices

### 1. Test Naming

```typescript
✅ Good: Describes what should happen
it('should return capitalized string when input is lowercase', () => {})

❌ Bad: Vague or implementation-focused
it('test capitalize function', () => {})
```

### 2. Arrange-Act-Assert Pattern

```typescript
it('should process user data', () => {
  // Arrange: Set up test data
  const user = createMockUser({ name: 'John' });

  // Act: Call the function
  const result = processUser(user);

  // Assert: Verify the result
  expect(result.displayName).toBe('John');
});
```

### 3. Avoid Test Interdependence

```typescript
❌ Bad: Tests depend on execution order
let user;
test('create user', () => {
  user = createUser({ name: 'John' });
});
test('update user', () => {
  updateUser(user);
});

✅ Good: Each test is independent
test('can create user', () => {
  const user = createUser({ name: 'John' });
  expect(user.name).toBe('John');
});
test('can update user', () => {
  const user = createMockUser();
  const updated = updateUser(user);
  expect(updated.name).toBe('John');
});
```

### 4. Use Fixtures for Common Setup

```typescript
// test-utils/fixtures.ts
export function createMockUser(overrides?: Partial<User>): User {
  return {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    ...overrides,
  };
}

// In tests
const user = createMockUser({ name: 'John' });
```

### 5. Test Behavior, Not Implementation

```typescript
✅ Good: Testing what the function does
it('should return unique items', () => {
  expect(unique([1, 1, 2, 3])).toEqual([1, 2, 3]);
});

❌ Bad: Testing how it's implemented
it('should create a Set internally', () => {
  // Don't test internal implementation
});
```

## Coverage Reports

Generate and view coverage reports:

```bash
# Generate coverage
pnpm run test:coverage

# View HTML report
open coverage/index.html
```

Coverage is automatically tracked and must meet thresholds before passing CI.

## CI/CD Integration

Tests run automatically on:
- **Pre-commit**: Type checking and linting
- **Push**: All tests, coverage, and build validation
- **Pull Request**: Same checks plus coverage reports

See [.github/workflows/ci.yml](../.github/workflows/ci.yml) for details.

## Troubleshooting

### "Module not found" in tests

```bash
# Rebuild packages
pnpm run build

# Clear Vitest cache
rm -rf node_modules/.vitest
```

### Tests timeout

```typescript
// Increase timeout for slow tests
it('slow test', async () => {
  // ...
}, { timeout: 10000 });
```

### Coverage not showing accurate results

```bash
# Clear coverage cache and regenerate
rm -rf coverage
pnpm run test:coverage
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://testing-library.com/)
