[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ServerSendMethods

# Type Alias: ServerSendMethods\<_ClientCaps\>

> **ServerSendMethods**\<`_ClientCaps`\> = `Simplify`\<`{ [Namespace in KeyAsString<LSPRequest> as CamelCase<Namespace>]: RemoveNever<{ [Method in keyof LSPRequest[Namespace] as CamelCase<Method & string>]: TransformToServerSendMethod<LSPRequest[Namespace][Method], _ClientCaps> }> }`\>

Defined in: [packages/core/src/protocol/capability-methods.ts:218](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/capability-methods.ts#L218)

## Type Parameters

### _ClientCaps

`_ClientCaps` *extends* `Partial`\<[`ClientCapabilities`](../interfaces/ClientCapabilities.md)\> = [`ClientCapabilities`](../interfaces/ClientCapabilities.md)
