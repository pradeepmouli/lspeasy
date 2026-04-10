[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Server

# Type Alias: Server\<ClientCaps, ServerCaps\>

> **Server**\<`ClientCaps`, `ServerCaps`\> = `SimplifyDeep`\<`{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"][K]]: ToRequestSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["requests"][K][Q]> } }` & `{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"][K]]: ToNotificationSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["notifications"][K][Q]> } }` & `` { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToRequestHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["requestHandlers"][K][Q]> } } `` & `` { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToNotificationHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["server"]["notificationHandlers"][K][Q]> } } ``\>

Defined in: [packages/core/src/protocol/capability-methods.ts:290](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capability-methods.ts#L290)

Combined Server type with handlers and send methods

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\> = [`ClientCapabilities`](../interfaces/ClientCapabilities.md)

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\> = [`ServerCapabilities`](../interfaces/ServerCapabilities.md)

## Example

```ts
type MyCaps = { hoverProvider: true };
type MyServer = Server<ClientCapabilities, MyCaps>;
// server.textDocument.onHover is available
// server.window.showMessage is available for sending
```
