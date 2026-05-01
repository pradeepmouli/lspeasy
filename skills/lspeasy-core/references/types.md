# Types & Enums

## protocol

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

### `ServerCapabilityForRequest`
Resolves the `ServerCapabilities` path key required to enable a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { ServerCapability: infer C } ? C : never : never
```

### `ClientCapabilityForRequest`
Resolves the `ClientCapabilities` path key required for a client to send a given LSP request.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { ClientCapability: infer C } ? C : never : never
```

### `ParamsForNotification`
Infer notification parameters from method name
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M]["Params"] : never
```

### `ServerCapabilityForNotification`
Resolves the `ServerCapabilities` path key required to enable a given LSP notification method.
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M] extends { ServerCapability: infer C } ? C : never : never
```

### `ClientCapabilityForNotification`
Resolves the `ClientCapabilities` path key required for a client to handle a given LSP notification.
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M] extends { ClientCapability: infer C } ? C : never : never
```

### `OptionsForRequest`
Resolves the registration options type for a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { Options: infer O } ? O : never : never
```

### `RegistrationOptionsForRequest`
Resolves the dynamic registration options type for a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { RegistrationOptions: infer R } ? R : never : never
```

### `DirectionForRequest`
Resolves the message direction (`'clientToServer'` | `'serverToClient'` | `'both'`)
for a given LSP request method.
```ts
M extends LSPRequestMethod ? FlatRequestMap[M] extends { Direction: infer D } ? D : never : never
```

### `DirectionForNotification`
Resolves the message direction for a given LSP notification method.
```ts
M extends LSPNotificationMethod ? FlatNotificationMap[M] extends { Direction: infer D } ? D : never : never
```

### `RequestDefinition`
The shape of a single LSP request definition entry (method, params, result,
direction, capability keys). Represents the structure of entries in the
`LSPRequest` namespace objects.
```ts
typeof IncomingCalls
```

### `ClientNotifications`
Client methods for sending requests to server
Methods are conditionally visible based on ServerCapabilities
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in ConditionalKeys<LSPRequest[Namespace], { Direction: "clientToServer" | "both" }> as CamelCase<Method>]: TransformToClientSendMethod<LSPRequest[Namespace][Method], ServerCaps> }> }>>
```

### `ClientRequests`
Typed namespace of client-to-server LSP request methods, filtered by the
server's declared capabilities.
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in ConditionalKeys<LSPRequest[Namespace], { Direction: "clientToServer" | "both" }> as CamelCase<Method>]: TransformToClientSendMethod<LSPRequest[Namespace][Method], ServerCaps> }> }>>
```

### `ServerHandlers`
Server handler registration methods (for requests from client)
Handlers are conditionally visible based on ServerCapabilities
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof LSPRequest[Namespace] as `on${Method & string}`]: TransformToServerHandler<LSPRequest[Namespace][Method], ServerCaps> }> }>>
```

### `ClientRequestHandlers`
Client handler registration methods (for requests from server)
```ts
RemoveNever<{ [Namespace in keyof LSPRequest as CamelCase<Namespace>]: { [Method in keyof ConditionalPick<LSPRequest[Namespace], { Direction: "serverToClient" | "both" }> as `on${Method & string}Request`]: TransformToClientHandler<LSPRequest[Namespace][Method & keyof LSPRequest[Namespace]], _ClientCaps> } }>
```

### `ClientNotificationHandlers`
Typed namespace of server-to-client notification handler registration methods,
filtered by the client's declared capabilities.
```ts
RemoveNever<{ [Namespace in keyof LSPNotification as CamelCase<Namespace>]: { [Method in keyof ConditionalPick<LSPNotification[Namespace], { Direction: "serverToClient" | "both" }> as `on${Method & string}Notification`]: TransformToClientHandler<LSPNotification[Namespace][Method & keyof LSPNotification[Namespace]], _ClientCaps> } }>
```

### `ServerSendMethods`
Typed namespace of server-to-client request send methods, filtered by the
client's declared capabilities.
```ts
Simplify<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNever<{ [Method in keyof LSPRequest[Namespace] as CamelCase<Method & string>]: TransformToServerSendMethod<LSPRequest[Namespace][Method], _ClientCaps> }> }>
```

### `ToRequestSignature`
Converts an LSP request type definition into a callable method signature
`(params: P) => Promise<R>`.
```ts
T extends { Method: string; Params: infer P; Result?: infer R } ? (params: P) => Promise<R> : never
```

### `ToNotificationSignature`
Converts an LSP notification type definition into a fire-and-forget method
signature `(params: P) => void`.
```ts
T extends { Method: string; Params: infer P } ? (params: P) => void : never
```

### `ToRequestHandlerSignature`
Converts an LSP request type definition into a handler registration signature
`(handler: (params: P) => Promise<R> | R) => void`.
```ts
T extends { Method: string; Params: infer P; Result?: infer R } ? (handler: (params: P) => Promise<R> | R) => void : never
```

### `ToNotificationHandlerSignature`
Converts an LSP notification type definition into a handler registration
signature `(handler: (params: P) => void) => void`.
```ts
T extends { Method: string; Params: infer P } ? (handler: (params: P) => void) => void : never
```

### `AvailableMethods`
The complete set of available LSP methods for a client/server capability pair,
split by direction (client send, server send, handlers).

### `LSPRequest`
LSP Request type definitions organized by namespace

### `LSPNotification`
LSP Notification type definitions organized by namespace

### `Client`
Capability-aware interface for an LSP client, combining typed request send
methods, notification send methods, and server-to-client handler registrations.
```ts
SimplifyDeep<{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"][K]]: ToRequestSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"][K]]: ToNotificationSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToRequestHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"][K][Q]> } } & { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToNotificationHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"][K][Q]> } }>
```

### `AvailableRequests`
Mapped type of all available LSP request methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsClientCapabilityEnabled<ClientCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }>>
```

### `AvailableNotifications`
Mapped type of all available LSP notification methods and their handler signatures
```ts
Simplify<RemoveNever<{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsClientCapabilityEnabled<ClientCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }>>
```

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

### `WorkDoneProgressValue`
WorkDoneProgress value types
```ts
WorkDoneProgressBegin | WorkDoneProgressReport | WorkDoneProgressEnd
```

### `PartialResultParams`
A parameter literal used to pass a partial result token.
**Properties:**
- `partialResultToken: ProgressToken` (optional) — An optional token that a server can use to report partial results
(e.g., streaming) to the client.

### `DynamicRegistration`
A single LSP dynamic capability registration entry.
**Properties:**
- `id: string` — Unique identifier for this registration, used to unregister it later.
- `method: string` — The LSP method this registration applies to.
- `registerOptions: unknown` (optional) — Optional method-specific registration options.

### `DynamicRegistrationBehavior`
Controls compatibility behavior for dynamic registrations not declared by client capabilities.
**Properties:**
- `allowUndeclaredDynamicRegistration: boolean` (optional) — When `true`, the client accepts dynamic registrations for capabilities it did not declare
in the `initialize` request. Useful for compatibility with servers that over-register.

### `RegisterCapabilityParams`
Params payload for `client/registerCapability`.
**Properties:**
- `registrations: DynamicRegistration[]` — The capability registrations to apply.

### `UnregisterCapability`
Entry used by `client/unregisterCapability`.
**Properties:**
- `id: string` — The registration `id` returned by the original `client/registerCapability` request.
- `method: string` — The LSP method to unregister.

### `UnregisterCapabilityParams`
Params payload for `client/unregisterCapability`.
**Properties:**
- `unregisterations: UnregisterCapability[]` — The capability unregistration entries to apply.

### `CancelledPartialResult`
Structured response when a partial-enabled request is cancelled.
**Properties:**
- `cancelled: true` — Discriminant — always `true` for cancelled results.
- `partialResults: TPartial[]` — Partial result batches received before the cancellation occurred.
- `finalResult: undefined` (optional) — Always `undefined` for cancelled results — no final result was received.

### `CompletedPartialResult`
Structured response when a partial-enabled request completes successfully.
**Properties:**
- `cancelled: false` — Discriminant — always `false` for completed results.
- `partialResults: TPartial[]` — Partial result batches received during streaming.
- `finalResult: TResult` — The final result returned when the request completed.

### `PartialRequestOutcome`
Union return type for partial-enabled client requests.
```ts
CancelledPartialResult<TPartial> | CompletedPartialResult<TPartial, TResult>
```

## JSON-RPC

### `BaseMessage`
Base JSON-RPC 2.0 message discriminant.
**Properties:**
- `jsonrpc: "2.0"` — JSON-RPC protocol version discriminant — always `"2.0"`.

### `RequestMessage`
JSON-RPC 2.0 Request message — expects a response from the peer.
**Properties:**
- `id: string | number` — Unique identifier correlating this request to its eventual response.
- `method: string` — LSP method string, e.g. `'textDocument/hover'`.
- `jsonrpc: "2.0"` — JSON-RPC protocol version — always `"2.0"` (inherited).
- `params: unknown` (optional) — Optional request parameters (method-specific shape).

### `NotificationMessage`
JSON-RPC 2.0 Notification message — no response is expected or sent.
**Properties:**
- `method: string` — LSP method string, e.g. `'textDocument/didOpen'`.
- `jsonrpc: "2.0"` — JSON-RPC protocol version — always `"2.0"` (inherited).
- `params: unknown` (optional) — Optional notification parameters (method-specific shape).

### `SuccessResponseMessage`
JSON-RPC 2.0 success response to a prior request.
**Properties:**
- `id: string | number` — Identifier matching the originating request's `id`.
- `jsonrpc: "2.0"` — JSON-RPC protocol version — always `"2.0"` (inherited).
- `result: unknown` — The request result payload.

### `ErrorResponseMessage`
JSON-RPC 2.0 error response to a prior request.
**Properties:**
- `id: string | number` — Identifier matching the originating request's `id`.
- `jsonrpc: "2.0"` — JSON-RPC protocol version — always `"2.0"` (inherited).
- `error: ResponseErrorInterface` — Structured error payload.

### `ResponseMessage`
JSON-RPC 2.0 Response message — either a success result or an error.
```ts

<!-- truncated -->
