# API Contract: @lspeasy/server

**Package**: @lspeasy/server
**Version**: 1.0.0
**Purpose**: Public API for building LSP servers

---

## Main Exports

### LSPServer Class

Primary class for creating and managing LSP servers.

**Generic Type Parameter** (optional): Constrain available methods based on declared capabilities.

```typescript
class LSPServer<Capabilities extends Partial<ServerCapabilities> = ServerCapabilities>
```

**Example**: Type-safe server with only hover capability:
```typescript
const server = new LSPServer<{ hoverProvider: true }>();
// Only onRequest('textDocument/hover') is type-checked
// Other capability methods fall back to generic overload
```

#### Constructor

```typescript
constructor(options?: ServerOptions)

interface ServerOptions {
  // Server name and version (sent in initialize response)
  name?: string;
  version?: string;

  // Logging configuration (MCP SDK style)
  logger?: Logger;
  logLevel?: 'trace' | 'debug' | 'info' | 'warn' | 'error';

  // Validation error customization
  onValidationError?: (error: ZodError, request: RequestMessage) => ResponseError;
}
```

#### Methods

**Handler Registration** (supports optional chaining):

```typescript
// Strongly-typed request handler (capability-aware if Capabilities specified)
onRequest<M extends LSPRequestMethod>(
  method: M,
  handler: RequestHandler<InferRequestParams<M>, InferRequestResult<M>>
): this

// Generic request handler (for custom methods)
onRequest<Params = any, Result = any>(
  method: string,
  handler: RequestHandler<Params, Result>
): this

// Strongly-typed notification handler (capability-aware if Capabilities specified)
onNotification<M extends LSPNotificationMethod>(
  method: M,
  handler: NotificationHandler<InferNotificationParams<M>>
): this

// Generic notification handler (for custom methods)
onNotification<Params = any>(
  method: string,
  handler: NotificationHandler<Params>
): this

// Type helpers extract method names from capabilities
type MethodsForCapabilities<Caps> = /* filters LSPRequestMethod by Caps */

// Examples with strict typing:
server
  .onRequest('textDocument/hover', async (params, token) => {
    // params: HoverParams (strictly typed from LSPRequest.TextDocument.Hover.Params)
    // return type enforced: Hover | null (from LSPRequest.TextDocument.Hover.Result)
    return { contents: 'hover text' };
  })
  .onRequest('textDocument/documentSymbol', async (params, token) => {
    // params: DocumentSymbolParams (from LSPRequest.TextDocument.DocumentSymbol.Params)
    // return type enforced: DocumentSymbol[] | SymbolInformation[] | null
    return [];
  })
  .onNotification('textDocument/didOpen', (params) => {
    // params: DidOpenTextDocumentParams (from LSPNotification.TextDocument.DidOpen.Params)
    console.log(params.textDocument.uri);
  });

// Capability-aware example:
const hoverOnlyServer = new LSPServer<{ hoverProvider: true }>();
hoverOnlyServer.setCapabilities({ hoverProvider: true });

hoverOnlyServer
  .onRequest('textDocument/hover', async (params, token) => {
    // ✅ Full type checking (capability matches)
    return { contents: 'hover' };
  })
  .onRequest('textDocument/completion', async (params, token) => {
    // ⚠️ Still compiles (generic fallback) but capability not declared
    // Consider warning or runtime check
    return { items: [] };
  });

// Custom method (falls back to generic overload)
server.onRequest<CustomParams, CustomResult>(
  'custom/method',
  async (params, token) => {
    return { customField: params.input };
  }
);
```

**Lifecycle Management**:

```typescript
// Start server with given transport
listen(transport: Transport): Promise<void>

// Graceful shutdown (waits for pending requests)
shutdown(timeout?: number): Promise<void>

// Force close (immediately)
close(): Promise<void>
```

**Capability Declaration**:

```typescript
// Set server capabilities (called before listen())
setCapabilities(capabilities: ServerCapabilities): void

// Get current capabilities
getCapabilities(): ServerCapabilities
```

**Event Subscriptions**:

```typescript
// Connection lifecycle events
onInitialized(handler: () => void): Disposable
onShutdown(handler: () => void): Disposable
onError(handler: (error: Error) => void): Disposable
```

---

## Type Definitions

### RequestHandler

```typescript
type RequestHandler<Params, Result> = (
  params: Params,
  token: CancellationToken,
  context: RequestContext
) => Promise<Result> | Result;

interface RequestContext {
  // Request ID for correlation
  id: number | string;

  // Method name
  method: string;

  // Client capabilities (available after initialization)
  clientCapabilities?: ClientCapabilities;
}
```

### NotificationHandler

```typescript
type NotificationHandler<Params> = (
  params: Params,
  context: NotificationContext
) => void | Promise<void>;

interface NotificationContext {
  // Method name
  method: string;

  // Client capabilities (available after initialization)
  clientCapabilities?: ClientCapabilities;
}
```

### ResponseError

```typescript
class ResponseError extends Error {
  constructor(code: number, message: string, data?: any);

  code: number;
  data?: any;
}

// Standard LSP error codes
enum ErrorCodes {
  ParseError = -32700,
  InvalidRequest = -32600,
  MethodNotFound = -32601,
  InvalidParams = -32602,
  InternalError = -32603,
  ServerNotInitialized = -32002,
  // ... more LSP-specific codes
}
```

---

## Usage Example

```typescript
import { LSPServer } from '@lspeasy/server';
import { StdioTransport } from '@lspeasy/core';
import type { HoverParams, Hover } from '@lspeasy/core/protocol';

const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0',
  logLevel: 'info'
});

// Set capabilities
server.setCapabilities({
  textDocumentSync: 1, // Full document sync
  hoverProvider: true
});

// Register hover handler
server.onRequest<HoverParams, Hover | null>(
  'textDocument/hover',
  async (params, token) => {
    if (token.isCancellationRequested) {
      return null;
    }

    return {
      contents: {
        kind: 'markdown',
        value: 'Hover information here'
      }
    };
  }
);

// Start server
const transport = new StdioTransport();
await server.listen(transport);
```

---

## Error Handling Contract

### Automatic Error Responses

| Condition | Error Code | Error Message |
|-----------|------------|---------------|
| Request before initialization | -32002 | "Server not initialized" |
| Request during shutdown | -32603 | "Invalid request" |
| Malformed JSON | -32700 | "Parse error" |
| Invalid params (Zod validation) | -32602 | "Invalid params" + Zod details |
| Handler throws exception | -32603 | "Internal error" |
| Unknown method | -32601 | "Method not found" |

### Custom Error Handling

```typescript
// Throw ResponseError for custom error codes
server.onRequest('custom/method', async (params) => {
  if (!params.valid) {
    throw new ResponseError(
      ErrorCodes.RequestFailed,
      'Validation failed',
      { field: 'value', reason: 'invalid' }
    );
  }
});

// Customize validation errors
new LSPServer({
  onValidationError: (zodError, request) => {
    // Transform Zod error to ResponseError
    return new ResponseError(
      ErrorCodes.InvalidParams,
      `Validation failed: ${zodError.message}`,
      zodError.errors
    );
  }
});
```

---

## Validation Contract

### Request Parameter Validation

- All request parameters validated against Zod schemas before handler invocation
- Invalid parameters trigger -32602 error with detailed Zod error information
- Developers can customize error transformation via `onValidationError` option

### Type Safety

- Request handlers receive fully typed `params` based on method name
- Return types enforced at compile time
- CancellationToken always provided for long-running operations

---

## Performance Contract

- Handler dispatch overhead: <0.1ms (p95)
- Parameter validation: <1ms (p95) for typical requests
- Memory: <50MB baseline per server instance
- Cancellation propagation: <100ms

---

## Breaking Change Policy

- Method signature changes: MAJOR version bump
- New optional parameters: MINOR version bump
- Internal optimizations: PATCH version bump
- Deprecated APIs removed after 1 minor version deprecation period
