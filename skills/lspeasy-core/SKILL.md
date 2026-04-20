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

## Features

- **Capability-aware handler registration** — `server.textDocument.onHover(...)` is only callable after `registerCapabilities({ hoverProvider: true })`; mismatches are caught at both compile time and at the dispatcher.
- **Full JSON-RPC 2.0 core** — schemas, framing, request/notification/response types, and typed error codes, all validated with Zod.
- **Swappable transports** — `StdioTransport`, `TcpTransport`, `IpcTransport`, `WebSocketTransport`, `DedicatedWorkerTransport`, `SharedWorkerTransport`; write your own against the `Transport` interface.
- **Runs anywhere** — Node.js-specific transports live under `@lspeasy/core/node`; the root export is browser-safe so the same code ships to a VS Code extension and a web playground.
- **Typed client API** — `client.textDocument.hover(...)`, `client.workspace.symbol(...)`, and the full request surface with request/response types pulled from the LSP spec.
- **Composable middleware** — `composeMiddleware(...)` plus `createScopedMiddleware({ methods, direction })` for logging, tracing, metrics, or request mutation without touching the core dispatcher.
- **Lifecycle + progress + cancellation** — initialize/initialized/shutdown/exit are handled for you, with built-in partial-result and work-done progress senders and `CancellationToken` support.
- **Zod-validated messages** — every inbound message is parsed against a schema, so malformed peers surface as typed errors instead of runtime crashes.
- **Tree-shakeable, ESM-only** — pay for what you import; no CommonJS compatibility shims dragging extra code into browser bundles.

## Quick Start

### Writing a client

```typescript
import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core/node';
import { spawn } from 'node:child_process';

const proc = spawn('my-language-server', ['--stdio']);
const transport = new StdioTransport({ input: proc.stdout, output: proc.stdin });

const client = new LSPClient({ name: 'my-client', version: '1.0.0' });
await client.connect(transport);

const hover = await client.textDocument.hover({
  textDocument: { uri: 'file:///example.ts' },
  position: { line: 0, character: 6 }
});

await client.disconnect();
```

### Transports

`@lspeasy/core` ships several built-in transports. Import Node-only transports from the `/node` subpath so browser bundles stay clean.

| Transport | Import | Notes |
|-----------|--------|-------|
| `StdioTransport` | `@lspeasy/core/node` | stdin/stdout, child processes |
| `TcpTransport` | `@lspeasy/core/node` | TCP client/server with optional reconnect |
| `IpcTransport` | `@lspeasy/core/node` | Node parent/child IPC |
| `WebSocketTransport` | `@lspeasy/core` | Native `globalThis.WebSocket` (Node ≥22.4 or browsers) |
| `DedicatedWorkerTransport` | `@lspeasy/core` | Browser dedicated worker |
| `SharedWorkerTransport` | `@lspeasy/core` | Browser shared worker |

### Middleware

`@lspeasy/core/middleware` provides a composable pipeline for logging, tracing, or mutating requests on the fly:

```typescript
import { composeMiddleware, createScopedMiddleware } from '@lspeasy/core/middleware';
import type { Middleware } from '@lspeasy/core/middleware';

const logging: Middleware = async (ctx, next) => {
  console.log(`${ctx.direction} ${ctx.method}`);
  await next();
};

const textDocOnly = createScopedMiddleware(
  { methods: /^textDocument\//, direction: 'clientToServer' },
  async (ctx, next) => {
    ctx.metadata.startedAt = Date.now();
    await next();
  }
);

const middleware = composeMiddleware(logging, textDocOnly);
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
**Middleware:** `composeMiddleware` (Combines multiple middleware functions into a single middleware that runs
them left-to-right, each delegating to the next via `next()`), `executeMiddlewarePipeline` (Runs the registered middleware chain for a single JSON-RPC message, then
calls `finalHandler` if no middleware short-circuits), `createScopedMiddleware` (Wraps a middleware with a filter so it only runs for matching LSP messages), `createTypedMiddleware` (Creates a typed, method-scoped middleware with full TypeScript inference for
the message params and result), `Middleware` (A function that intercepts JSON-RPC messages flowing through `LSPServer`
or `LSPClient`), `MiddlewareContext` (Execution context passed to every middleware function in the pipeline), `MiddlewareDirection` (Direction of a JSON-RPC message in the middleware pipeline), `MiddlewareMessage` (The JSON-RPC message exposed to middleware, with `id` made read-only to
prevent accidental mutation that would break response correlation), `MiddlewareMessageType` (Kind of JSON-RPC message flowing through middleware), `MiddlewareNext` (Calls the next middleware (or final handler) in the pipeline), `MiddlewareResult` (The return value from a middleware function), `MethodFilter` (Filter predicate used by `ScopedMiddleware` to select which messages
a middleware should intercept), `ScopedMiddleware` (A `Middleware` paired with a `MethodFilter` so it only runs for matching
messages), `TypedMiddleware` (A middleware function narrowed to a specific LSP method with full type
inference for `params` and `result`), `TypedMiddlewareContext` (Typed middleware context narrowed to a specific LSP method), `TypedParams` (Infers the params type for a given LSP method), `TypedResult` (Infers the result type for a given LSP method (void for notifications)), `LSPMethod` (Union of all LSP request and notification method strings)
**Document:** `createFullDidChangeParams` (Builds `DidChangeTextDocumentParams` for a full-document text replacement), `createIncrementalDidChangeParams` (Builds `DidChangeTextDocumentParams` for an incremental (range-based)
document change notification), `DocumentVersionTracker` (Tracks monotonically increasing version numbers for open text documents)
**transport:** `isMessage` (Runtime guard for JSON-RPC message envelopes), `isWorkerTransportEnvelope` (Runtime guard for shared worker transport envelope payloads), `DedicatedWorkerTransport` (JSON-RPC transport backed by a Dedicated Worker instance), `SharedWorkerTransport` (JSON-RPC transport for Shared Worker environments with per-client envelope routing), `TransportEventEmitter` (Transport event emitter), `WorkerLike` (Minimal worker contract required by dedicated worker transport), `MessagePortLike` (Minimal message port contract required by shared worker transport), `SharedWorkerLike` (Shared worker wrapper exposing a message port), `WorkerMessageEventLike` (Lightweight event shape shared by worker and message port adapters), `WorkerTransportEnvelope` (Envelope used by shared worker transport to preserve client isolation)
**Utilities:** `buildMethodSets` (Builds the full set of LSP methods and the subset that are always allowed
(not gated by a capability) for a given capability key), `SERVER_METHODS` (Pre-built method sets indexed by server capability), `CLIENT_METHODS` (Pre-built method sets indexed by client capability)
**utils:** `checkMethod` (Shared validation logic for checking if a method is allowed based on capabilities), `DisposableEventEmitter` (Event emitter that returns disposables and can dispose all listeners at once), `CancellationToken` (Singleton token that is never cancelled), `IncrementalChange` (Represents a single incremental text document change), `VersionSource` (Source of version information for helper constructors), `ErrorMessage` (Error messages for each error code)
**Lifecycle:** `DisposableStore` (Collects multiple `Disposable` instances and releases them together), `CancellationTokenSource` (Controller that creates and manages a `CancellationToken`), `Disposable` (Represents a resource that can be explicitly released), `CancellationToken` (Read-only handle for observing cancellation state)
**Logging:** `ConsoleLogger` (Logger implementation that writes to the process console with level filtering), `NullLogger` (No-op logger that silently discards all messages), `Logger` (Structured logging interface used throughout lspeasy), `LogLevel` (Numeric severity levels for filtering log output)
**Errors:** `ResponseError` (An `Error` subclass that maps to a JSON-RPC 2), `JSONRPCErrorCode` (Numeric error codes defined by JSON-RPC 2)
**jsonrpc:** `requestMessageSchema` (Schema for JSON-RPC 2), `notificationMessageSchema` (Schema for JSON-RPC 2), `responseErrorSchema` (Schema for JSON-RPC 2), `successResponseMessageSchema` (Schema for JSON-RPC 2), `errorResponseMessageSchema` (Schema for JSON-RPC 2), `responseMessageSchema` (Schema for JSON-RPC 2), `messageSchema` (Schema for any JSON-RPC 2)

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