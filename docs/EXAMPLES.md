# Examples

This document provides examples demonstrating how to use the lspeasy LSP SDK.

## Table of Contents

- [Basic Server](#basic-server)
- [Basic Client](#basic-client)
- [Capability-Aware Server](#capability-aware-server)
- [Capability-Aware Client](#capability-aware-client)
- [Custom Transport](#custom-transport)
- [Dynamic Registration](#dynamic-registration)
- [Worker Transports](#worker-transports)
- [Notebook Sync](#notebook-sync)

## Basic Server

```typescript
import { LSPServer, StdioTransport } from '@lspeasy/server';

const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0'
});

// Set server capabilities
server.setCapabilities({
  textDocumentSync: { openClose: true, change: 1 },
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] }
});

// Register request handler
server.onRequest('textDocument/hover', async (params) => {
  return {
    contents: { kind: 'markdown', value: 'Hover text' }
  };
});

// Start listening
const transport = new StdioTransport();
await server.listen(transport);
```

## Basic Client

```typescript
import { LSPClient, WebSocketTransport } from '@lspeasy/client';

const client = new LSPClient({
  name: 'my-client',
  version: '1.0.0'
});

const transport = new WebSocketTransport('ws://localhost:8080');
await client.connect(transport);

// Send requests
const hoverResult = await client.sendRequest('textDocument/hover', {
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 10, character: 5 }
});

await client.shutdown();
```

## Capability-Aware Server

The server validates that handlers are only registered for capabilities that have been declared. In strict mode, attempting to register a handler for an undeclared capability will throw an error.

```typescript
import { LSPServer, StdioTransport } from '@lspeasy/server';
import type { ServerCapabilities } from '@lspeasy/core';

// Define server capabilities
const capabilities: ServerCapabilities = {
  textDocumentSync: { openClose: true, change: 1 },
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] },
  // Note: definitionProvider is NOT declared
};

// Create server with strict capability checking
const server = new LSPServer({
  name: 'capability-aware-server',
  version: '1.0.0',
  strictCapabilities: true  // Throws error if handler doesn't match capability
});

server.setCapabilities(capabilities);

// ✅ This works - hover capability is declared
server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'Hover text' };
});

// ❌ This throws error in strict mode - definitionProvider not declared
// server.onRequest('textDocument/definition', async (params) => {
//   return { uri: params.textDocument.uri, range: ... };
// });

const transport = new StdioTransport();
await server.listen(transport);
```

## Capability-Aware Client

After connecting, the client dynamically exposes methods based on the server's declared capabilities. Methods for unsupported capabilities are not available.

```typescript
import { LSPClient, WebSocketTransport } from '@lspeasy/client';

const client = new LSPClient({
  name: 'capability-aware-client',
  version: '1.0.0'
});

const transport = new WebSocketTransport('ws://localhost:8080');
await client.connect(transport);

// After initialization, methods are dynamically available
console.log('Server capabilities:', client.serverCapabilities);

// ✅ Check if method is available before calling
if ('hover' in client.textDocument) {
  const hover = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 10, character: 5 }
  });
  console.log('Hover:', hover);
} else {
  console.log('Server does not support hover');
}

// List available methods
const methods = Object.keys(client.textDocument).filter(
  key => typeof client.textDocument[key] === 'function'
);
console.log('Available methods:', methods);

await client.shutdown();
```

## Custom Transport

```typescript
import { capitalize, camelCase, kebabCase, truncate } from '@company/utils';

// Capitalize
capitalize('hello');        // 'Hello'
capitalize('world');        // 'World'

// camelCase
camelCase('hello-world');   // 'helloWorld'
camelCase('hello_world');   // 'helloWorld'
camelCase('HelloWorld');    // 'helloWorld'

// kebabCase
kebabCase('HelloWorld');    // 'hello-world'
kebabCase('helloWorld');    // 'hello-world'

// Truncate
truncate('Hello World', 8); // 'Hello...'
truncate('Hi', 8);          // 'Hi'
```

## Array Utilities

```typescript
import { unique, groupBy, flatten, chunk } from '@company/utils';

// Remove duplicates
unique([1, 2, 2, 3, 3, 3]);           // [1, 2, 3]
unique(['a', 'b', 'a']);              // ['a', 'b']

// Group by key
const users = [
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' },
  { id: 3, role: 'admin' },
];
groupBy(users, (u) => u.role);
// { admin: [{id:1,...}, {id:3,...}], user: [{id:2,...}] }

// Flatten nested arrays
flatten([[1, 2], [3, [4, 5]]], 1);    // [1, 2, 3, [4, 5]]
flatten([[1, 2], [3, [4, 5]]], 2);    // [1, 2, 3, 4, 5]

// Split into chunks
chunk([1, 2, 3, 4, 5], 2);            // [[1, 2], [3, 4], [5]]
chunk('hello', 2);                    // ['he', 'll', 'o']
```

## Core Utilities

## Dynamic Registration

```typescript
const client = new LSPClient({
  capabilities: {
    workspace: {
      didChangeWatchedFiles: { dynamicRegistration: true }
    }
  }
});

const runtime = client.getRuntimeCapabilities();
console.log(runtime.dynamicRegistrations);
```

## Worker Transports

```typescript
const dedicated = new DedicatedWorkerTransport({ worker });
const shared = new SharedWorkerTransport({
  worker: sharedWorker,
  port: sharedWorker.port,
  clientId: crypto.randomUUID()
});
```

## Notebook Sync

```typescript
await client.notebookDocument.didOpen(openParams);
server.notebookDocument.onDidOpen((params) => {
  // handle notebook open
});
```

### Email Validation

```typescript
import { isValidEmail, createSuccessResponse, createErrorResponse } from '@company/core';

// Validate email
isValidEmail('user@example.com');     // true
isValidEmail('invalid-email');        // false

// Create response
const response = createSuccessResponse({ email: 'user@example.com' });
// { success: true, data: { email: 'user@example.com' } }
```

### API Response Helpers

```typescript
import { createSuccessResponse, createErrorResponse } from '@company/core';

// Success response
const success = createSuccessResponse({
  user: { id: 1, name: 'John' },
  token: 'abc123',
});
// { success: true, data: { user: {...}, token: '...' } }

// Error response
const error = createErrorResponse('User not found');
// { success: false, error: 'User not found' }
```

### Async Utilities

```typescript
import { delay } from '@company/core';

// Wait before continuing
async function fetchWithRetry() {
  try {
    return await fetch('/api/data');
  } catch {
    // Retry after delay
    await delay(1000);
    return fetch('/api/data');
  }
}
```

## Cross-Package Usage

```typescript
import { isValidEmail } from '@company/core';
import { capitalize } from '@company/utils';

// Combine utilities
function formatUserEmail(email: string): string | null {
  if (!isValidEmail(email)) return null;

  const [localPart] = email.split('@');
  return capitalize(localPart);
}

formatUserEmail('john.doe@example.com');  // 'John.doe'
formatUserEmail('invalid-email');         // null
```

## Testing with Test Utilities

```typescript
import { describe, it, expect } from 'vitest';
import {
  createMockUser,
  createMockApiResponse,
  createMockFn,
} from '@company/test-utils';

describe('User Service', () => {
  it('should fetch and process user', async () => {
    const mockUser = createMockUser({ name: 'Alice' });
    const mockFn = createMockFn();
    mockFn.mockResolvedValue(createMockApiResponse({ user: mockUser }));

    const response = await mockFn();

    expect(response.success).toBe(true);
    expect(response.data.user.name).toBe('Alice');
  });
});
```

## Monorepo Development Example

Creating a new feature across packages:

```typescript
// 1. Add validation logic in @company/core
// packages/core/src/validation.ts
export function validateUsername(username: string): boolean {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
}

// 2. Use in @company/utils for formatting
// packages/utils/src/user.ts
import { validateUsername } from '@company/core';

export function formatUsername(name: string): string {
  if (!validateUsername(name)) throw new Error('Invalid username');
  return name.toLowerCase();
}

// 3. Test integration
// integration.test.ts
import { validateUsername } from '@company/core';
import { formatUsername } from '@company/utils';

it('should validate and format usernames', () => {
  expect(formatUsername('JohnDoe')).toBe('johndoe');
  expect(() => formatUsername('ab')).toThrow();
});
```

## Real-World Scenarios

### User Data Processing

```typescript
import { isValidEmail } from '@company/core';
import { capitalize, unique } from '@company/utils';

const users = [
  { email: 'john@example.com', name: 'john' },
  { email: 'invalid', name: 'jane' },
  { email: 'bob@example.com', name: 'bob' },
];

const validUsers = users
  .filter((u) => isValidEmail(u.email))
  .map((u) => ({
    ...u,
    name: capitalize(u.name),
  }));

// [
//   { email: 'john@example.com', name: 'John' },
//   { email: 'bob@example.com', name: 'Bob' },
// ]
```

### Data Batch Processing

```typescript
import { chunk } from '@company/utils';

const items = Array.from({ length: 1000 }, (_, i) => i);
const batches = chunk(items, 100);

for (const batch of batches) {
  await processBatch(batch);
}
```

### API Error Handling

```typescript
import { createSuccessResponse, createErrorResponse, delay } from '@company/core';

async function fetchWithFallback(url: string) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return createSuccessResponse(data);
  } catch (error) {
    // Retry with exponential backoff
    await delay(1000);

    try {
      const response = await fetch(url);
      const data = await response.json();
      return createSuccessResponse(data);
    } catch {
      return createErrorResponse('Failed to fetch data');
    }
  }
}
```

## Running Examples

All examples are part of the test suite:

```bash
# Run integration tests with examples
pnpm run test integration.test.ts

# Run specific example
pnpm run test -- --grep "should process user data"

# Watch examples as you edit
pnpm run test:watch -- integration.test.ts
```

## More Information

- [Core Package](../packages/core/README.md)
- [Utils Package](../packages/utils/README.md)
- [Test Utils Package](../packages/test-utils/README.md)
- [Workspace Guide](./WORKSPACE.md)
- [Testing Guide](./TESTING.md)
- [Development Workflow](./DEVELOPMENT.md)
