# Architecture Guide

## Overview

`lspeasy` is a TypeScript SDK for building Language Server Protocol (LSP) clients and servers. It provides a strongly-typed, modern API inspired by the Model Context Protocol (MCP) SDK patterns.

## Package Structure

```
lspeasy/
├── packages/
│   ├── core/         # Protocol types, transports, JSON-RPC
│   ├── server/       # LSP server implementation
│   └── client/       # LSP client implementation
└── examples/         # Usage examples
```

### @lspeasy/core

The foundation package providing:

- **JSON-RPC 2.0 implementation**: Message parsing, serialization, validation
- **Transport abstraction**: Interface for communication channels
- **Protocol types**: LSP 3.17 types from vscode-languageserver-protocol
- **Utilities**: Cancellation tokens, logging, disposables

**Key exports:**
- `Transport` interface
- `StdioTransport` implementation
- Message types and schemas
- Protocol types (re-exported from vscode-languageserver-protocol)

### @lspeasy/server

LSP server implementation with:

- **Handler registration**: Type-safe request/notification handlers
- **Lifecycle management**: Initialize, shutdown, exit sequences
- **Server capabilities**: Declare what features are supported
- **Transport-agnostic**: Works with any Transport implementation

**Key exports:**
- `LSPServer` class
- `ServerOptions` interface
- Handler registration methods

### @lspeasy/client

LSP client implementation with:

- **Connection management**: Connect, disconnect, state tracking
- **Request/notification sending**: Type-safe method calls
- **High-level API**: `textDocument.*` and `workspace.*` methods
- **Server-to-client handlers**: Handle server requests and notifications
- **Cancellable requests**: Cancel in-flight requests

**Key exports:**
- `LSPClient` class
- `ClientOptions` interface
- High-level method builders

## Architecture Layers

### Layer 1: Transport

The transport layer handles raw message transmission between client and server.

```typescript
interface Transport {
  send(message: Message): Promise<void>;
  onMessage(handler: (message: Message) => void): Disposable;
  onError(handler: (error: Error) => void): Disposable;
  onClose(handler: () => void): Disposable;
  close(): Promise<void>;
  isConnected(): boolean;
}
```

**Available Transports:**
- `StdioTransport`: Communicate via stdin/stdout (for CLI tools)
- `WebSocketTransport`: Communicate via WebSocket; supports persistent connections and optional automatic reconnection when the socket closes unexpectedly

**Design principles:**
- **Bidirectional**: Both client and server use the same interface
- **Event-driven**: Handler-based API for incoming messages
- **Resource management**: Disposable pattern for cleanup

### Layer 2: JSON-RPC 2.0

The JSON-RPC layer implements the LSP message protocol.

**Message Types:**
```typescript
// Request (expects response)
{
  jsonrpc: "2.0",
  id: number | string,
  method: string,
  params?: any
}

// Response (success)
{
  jsonrpc: "2.0",
  id: number | string,
  result: any
}

// Response (error)
{
  jsonrpc: "2.0",
  id: number | string,
  error: {
    code: number,
    message: string,
    data?: any
  }
}

// Notification (no response expected)
{
  jsonrpc: "2.0",
  method: string,
  params?: any
}
```

**Message Framing:**
LSP uses HTTP-style headers for message boundaries:

```
Content-Length: 123\r\n
Content-Type: application/vscode-jsonrpc; charset=utf-8\r\n
\r\n
{"jsonrpc":"2.0","id":1,"method":"initialize",...}
```

**Implementation:**
- `MessageReader`: Parse incoming messages from streams
- `MessageWriter`: Serialize and frame outgoing messages
- `parseMessage()`: Validate message structure with Zod schemas

### Layer 3: LSP Protocol

The protocol layer provides LSP-specific types and methods.

**Type Organization:**
```
protocol/
├── types.ts           # Re-exports from vscode-languageserver-protocol
├── namespaces.ts      # Organize methods by category
├── infer.ts           # Type inference helpers
└── schemas.ts         # Zod validation schemas
```

**Method Namespaces:**
```typescript
LSPRequest.TextDocument.Hover
LSPRequest.TextDocument.Completion
LSPRequest.TextDocument.Definition
LSPRequest.Workspace.Symbol
// ... etc
```

**Type Inference:**
```typescript
type HoverParams = InferRequestParams<'textDocument/hover'>
type HoverResult = InferRequestResult<'textDocument/hover'>
```

### Layer 4: Server/Client APIs

#### Server Architecture

```
LSPServer
├── Handler Registry
│   ├── Request handlers (method → async function)
│   ├── Notification handlers (method → function)
│   └── Type-safe wrappers
├── Lifecycle Manager
│   ├── Initialize handshake
│   ├── Shutdown sequence
│   └── Capability negotiation
└── Transport Manager
    ├── Message dispatcher
    ├── Response correlation
    └── Error handling
```

**Request Flow:**
1. Message arrives via transport
2. Dispatcher identifies message type
3. Handler lookup by method name
4. Execute handler with validated params
5. Send response (or error) back via transport

#### Client Architecture

```
LSPClient
├── Connection Manager
│   ├── Connect/disconnect lifecycle
│   ├── Initialize handshake
│   └── State tracking
├── Request Manager
│   ├── Pending request tracking
│   ├── Response correlation
│   ├── Cancellation support
│   └── Error handling
├── High-level API
│   ├── textDocument.* methods
│   ├── workspace.* methods
│   └── Type-safe builders
└── Event System
    ├── onConnected/onDisconnected
    ├── onError
    └── Server notification handlers
```

**Request Flow:**
1. User calls high-level method (e.g., `client.textDocument.hover(...)`)
2. Create request message with auto-incremented ID
3. Store promise resolver in pending requests map
4. Send message via transport
5. When response arrives, resolve/reject promise
6. Clean up pending request entry

## Key Design Patterns

### 1. Disposable Pattern

Used throughout for resource cleanup:

```typescript
interface Disposable {
  dispose(): void;
}

// Example: Event handler registration
const disposable = server.onRequest('textDocument/hover', async (params) => {
  return { contents: 'hover text' };
});

// Later: cleanup
disposable.dispose();
```

### 2. Event Emitter Pattern

For lifecycle and notification events:

```typescript
client.onConnected(() => {
  console.log('Connected to server');
});

client.onError((error) => {
  console.error('Transport error:', error);
});
```

### 3. Promise-based Async

All I/O operations return promises:

```typescript
const result = await client.textDocument.hover(params);
const initResult = await client.connect(transport);
await server.listen(transport);
```

### 4. Cancellation Tokens

For cancellable operations:

```typescript
const tokenSource = new CancellationTokenSource();

const request = client.sendRequest(
  'textDocument/completion',
  params,
  tokenSource.token
);

// Cancel if needed
tokenSource.cancel();
```

### 5. Builder Pattern

High-level APIs use builders for discoverability:

```typescript
// Instead of:
client.sendRequest('textDocument/hover', { textDocument, position });

// Use:
client.textDocument.hover({ textDocument, position });
```

## Error Handling

### Transport Errors

Transport errors are reported via the `onError` handler:

```typescript
transport.onError((error) => {
  console.error('Transport error:', error);
  // Reconnect logic here
});
```

### Protocol Errors

LSP errors follow JSON-RPC error codes:

```typescript
{
  code: -32601,  // Method not found
  message: "Method not found: textDocument/unknownMethod"
}
```

Common error codes:
- `-32700`: Parse error
- `-32600`: Invalid request
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32603`: Internal error

### Handler Errors

Server handler errors are caught and converted to error responses:

```typescript
server.onRequest('textDocument/hover', async (params) => {
  if (!isValidUri(params.textDocument.uri)) {
    throw new Error('Invalid URI');  // Becomes JSON-RPC error
  }
  return { contents: 'hover text' };
});
```

### Client Error Handling

Client requests reject on errors:

```typescript
try {
  const result = await client.textDocument.hover(params);
} catch (error) {
  // Could be:
  // - Transport error
  // - Server error response
  // - Request cancellation
  console.error('Request failed:', error);
}
```

## Memory Management

### Resource Cleanup

1. **Dispose handlers** when no longer needed:
   ```typescript
   const disposable = server.onRequest('method', handler);
   disposable.dispose();  // Remove handler
   ```

2. **Close transports** to release resources:
   ```typescript
   await transport.close();  // Close streams, sockets
   ```

3. **Cancel pending requests** on disconnect:
   ```typescript
   await client.disconnect();  // Rejects all pending requests
   ```

### Memory Leak Prevention

- **Cancellation subscriptions**: Disposed in all completion paths
- **Transport handlers**: Stored and disposed on disconnect
- **Event listeners**: Use Disposable pattern for cleanup
- **Pending requests**: Cleared on connection close

## Testing Strategy

### Unit Tests

Test individual components in isolation:

```typescript
// Test JSON-RPC message parsing
describe('parseMessage', () => {
  it('should parse valid request', () => {
    const msg = parseMessage(buffer);
    expect(msg.method).toBe('initialize');
  });
});

// Test transport implementation
describe('StdioTransport', () => {
  it('should send and receive messages', async () => {
    // Mock streams, test send/receive
  });
});
```

### Integration Tests

Test components working together:

```typescript
// Test client-server interaction
describe('Client-Server', () => {
  it('should complete initialize handshake', async () => {
    const client = new LSPClient();
    const server = new LSPServer();
    // Connect via transport, test handshake
  });
});
```

### End-to-End Tests

Test against real language servers:

```typescript
// Test with typescript-language-server
describe('Real Server', () => {
  it('should get hover information', async () => {
    const client = new LSPClient();
    // Spawn real server, connect, test features
  });
});
```

## Performance Considerations

### Message Parsing

- **Streaming**: Process messages as they arrive, no buffering
- **Validation**: Zod schemas validate structure efficiently
- **Target**: <1ms p95 for message parsing

### Handler Dispatch

- **Map lookup**: O(1) handler lookup by method name
- **No reflection**: Direct function calls, no dynamic dispatch
- **Target**: <0.1ms p95 for handler dispatch

### Cancellation

- **Token-based**: No polling, event-driven cancellation
- **Cleanup**: Immediate resource release on cancel
- **Target**: <100ms for cancellation propagation

## Extension Points

### Custom Transports

Implement the `Transport` interface:

```typescript
class MyTransport implements Transport {
  async send(message: Message): Promise<void> {
    // Your transport logic
  }
  
  onMessage(handler: (message: Message) => void): Disposable {
    // Register message handler
    return { dispose: () => { /* cleanup */ } };
  }
  
  // ... implement other methods
}
```

### Custom Methods

Support custom LSP methods:

```typescript
// Server side
server.onRequest('custom/myMethod', async (params: MyParams) => {
  return { result: 'custom response' };
});

// Client side
const result = await client.sendRequest<MyParams, MyResult>(
  'custom/myMethod',
  { customParam: 'value' }
);
```

### Middleware

Intercept messages for logging, tracing, etc:

```typescript
const originalSend = transport.send;
transport.send = async (message) => {
  console.log('Sending:', message);
  return originalSend.call(transport, message);
};
```

## Future Enhancements

### Planned Features

1. **WebSocketTransport**: For web-based clients
2. **Reconnection logic**: Automatic reconnect with backoff
3. **Progress reporting**: LSP progress notifications
4. **Partial results**: Streaming results for large responses
5. **Workspace folders**: Multi-root workspace support

### API Stability

- **@lspeasy/core**: Stable, minimal breaking changes
- **@lspeasy/server**: Stable, additive changes only
- **@lspeasy/client**: Stable, additive changes only

## References

- [LSP Specification](https://microsoft.github.io/language-server-protocol/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)
- [MCP SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [vscode-languageserver-protocol](https://www.npmjs.com/package/vscode-languageserver-protocol)
