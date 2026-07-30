# Types & Enums

## Server

### `LSPServer`
Full-featured LSP server with automatic lifecycle management, typed handlers,
capability-aware namespaces, and pluggable middleware.
```ts
BaseLSPServer<ServerCaps> & Transport<Transport, ServerCaps>
```

## Handler

### `RequestHandler`
Signature for LSP request handlers registered via `LSPServer.onRequest`.
```ts
(params: Params, token: Transport, context: RequestContext) => Promise<Result> | Result
```

### `NotificationHandler`
Signature for LSP notification handlers registered via
`LSPServer.onNotification`.
```ts
(params: Params, context: NotificationContext) => void | Promise<void>
```

### `NotebookDocumentHandlerNamespace`
Namespace for registering notebook-document lifecycle notification handlers.

### `RequestContext`
Context provided to request handlers alongside params and the cancellation token.
**Properties:**
- `id: string | number` — JSON-RPC request ID for correlation.
- `method: string` — LSP method string, e.g. `'textDocument/hover'`.
- `clientCapabilities: any` (optional) — Client capabilities received during `initialize`.
Available after the first `initialize` request.

### `NotificationContext`
Context provided to notification handlers alongside params.
**Properties:**
- `method: string` — LSP method string, e.g. `'textDocument/didOpen'`.
- `clientCapabilities: any` (optional) — Client capabilities received during `initialize`.
Available after the `initialize` handshake.

## Lifecycle

### `ServerState`
Lifecycle state of an `LSPServer` instance.
- `Created` = `"created"`
- `Initializing` = `"initializing"`
- `Initialized` = `"initialized"`
- `ShuttingDown` = `"shutting_down"`
- `Shutdown` = `"shutdown"`
