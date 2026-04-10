[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / messageSchema

# Variable: messageSchema

> `const` **messageSchema**: `ZodUnion`\<readonly \[`ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodString`; `params`: `ZodOptional`\<`ZodUnknown`\>; \}, `$strip`\>, `ZodObject`\<\{ `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodString`; `params`: `ZodOptional`\<`ZodUnknown`\>; \}, `$strip`\>, `ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `result`: `ZodUnknown`; \}, `$strip`\>, `ZodObject`\<\{ `error`: `ZodObject`\<\{ `code`: `ZodNumber`; `data`: `ZodOptional`\<`ZodUnknown`\>; `message`: `ZodString`; \}, `$strip`\>; `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; \}, `$strip`\>\]\>

Defined in: [packages/core/src/jsonrpc/schemas.ts:69](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/jsonrpc/schemas.ts#L69)

Schema for any JSON-RPC 2.0 Message
Uses discriminated union based on presence of 'method' and 'id'
