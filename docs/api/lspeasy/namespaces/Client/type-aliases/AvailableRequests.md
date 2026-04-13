[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Client](../README.md) / AvailableRequests

# Type Alias: AvailableRequests\<ClientCaps, Requests\>

> **AvailableRequests**\<`ClientCaps`, `Requests`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsClientCapabilityEnabled<ClientCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:260](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/capability-methods.ts#L260)

Mapped type of all available LSP request methods and their handler signatures

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../../../../interfaces/ClientCapabilities.md)\>

### Requests

`Requests` *extends* `Partial`\<[`LSPRequest`](../../../../type-aliases/LSPRequest.md)\> = [`LSPRequest`](../../../../type-aliases/LSPRequest.md)
