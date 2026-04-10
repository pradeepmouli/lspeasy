[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [Client](../README.md) / AvailableRequests

# Type Alias: AvailableRequests\<ClientCaps, Requests\>

> **AvailableRequests**\<`ClientCaps`, `Requests`\> = `Simplify`\<`RemoveNever`\<`{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNeverFromNamespace<{ [Method in keyof Requests[Namespace] as CamelCase<Method & string>]: IsClientCapabilityEnabled<ClientCaps, Requests[Namespace][Method]> extends true ? Requests[Namespace][Method] : never }> }`\>\>

Defined in: [packages/core/src/protocol/capability-methods.ts:259](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/protocol/capability-methods.ts#L259)

## Type Parameters

### ClientCaps

`ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../../../../interfaces/ClientCapabilities.md)\>

### Requests

`Requests` *extends* `Partial`\<[`LSPRequest`](../../../../type-aliases/LSPRequest.md)\> = [`LSPRequest`](../../../../type-aliases/LSPRequest.md)
