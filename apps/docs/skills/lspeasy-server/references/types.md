# Types & Enums

## server

### `LSPServer`
@lspeasy/server - Build LSP servers with simple, typed API
```ts
BaseLSPServer<ServerCaps> & Server<ClientCapabilities, ServerCaps>
```

## Server

### `ServerOptions`
Configuration for an `LSPServer` instance.
**Properties:**
- `name: string` (optional) — Server name (sent in initialize response)
- `version: string` (optional) — Server version (sent in initialize response)
- `logger: Logger` (optional) — Logger instance (defaults to ConsoleLogger)
- `logLevel: LogLevel` (optional) — Log level (defaults to 'info')
- `requestTimeout: number` (optional) — Default request timeout in milliseconds for server-initiated requests
- `onValidationError: (error: ZodError, message: RequestContext | NotificationContext) => void | ResponseError` (optional) — Custom validation error handler
- `validateParams: boolean` (optional) — Enable parameter validation for requests and notifications
Defaults to true
- `capabilities: Capabilities` (optional) — Capabilities to declare during initialization
- `strictCapabilities: boolean` (optional) — Strict capability checking mode
When true, throws error if handler registered for unsupported capability
When false, logs warning and allows registration (default: false)
- `middleware: (Middleware | ScopedMiddleware)[]` (optional) — Optional middleware chain for clientToServer/serverToClient messages.

## Handler

### `RequestHandler`
Signature for LSP request handlers registered via `LSPServer.onRequest`.
```ts
(params: Params, token: CancellationToken, context: RequestContext) => Promise<Result> | Result
```

### `NotificationHandler`
Signature for LSP notification handlers registered via
`LSPServer.onNotification`.
```ts
(params: Params, context: NotificationContext) => void | Promise<void>
```

### `RequestContext`
Context provided to request handlers alongside params and the cancellation token.
**Properties:**
- `id: string | number` — JSON-RPC request ID for correlation.
- `method: string` — LSP method string, e.g. `'textDocument/hover'`.
- `clientCapabilities: ClientCapabilities` (optional) — Client capabilities received during `initialize`.
Available after the first `initialize` request.

### `NotificationContext`
Context provided to notification handlers alongside params.
**Properties:**
- `method: string` — LSP method string, e.g. `'textDocument/didOpen'`.
- `clientCapabilities: ClientCapabilities` (optional) — Client capabilities received during `initialize`.
Available after the `initialize` handshake.

## types

### `NotebookDocumentHandlerNamespace`

## capability-methods.d

### `Server`
Combined Server type with handlers and send methods
```ts
SimplifyDeep<{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"][K]]: ToRequestSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"][K]]: ToNotificationSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToRequestHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToNotificationHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"][K][Q]> } }>
```

### `AvailableRequests`
Mapped type of all available LSP request methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsServerCapabilityEnabled<ServerCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }>>
```

### `AvailableNotifications`
Mapped type of all available LSP notification methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsServerCapabilityEnabled<ServerCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }>>
```

## cancellation.d

### `CancellationToken`
Singleton token that is never cancelled

## Lifecycle

### `CancellationToken`
Read-only handle for observing cancellation state.
**Properties:**
- `isCancellationRequested: boolean` — `true` once cancellation has been requested; never resets to `false`.

### `ServerState`
Lifecycle state of an `LSPServer` instance.
- `Created` = `"created"`
- `Initializing` = `"initializing"`
- `Initialized` = `"initialized"`
- `ShuttingDown` = `"shutting_down"`
- `Shutdown` = `"shutdown"`

## infer.d

### `LSPRequestMethod`
Union type of all valid LSP request method names
```ts
Direction extends "both" ? KeyAsString<FlatRequestMap> : ConditionalKeys<FlatRequestMap, { Direction: Direction | "both" }> & string
```

### `LSPNotificationMethod`
Union type of all valid LSP notification method names
```ts
Direction extends "both" ? KeyAsString<FlatNotificationMap> : ConditionalKeys<FlatNotificationMap, { Direction: Direction | "both" }> & string
```

### `ParamsForRequest`
Infer request parameters from method name
```ts
M extends LSPRequestMethod ? FlatRequestMap[M]["Params"] : never
```

### `ResultForRequest`
Infer request result from method name
```ts
M extends LSPRequestMethod ? FlatRequestMap[M]["Result"] : never
```

### `ParamsForNotification`
Infer notification parameters from method name
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M]["Params"] : never
```
