# Data Model: LSP SDK Core Entities

**Date**: 2026-01-29
**Phase**: Phase 1 - Design
**Purpose**: Define core entities, their relationships, and validation rules

## Entity Overview

This SDK's data model centers around LSP protocol messages, connection lifecycle, and capability negotiation. Entities are organized by package for modularity.

---

## Package: @lspeasy/core

### 1. Message (Union Type)

Base JSON-RPC 2.0 message types following MCP SDK patterns with custom implementation.

**Properties**:
- `jsonrpc`: "2.0" (literal)
- Discriminated by presence of `id`, `method`, `result`, `error`

**Subtypes**:
- `RequestMessage`: Has `id`, `method`, `params?`
- `ResponseMessage`: Has `id`, `result` OR `error`
- `NotificationMessage`: Has `method`, `params?`, no `id`
- `ErrorMessage`: Has `id`, `error` object with `code`, `message`, `data?`

**Validation**: Zod schemas generated from vscode-languageserver-protocol types

**Relationships**: All LSP communication is Message instances

---

### 2. Transport (Interface)

Abstract interface for message send/receive across different communication channels.

**Properties** (methods):
```typescript
interface Transport {
  // Send a message to remote peer
  send(message: Message): Promise<void>;

  // Subscribe to incoming messages
  onMessage(handler: (message: Message) => void): Disposable;

  // Subscribe to connection errors
  onError(handler: (error: Error) => void): Disposable;

  // Close the connection
  close(): Promise<void>;

  // Check if connection is active
  isConnected(): boolean;
}
```

**Implementations**:
- `StdioTransport`: Reads/writes via stdin/stdout
- `WebSocketTransport`: Communicates over WebSocket connection

**Validation**: N/A (interface, validated by implementations)

**State Transitions**:
- `disconnected` → `connecting` → `connected` → `disconnected`

---

### 3. CancellationToken (Interface)

Mechanism for aborting long-running operations per LSP `$/cancelRequest`.

**Properties**:
```typescript
interface CancellationToken {
  // Check if cancellation requested
  isCancellationRequested: boolean;

  // Subscribe to cancellation event
  onCancellationRequested: Event<void>;
}
```

**Source**:
- Implemented following MCP SDK patterns (custom CancellationTokenSource)
- Passed to all request handlers

**Validation**: N/A (behavior interface)

**Relationships**: Linked to request ID; cancellation via `$/cancelRequest` notification

---

### 4. Protocol Types (Re-exported from vscode-languageserver-protocol)

Core LSP types as defined in LSP 3.17 specification.

**Key Types**:
- `Position`: { line: number, character: number }
- `Range`: { start: Position, end: Position }
- `Location`: { uri: DocumentUri, range: Range }
- `DocumentUri`: string (validated as URI)
- `TextEdit`: { range: Range, newText: string }
- `Diagnostic`: { range: Range, severity?: DiagnosticSeverity, message: string, ... }
- 50+ additional types for LSP messages

**Validation**: Runtime Zod schemas mirror TypeScript types

**Relationships**: Composed into request/response parameter types

---

## Package: @lspeasy/server

### 5. LSPServer (Class)

Main server class managing connection, capabilities, and request routing.

**Properties**:
```typescript
class LSPServer {
  private connection: Connection;              // Custom JSON-RPC connection (MCP SDK pattern)
  private transport: Transport;                // Pluggable transport
  private capabilities: ServerCapabilities;    // Advertised capabilities
  private handlers: Map<string, Handler>;      // Request handlers
  private initialized: boolean;                // Lifecycle state
  private logger: Logger;                      // MCP-style logging
}
```

**Methods**:
- `onRequest<P, R>(method: string, handler: RequestHandler<P, R>): this` - Register request handler (chainable)
- `onNotification<P>(method: string, handler: NotificationHandler<P>): this` - Register notification handler
- `listen(transport: Transport): Promise<void>` - Start server on transport
- `shutdown(): Promise<void>` - Graceful shutdown

**State Transitions**:
- `created` → `initializing` (client sends initialize) → `initialized` (server responds) → `running` → `shutting down` → `shutdown`

**Validation**:
- Automatic parameter validation via Zod before calling handlers
- Rejects requests before initialization with -32002 error

**Relationships**:
- Owns Transport instance
- Dispatches to RequestHandlers
- Emits lifecycle events

---

### 6. RequestHandler (Type)

Type-safe function signature for handling LSP requests.

**Signature**:
```typescript
type RequestHandler<Params, Result> = (
  params: Params,
  token: CancellationToken,
  context: RequestContext
) => Promise<Result> | Result;
```

**Validation**: `params` pre-validated against Zod schema

**Error Handling**:
- Thrown errors converted to JSON-RPC errors
- Custom error codes via ResponseError class

---

### 7. NotificationHandler (Type)

Type-safe function for handling notifications (no response expected).

**Signature**:
```typescript
type NotificationHandler<Params> = (
  params: Params,
  context: NotificationContext
) => void | Promise<void>;
```

**Validation**: `params` pre-validated against Zod schema

---

### 8. ServerCapabilities (Type)

Strongly-typed object declaring server's LSP capabilities.

**Properties** (subset):
```typescript
interface ServerCapabilities {
  textDocumentSync?: TextDocumentSyncOptions | TextDocumentSyncKind;
  hoverProvider?: boolean | HoverOptions;
  completionProvider?: CompletionOptions;
  definitionProvider?: boolean | DefinitionOptions;
  referencesProvider?: boolean | ReferenceOptions;
  // ... 30+ capability fields
}
```

**Source**: Re-exported from vscode-languageserver-protocol

**Validation**: Returned in initialize response, no runtime validation needed (type-safe)

**Relationships**: Negotiated during initialization with ClientCapabilities

---

## Package: @lspeasy/client

### 9. LSPClient (Class)

Main client class for connecting to language servers.

**Properties**:
```typescript
class LSPClient {
  private connection: Connection;
  private transport: Transport;
  private serverCapabilities?: ServerCapabilities;  // Received from server
  private clientCapabilities: ClientCapabilities;   // Advertised capabilities
  private initialized: boolean;
  private logger: Logger;
}
```

**Methods**:
- `connect(transport: Transport): Promise<InitializeResult>` - Connect and initialize
- `textDocument.hover(params: HoverParams): Promise<Hover | null>` - High-level request methods
- `textDocument.completion(params: CompletionParams): Promise<CompletionList | CompletionItem[]>` - Typed requests
- `sendRequest<P, R>(method: string, params: P): Promise<R>` - Low-level request
- `shutdown(): Promise<void>` - Graceful disconnect

**State Transitions**:
- `disconnected` → `connecting` → `initializing` → `initialized` → `disconnected`

**Validation**:
- Response validation via Zod before returning to caller
- Validates server responses match LSP spec

**Relationships**:
- Owns Transport instance
- Stores ServerCapabilities from initialization

---

### 10. ClientCapabilities (Type)

Strongly-typed object declaring client's supported LSP features.

**Properties** (subset):
```typescript
interface ClientCapabilities {
  workspace?: WorkspaceClientCapabilities;
  textDocument?: TextDocumentClientCapabilities;
  window?: WindowClientCapabilities;
  general?: GeneralClientCapabilities;
  experimental?: any;
}
```

**Source**: Re-exported from vscode-languageserver-protocol

**Validation**: Sent in initialize request

**Relationships**: Used by server to determine available features

---

## Entity Relationships Diagram

```
┌─────────────────────────────────────────────────────┐
│                   @lspeasy/core                        │
├─────────────────────────────────────────────────────┤
│  Transport Interface                                │
│    ├─ StdioTransport                                │
│    └─ WebSocketTransport                            │
│                                                      │
│  Message Union                                      │
│    ├─ RequestMessage                                │
│    ├─ ResponseMessage                               │
│    ├─ NotificationMessage                           │
│    └─ ErrorMessage                                  │
│                                                      │
│  Protocol Types (LSP 3.17)                         │
│    ├─ Position, Range, Location                    │
│    ├─ TextEdit, Diagnostic                          │
│    └─ 50+ LSP types...                              │
│                                                      │
│  CancellationToken                                  │
└─────────────────────────────────────────────────────┘
                     ▲           ▲
                     │           │
                     │           │
        ┌────────────┴─┐     ┌──┴───────────┐
        │ @lspeasy/server │     │ @lspeasy/client │
        └──────────────┘     └──────────────┘
             owns                  owns
        ┌────────────┐       ┌──────────────┐
        │ LSPServer  │       │  LSPClient   │
        ├────────────┤       ├──────────────┤
        │- transport │       │- transport   │
        │- handlers  │       │- serverCaps  │
        │- caps      │       │- clientCaps  │
        └────────────┘       └──────────────┘
             │                      │
             │                      │
             └──────────┬───────────┘
                        │
                   uses JSON-RPC
                    over Transport
```

---

## Validation Rules Summary

| Entity | Validation Strategy | Error Response |
|--------|---------------------|----------------|
| RequestMessage params | Zod schema validation | -32602 InvalidParams with Zod error details |
| ResponseMessage result | Zod schema validation | Client throws validation error |
| ServerCapabilities | TypeScript compile-time only | N/A (type-safe) |
| ClientCapabilities | TypeScript compile-time only | N/A (type-safe) |
| Transport state | Runtime checks | ConnectionError exceptions |
| CancellationToken | Event-based, no validation | N/A |

---

## State Machine: LSP Server Lifecycle

```
[Created]
   │
   ↓ client sends initialize
[Initializing] (validate params, build capabilities)
   │
   ↓ server responds InitializeResult
[Initialized] (client sends initialized notification)
   │
   ↓ start accepting requests
[Running]
   │
   ↓ client sends shutdown
[Shutting Down] (reject new requests, finish pending)
   │
   ↓ client sends exit notification
[Shutdown] (close transport, cleanup)
```

**Enforcement**: Requests sent before initialization receive -32002 error; requests during shutdown receive -32603 error.

---

## Summary

**Total Entities**: 10 core types + 50+ LSP protocol types (re-exported)
**Packages**: 3 (@lspeasy/core, @lspeasy/server, @lspeasy/client)
**Validation**: Zod schemas for runtime validation matching TypeScript types
**State Management**: Explicit lifecycle states for server/client with error guards
**Extensibility**: Transport interface allows custom implementations; Handler types allow any LSP capability

This data model provides the foundation for Phase 1 contract generation (API signatures) and implementation.
