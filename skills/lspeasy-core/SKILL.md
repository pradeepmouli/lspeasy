---
name: lspeasy-core
description: "Core types, transports, and utilities for LSP SDK Use when working with lsp, language-server-protocol, jsonrpc, transport."
license: MIT
---

# @lspeasy/core

Core types, transports, and utilities for LSP SDK

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

**protocol:** `getCapabilityForRequestMethod` (Get the server capability key for a given request method at runtime), `getClientCapabilityForRequestMethod` (Get the client capability key for a given request method at runtime), `getCapabilityForNotificationMethod` (Get the server capability key for a given notification method at runtime), `getClientCapabilityForNotificationMethod` (Get the client capability key for a given notification method at runtime), `getDefinitionForRequest` (Retrieves the full definition object for a given LSP request method by
namespace and method key), `getDefinitionForNotification` (Retrieves the full definition object for a given LSP notification method by
namespace and method key), `serverSupportsRequest` (Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server request method), `serverSupportsNotification` (Type-guarding predicate that narrows `capabilities` to include the specific
server capability key required for the given client-to-server notification method), `clientSupportsRequest` (Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client request method), `clientSupportsNotification` (Type-guarding predicate that narrows `capabilities` to include the specific
client capability key required for the given server-to-client notification method), `hasServerCapability` (Type-guarding predicate that narrows `capabilities` to confirm a specific server capability
is enabled at a deep dot-notation path), `hasClientCapability` (Type-guarding predicate that narrows `capabilities` to confirm a specific client capability
is enabled at a deep dot-notation path), `supportsHover` (Returns `true` when `hoverProvider` is declared in the server capabilities), `supportsCompletion` (Returns `true` when `completionProvider` is declared in the server capabilities), `supportsDefinition` (Returns `true` when `definitionProvider` is declared in the server capabilities), `supportsReferences` (Returns `true` when `referencesProvider` is declared in the server capabilities), `supportsDocumentSymbol` (Returns `true` when `documentSymbolProvider` is declared in the server capabilities), `supportsWorkspaceFolders` (Returns `true` when the server supports workspace folders), `supportsNotebookDocumentSync` (Helper to check if notebook document sync is supported by the server), `supportsFileWatching` (Returns `true` when the client supports dynamic file watching registration), `supportsWorkDoneProgress` (Returns `true` when the client supports work done progress notifications), `getSchemaForMethod` (Looks up the Zod validation schema for a given LSP method), `createWorkspaceFolder` (Helper to create a WorkspaceFolder), `createWorkspaceFoldersChangeEvent` (Helper to create a WorkspaceFoldersChangeEvent), `createFileEvent` (Helper to create a FileEvent), `createFileSystemWatcher` (Helper to create a FileSystemWatcher), `createDidChangeWatchedFilesParams` (Helper to create DidChangeWatchedFilesParams), `createProgressBegin` (Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification), `createProgressReport` (Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification), `createProgressEnd` (Creates a `WorkDoneProgressEnd` payload to close a work-done progress notification), `createProgressCreateParams` (Creates `WorkDoneProgressCreateParams` for a `window/workDoneProgress/create` request), `createProgressToken` (Generate a unique progress token), `createPartialResultParams` (Creates `PartialResultParams` with the given partial result token), `hasPartialResultToken` (Type guard to check if params support partial results), `getPartialResultToken` (Extracts the partial result token from params), `isRegisterCapabilityParams` (Runtime guard for register-capability params), `isUnregisterCapabilityParams` (Runtime guard for unregister-capability params), `LSPRequestMethod` (Union type of all valid LSP request method names), `LSPNotificationMethod` (Union type of all valid LSP notification method names), `ParamsForRequest` (Infer request parameters from method name), `ResultForRequest` (Infer request result from method name), `ServerCapabilityForRequest` (Resolves the `ServerCapabilities` path key required to enable a given LSP request method), `ClientCapabilityForRequest` (Resolves the `ClientCapabilities` path key required for a client to send a given LSP request), `ParamsForNotification` (Infer notification parameters from method name), `ServerCapabilityForNotification` (Resolves the `ServerCapabilities` path key required to enable a given LSP notification method), `ClientCapabilityForNotification` (Resolves the `ClientCapabilities` path key required for a client to handle a given LSP notification), `OptionsForRequest` (Resolves the registration options type for a given LSP request method), `RegistrationOptionsForRequest` (Resolves the dynamic registration options type for a given LSP request method), `DirectionForRequest` (Resolves the message direction (`'clientToServer'` | `'serverToClient'` | `'both'`)
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