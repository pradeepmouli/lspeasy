[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Server](../README.md) / AvailableNotifications

# Type Alias: AvailableNotifications\<ServerCaps, Notifications\>

> **AvailableNotifications**\<`ServerCaps`, `Notifications`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsServerCapabilityEnabled<ServerCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:306](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L306)

## Type Parameters

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../../../../interfaces/ServerCapabilities.md)\>

### Notifications

`Notifications` *extends* `Partial`\<[`LSPNotification`](../../../../type-aliases/LSPNotification.md)\> = [`LSPNotification`](../../../../type-aliases/LSPNotification.md)
