[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CompletionItemSchema

# Variable: CompletionItemSchema

> `const` **CompletionItemSchema**: `ZodObject`\<\{ `additionalTextEdits`: `ZodOptional`\<`ZodArray`\<`ZodObject`\<\{ `newText`: `ZodString`; `range`: `ZodObject`\<\{ `end`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `start`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\>; \}, `$strip`\>\>\>; `command`: `ZodOptional`\<`ZodAny`\>; `commitCharacters`: `ZodOptional`\<`ZodArray`\<`ZodString`\>\>; `data`: `ZodOptional`\<`ZodUnknown`\>; `deprecated`: `ZodOptional`\<`ZodBoolean`\>; `detail`: `ZodOptional`\<`ZodString`\>; `documentation`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodObject`\<\{ `kind`: `ZodUnion`\<readonly \[`ZodLiteral`\<`"plaintext"`\>, `ZodLiteral`\<`"markdown"`\>\]\>; `value`: `ZodString`; \}, `$strip`\>\]\>\>; `filterText`: `ZodOptional`\<`ZodString`\>; `insertText`: `ZodOptional`\<`ZodString`\>; `insertTextFormat`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodLiteral`\<`1`\>, `ZodLiteral`\<`2`\>\]\>\>; `kind`: `ZodOptional`\<`ZodNumber`\>; `label`: `ZodString`; `preselect`: `ZodOptional`\<`ZodBoolean`\>; `sortText`: `ZodOptional`\<`ZodString`\>; `tags`: `ZodOptional`\<`ZodArray`\<`ZodNumber`\>\>; `textEdit`: `ZodOptional`\<`ZodObject`\<\{ `newText`: `ZodString`; `range`: `ZodObject`\<\{ `end`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `start`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\>; \}, `$strip`\>\>; \}, `$strip`\>

Defined in: [packages/core/src/protocol/schemas.ts:135](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/schemas.ts#L135)

Completion item
