# Quickstart: Middleware System & Client/Server DX Improvements

**Date**: 2026-02-11
**For**: [spec.md](spec.md)
**Status**: Phase 1 Complete

## Overview

This guide provides usage examples for the new features:
1. Middleware system for message interception
2. Native WebSocket client support
3. One-shot notification waiting
4. Connection health monitoring
5. Server-to-client request handling
6. Document change helpers

---

## 1. Middleware System

### Basic Logging Middleware

```typescript
import { LSPClient, type Middleware } from '@lspeasy/client';

const loggingMiddleware: Middleware = async (context, next) => {
  console.log(`→ ${context.direction} ${context.messageType}: ${context.method}`);
  const start = Date.now();

  await next();

  const duration = Date.now() - start;
  console.log(`← ${context.method} (${duration}ms)`);
};

const client = new LSPClient({
  transport: { type: 'websocket', url: 'ws://localhost:3000' },
  middleware: [loggingMiddleware],
});
```

### Timing Middleware (Cross-Cutting Metrics)

```typescript
const timingMiddleware: Middleware = async (context, next) => {
  context.metadata.startTime = Date.now();
  await next();

  const duration = Date.now() - (context.metadata.startTime as number);
  metrics.record(context.method, duration);
};
```

### Error Handling Middleware

```typescript
const errorHandlerMiddleware: Middleware = async (context, next) => {
  try {
    await next();
  } catch (error) {
    logger.error(`Error in ${context.method}:`, error);
    // Optionally transform or suppress error
    throw error;  // Re-throw if not suppressed
  }
};
```

### Caching Middleware (Short-Circuit Example)

```typescript
const cacheMiddleware: Middleware = async (context, next) => {
  // Only cache responses to specific requests
  if (context.direction === 'clientToServer' && context.messageType === 'request') {
    const cacheKey = `${context.method}:${JSON.stringify(context.message.params)}`;

    if (cache.has(cacheKey)) {
      return {
        shortCircuit: true,
        response: cache.get(cacheKey),
      };
    }

    // Not cached, proceed
    await next();

    // Cache response on serverToClient
    if (context.direction === 'serverToClient' && context.messageType === 'response') {
      cache.set(cacheKey, context.message);
    }
  } else {
    await next();
  }
};
```

### Composing Multiple Middleware

```typescript
import { composeMiddleware } from '@lspeasy/core/middleware';

const combined = composeMiddleware(
  loggingMiddleware,
  timingMiddleware,
  errorHandlerMiddleware,
  cacheMiddleware
);

const client = new LSPClient({
  transport: { type: 'websocket', url: 'ws://localhost:3000' },
  middleware: [combined],
});
```

### Method-Scoped Middleware

```typescript
import { createScopedMiddleware } from '@lspeasy/core/middleware';

// Only apply to textDocument/* methods
const textDocumentMiddleware = createScopedMiddleware(
  {
    methods: /^textDocument\//,
    direction: 'clientToServer',
    messageType: ['request']
  },
  async (context, next) => {
    console.log('Text document request:', context.method);
    await next();
  }
);

// Only apply to specific methods
const hoverAndCompletionMiddleware = createScopedMiddleware(
  { methods: ['textDocument/hover', 'textDocument/completion'] },
  async (context, next) => {
    const start = Date.now();
    await next();
    console.log(`${context.method} took ${Date.now() - start}ms`);
  }
);

const client = new LSPClient({
  transport: { type: 'websocket', url: 'ws://localhost:3000' },
  middleware: [
    loggingMiddleware,  // Global
    textDocumentMiddleware,  // Scoped to textDocument/* clientToServer requests
    hoverAndCompletionMiddleware,  // Scoped to hover and completion only
  ],
});
```

### Typed Middleware (Type-Safe Method-Specific)

```typescript
import { createTypedMiddleware } from '@lspeasy/core/middleware';
import type { HoverParams, Hover } from 'vscode-languageserver-protocol';

// Middleware with full type inference
const hoverMiddleware = createTypedMiddleware('textDocument/hover', async (context, next) => {
  // context.params is typed as HoverParams
  console.log('Hover at position:', context.params?.position);

  await next();

  // context.result is typed as Hover | null (in response context)
  if (context.direction === 'serverToClient' && context.messageType === 'response') {
    console.log('Hover result:', context.result);
  }
});

const completionMiddleware = createTypedMiddleware('textDocument/completion', async (context, next) => {
  // context.params is typed as CompletionParams
  const triggerKind = context.params?.context?.triggerKind;
  console.log('Completion trigger:', triggerKind);

  await next();
});

const client = new LSPClient({
  transport: { type: 'websocket', url: 'ws://localhost:3000' },
  middleware: [
    hoverMiddleware,
    completionMiddleware,
  ],
});
```

### Combining Global, Scoped, and Typed Middleware

```typescript
const client = new LSPClient({
  transport: { type: 'websocket', url: 'ws://localhost:3000' },
  middleware: [
    loggingMiddleware,  // Global: all messages
    createScopedMiddleware(
      { methods: /^textDocument\//, direction: 'clientToServer' },
      timingMiddleware
    ),  // Scoped: timing only for clientToServer textDocument/* methods
    createTypedMiddleware('textDocument/hover', async (context, next) => {
      // Type-safe hover-specific logic
      if (context.params) {
        cache.set(getCacheKey(context.params), Date.now());
      }
      await next();
    }),
  ],
});
```

### Using Pino Logging Middleware (Separate Package)

```typescript
import { LSPClient } from '@lspeasy/client';
import { createPinoMiddleware } from '@lspeasy/middleware-pino';
import pino from 'pino';

const logger = pino({ level: 'info' });

const client = new LSPClient({
  transport: { type: 'websocket', url: 'ws://localhost:3000' },
  middleware: [
    createPinoMiddleware(logger, {
      logLevel: 'debug',
      includeMessageContent: false,  // Avoid logging large payloads
    }),
  ],
});
```

---

## 2. Native WebSocket Client

### Node.js >= 22.4 (No Dependencies)

```typescript
import { LSPClient } from '@lspeasy/client';

// Native WebSocket automatically detected
const client = new LSPClient({
  transport: {
    type: 'websocket',
    url: 'ws://localhost:3000',
  },
});

await client.connect();
console.log('Connected using native WebSocket');
```

### Browser (Native WebSocket)

```typescript
import { LSPClient } from '@lspeasy/client';

const client = new LSPClient({
  transport: {
    type: 'websocket',
    url: 'wss://language-server.example.com',
  },
});

await client.connect();
```

### Older Node.js with `ws` Fallback

```typescript
// If Node.js < 22.4, install 'ws': npm install ws

import { LSPClient } from '@lspeasy/client';

const client = new LSPClient({
  transport: {
    type: 'websocket',
    url: 'ws://localhost:3000',
  },
});

// Automatically falls back to 'ws' library if native WebSocket unavailable
await client.connect();
```

### Reconnection (Unchanged Behavior)

```typescript
const client = new LSPClient({
  transport: {
    type: 'websocket',
    url: 'ws://localhost:3000',
    reconnect: {
      enabled: true,
      maxAttempts: 5,
      backoff: 'exponential',  // 1s, 2s, 4s, 8s, 16s
    },
  },
});

client.on('reconnecting', (attempt) => {
  console.log(`Reconnecting... attempt ${attempt}`);
});

client.on('reconnected', () => {
  console.log('Reconnected successfully');
});
```

---

## 3. One-Shot Notification Waiting

### Wait for Diagnostics After Opening Document

```typescript
import { LSPClient } from '@lspeasy/client';

const client = new LSPClient({ /* config */ });
await client.connect();

// Open document
await client.notify('textDocument/didOpen', {
  textDocument: {
    uri: 'file:///path/to/file.ts',
    languageId: 'typescript',
    version: 0,
    text: 'const x = 42;\n',
  },
});

// Wait for diagnostics (with timeout)
const diagnostics = await client.waitForNotification(
  'textDocument/publishDiagnostics',
  { timeout: 5000 }  // Required per user clarification
);

console.log('Diagnostics:', diagnostics);
```

### Wait with Filter (Specific File)

```typescript
const diagnostics = await client.waitForNotification(
  'textDocument/publishDiagnostics',
  {
    filter: (params) => params.uri === 'file:///path/to/file.ts',
    timeout: 5000,
  }
);
```

### Concurrent Waits (Multiple Notifications)

```typescript
// Wait for multiple notifications in parallel
const [diagnostics, progress] = await Promise.all([
  client.waitForNotification('textDocument/publishDiagnostics', { timeout: 5000 }),
  client.waitForNotification('$/progress', {
    filter: (params) => params.token === 'my-token',
    timeout: 10000
  }),
]);
```

### Error Handling (Timeout)

```typescript
try {
  const diagnostics = await client.waitForNotification(
    'textDocument/publishDiagnostics',
    { timeout: 2000 }
  );
} catch (error) {
  if (error.message.includes('Timeout')) {
    console.error('No diagnostics received within timeout');
  } else if (error.message.includes('Connection closed')) {
    console.error('Client disconnected while waiting');
  }
}
```

---

## 4. Connection Health Monitoring

### Basic State Monitoring

```typescript
import { LSPClient, ConnectionState } from '@lspeasy/client';

const client = new LSPClient({ /* config */ });

// Listen for state changes
const disposable = client.onStateChange((event) => {
  console.log(`State: ${event.previous} → ${event.current}`);
  if (event.reason) {
    console.log(`Reason: ${event.reason}`);
  }
});

await client.connect();
// Logs: "State: disconnected → connecting"
// Logs: "State: connecting → connected"

// Later: cleanup listener
disposable.dispose();
```

### Query Health Status

```typescript
const health = client.getHealth();
console.log('Connection state:', health.state);
console.log('Last sent:', health.lastMessageSent);
console.log('Last received:', health.lastMessageReceived);

if (health.state === ConnectionState.Connected) {
  const timeSinceLastMessage = Date.now() - health.lastMessageReceived!.getTime();
  console.log(`Last activity: ${timeSinceLastMessage}ms ago`);
}
```

### Heartbeat Monitoring (WebSocket Only, Opt-In)

```typescript
const client = new LSPClient({
  transport: {
    type: 'websocket',
    url: 'ws://localhost:3000',
    heartbeat: {
      enabled: true,         // Opt-in (default: false)
      interval: 30000,       // Ping every 30 seconds
      timeout: 10000,        // Mark unhealthy if no pong within 10s
    },
  },
});

// Listen for health changes (includes heartbeat status)
client.onHealthChange((event) => {
  if (event.heartbeat && !event.heartbeat.isResponsive) {
    console.warn('Server is not responding to heartbeat pings');
  }
});

await client.connect();

// Query heartbeat status
const health = client.getHealth();
if (health.heartbeat) {
  console.log('Heartbeat enabled:', health.heartbeat.enabled);
  console.log('Responsive:', health.heartbeat.isResponsive);
  console.log('Last ping:', health.heartbeat.lastPing);
  console.log('Last pong:', health.heartbeat.lastPong);
}
```

### Monitor Long-Running Idle Connections

```typescript
const client = new LSPClient({ /* config */ });
await client.connect();

// Periodically check health
setInterval(() => {
  const health = client.getHealth();

  if (health.state === ConnectionState.Connected && health.lastMessageReceived) {
    const idleTime = Date.now() - health.lastMessageReceived.getTime();

    if (idleTime > 60000) {  // 1 minute idle
      console.warn(`Connection idle for ${idleTime}ms`);
    }
  }
}, 10000);  // Check every 10 seconds
```

---

## 5. Server-to-Client Request Handling

### Handle `workspace/applyEdit` Requests

```typescript
import { LSPClient } from '@lspeasy/client';

const client = new LSPClient({ /* config */ });

// Register handler for server-initiated requests
client.onRequest('workspace/applyEdit', async (params) => {
  console.log('Server requested edit:', params.edit);

  // Apply edit to local workspace
  const success = await applyEditsToWorkspace(params.edit);

  // Return response (automatically correlated by client)
  return { applied: success };
});

await client.connect();
```

### Handle `window/showMessageRequest`

```typescript
client.onRequest('window/showMessageRequest', async (params) => {
  console.log('Server message:', params.message);

  // Prompt user to select an action
  const selectedAction = await promptUser(params.actions);

  // Return selected action (or null if dismissed)
  return selectedAction;
});
```

### Handle `workspace/configuration`

```typescript
client.onRequest('workspace/configuration', async (params) => {
  // Server requests configuration values
  const configs = params.items.map((item) => {
    if (item.section === 'myLanguage') {
      return { enabled: true, maxErrors: 100 };
    }
    return null;
  });

  return configs;
});
```

### No Handler Registered (Automatic Error Response)

```typescript
// If no handler registered, client responds with "method not found" error
// No manual handling needed

await client.connect();

// Server sends `workspace/applyEdit`, but no handler registered
// Client automatically responds: { error: { code: -32601, message: "Method not found" } }
```

---

## 6. Document Change Helpers

### With `DocumentVersionTracker` (Stateful)

```typescript
import { DocumentVersionTracker, createIncrementalChange, createDidOpen, createDidClose } from '@lspeasy/client/document';

const tracker = new DocumentVersionTracker();
const uri = 'file:///path/to/file.ts';

// Open document
tracker.open(uri, 0);
await client.notify('textDocument/didOpen', createDidOpen(uri, 'typescript', 0, 'const x = 42;\n'));

// Incremental change (version auto-increments to 1)
const change1 = createIncrementalChange(
  uri,
  tracker,  // Automatically gets next version
  { start: { line: 0, character: 6 }, end: { line: 0, character: 10 } },
  'y = 100'
);
await client.notify('textDocument/didChange', change1);

// Another incremental change (version auto-increments to 2)
const change2 = createIncrementalChange(
  uri,
  tracker,
  { start: { line: 1, character: 0 }, end: { line: 1, character: 0 } },
  'const z = 200;\n'
);
await client.notify('textDocument/didChange', change2);

// Close document
await client.notify('textDocument/didClose', createDidClose(uri));
tracker.close(uri);  // Cleanup tracker state
```

### With Explicit Versions (Stateless)

```typescript
import { createIncrementalChange, createFullChange } from '@lspeasy/client/document';

const uri = 'file:///path/to/file.ts';

// Open document (version 0)
await client.notify('textDocument/didOpen', createDidOpen(uri, 'typescript', 0, 'const x = 42;\n'));

// Incremental change (explicit version 1)
const change1 = createIncrementalChange(
  uri,
  1,  // Explicit version
  { start: { line: 0, character: 6 }, end: { line: 0, character: 10 } },
  'y = 100'
);
await client.notify('textDocument/didChange', change1);

// Full document replacement (explicit version 2)
const change2 = createFullChange(uri, 2, 'const y = 100;\nconst z = 200;\n');
await client.notify('textDocument/didChange', change2);
```

### Full Document Sync (TextDocumentSyncKind.Full)

```typescript
import { createFullChange } from '@lspeasy/client/document';

const uri = 'file:///path/to/file.ts';
let version = 0;

// Open document
await client.notify('textDocument/didOpen', createDidOpen(uri, 'typescript', version, 'const x = 42;\n'));

// User types a character → send full document
version++;
const newContent = 'const x = 42;\nconst y = 100;\n';
await client.notify('textDocument/didChange', createFullChange(uri, version, newContent));
```

### Mixed Tracker and Explicit Versions

```typescript
const tracker = new DocumentVersionTracker();
const uri = 'file:///path/to/file.ts';

tracker.open(uri, 0);

// Use tracker for most changes
const change1 = createIncrementalChange(uri, tracker, range1, text1);

// Override version explicitly for a specific change
const change2 = createIncrementalChange(uri, 10, range2, text2);

// Continue with tracker (version 11)
const change3 = createIncrementalChange(uri, tracker, range3, text3);
```

---

## Complete Example: All Features Combined

```typescript
import { LSPClient, ConnectionState, type Middleware } from '@lspeasy/client';
import { DocumentVersionTracker, createIncrementalChange, createDidOpen, createDidClose } from '@lspeasy/client/document';

// 1. Setup middleware
const loggingMiddleware: Middleware = async (context, next) => {
  console.log(`[${context.direction}] ${context.method}`);
  await next();
};

// 2. Create client with native WebSocket and middleware
const client = new LSPClient({
  transport: {
    type: 'websocket',
    url: 'ws://localhost:3000',
    heartbeat: { enabled: true, interval: 30000, timeout: 10000 },
  },
  middleware: [loggingMiddleware],
});

// 3. Monitor connection health
client.onStateChange((event) => {
  console.log(`State: ${event.previous} → ${event.current}`);
});

// 4. Handle server-to-client requests
client.onRequest('workspace/applyEdit', async (params) => {
  return { applied: true };
});

// 5. Connect and initialize
await client.connect();

const initResult = await client.request('initialize', {
  processId: process.pid,
  clientInfo: { name: 'my-client', version: '1.0.0' },
  capabilities: {},
  rootUri: 'file:///workspace',
});

await client.notify('initialized', {});

// 6. Open document and track versions
const tracker = new DocumentVersionTracker();
const uri = 'file:///workspace/file.ts';

tracker.open(uri, 0);
await client.notify('textDocument/didOpen', createDidOpen(uri, 'typescript', 0, 'const x = 42;\n'));

// 7. Wait for initial diagnostics
const diagnostics = await client.waitForNotification(
  'textDocument/publishDiagnostics',
  { filter: (params) => params.uri === uri, timeout: 5000 }
);
console.log('Initial diagnostics:', diagnostics);

// 8. Apply incremental change
const change = createIncrementalChange(
  uri,
  tracker,
  { start: { line: 1, character: 0 }, end: { line: 1, character: 0 } },
  'const y = 100;\n'
);
await client.notify('textDocument/didChange', change);

// 9. Wait for updated diagnostics
const updatedDiagnostics = await client.waitForNotification(
  'textDocument/publishDiagnostics',
  { filter: (params) => params.uri === uri, timeout: 5000 }
);
console.log('Updated diagnostics:', updatedDiagnostics);

// 10. Check health
const health = client.getHealth();
console.log('Connection health:', health.state);
console.log('Heartbeat responsive:', health.heartbeat?.isResponsive);

// 11. Cleanup
await client.notify('textDocument/didClose', createDidClose(uri));
tracker.close(uri);

await client.request('shutdown', null);
await client.notify('exit', null);
```

---

## Testing Patterns

### Test Middleware Execution Order

```typescript
import { describe, it, expect } from 'vitest';

describe('Middleware execution order', () => {
  it('executes in registration order', async () => {
    const order: string[] = [];

    const middleware1: Middleware = async (context, next) => {
      order.push('1-before');
      await next();
      order.push('1-after');
    };

    const middleware2: Middleware = async (context, next) => {
      order.push('2-before');
      await next();
      order.push('2-after');
    };

    const client = new LSPClient({
      transport: { type: 'stdio', command: 'language-server' },
      middleware: [middleware1, middleware2],
    });

    await client.connect();
    await client.request('initialize', { /* ... */ });

    expect(order).toEqual(['1-before', '2-before', '2-after', '1-after']);
  });
});
```

### Test Notification Waiting with Timeout

```typescript
it('rejects on timeout', async () => {
  const client = new LSPClient({ /* config */ });
  await client.connect();

  await expect(
    client.waitForNotification('nonexistent/notification', { timeout: 100 })
  ).rejects.toThrow('Timeout');
});
```

### Test Connection Health Events

```typescript
it('emits state change events', async () => {
  const client = new LSPClient({ /* config */ });
  const events: StateChangeEvent[] = [];

  client.onStateChange((event) => events.push(event));

  await client.connect();

  expect(events).toHaveLength(2);
  expect(events[0]).toMatchObject({ previous: ConnectionState.Disconnected, current: ConnectionState.Connecting });
  expect(events[1]).toMatchObject({ previous: ConnectionState.Connecting, current: ConnectionState.Connected });
});
```

### Test Method-Scoped Middleware

```typescript
it('applies scoped middleware only to matching methods', async () => {
  const calledMethods: string[] = [];

  const scopedMiddleware = createScopedMiddleware(
    { methods: /^textDocument\// },
    async (context, next) => {
      calledMethods.push(context.method);
      await next();
    }
  );

  const client = new LSPClient({
    transport: { type: 'stdio', command: 'language-server' },
    middleware: [scopedMiddleware],
  });

  await client.connect();
  await client.request('initialize', { /* ... */ });  // Not matched
  await client.request('textDocument/hover', { /* ... */ });  // Matched
  await client.request('workspace/symbol', { /* ... */ });  // Not matched
  await client.request('textDocument/completion', { /* ... */ });  // Matched

  expect(calledMethods).toEqual(['textDocument/hover', 'textDocument/completion']);
});
```

### Test Typed Middleware Type Safety

```typescript
it('provides typed context for typed middleware', async () => {
  const hoverMiddleware = createTypedMiddleware('textDocument/hover', async (context, next) => {
    // Type assertion to verify context.params is HoverParams
    expect(context.method).toBe('textDocument/hover');
    expect(context.params).toHaveProperty('textDocument');
    expect(context.params).toHaveProperty('position');
    await next();
  });

  const client = new LSPClient({
    transport: { type: 'stdio', command: 'language-server' },
    middleware: [hoverMiddleware],
  });

  await client.connect();
  await client.request('initialize', { /* ... */ });

  await client.request('textDocument/hover', {
    textDocument: { uri: 'file:///test.ts' },
    position: { line: 0, character: 0 }
  });
});
```

### Test Middleware Filter Combinations

```typescript
it('applies filter with direction and message type', async () => {
  const calls: string[] = [];

  const clientToServerRequestMiddleware = createScopedMiddleware(
    {
      methods: ['textDocument/hover'],
      direction: 'clientToServer',
      messageType: ['request']
    },
    async (context, next) => {
      calls.push(`${context.direction}-${context.messageType}`);
      await next();
    }
  );

  const client = new LSPClient({
    transport: { type: 'stdio', command: 'language-server' },
    middleware: [clientToServerRequestMiddleware],
  });

  await client.connect();
  await client.request('initialize', { /* ... */ });

  // Should trigger: clientToServer request
  await client.request('textDocument/hover', { /* ... */ });

  // serverToClient response should NOT trigger scoped middleware
  // (only clientToServer requests match the filter)

  expect(calls).toEqual(['clientToServer-request']);
});
```

---

**Phase 1 Status (quickstart.md)**: ✅ Complete - All usage patterns documented.
