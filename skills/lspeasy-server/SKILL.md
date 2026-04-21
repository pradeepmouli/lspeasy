---
name: lspeasy-server
description: "Build LSP language servers with a simple, fully-typed API Use when: The client sets `partialResultToken` in the request params and you want to.... Also: lsp, language-server-protocol, lsp-server, language-server."
license: MIT
---

# @lspeasy/server

Build LSP language servers with a simple, fully-typed API

Use `@lspeasy/server` when you need to build the **provider** side of the
Language Server Protocol — a daemon that editors and language-client tooling
connect to in order to get diagnostics, completions, hover, go-to-definition,
and other language intelligence features.

The primary entry point is LSPServer. Construct it with
ServerOptions, call `registerCapabilities(caps)` to declare what
the server supports, register handlers with `onRequest` / `onNotification`,
then call `listen(transport)` to accept the first client connection.

### Transport Decision Tree

**Stdio** (`StdioTransport` from `@lspeasy/core/node`)
— Use when: the client spawns your server as a child process (the canonical
  VS Code extension pattern). No network, no port management. Failure mode:
  `ConsoleLogger` writes to stdout and corrupts the LSP stream — always use
  `NullLogger` or a file-based logger with stdio.

**WebSocket** (`WebSocketTransport` from `@lspeasy/core`)
— Use when: multiple clients connect over a network, or the server must be
  browser-accessible. Each accepted WebSocket connection needs its own
  `LSPServer` instance. Failure mode: one client crash should not affect
  others — wrap each `wss.on('connection')` callback in try/catch and
  create a fresh `LSPServer` per socket.

**TCP** (`TcpTransport` from `@lspeasy/core/node`)
— Use when: building a persistent local daemon (e.g. a formatting server
  shared across editor sessions). Failure mode: client disconnect fires
  `close()` on the server instance — use `mode: 'server'` and create a new
  `LSPServer` on each reconnect.

**DedicatedWorkerTransport** (`DedicatedWorkerTransport` from `@lspeasy/core`)
— Use when: running the server logic in a Web Worker for in-process browser
  isolation. Zero serialization overhead. Failure mode: worker crash is
  silent from the server side — monitor the worker's `onerror` in the host.

### Typed capability namespaces
After `registerCapabilities({ hoverProvider: true })`, TypeScript exposes
`server.textDocument.onHover(handler)` — methods that are absent unless the
corresponding capability is declared. This prevents accidentally registering
handlers for capabilities the server never advertised.

### Handler conventions
- RequestHandler — async, throws ResponseError for
  structured errors, checks `token.isCancellationRequested` for early exit.
- NotificationHandler — fire-and-forget; unhandled rejections
  surface via `server.onError()`.

## Quick Start

Create a minimal hover server in less than 30 lines:

```typescript
import { LSPServer, StdioTransport } from '@lspeasy/server';
import type { HoverParams, Hover } from '@lspeasy/server';

// Create server with capabilities (fluent, returns narrowed type)
const server = new LSPServer({
  name: 'my-language-server',
  version: '1.0.0'
}).registerCapabilities({
  hoverProvider: true
});

// Register hover handler via capability-aware namespace
server.textDocument.onHover(async (params) => {
  return {
    contents: {
      kind: 'markdown',
      value: `# Hover\nLine ${params.position.line}`
    }
  };
});

// Start server
const transport = new StdioTransport();
await server.listen(transport);
```

## When to Use

**Use this skill when:**
- The client sets `partialResultToken` in the request params and you want to stream intermediate results (e.g. symbols found so far) rather than waiting for the complete set. → use `PartialResultSender`
- A request handler needs to reject with a machine-readable error code that the client can act on (e.g. respond with `MethodNotFound` when a capability was not declared, or `InvalidParams` when schema validation fails). → use `ResponseError`

**Do NOT use when:**
- You want to log a server-side error without sending an error to the client — throw a plain `Error` and handle it via `server.onError()` instead.

API surface: 4 classes, 16 types, 1 enums, 2 constants

## NEVER

- NEVER register the same method in both the request and notification handler registries — the dispatcher uses separate lookup tables and the method will only match one path, silently ignoring the other.
- NEVER call `dispatch` before calling `setClientCapabilities` if your handler reads `context.clientCapabilities` — the value will be `undefined` until the `initialize` request is processed.
- NEVER call `send` after the handler has already returned a response — the `$/progress` notification will arrive after the client has closed the partial-result channel, and the client will silently discard or error on it.
- NEVER send partial results without a `partialResultToken` — the client has no way to correlate the `$/progress` notification to the pending request.
- NEVER throw `ResponseError` with a code outside the defined ranges without documenting it. Undocumented codes are opaque to clients and tools.
- NEVER use `ConsoleLogger` in a stdio LSP server (`StdioTransport`) — the LSP base protocol uses stdout as the message channel. Any `console.log` / `console.info` / `console.debug` output will corrupt the stdio stream. Use `NullLogger` or a file-based logger instead, and send diagnostic messages via `window/logMessage` notifications.

## Configuration

**ServerOptions** — Configuration for an `LSPServer` instance. (10 options — see references/config.md)

## Quick Reference

**Server:** `MessageDispatcher` (Routes incoming JSON-RPC requests and notifications to their registered handlers), `PartialResultSender` (Emits typed `$/progress` partial-result batches from server-side request handlers), `LSPServer` (Full-featured LSP server with automatic lifecycle management, typed handlers,
capability-aware namespaces, and pluggable middleware), `LSPServer` (Constructs an LSPServer instance)
**Errors:** `ResponseError` (An `Error` subclass that maps to a JSON-RPC 2), `JSONRPCErrorCode` (Numeric error codes defined by JSON-RPC 2)
**Logging:** `ConsoleLogger` (Logger implementation that writes to the process console with level filtering)
**Handler:** `RequestHandler` (Signature for LSP request handlers registered via `LSPServer), `NotificationHandler` (Signature for LSP notification handlers registered via
`LSPServer), `NotebookDocumentHandlerNamespace` (Namespace for registering notebook-document lifecycle notification handlers), `RequestContext` (Context provided to request handlers alongside params and the cancellation token), `NotificationContext` (Context provided to notification handlers alongside params)
**capability-methods.d:** `Server` (Combined Server type with handlers and send methods), `AvailableRequests` (Mapped type of all available LSP request methods and thei...), `AvailableNotifications` (Mapped type of all available LSP notification methods and...)
**cancellation.d:** `CancellationToken` (Singleton token that is never cancelled)
**Lifecycle:** `CancellationToken` (Read-only handle for observing cancellation state), `ServerState` (Lifecycle state of an `LSPServer` instance)
**infer.d:** `LSPRequestMethod` (Union type of all valid LSP request method names), `LSPNotificationMethod` (Union type of all valid LSP notification method names), `ParamsForRequest` (Infer request parameters from method name), `ResultForRequest` (Infer request result from method name), `ParamsForNotification` (Infer notification parameters from method name)

## References

Load these on demand — do NOT read all at once:

- When using a class → read `references/classes/` for properties, methods, and inheritance
- When defining typed variables or function parameters → read `references/types.md`
- When using enum values → read `references/enums.md`
- When using exported constants → read `references/variables.md`
- When configuring options → read `references/config.md` for all settings and defaults

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli <pmouli@mac.com> (https://github.com/pradeepmouli)