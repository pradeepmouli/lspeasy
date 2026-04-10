[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / requestMessageSchema

# Variable: requestMessageSchema

> `const` **requestMessageSchema**: `ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodString`; `params`: `ZodOptional`\<`ZodUnknown`\>; \}, `$strip`\>

Defined in: [packages/core/src/jsonrpc/schemas.ts:18](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/jsonrpc/schemas.ts#L18)

Schema for JSON-RPC 2.0 Request Message
