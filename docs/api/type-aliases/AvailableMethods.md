[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / AvailableMethods

# Type Alias: AvailableMethods\<ClientCaps, ServerCaps\>

> **AvailableMethods**\<`ClientCaps`, `ServerCaps`\> = `object`

Defined in: [packages/core/src/protocol/capability-methods.ts:322](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L322)

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../interfaces/ServerCapabilities.md)\>

## Properties

### client

> **client**: `object`

Defined in: [packages/core/src/protocol/capability-methods.ts:326](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L326)

#### notificationHandlers

> **notificationHandlers**: `ConditionalPickDeep`\<[`AvailableNotifications`](../lspeasy/namespaces/Client/type-aliases/AvailableNotifications.md)\<`ClientCaps`\>, \{ `Direction`: `"serverToClient"` \| `"both"`; \}\>

#### notifications

> **notifications**: `ConditionalPickDeep`\<[`AvailableNotifications`](../lspeasy/namespaces/Client/type-aliases/AvailableNotifications.md)\<`ClientCaps`\>, \{ `Direction`: `"clientToServer"` \| `"both"`; \}\>

#### requestHandlers

> **requestHandlers**: `ConditionalPickDeep`\<[`AvailableRequests`](../lspeasy/namespaces/Client/type-aliases/AvailableRequests.md)\<`ClientCaps`\>, \{ `Direction`: `"serverToClient"` \| `"both"`; \}\>

#### requests

> **requests**: `ConditionalPickDeep`\<[`AvailableRequests`](../lspeasy/namespaces/Client/type-aliases/AvailableRequests.md)\<`ClientCaps`\>, \{ `Direction`: `"clientToServer"` \| `"both"`; \}\>

***

### server

> **server**: `object`

Defined in: [packages/core/src/protocol/capability-methods.ts:344](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L344)

#### notificationHandlers

> **notificationHandlers**: `ConditionalPickDeep`\<[`AvailableNotifications`](../lspeasy/namespaces/Server/type-aliases/AvailableNotifications.md)\<`ServerCaps`\>, \{ `Direction`: `"clientToServer"` \| `"both"`; \}\>

#### notifications

> **notifications**: `ConditionalPickDeep`\<[`AvailableNotifications`](../lspeasy/namespaces/Server/type-aliases/AvailableNotifications.md)\<`ServerCaps`\>, \{ `Direction`: `"serverToClient"` \| `"both"`; \}\>

#### requestHandlers

> **requestHandlers**: `ConditionalPickDeep`\<[`AvailableRequests`](../lspeasy/namespaces/Server/type-aliases/AvailableRequests.md)\<`ServerCaps`\>, \{ `Direction`: `"clientToServer"` \| `"both"`; \}\>

#### requests

> **requests**: `ConditionalPickDeep`\<[`AvailableRequests`](../lspeasy/namespaces/Server/type-aliases/AvailableRequests.md)\<`ServerCaps`\>, \{ `Direction`: `"serverToClient"` \| `"both"`; \}\>
