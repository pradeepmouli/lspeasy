[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ClientNotificationHandlers

# Type Alias: ClientNotificationHandlers\<_ClientCaps\>

> **ClientNotificationHandlers**\<`_ClientCaps`\> = `RemoveNever`\<\{ \[Namespace in keyof LSPNotification as CamelCase\<Namespace\>\]: \{ \[Method in keyof ConditionalPick\<LSPNotification\[Namespace\], \{ Direction: "serverToClient" \| "both" \}\> as \`on$\{Method & string\}Notification\`\]: TransformToClientHandler\<LSPNotification\[Namespace\]\[Method\], \_ClientCaps\> \} \}\>

Defined in: [packages/core/src/protocol/capability-methods.ts:205](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capability-methods.ts#L205)

## Type Parameters

### _ClientCaps

`_ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\>
