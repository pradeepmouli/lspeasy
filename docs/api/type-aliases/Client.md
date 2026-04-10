[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / Client

# Type Alias: Client\<ClientCaps, ServerCaps\>

> **Client**\<`ClientCaps`, `ServerCaps`\> = `SimplifyDeep`\<`{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"][K]]: ToRequestSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["requests"][K][Q]> } }` & `{ [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"][K]]: ToNotificationSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["notifications"][K][Q]> } }` & `` { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToRequestHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["requestHandlers"][K][Q]> } } `` & `` { [K in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"]]: { [Q in keyof AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"][K] as `on${PascalCase<string & Q, { preserveConsecutiveUppercase: true }>}`]: ToNotificationHandlerSignature<AvailableMethods<ClientCaps, ServerCaps>["client"]["notificationHandlers"][K][Q]> } } ``\>

Defined in: [packages/core/src/protocol/capability-methods.ts:258](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/capability-methods.ts#L258)

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\> = [`ClientCapabilities`](../interfaces/ClientCapabilities.md)

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\> = [`ServerCapabilities`](../interfaces/ServerCapabilities.md)
