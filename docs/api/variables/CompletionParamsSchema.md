[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionParamsSchema

# Variable: CompletionParamsSchema

> `const` **CompletionParamsSchema**: `ZodObject`\<\{ `context`: `ZodOptional`\<`ZodObject`\<\{ `triggerCharacter`: `ZodOptional`\<`ZodString`\>; `triggerKind`: `ZodNumber`; \}, `$strip`\>\>; `partialResultToken`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `position`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; `workDoneToken`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$strip`\>

Defined in: [packages/core/src/protocol/schemas.ts:116](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/schemas.ts#L116)

Completion params
