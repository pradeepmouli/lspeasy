[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Server](../README.md) / AvailableNotifications

# Type Alias: AvailableNotifications\<ServerCaps, Notifications\>

> **AvailableNotifications**\<`ServerCaps`, `Notifications`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsServerCapabilityEnabled<ServerCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:310](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/capability-methods.ts#L310)

Mapped type of all available LSP notification methods and their handler signatures

## Type Parameters

### ServerCaps

`ServerCaps` *extends* `Partial`\<[`ServerCapabilities`](../../../../interfaces/ServerCapabilities.md)\>

### Notifications

`Notifications` *extends* `Partial`\<[`LSPNotification`](../../../../type-aliases/LSPNotification.md)\> = [`LSPNotification`](../../../../type-aliases/LSPNotification.md)
