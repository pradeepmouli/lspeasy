---
name: lspeasy-core
description: "TypeScript SDK for building Language Server Protocol clients and servers Core types, transports, and utilities shared by all lspeasy packages. Use when: You are building a browser-based LSP client, a WebSocket-backed language; server, or any LSP integration that must run over HTTP/HTTPS infrastructure.; You register multiple handlers (hover, completion, definition) that share."
license: MIT
---

# @lspeasy/core

TypeScript SDK for building Language Server Protocol clients and servers

`@lspeasy/core` is the shared foundation for the lspeasy SDK. It contains
everything needed to build custom LSP integrations, and re-exports the
most-used pieces from `@lspeasy/client` and `@lspeasy/server`.

### Key areas

**JSON-RPC 2.0** — Message types (RequestMessage, NotificationMessage,
ResponseMessage), framing (parseMessage, serializeMessage),
and Zod schemas for validation.

**Transports** — The Transport interface plus browser-compatible
implementations: WebSocketTransport, DedicatedWorkerTransport,
SharedWorkerTransport.
Node.js transports (`StdioTransport`, `TcpTransport`, `IpcTransport`) are
in `@lspeasy/core/node` to avoid importing Node.js builtins in browsers.

**Middleware** — The Middleware pipeline runs on every
client-to-server and server-to-client message. Use createScopedMiddleware
to limit a middleware to specific methods, and createTypedMiddleware
for full param/result type inference.

**LSP protocol** — LSPRequest and LSPNotification namespaces
expose every standard LSP method with its params and result types.
LSPRequestMethod / LSPNotificationMethod are the union types
for string-literal method names.

**Utilities** — CancellationTokenSource for request cancellation,
DisposableStore for lifecycle management, ResponseError for
structured JSON-RPC errors, DocumentVersionTracker for document sync.

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

## When to Use


| Task | Use | Why |
|------|-----|-----|
| You are building a browser-based LSP client, a WebSocket-backed language | `WebSocketTransport` | — |
| server, or any LSP integration that must run over HTTP/HTTPS infrastructure. | `WebSocketTransport` | — |
| You register multiple handlers (hover, completion, definition) that share | `DisposableStore` | — |
| the same lifetime | `DisposableStore` | collect them all into one store and dispose the store |
| on shutdown or feature toggle. | `DisposableStore` | — |
| A request handler needs to reject with a machine-readable error code that | `ResponseError` | — |
| the client can act on (e.g. respond with `MethodNotFound` when a capability | `ResponseError` | — |
| was not declared, or `InvalidParams` when schema validation fails). | `ResponseError` | — |
| You are building an LSP client that sends `textDocument/didChange` | `DocumentVersionTracker` | — |
| notifications and need to track per-document version counters. | `DocumentVersionTracker` | — |

**Avoid when:**

| Don't Use | When | Use Instead |
|-----------|------|-------------|
| `WebSocketTransport` | You are building a CLI language server | `StdioTransport` (from |
| `WebSocketTransport` | `@lspeasy/core/node`) is the conventional choice and avoids the overhead | — |
| `WebSocketTransport` | of a network stack. For same-process workers prefer | — |
| `WebSocketTransport` | `DedicatedWorkerTransport` or `SharedWorkerTransport`. | — |
| `ResponseError` | You want to log a server-side error without sending an error to the client — | — |
| `ResponseError` | throw a plain `Error` and handle it via `server.onError()` instead. | — |
- API surface: 55 functions, 11 classes, 77 types, 1 enums, 41 constants

**NEVER:**

- NEVER set `enableReconnect: true` in server mode (`socket` provided) —
- the option is silently ignored (reconnect has no URL to reconnect to), but
- the intent is misleading and suggests lifecycle management will be handled
- when it is not.
- NEVER send messages before `isConnected()` returns `true`. In client mode
- the socket is in CONNECTING state immediately after construction; `send()`
- will throw until the open event fires.
- NEVER use `ConsoleLogger` in a stdio LSP server (`StdioTransport`) — the
- LSP base protocol uses stdout as the message channel. Any `console.log` /
- `console.info` / `console.debug` output will corrupt the stdio stream.
- Use `NullLogger` or a file-based logger instead, and send diagnostic
- messages via `window/logMessage` notifications.
- NEVER throw `ResponseError` with a code outside the defined ranges without
- documenting it. Undocumented codes are opaque to clients and tools.
- NEVER send a `textDocument/didChange` with the same version number as a
- previous change for the same document. The server may reject the change as
- a no-op or apply it out of order, causing text state desync.

## Configuration

4 configuration interfaces — see references/config.md for details.

## Quick Reference

**protocol:** `getCapabilityForRequestMethod` (Get the capability key for a given method at runtime), `getClientCapabilityForRequestMethod` (Get the client capability key for a given request method...), `getCapabilityForNotificationMethod` (Get the capability key for a given notification method at...), `getClientCapabilityForNotificationMethod` (Get the client capability key for a given notification me...), `getDefinitionForRequest` (Retrieves the full definition object for a given LSP request method by
namespace and method key), `getDefinitionForNotification` (Retrieves the full definition object for a given LSP notification method by
namespace and method key), `serverSupportsRequest` (Check if a method is supported by the given server capabi...), `serverSupportsNotification` (Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server notification method), `clientSupportsRequest` (Check if a method is supported by the given client capabi...), `clientSupportsNotification` (Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client notification method), `hasServerCapability` (Check if a server capability is enabled), `hasClientCapability` (Check if a client capability is enabled), `supportsHover` (Helper to check if hover is supported), `supportsCompletion` (Helper to check if completion is supported), `supportsDefinition` (Helper to check if definition is supported), `supportsReferences` (Helper to check if references are supported), `supportsDocumentSymbol` (Helper to check if document symbols are supported), `supportsWorkspaceFolders` (Helper to check if workspace folders are supported), `supportsNotebookDocumentSync` (Helper to check if notebook document sync is supported by the server), `supportsFileWatching` (Helper to check if file watching is supported), `supportsWorkDoneProgress` (Helper to check if work done progress is supported), `getSchemaForMethod` (Get schema for a given method), `createWorkspaceFolder` (Helper to create a WorkspaceFolder), `createWorkspaceFoldersChangeEvent` (Helper to create a WorkspaceFoldersChangeEvent), `createFileEvent` (Helper to create a FileEvent), `createFileSystemWatcher` (Helper to create a FileSystemWatcher), `createDidChangeWatchedFilesParams` (Helper to create DidChangeWatchedFilesParams), `createProgressBegin` (Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification), `createProgressReport` (Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification), `createProgressEnd` (Helper to create a progress end notification), `createProgressCreateParams` (Helper to create progress create params), `createProgressToken` (Generate a unique progress token), `createPartialResultParams` (Helper to create partial result params), `hasPartialResultToken` (Type guard to check if params support partial results), `getPartialResultToken` (Helper to extract partial result token from params), `isRegisterCapabilityParams` (Runtime guard for register-capability params), `isUnregisterCapabilityParams` (Runtime guard for unregister-capability params), `LSPRequestMethod` (Union type of all valid LSP request method names), `LSPNotificationMethod` (Union type of all valid LSP notification method names), `ParamsForRequest` (Infer request parameters from method name), `ResultForRequest` (Infer request result from method name), `ServerCapabilityForRequest` (Resolves the `ServerCapabilities` path key required to enable a given LSP request method), `ClientCapabilityForRequest` (Resolves the `ClientCapabilities` path key required for a client to send a given LSP request), `ParamsForNotification` (Infer notification parameters from method name), `ServerCapabilityForNotification` (Resolves the `ServerCapabilities` path key required to enable a given LSP notification method), `ClientCapabilityForNotification` (Resolves the `ClientCapabilities` path key required for a client to handle a given LSP notification), `OptionsForRequest` (Resolves the registration options type for a given LSP request method), `RegistrationOptionsForRequest` (Resolves the dynamic registration options type for a given LSP request method), `DirectionForRequest` (Resolves the message direction (`'clientToServer'` | `'serverToClient'` | `'both'`)
for a given LSP request method), `DirectionForNotification` (Resolves the message direction for a given LSP notification method), `RequestDefinition` (The shape of a single LSP request definition entry (method, params, result,
direction, capability keys)), `ClientNotifications` (Client methods for sending requests to server
Methods are...), `ClientRequests` (Typed namespace of client-to-server LSP request methods, filtered by the
server's declared capabilities), `ServerHandlers` (Server handler registration methods (for requests from cl...), `ClientRequestHandlers` (Client handler registration methods (for requests from se...), `ClientNotificationHandlers` (Typed namespace of server-to-client notification handler registration methods,
filtered by the client's declared capabilities), `ServerSendMethods` (Typed namespace of server-to-client request send methods, filtered by the
client's declared capabilities), `ToRequestSignature` (Converts an LSP request type definition into a callable method signature
`(params: P) => Promise<R>`), `ToNotificationSignature` (Converts an LSP notification type definition into a fire-and-forget method
signature `(params: P) => void`), `ToRequestHandlerSignature` (Converts an LSP request type definition into a handler registration signature
`(handler: (params: P) => Promise<R> | R) => void`), `ToNotificationHandlerSignature` (Converts an LSP notification type definition into a handler registration
signature `(handler: (params: P) => void) => void`), `AvailableMethods` (The complete set of available LSP methods for a client/server capability pair,
split by direction (client send, server send, handlers)), `LSPRequest` (LSP Request type definitions organized by namespace), `LSPNotification` (LSP Notification type definitions organized by namespace), `Client` (Capability-aware interface for an LSP client, combining typed request send
methods, notification send methods, and server-to-client handler registrations), `AvailableRequests` (Mapped type of all available LSP request methods and thei...), `AvailableNotifications` (Mapped type of all available LSP notification methods and...), `Server` (Combined Server type with handlers and send methods), `AvailableRequests` (Mapped type of all available LSP request methods and thei...), `AvailableNotifications` (Mapped type of all available LSP notification methods and...), `WorkDoneProgressValue` (WorkDoneProgress value types), `PartialResultParams` (A parameter literal used to pass a partial result token), `DynamicRegistration` (A single LSP dynamic capability registration entry), `DynamicRegistrationBehavior` (Controls compatibility behavior for dynamic registrations not declared by client capabilities), `RegisterCapabilityParams` (Params payload for `client/registerCapability`), `UnregisterCapability` (Entry used by `client/unregisterCapability`), `UnregisterCapabilityParams` (Params payload for `client/unregisterCapability`), `CancelledPartialResult` (Structured response when a partial-enabled request is cancelled), `CompletedPartialResult` (Structured response when a partial-enabled request completes successfully), `PartialRequestOutcome` (Union return type for partial-enabled client requests), `RequestMethodMap` (Runtime map from every LSP request method string to its metadata
(direction, server capability, client capability)), `NotificationMethodMap` (Runtime map from every LSP notification method string to its metadata
(direction, server capability, client capability)), `ClientRequestMethodToCapabilityMap` (Runtime map from every LSP request method string to the corresponding
server capability key (or `undefined` for always-allowed methods)), `ClientNotificationMethodToCapabilityMap` (Runtime map from every LSP notification method string to the corresponding
server capability key (or `undefined` for always-allowed notifications)), `LSPRequest` (LSP Request methods organized by namespace), `LSPNotification` (LSP Notification methods organized by namespace), `PositionSchema` (Position in a text document expressed as zero-based line...), `RangeSchema` (Range in a text document expressed as (zero-based) start...), `TextDocumentIdentifierSchema` (Text document identifier), `HoverParamsSchema` (Hover params), `HoverSchema` (Hover result), `CompletionParamsSchema` (Completion params), `CompletionItemSchema` (Completion item), `CompletionListSchema` (Completion list), `DefinitionParamsSchema` (Definition params), `ReferenceParamsSchema` (Reference params), `DocumentSymbolParamsSchema` (Document symbol params), `DocumentSymbolSchema` (Document symbol), `InitializeParamsSchema` (Initialize params), `DidOpenTextDocumentParamsSchema` (Did open text document params), `DidChangeTextDocumentParamsSchema` (Did change text document params), `DidCloseTextDocumentParamsSchema` (Did close text document params), `DidSaveTextDocumentParamsSchema` (Did save text document params), `LSPSchemas` (Schema registry for method-based lookup), `WorkspaceFileChangeTypes` (File change types enum for convenience), `WatchKinds` (Watch kinds for file system watchers), `dynamicRegistrationSchema` (Zod schema for validating a single dynamic-registration entry), `registerCapabilityParamsSchema` (Zod schema for validating `client/registerCapability` params), `unregisterCapabilitySchema` (Zod schema for validating a single capability unregistration entry), `unregisterCapabilityParamsSchema` (Zod schema for validating `client/unregisterCapability` params)
**JSON-RPC:** `isRequestMessage` (Returns `true` when `message` is a JSON-RPC request (has `id` + `method`)), `isNotificationMessage` (Returns `true` when `message` is a JSON-RPC notification (has `method`,
no `id`)), `isResponseMessage` (Returns `true` when `message` is a JSON-RPC response (has `id`, no `method`)), `isSuccessResponse` (Returns `true` when `response` carries a `result` (success case)), `isErrorResponse` (Returns `true` when `response` carries an `error` (error case)), `parseMessage` (Parses a single framed JSON-RPC 2), `serializeMessage` (Serializes a JSON-RPC 2), `BaseMessage` (Base JSON-RPC 2), `RequestMessage` (JSON-RPC 2), `NotificationMessage` (JSON-RPC 2), `SuccessResponseMessage` (JSON-RPC 2), `ErrorResponseMessage` (JSON-RPC 2), `ResponseMessage` (JSON-RPC 2), `Message` (Union of all JSON-RPC 2), `ResponseErrorInterface` (JSON-RPC 2)
**Transport:** `createWebSocketClient` (Creates a WebSocket client instance, preferring the native
`globalThis), `WebSocketTransport` (WebSocket-based transport for LSP communication), `Transport` (Pluggable communication layer for JSON-RPC message exchange)

*185 exports total — see references/ for full API.*

## References

Load these on demand — do NOT read all at once:

- When calling any function → read `references/functions.md` for full signatures, parameters, and return types
- When using a class → read `references/classes/` for properties, methods, and inheritance
- When defining typed variables or function parameters → read `references/types.md`
- When using enum values → read `references/enums.md`
- When using exported constants → read `references/variables.md`
- When configuring options → read `references/config.md` for all settings and defaults

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli <pmouli@mac.com> (https://github.com/pradeepmouli)