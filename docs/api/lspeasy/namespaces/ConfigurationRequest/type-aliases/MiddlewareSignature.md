[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [ConfigurationRequest](../README.md) / MiddlewareSignature

# Type Alias: MiddlewareSignature

> **MiddlewareSignature** = (`params`, `token`, `next`) => [`HandlerResult`](../../../../type-aliases/HandlerResult.md)\<[`LSPAny`](../../../../type-aliases/LSPAny.md)[], `void`\>

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.configuration.d.ts:18

## Parameters

### params

[`ConfigurationParams`](../../../../interfaces/ConfigurationParams.md)

### token

`CancellationToken`

### next

[`HandlerSignature`](HandlerSignature.md)

## Returns

[`HandlerResult`](../../../../type-aliases/HandlerResult.md)\<[`LSPAny`](../../../../type-aliases/LSPAny.md)[], `void`\>
