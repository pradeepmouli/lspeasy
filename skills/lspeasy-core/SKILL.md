---
description: "Core types, transports, and utilities shared by all lspeasy packages. Use when: You register multiple handlers (hover, completion, definition) that share the...."
name: lspeasy-core
---

# @lspeasy/core

Core types, transports, and utilities shared by all lspeasy packages.

`@lspeasy/core` is the shared foundation for the lspeasy SDK. It contains
everything needed to build custom LSP integrations, and re-exports the
most-used pieces from `@lspeasy/client` and `@lspeasy/server`.

### Key areas

**JSON-RPC 2.0** — Message types (RequestMessage, NotificationMessage,
ResponseMessage) and framing (parseMessage,
serializeMessage). Zod schemas for validating them live in
`@lspeasy/core/schemas`.

**Transports** — The Transport interface is exported here; the
implementations are not. Browser transports (`WebSocketTransport`,
`DedicatedWorkerTransport`, `SharedWorkerTransport`) are in
`@lspeasy/core/transport`; Node.js transports (`StdioTransport`,
`TcpTransport`, `IpcTransport`, `SocketTransport`) are in
`@lspeasy/core/node`, so browser bundles never pull `node:` builtins.

This barrel deliberately contains no runtime zod. See
`barrel-purity.test.ts` and the design note in
docs/superpowers/specs/2026-09-02-zod-off-the-runtime-path-design.md.

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

## When to Use

**Use this skill when:**
- You register multiple handlers (hover, completion, definition) that share the same lifetime → use `DisposableStore` — collect them all into one store and dispose the store on shutdown or feature toggle.
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails). → use `ResponseError`
- You are building an LSP client that sends `textDocument/didChange` notifications and need to track per-document version counters. → use `DocumentVersionTracker`

**Do NOT use when:**
- You want to log a server-side error without sending an error to the client — throw a plain `Error` and handle it via `server.onError()` instead.

API surface: 68 functions, 7 classes, 123 types, 1 enums, 51 constants

## NEVER

- Returns `null` silently when no `lsp.json` is found anywhere in   the search path (including the global `~/.claude/lsp.json` fallback).   Callers that skip the null check will silently fail to resolve a server   command — for the CLI this means `lsproxy` exits before the proxy daemon   is ever spawned.  Create an `lsp.json` at the workspace root or at   `~/.claude/lsp.json` for a per-user fallback.
- Returns `null` silently when no matching entry is found.  The   proxy daemon's `BackendPool` calls this function on every new language   connection — if `lsp.json` is absent or omits the requested language, the   daemon starts successfully but throws `"No LSP server configured for   languageId"` the moment a client request arrives.  An `lsp.json` must be   present in the workspace (or at `~/.claude/lsp.json`) before the proxy   server can serve any language.
- NEVER use `ConsoleLogger` in a stdio LSP server (`StdioTransport`) — the LSP base protocol uses stdout as the message channel. Any `console.log` / `console.info` / `console.debug` output will corrupt the stdio stream. Use `NullLogger` or a file-based logger instead, and send diagnostic messages via `window/logMessage` notifications.
- NEVER throw `ResponseError` with a code outside the defined ranges without documenting it. Undocumented codes are opaque to clients and tools.
- NEVER send a `textDocument/didChange` with the same version number as a previous change for the same document. The server may reject the change as a no-op or apply it out of order, causing text state desync.

## Configuration

4 configuration interfaces — see references/config.md for details.

## Quick Reference

**Key functions:** `isRequestMessage` (Returns `true` when `message` is a JSON-RPC request (has `id` + `method`)), `isNotificationMessage` (Returns `true` when `message` is a JSON-RPC notification (has `method`,
no `id`)), `isResponseMessage` (Returns `true` when `message` is a JSON-RPC response (has `id`, no `method`)), `isSuccessResponse` (Returns `true` when `response` carries a `result` (success case)), `isErrorResponse` (Returns `true` when `response` carries an `error` (error case)), `parseMessage` (Parses a single framed JSON-RPC 2), `serializeMessage` (Serializes a JSON-RPC 2), `composeMiddleware` (Combines multiple middleware functions into a single middleware that runs
them left-to-right, each delegating to the next via `next()`), `executeMiddlewarePipeline` (Runs the registered middleware chain for a single JSON-RPC message, then
calls `finalHandler` if no middleware short-circuits), `createScopedMiddleware` (Wraps a middleware with a filter so it only runs for matching LSP messages), `createTypedMiddleware` (Creates a typed, method-scoped middleware with full TypeScript inference for
the message params and result), `createFullDidChangeParams` (Builds `DidChangeTextDocumentParams` for a full-document text replacement), `createIncrementalDidChangeParams` (Builds `DidChangeTextDocumentParams` for an incremental (range-based)
document change notification), `createProgressBegin` (Creates a `WorkDoneProgressBegin` payload to start a work-done progress notification), `createProgressReport` (Creates a `WorkDoneProgressReport` payload to update an in-progress work-done notification), `buildMethodSets` (Builds the full set of LSP methods and the subset that are always allowed
(not gated by a capability) for a given capability key), `discoverServer` (Resolve an LSP server for a file extension by walking up from `root` to the filesystem root then falling back to the global user config), `discoverServerByLanguageId` (Resolve an LSP server for a language ID by walking up from `root` to the filesystem root then falling back to the global user config)
**Key classes:** `DisposableStore` (Collects multiple `Disposable` instances and releases them together), `CancellationTokenSource` (Controller that creates and manages a `CancellationToken`), `ConsoleLogger` (Logger implementation that writes to the process console with level filtering), `NullLogger` (No-op logger that silently discards all messages), `ResponseError` (An `Error` subclass that maps to a JSON-RPC 2), `DocumentVersionTracker` (Tracks monotonically increasing version numbers for open text documents)

*250 exports total — see references/ for full API.*

## References

Load these on demand — do NOT read all at once:

- When calling any function → browse `references/functions/` for grouped indexes, full signatures, parameters, and return types
- When using a class → read `references/classes.md` for properties, methods, and inheritance
- When defining typed variables or function parameters → read `references/types.md`
- When using exported constants → read `references/variables.md`
- When configuring options → read `references/config.md` for all settings and defaults

## Links

- Author: Pradeep Mouli <pmouli@mac.com> (https://github.com/pradeepmouli)