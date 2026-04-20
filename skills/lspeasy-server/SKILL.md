---
name: lspeasy-server
description: "Typed LSP server with capability-aware handler namespaces, automatic initialize/shutdown lifecycle, cancellation support, and partial-result streaming. Use when building a language server daemon that editors connect to via stdio, TCP, or WebSocket — and need the lspeasy SDK (LSPServer, MessageDispatcher, PartialResultSender). Keywords: lsp, language-server-protocol, lsp-server, language-server, lspeasy."
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

### Choosing a transport
| Environment | Transport |
|---|---|
| Editor stdio/pipe | `StdioTransport` from `@lspeasy/core/node` |
| TCP socket | `TcpTransport` from `@lspeasy/core/node` |
| In-process / test | `WebSocketTransport` from `@lspeasy/core` |
| Web Workers | `DedicatedWorkerTransport` from `@lspeasy/core` |

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

## Features

- **Type-Safe Handlers**: Fully typed request and notification handlers with IntelliSense support
- **Automatic Validation**: Built-in parameter validation using Zod schemas
- **Lifecycle Management**: Automatic initialize/shutdown handshake handling
- **Cancellation Support**: Built-in cancellation token support for long-running operations
- **Error Handling**: Comprehensive error handling with LSP error codes
- **Chainable API**: Fluent API with method chaining

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
- The client sends `partialResultToken` in request params (e.g. `textDocument/references`, `workspace/symbol`) and you want to stream intermediate result batches rather than holding the full set in memory before responding → use `PartialResultSender`. Without streaming, large result sets block the client until the handler returns.
- A request handler must reject with a machine-readable error code (e.g. `MethodNotFound`, `InvalidParams`) that clients can route programmatically → use `ResponseError`. Throw plain `Error` only for unexpected internal failures (becomes generic `-32603 InternalError`).
- You need direct control over the JSON-RPC routing table — e.g. inspecting which methods are registered or dispatching manually in tests → use `MessageDispatcher` directly (normally internal to `LSPServer`).

**Do NOT use when:**
- You want to log a server-side error without sending it to the client — throw a plain `Error` caught by `server.onError()` instead.
- You need a bare JSON-RPC layer without LSP semantics — use the transport and framing utilities from `@lspeasy/core` directly.

API surface: 4 classes, 16 types, 1 enums, 2 constants

## NEVER

- NEVER call `server.shutdown()` or `server.close()` from inside a request or notification handler — the transport is actively dispatching at that point; calling close from within a handler creates a deadlock where the handler awaits close, and close waits for all handlers to finish.
- NEVER mutate `ServerCapabilities` after the `initialized` notification is received — the client cached `InitializeResult` at handshake time; runtime changes are invisible to it and will cause capability mismatches.
- NEVER share one `LSPServer` instance across multiple client connections — each connection requires its own instance to maintain independent lifecycle state and ID sequences.
- NEVER send server-to-client notifications inside the `initialize` request handler — the `initialize` response has not been sent at that point; notifications sent before the response are discarded by clients. Use the `initialized` notification handler for post-handshake setup instead.
- NEVER register the same method in both the request and notification handler registries — the dispatcher uses separate lookup tables and the method will only match one path, silently ignoring the other.
- NEVER call `dispatch` before `setClientCapabilities` if your handler reads `context.clientCapabilities` — the value is `undefined` until the `initialize` request is processed.
- NEVER call `PartialResultSender.send` after the handler has returned a response — the `$/progress` notification arrives after the client has closed the partial-result channel and will be silently discarded or cause a protocol error.
- NEVER send partial results without a `partialResultToken` — the client has no way to correlate the `$/progress` notification to the pending request.
- NEVER throw `ResponseError` with a code outside the defined JSON-RPC / LSP ranges without documenting it — undocumented codes are opaque to clients and tools that route on error codes.
- NEVER use `ConsoleLogger` in a stdio LSP server — stdout is the LSP base protocol message channel; any `console.log` / `console.info` / `console.debug` output corrupts the stream framing and breaks all clients. Use `NullLogger` or a file-based logger; send diagnostic text via `window/logMessage` notifications.

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