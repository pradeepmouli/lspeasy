# @company/utils

String and array utility functions for the monorepo.

## Features

- **String manipulation** - capitalize, camelCase, kebabCase, truncate
- **Array operations** - unique, groupBy, flatten, chunk
- **Type-safe** - Full TypeScript support
- **No dependencies** - Pure functional utilities

## Installation

```bash
pnpm add @company/utils
```

## Usage

### String Utilities

```typescript
import { capitalize, camelCase, kebabCase, truncate } from '@company/utils/string';

capitalize('hello');          // 'Hello'
camelCase('hello-world');     // 'helloWorld'
kebabCase('HelloWorld');      // 'hello-world'
truncate('Hello World', 8);   // 'Hello...'
```

### Array Utilities

```typescript
import { unique, groupBy, flatten, chunk } from '@company/utils/array';

unique([1, 2, 2, 3]);                      // [1, 2, 3]
groupBy([1, 2, 3], n => n % 2);            // { 0: [2], 1: [1, 3] }
flatten([[1, [2, 3]]], 1);                 // [1, [2, 3]]
chunk([1, 2, 3, 4, 5], 2);                 // [[1, 2], [3, 4], [5]]
```

## Sub-paths

You can import specific modules:

```typescript
// Import only string utilities
import { capitalize } from '@company/utils/string';

// Import only array utilities
import { unique } from '@company/utils/array';

// Import everything
import { capitalize, unique } from '@company/utils';
```

## API

### String Module

- **`capitalize(str: string): string`** - Capitalize first letter
- **`camelCase(str: string): string`** - Convert to camelCase
- **`kebabCase(str: string): string`** - Convert to kebab-case
- **`truncate(str: string, maxLength: number, suffix?: string): string`** - Truncate with suffix

### Array Module

- **`unique<T>(arr: T[]): T[]`** - Remove duplicates
- **`groupBy<T, K>(arr: T[], keyFn: (item: T) => K): Record<K, T[]>`** - Group by key
- **`flatten<T>(arr: Array<T | T[]>, depth?: number): T[]`** - Flatten nested arrays
- **`chunk<T>(arr: T[], size: number): T[][]`** - Split into chunks

## Testing

```bash
# Run tests for this package
pnpm --filter @company/utils test

# Watch mode
pnpm --filter @company/utils test:watch

# Coverage
pnpm --filter @company/utils test:coverage
```

## Performance

All functions are optimized for:
- Time complexity O(n) or O(n log n)
- Minimal memory allocations
- No external dependencies

## License

MIT
