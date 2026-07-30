# Classes

## Server

### `MessageDispatcher`
Routes incoming JSON-RPC requests and notifications to their registered handlers.
```ts
constructor(logger: Logger): MessageDispatcher
```
**Methods:**
- `registerRequest<Params, Result>(method: string, handler: RequestHandler<Params, Result>): void` — Register a typed request handler for the given LSP method.
- `registerNotification<Params>(method: string, handler: NotificationHandler<Params>): void` — Register a typed notification handler for the given LSP method.
- `unregisterRequest(method: string): void` — Unregister a request handler.
- `unregisterNotification(method: string): void` — Unregister a notification handler.
- `setClientCapabilities(capabilities: ClientCapabilities): void` — Set client capabilities (from initialize request)
- `dispatch(message: Message, transport: Transport, cancellationTokens: Map<string | number, AbortController>): Promise<void>` — Dispatch an incoming message to the registered handler.
- `cancelRequest(id: string | number): void` — Cancel a pending request.
- `clear(): void` — Clear all handlers

### `PartialResultSender`
Emits typed `$/progress` partial-result batches from server-side request handlers.
```ts
constructor(server: BaseLSPServer): PartialResultSender
```
**Methods:**
- `send<T>(token: ProgressToken, value: T): Promise<void>` — Send a batch of partial results to the client.
