[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / responseMessageSchema

# Variable: responseMessageSchema

> `const` **responseMessageSchema**: `ZodUnion`\<readonly \[`ZodObject`\<\{ `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; `result`: `ZodUnknown`; \}, `$strip`\>, `ZodObject`\<\{ `error`: `ZodObject`\<\{ `code`: `ZodNumber`; `data`: `ZodOptional`\<`ZodUnknown`\>; `message`: `ZodString`; \}, `$strip`\>; `id`: `ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>; `jsonrpc`: `ZodLiteral`\<`"2.0"`\>; \}, `$strip`\>\]\>

Defined in: [packages/core/src/jsonrpc/schemas.ts:60](https://github.com/pradeepmouli/lspeasy/blob/90e5dd09e9abc1eaec4942c3ce2bc68117367562/packages/core/src/jsonrpc/schemas.ts#L60)

Schema for JSON-RPC 2.0 Response Message (success or error)
