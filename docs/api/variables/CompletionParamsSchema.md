[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionParamsSchema

# Variable: CompletionParamsSchema

> `const` **CompletionParamsSchema**: `ZodObject`\<\{ `context`: `ZodOptional`\<`ZodObject`\<\{ `triggerCharacter`: `ZodOptional`\<`ZodString`\>; `triggerKind`: `ZodNumber`; \}, `$strip`\>\>; `partialResultToken`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `position`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; `workDoneToken`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$strip`\>

Defined in: [packages/core/src/protocol/schemas.ts:116](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/schemas.ts#L116)

Completion params
