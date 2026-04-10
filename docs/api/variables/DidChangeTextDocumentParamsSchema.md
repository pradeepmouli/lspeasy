[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidChangeTextDocumentParamsSchema

# Variable: DidChangeTextDocumentParamsSchema

> `const` **DidChangeTextDocumentParamsSchema**: `ZodObject`\<\{ `contentChanges`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `range`: `ZodObject`\<\{ `end`: `ZodObject`\<\{ `character`: ...; `line`: ...; \}, `$strip`\>; `start`: `ZodObject`\<\{ `character`: ...; `line`: ...; \}, `$strip`\>; \}, `$strip`\>; `rangeLength`: `ZodOptional`\<`ZodNumber`\>; `text`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `text`: `ZodString`; \}, `$strip`\>\]\>\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; `version`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\>

Defined in: [packages/core/src/protocol/schemas.ts:261](https://github.com/pradeepmouli/lspeasy/blob/1dc2e704391f3b32ce8185dadf1a265a4beb41d3/packages/core/src/protocol/schemas.ts#L261)

Did change text document params
