# @company/core

Core utilities used across the monorepo.

## Features

- **Email validation** - RFC-compliant email validation
- **API response helpers** - Consistent response formatting
- **Async utilities** - Delay and promise helpers
- **Type-safe** - Full TypeScript support

## Installation

```bash
pnpm add @company/core
```

## Usage

### Email Validation

```typescript
import { isValidEmail } from '@company/core';

isValidEmail('user@example.com');  // true
isValidEmail('invalid');            // false
```

### API Responses

```typescript
import { createSuccessResponse, createErrorResponse } from '@company/core';

const success = createSuccessResponse({ user: { id: 1 } });
const error = createErrorResponse('Not found');
```

### Async Utilities

```typescript
import { delay } from '@company/core';

// Wait before continuing
await delay(1000);
```

## API

### `isValidEmail(email: string): boolean`

Validates email addresses using Zod schema validation.

### `createSuccessResponse<T>(data: T): ApiResponse<T>`

Creates a successful API response.

### `createErrorResponse(error: string): ApiResponse<never>`

Creates an error API response.

### `delay(ms: number): Promise<void>`

Returns a promise that resolves after the specified milliseconds.

## Testing

```bash
# Run tests for this package
pnpm --filter @company/core test

# Watch mode
pnpm --filter @company/core test:watch
```

## Types

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```
