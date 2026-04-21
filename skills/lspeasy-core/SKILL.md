---
name: lspeasy-core
description: "Core types, transports, and utilities for LSP SDK Use when: You are building a browser-based LSP client, a WebSocket-backed language.... Also: lsp, language-server-protocol, jsonrpc, transport."
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

### Transport Selection Guide

| Need | Transport | Critical Gotcha |
|------|-----------|-----------------|
| Spawn server as child process | `StdioTransport` | `ConsoleLogger` corrupts stdout — use `NullLogger` |
| Browser or remote server | `WebSocketTransport` | Call `send()` only after `isConnected()` is `true` |
| Persistent local daemon | `TcpTransport` | Create a new server instance per client reconnect |
| In-process browser isolation | `DedicatedWorkerTransport` | Monitor `worker.onerror`; crashes are silent |
| Shared worker, multiple tabs | `SharedWorkerTransport` | One worker handles all port connections |

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

**Use this skill when:**
- You are building a browser-based LSP client, a WebSocket-backed language server, or any LSP integration that must run over HTTP/HTTPS infrastructure. → use `WebSocketTransport`
- You register multiple handlers (hover, completion, definition) that share the same lifetime → use `DisposableStore` — collect them all into one store and dispose the store on shutdown or feature toggle.
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails). → use `ResponseError`
- You are building an LSP client that sends `textDocument/didChange` notifications and need to track per-document version counters. → use `DocumentVersionTracker`

**Do NOT use when:**
- You are building a CLI language server — `StdioTransport` (from `@lspeasy/core/node`) is the conventional choice and avoids the overhead of a network stack. For same-process workers prefer `DedicatedWorkerTransport` or `SharedWorkerTransport`. (`WebSocketTransport`)
- You want to log a server-side error without sending an error to the client — throw a plain `Error` and handle it via `server.onError()` instead. (`ResponseError`)

API surface: 55 functions, 11 classes, 77 types, 1 enums, 41 constants

## NEVER

- NEVER set `enableReconnect: true` in server mode (`socket` provided) — the option is silently ignored (reconnect has no URL to reconnect to), but the intent is misleading and suggests lifecycle management will be handled when it is not.
- NEVER send messages before `isConnected()` returns `true`. In client mode the socket is in CONNECTING state immediately after construction; `send()` will throw until the open event fires.
- NEVER use `ConsoleLogger` in a stdio LSP server (`StdioTransport`) — the LSP base protocol uses stdout as the message channel. Any `console.log` / `console.info` / `console.debug` output will corrupt the stdio stream. Use `NullLogger` or a file-based logger instead, and send diagnostic messages via `window/logMessage` notifications.
- NEVER throw `ResponseError` with a code outside the defined ranges without documenting it. Undocumented codes are opaque to clients and tools.
- NEVER send a `textDocument/didChange` with the same version number as a previous change for the same document. The server may reject the change as a no-op or apply it out of order, causing text state desync.

## Configuration

4 configuration interfaces — see references/config.md for details.

## Quick Reference

**Key functions:** `isRequestMessage` (Returns `true` when `message` is a JSON-RPC request (has `id` + `method`)), `isNotificationMessage` (Returns `true` when `message` is a JSON-RPC notification (has `method`,
no `id`)), `isResponseMessage` (Returns `true` when `message` is a JSON-RPC response (has `id`, no `method`)), `isSuccessResponse` (Returns `true` when `response` carries a `result` (success case)), `isErrorResponse` (Returns `true` when `response` carries an `error` (error case)), `parseMessage` (Parses a single framed JSON-RPC 2), `serializeMessage` (Serializes a JSON-RPC 2), `createWebSocketClient` (Creates a WebSocket client instance, preferring the native
`globalThis), `composeMiddleware` (Combines multiple middleware functions into a single middleware that runs
them left-to-right, each delegating to the next via `next()`), `executeMiddlewarePipeline` (Runs the registered middleware chain for a single JSON-RPC message, then
calls `finalHandler` if no middleware short-circuits), `createScopedMiddleware` (Wraps a middleware with a filter so it only runs for matching LSP messages), `createTypedMiddleware` (Creates a typed, method-scoped middleware with full TypeScript inference for
the message params and result), `createFullDidChangeParams` (Builds `DidChangeTextDocumentParams` for a full-document text replacement), `createIncrementalDidChangeParams` (Builds `DidChangeTextDocumentParams` for an incremental (range-based)
document change notification), `createProgressBegin` (Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification), `createProgressReport` (Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification), `buildMethodSets` (Builds the full set of LSP methods and the subset that are always allowed
(not gated by a capability) for a given capability key)
**Key classes:** `WebSocketTransport` (WebSocket-based transport for LSP communication), `DisposableStore` (Collects multiple `Disposable` instances and releases them together), `CancellationTokenSource` (Controller that creates and manages a `CancellationToken`), `ConsoleLogger` (Logger implementation that writes to the process console with level filtering), `NullLogger` (No-op logger that silently discards all messages), `ResponseError` (An `Error` subclass that maps to a JSON-RPC 2), `DocumentVersionTracker` (Tracks monotonically increasing version numbers for open text documents)

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