# @lspeasy/core

Core transport layer and utilities for the lspeasy Language Server Protocol SDK.

## Overview

`@lspeasy/core` provides the foundational building blocks for LSP communication:

- **Transport Interface**: Abstract transport layer for message exchange
- **StdioTransport**: Standard input/output transport implementation
- **WebSocketTransport**: WebSocket transport with automatic reconnection
- **Middleware Pipeline**: Composable JSON-RPC interception with method scoping and typing
- **JSON-RPC 2.0**: Message framing, parsing, and serialization
- **Type-Safe Enums**: Enums for all LSP kind types with extensibility support
- **Cancellation**: Token-based cancellation support
- **Utilities**: Event emitters, disposables, logging, and document sync helpers

## Middleware API

Middleware is exported from `@lspeasy/core/middleware`.

```typescript
import {
  composeMiddleware,
  createScopedMiddleware,
  createTypedMiddleware,
  type Middleware
} from '@lspeasy/core/middleware';

const logging: Middleware = async (context, next) => {
  console.log(`${context.direction} ${context.messageType} ${context.method}`);
  await next();
};

const scoped = createScopedMiddleware(
  { methods: /^textDocument\//, direction: 'clientToServer', messageType: ['request'] },
  async (context, next) => {
    context.metadata.startedAt = Date.now();
    await next();
  }
);

const typed = createTypedMiddleware('textDocument/hover', async (context, next) => {
  console.log(context.params?.position);
  await next();
});

export const middleware = composeMiddleware(logging, scoped, typed);
```

## Native WebSocket Support

- `createWebSocketClient()` and `WebSocketTransport` use native `globalThis.WebSocket` when available.
- Node.js `>= 22.4` is recommended for native WebSocket client support.
- For older Node.js versions, install `ws` as an optional peer dependency.
- WebSocket server mode (`WebSocketServer`) still requires `ws`.

## Document Change Helpers

Use document helpers from `@lspeasy/core/utils` to create typed didChange payloads.

```typescript
import {
  DocumentVersionTracker,
  createIncrementalDidChangeParams,
  createFullDidChangeParams
} from '@lspeasy/core/utils';

const tracker = new DocumentVersionTracker();
tracker.open('file:///demo.ts', 0);

const incremental = createIncrementalDidChangeParams(
  'file:///demo.ts',
  [
    {
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 5 }
      },
      text: 'const'
    }
  ],
  { tracker }
);

const full = createFullDidChangeParams('file:///demo.ts', 'const value = 1;', {
  tracker
});
```

## Installation

```bash
npm install @lspeasy/core
# or
pnpm add @lspeasy/core
# or
yarn add @lspeasy/core
```

## Quick Start

### Type-Safe LSP Enums

The SDK exports enums for all LSP kind types, providing type safety and IDE autocomplete:

```typescript
import {
  CompletionItemKind,
  SymbolKind,
  DiagnosticSeverity,
  CodeActionKind,
  FoldingRangeKind
} from '@lspeasy/core/protocol/enums';

// Use enums instead of magic numbers
const completion = {
  label: 'myFunction',
  kind: CompletionItemKind.Function // Instead of: kind: 2
};

// String-based kinds support both enums and custom values
const codeAction = {
  title: 'Quick fix',
  kind: CodeActionKind.QuickFix // Or custom: 'refactor.extract.helper'
};
```

### Using StdioTransport

```typescript
import { StdioTransport } from '@lspeasy/core';

// Create transport for stdio communication
const transport = new StdioTransport();

// Listen for messages
transport.onMessage((message) => {
  console.log('Received:', message);
});

// Send a message
await transport.send({
  jsonrpc: '2.0',
  method: 'initialize',
  id: 1,
  params: { /* ... */ }
});

// Clean up
await transport.close();
```

### Using WebSocketTransport

```typescript
import { WebSocketTransport } from '@lspeasy/core';

// Client mode with automatic reconnection
const transport = new WebSocketTransport({
  url: 'ws://localhost:3000',
  enableReconnect: true,
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  maxReconnectDelay: 30000,
  reconnectBackoffMultiplier: 2
});

// Subscribe to events
transport.onMessage((message) => {
  console.log('Received:', message);
});

transport.onError((error) => {
  console.error('Transport error:', error);
});

transport.onClose(() => {
  console.log('Connection closed');
});

// Send messages
await transport.send({
  jsonrpc: '2.0',
  method: 'textDocument/hover',
  id: 2,
  params: { /* ... */ }
});
```

If running on Node.js < 22.4 and using client mode, install `ws`:

```bash
pnpm add ws
```

### Server Mode WebSocket

```typescript
import { WebSocketTransport } from '@lspeasy/core';
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', (ws) => {
  // Wrap existing WebSocket connection
  const transport = new WebSocketTransport({
    socket: ws
  });

  transport.onMessage((message) => {
    // Handle LSP messages
  });
});
```

## Transport Interface

All transports implement the `Transport` interface:

```typescript
interface Transport {
  // Send a JSON-RPC message
  send(message: JSONRPCMessage): Promise<void>;

  // Subscribe to incoming messages
  onMessage(handler: (message: JSONRPCMessage) => void): Disposable;

  // Subscribe to errors
  onError(handler: (error: Error) => void): Disposable;

  // Subscribe to connection close
  onClose(handler: () => void): Disposable;

  // Close the transport
  close(): Promise<void>;
}
```

### Creating Custom Transports

You can implement custom transports for any communication protocol:

```typescript
import { Transport, Disposable, JSONRPCMessage } from '@lspeasy/core';
import EventEmitter from 'events';

class HTTPPollingTransport implements Transport {
  private events = new EventEmitter();
  private pollInterval: NodeJS.Timeout | null = null;

  constructor(private url: string) {
    this.startPolling();
  }

  async send(message: JSONRPCMessage): Promise<void> {
    await fetch(`${this.url}/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
  }

  onMessage(handler: (message: JSONRPCMessage) => void): Disposable {
    this.events.on('message', handler);
    return {
      dispose: () => this.events.off('message', handler)
    };
  }

  onError(handler: (error: Error) => void): Disposable {
    this.events.on('error', handler);
    return {
      dispose: () => this.events.off('error', handler)
    };
  }

  onClose(handler: () => void): Disposable {
    this.events.on('close', handler);
    return {
      dispose: () => this.events.off('close', handler)
    };
  }

  async close(): Promise<void> {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.events.emit('close');
  }

  private startPolling(): void {
    this.pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${this.url}/poll`);
        const messages = await response.json();
        for (const message of messages) {
          this.events.emit('message', message);
        }
      } catch (error) {
        this.events.emit('error', error);
      }
    }, 100);
  }
}
```

## JSON-RPC Message Utilities

### Parsing and Serialization

```typescript
import { parseMessages, serializeMessage } from '@lspeasy/core';

// Parse HTTP-style headers + JSON content
const input = 'Content-Length: 59\r\n\r\n{"jsonrpc":"2.0","method":"initialize","id":1,"params":{}}';
const messages = parseMessages(input);
// messages = [{ jsonrpc: '2.0', method: 'initialize', id: 1, params: {} }]

// Serialize back to wire format
const output = serializeMessage(messages[0]);
// output = 'Content-Length: 59\r\n\r\n{"jsonrpc":"2.0","method":"initialize","id":1,"params":{}}'
```

### Creating Messages

```typescript
// JSON-RPC 2.0 request message
const request = {
  jsonrpc: '2.0',
  id: 1,
  method: 'textDocument/hover',
  params: { /* params */ },
};

// JSON-RPC 2.0 notification message (no id)
const notification = {
  jsonrpc: '2.0',
  method: 'textDocument/didChange',
  params: { /* params */ },
};

// Successful response message
const response = {
  jsonrpc: '2.0',
  id: 1,
  result: { /* result */ },
};

// Error response message
const errorResponse = {
  jsonrpc: '2.0',
  id: 1,
  error: {
    code: -32601,
    message: 'Method not found',
    // optional: data: { ... },
  },
};
```

## Cancellation

### CancellationToken

```typescript
import { CancellationTokenSource } from '@lspeasy/core';

const source = new CancellationTokenSource();
const token = source.token;

// Subscribe to cancellation
token.onCancellationRequested(() => {
  console.log('Operation cancelled');
});

// Check if cancelled
if (token.isCancellationRequested) {
  return;
}

// Cancel the operation
source.cancel();

// Clean up
source.dispose();
```

### Using with Async Operations

```typescript
async function longRunningTask(token: CancellationToken): Promise<void> {
  for (let i = 0; i < 100; i++) {
    if (token.isCancellationRequested) {
      throw new Error('Operation cancelled');
    }
    await doWork();
  }
}

const source = new CancellationTokenSource();
longRunningTask(source.token).catch(console.error);

// Cancel after 5 seconds
setTimeout(() => source.cancel(), 5000);
```

## Logging

```typescript
import { ConsoleLogger, LogLevel } from '@lspeasy/core';

// Create logger
const logger = new ConsoleLogger('MyServer', LogLevel.Debug);

// Log at different levels
logger.error('Error message', new Error('Something failed'));
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug message');
```

## Error Codes

Standard JSON-RPC 2.0 error codes:

```typescript
enum ErrorCode {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603
}
```

## Best Practices

### Resource Management

Always clean up resources using the Disposable pattern:

```typescript
const disposables: Disposable[] = [];

disposables.push(transport.onMessage(handleMessage));
disposables.push(transport.onError(handleError));
disposables.push(transport.onClose(handleClose));

// Later, dispose all
disposables.forEach(d => d.dispose());
```

### Error Handling

Wrap transport operations in try/catch:

```typescript
try {
  await transport.send(message);
} catch (error) {
  logger.error('Failed to send message', error as Error);
  // Handle error (reconnect, retry, etc.)
}
```

### WebSocket Reconnection

Configure reconnection parameters based on your use case:

```typescript
// Aggressive reconnection for interactive apps
const transport = new WebSocketTransport({
  url: 'ws://localhost:3000',
  enableReconnect: true,
  maxReconnectAttempts: 10,
  reconnectDelay: 500,
  maxReconnectDelay: 5000,
  reconnectBackoffMultiplier: 1.5
});

// Conservative reconnection for batch processing
const transport = new WebSocketTransport({
  url: 'ws://localhost:3000',
  enableReconnect: true,
  maxReconnectAttempts: 3,
  reconnectDelay: 5000,
  maxReconnectDelay: 30000,
  reconnectBackoffMultiplier: 2
});
```

## Testing

Use mock transports for testing:

```typescript
import { Transport, Disposable, JSONRPCMessage } from '@lspeasy/core';
import EventEmitter from 'events';

class MockTransport implements Transport {
  private events = new EventEmitter();
  public sentMessages: JSONRPCMessage[] = [];

  async send(message: JSONRPCMessage): Promise<void> {
    this.sentMessages.push(message);
  }

  onMessage(handler: (message: JSONRPCMessage) => void): Disposable {
    this.events.on('message', handler);
    return { dispose: () => this.events.off('message', handler) };
  }

  onError(handler: (error: Error) => void): Disposable {
    this.events.on('error', handler);
    return { dispose: () => this.events.off('error', handler) };
  }

  onClose(handler: () => void): Disposable {
    this.events.on('close', handler);
    return { dispose: () => this.events.off('close', handler) };
  }

  async close(): Promise<void> {
    this.events.emit('close');
  }

  // Test helpers
  simulateMessage(message: JSONRPCMessage): void {
    this.events.emit('message', message);
  }

  simulateError(error: Error): void {
    this.events.emit('error', error);
  }
}
```

## API Reference

See [API.md](../../docs/API.md) for complete API documentation.

## Architecture

See [ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for system architecture details.

## License

MIT
