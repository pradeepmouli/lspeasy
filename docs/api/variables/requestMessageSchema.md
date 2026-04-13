[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / requestMessageSchema

# Variable: requestMessageSchema

> `const` **requestMessageSchema**: `ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodString`; `params`: `ZodOptional`\<`ZodUnknown`\>; \}, `$strip`\>

Defined in: [packages/core/src/jsonrpc/schemas.ts:18](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/jsonrpc/schemas.ts#L18)

Schema for JSON-RPC 2.0 Request Message
