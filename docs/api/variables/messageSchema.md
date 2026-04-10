[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / messageSchema

# Variable: messageSchema

> `const` **messageSchema**: `ZodUnion`\<readonly \[`ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodString`; `params`: `ZodOptional`\<`ZodUnknown`\>; \}, `$strip`\>, `ZodObject`\<\{ `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `method`: `ZodString`; `params`: `ZodOptional`\<`ZodUnknown`\>; \}, `$strip`\>, `ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `result`: `ZodUnknown`; \}, `$strip`\>, `ZodObject`\<\{ `error`: `ZodObject`\<\{ `code`: `ZodNumber`; `data`: `ZodOptional`\<`ZodUnknown`\>; `message`: `ZodString`; \}, `$strip`\>; `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; \}, `$strip`\>\]\>

Defined in: [packages/core/src/jsonrpc/schemas.ts:69](https://github.com/pradeepmouli/lspeasy/blob/74eda4ce2eb3e9f9d51dc27652e0acfc319327d4/packages/core/src/jsonrpc/schemas.ts#L69)

Schema for any JSON-RPC 2.0 Message
Uses discriminated union based on presence of 'method' and 'id'
