# @company/test-utils

Shared testing utilities for the monorepo using Vitest.

## Features

- **Mock utilities** - Create mocks and spies
- **Test fixtures** - Pre-built test data
- **API helpers** - Mock API responses
- **Type-safe** - Full TypeScript support

## Installation

```bash
pnpm add -D @company/test-utils
```

## Usage

### Creating Test Data

```typescript
import { createMockUser, createMockEmail, createMockApiResponse } from '@company/test-utils';

// Create a mock user
const user = createMockUser({ name: 'Alice' });

// Create a mock email
const email = createMockEmail({ to: 'alice@example.com' });

// Create a mock API response
const response = createMockApiResponse({ status: 201 });
```

### Mocking Functions

```typescript
import { createMockFn, spyOn } from '@company/test-utils';

// Create a mock function
const mockFn = createMockFn();
mockFn.mockResolvedValue({ id: 1 });

// Spy on console
const consoleSpy = spyOn(console, 'log');
console.log('test');
expect(consoleSpy).toHaveBeenCalledWith('test');
```

### Working with Time

```typescript
import { createMockTimer } from '@company/test-utils';

it('should handle timeouts', () => {
  const timer = createMockTimer();

  setTimeout(() => {
    doSomething();
  }, 1000);

  timer.advanceTimersByTime(1000);
  timer.restore();
});
```

### Mocking Fetch

```typescript
import { mockFetch } from '@company/test-utils';

it('should fetch data', async () => {
  mockFetch('/api/users', { success: true });

  const response = await fetch('/api/users');
  const data = await response.json();

  expect(data.success).toBe(true);
});
```

## API

### Mock Functions

- **`createMockFn(): Mock`** - Create a mock function

### Spies

- **`spyOn<T, K>(obj: T, method: K): Spy`** - Spy on object method

### Timers

- **`createMockTimer(): MockTimer`** - Create a fake timer controller
  - `.runAll()` - Run all timers
  - `.advanceTimersByTime(ms)` - Advance by milliseconds
  - `.restore()` - Restore real timers

### Fixtures

- **`createMockUser(overrides?): User`** - Create a user
- **`createMockEmail(overrides?): Email`** - Create an email
- **`createMockApiResponse(overrides?): ApiResponse`** - Create an API response
- **`createMockErrorResponse(message?): ApiResponse`** - Create an error response
- **`createMockArray<T>(count: number, factory): T[]`** - Create an array of mocks

## Examples

### Full Test Example

```typescript
import { describe, it, expect } from 'vitest';
import {
  createMockUser,
  createMockFn,
  createMockApiResponse,
} from '@company/test-utils';

describe('UserService', () => {
  it('should fetch and process user', async () => {
    // Arrange
    const mockUser = createMockUser({ name: 'Alice' });
    const mockFn = createMockFn();
    mockFn.mockResolvedValue(createMockApiResponse({ user: mockUser }));

    // Act
    const response = await mockFn();

    // Assert
    expect(response.success).toBe(true);
    expect(response.data.user.name).toBe('Alice');
  });
});
```

## Testing

```bash
# Run tests (if any)
pnpm --filter @company/test-utils test
```

## License

MIT
