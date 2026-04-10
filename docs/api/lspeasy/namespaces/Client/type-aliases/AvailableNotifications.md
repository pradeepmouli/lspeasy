[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Client](../README.md) / AvailableNotifications

# Type Alias: AvailableNotifications\<ClientCaps, Notifications\>

> **AvailableNotifications**\<`ClientCaps`, `Notifications`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPNotification> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Notifications[Namespace] as CamelCase<StripNamespaceSuffix<Namespace & string, Method & string>>]: IsClientCapabilityEnabled<ClientCaps, Notifications[Namespace][Method]> extends true ? Notifications[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:274](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/protocol/capability-methods.ts#L274)

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../../../../interfaces/ClientCapabilities.md)\>

### Notifications

`Notifications` *extends* `Partial`\<[`LSPNotification`](../../../../type-aliases/LSPNotification.md)\> = [`LSPNotification`](../../../../type-aliases/LSPNotification.md)
