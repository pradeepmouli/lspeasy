[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Client](../README.md) / AvailableNotifications

# Type Alias: AvailableNotifications\<ClientCaps, Notifications\>

> **AvailableNotifications**\<`ClientCaps`, `Notifications`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsClientCapabilityEnabled<ClientCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:276](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/capability-methods.ts#L276)

Mapped type of all available LSP notification methods and their handler signatures

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../../../../interfaces/ClientCapabilities.md)\>

### Notifications

`Notifications` *extends* `Partial`\<[`LSPNotification`](../../../../type-aliases/LSPNotification.md)\> = [`LSPNotification`](../../../../type-aliases/LSPNotification.md)
