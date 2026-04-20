---
name: lspeasy-server
description: "TypeScript SDK for building Language Server Protocol clients and servers LSP server package for hosting Language Server Protocol (LSP) servers. Use when: The client sets `partialResultToken` in the request params and you want to; stream intermediate results (e.g. symbols found so far) rather than waiting; for the complete set.."
license: MIT
---

# @lspeasy/server

TypeScript SDK for building Language Server Protocol clients and servers

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


| Task | Use |
|------|-----|
| The client sets `partialResultToken` in the request params and you want to | `PartialResultSender` |
| stream intermediate results (e.g. symbols found so far) rather than waiting | `PartialResultSender` |
| for the complete set. | `PartialResultSender` |
| A request handler needs to reject with a machine-readable error code that | `ResponseError` |
| the client can act on (e.g. respond with `MethodNotFound` when a capability | `ResponseError` |
| was not declared, or `InvalidParams` when schema validation fails). | `ResponseError` |

**Avoid when:**
- You want to log a server-side error without sending an error to the client —
- throw a plain `Error` and handle it via `server.onError()` instead.
- API surface: 4 classes, 16 types, 1 enums, 2 constants

**NEVER:**

- NEVER register the same method in both the request and notification handler
- registries — the dispatcher uses separate lookup tables and the method will
- only match one path, silently ignoring the other.
- NEVER call `dispatch` before calling `setClientCapabilities` if your handler
- reads `context.clientCapabilities` — the value will be `undefined` until
- the `initialize` request is processed.
- NEVER call `send` after the handler has already returned a response — the
- `$/progress` notification will arrive after the client has closed the
- partial-result channel, and the client will silently discard or error on it.
- NEVER send partial results without a `partialResultToken` — the client has
- no way to correlate the `$/progress` notification to the pending request.
- NEVER throw `ResponseError` with a code outside the defined ranges without
- documenting it. Undocumented codes are opaque to clients and tools.
- NEVER use `ConsoleLogger` in a stdio LSP server (`StdioTransport`) — the
- LSP base protocol uses stdout as the message channel. Any `console.log` /
- `console.info` / `console.debug` output will corrupt the stdio stream.
- Use `NullLogger` or a file-based logger instead, and send diagnostic
- messages via `window/logMessage` notifications.

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