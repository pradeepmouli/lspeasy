# @lspy/server

Build Language Server Protocol (LSP) servers with a simple, type-safe API.

## Installation

```bash
npm install @lspy/server @lspy/core
# or
pnpm add @lspy/server @lspy/core
# or
yarn add @lspy/server @lspy/core
```

## Quick Start

Create a minimal hover server in less than 30 lines:

```typescript
import { LSPServer, StdioTransport } from '@lspy/server';
import type { HoverParams, Hover } from '@lspy/server';

// Create server
const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0'
});

// Set capabilities
server.setCapabilities({
  hoverProvider: true
});

// Register hover handler
server.onRequest<'textDocument/hover', HoverParams, Hover | null>(
  'textDocument/hover',
  async (params, token) => {
    return {
      contents: {
        kind: 'markdown',
        value: `# Hover\nLine ${params.position.line}`
      }
    };
  }
);

// Start server
const transport = new StdioTransport();
await server.listen(transport);
```

## Features

- **Type-Safe Handlers**: Fully typed request and notification handlers with IntelliSense support
- **Automatic Validation**: Built-in parameter validation using Zod schemas
- **Lifecycle Management**: Automatic initialize/shutdown handshake handling
- **Cancellation Support**: Built-in cancellation token support for long-running operations
- **Error Handling**: Comprehensive error handling with LSP error codes
- **Chainable API**: Fluent API with method chaining

## Handler Registration

### Request Handlers

Request handlers receive parameters, a cancellation token, and return a result:

```typescript
server.onRequest<'textDocument/completion', CompletionParams, CompletionList>(
  'textDocument/completion',
  async (params, token, context) => {
    // Check for cancellation
    if (token.isCancellationRequested) {
      return { isIncomplete: false, items: [] };
    }

    // Return completions
    return {
      isIncomplete: false,
      items: [
        { label: 'function', kind: 3 },
        { label: 'const', kind: 6 }
      ]
    };
  }
);
```

### Notification Handlers

Notification handlers receive parameters but don't return a value:

```typescript
server.onNotification('textDocument/didOpen', (params, context) => {
  console.log('Document opened:', params.textDocument.uri);
});
```

### Method Chaining

Chain multiple handler registrations:

```typescript
server
  .onRequest('textDocument/hover', hoverHandler)
  .onRequest('textDocument/completion', completionHandler)
  .onNotification('textDocument/didOpen', didOpenHandler)
  .onNotification('textDocument/didChange', didChangeHandler);
```

## Server Options

```typescript
interface ServerOptions {
  // Server name (sent in initialize response)
  name?: string;

  // Server version (sent in initialize response)
  version?: string;

  // Logger instance (defaults to ConsoleLogger)
  logger?: Logger;

  // Log level (defaults to 'info')
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';

  // Custom validation error handler
  onValidationError?: (error: ZodError, request: RequestContext) => ResponseError;
}
```

## Error Handling

Throw `ResponseError` for custom error codes:

```typescript
import { ResponseError, JSONRPCErrorCode } from '@lspy/server';

server.onRequest('custom/method', async (params) => {
  if (!params.valid) {
    throw new ResponseError(
      JSONRPCErrorCode.InvalidParams,
      'Validation failed',
      { details: 'Invalid input' }
    );
  }
  return { success: true };
});
```

## Lifecycle

The server automatically handles the LSP lifecycle:

1. **Initialize**: Client sends `initialize` request → Server responds with capabilities
2. **Initialized**: Client sends `initialized` notification → Server is ready
3. **Running**: Server processes requests and notifications
4. **Shutdown**: Client sends `shutdown` request → Server prepares to exit
5. **Exit**: Client sends `exit` notification → Server closes

### Graceful Shutdown

```typescript
// Graceful shutdown (waits for pending requests)
await server.shutdown(5000); // 5 second timeout

// Force close
await server.close();
```

## Examples

Check out the [examples directory](../../examples/server/) for complete examples:

- [minimal-server.ts](../../examples/server/minimal-server.ts) - Basic hover server
- [hover-server.ts](../../examples/server/hover-server.ts) - Hover + completion with document tracking

## API Reference

### LSPServer

```typescript
class LSPServer<Capabilities extends Partial<ServerCapabilities> = ServerCapabilities>
```

#### Methods

- `onRequest<Method, Params, Result>(method, handler)` - Register request handler
- `onNotification<Method, Params>(method, handler)` - Register notification handler
- `setCapabilities(capabilities)` - Set server capabilities
- `getCapabilities()` - Get current capabilities
- `listen(transport)` - Start server on transport
- `shutdown(timeout?)` - Graceful shutdown
- `close()` - Force close

### Handler Types

```typescript
type RequestHandler<Params, Result> = (
  params: Params,
  token: CancellationToken,
  context: RequestContext
) => Promise<Result> | Result;

type NotificationHandler<Params> = (
  params: Params,
  context: NotificationContext
) => void | Promise<void>;
```

## License

MIT
