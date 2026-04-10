[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / errorResponseMessageSchema

# Variable: errorResponseMessageSchema

> `const` **errorResponseMessageSchema**: `ZodObject`\<\{ `error`: `ZodObject`\<\{ `code`: `ZodNumber`; `data`: `ZodOptional`\<`ZodUnknown`\>; `message`: `ZodString`; \}, `$strip`\>; `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; \}, `$strip`\>

Defined in: [packages/core/src/jsonrpc/schemas.ts:52](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/jsonrpc/schemas.ts#L52)

Schema for JSON-RPC 2.0 Error Response Message
