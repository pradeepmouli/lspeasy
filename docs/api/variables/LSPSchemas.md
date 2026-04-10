[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / LSPSchemas

# Variable: LSPSchemas

> `const` **LSPSchemas**: `object`

Defined in: [packages/core/src/protocol/schemas.ts:284](https://github.com/pradeepmouli/lspeasy/blob/376bc5f0c5c131f9052829a682564c2344e71fd6/packages/core/src/protocol/schemas.ts#L284)

Schema registry for method-based lookup

## Type Declaration

### initialize

> `readonly` **initialize**: `ZodObject`\<\{ `capabilities`: `ZodAny`; `clientInfo`: `ZodOptional`\<`ZodObject`\<\{ `name`: `ZodString`; `version`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; `initializationOptions`: `ZodOptional`\<`ZodUnknown`\>; `locale`: `ZodOptional`\<`ZodString`\>; `processId`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodNull`\]\>; `rootPath`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>\>; `rootUri`: `ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>; `trace`: `ZodOptional`\<`ZodEnum`\<\{ `messages`: `"messages"`; `off`: `"off"`; `verbose`: `"verbose"`; \}\>\>; `workspaceFolders`: `ZodOptional`\<`ZodNullable`\<`ZodArray`\<`ZodObject`\<\{ `name`: `ZodString`; `uri`: `ZodString`; \}, `$strip`\>\>\>\>; \}, `$strip`\> = `InitializeParamsSchema`

### textDocument/completion

> `readonly` **textDocument/completion**: `ZodObject`\<\{ `context`: `ZodOptional`\<`ZodObject`\<\{ `triggerCharacter`: `ZodOptional`\<`ZodString`\>; `triggerKind`: `ZodNumber`; \}, `$strip`\>\>; `partialResultToken`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; `position`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; `workDoneToken`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNumber`\]\>\>; \}, `$strip`\> = `CompletionParamsSchema`

### textDocument/definition

> `readonly` **textDocument/definition**: `ZodObject`\<\{ `position`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; \}, `$strip`\> = `DefinitionParamsSchema`

### textDocument/didChange

> `readonly` **textDocument/didChange**: `ZodObject`\<\{ `contentChanges`: `ZodArray`\<`ZodUnion`\<readonly \[`ZodObject`\<\{ `range`: `ZodObject`\<\{ `end`: `ZodObject`\<..., ...\>; `start`: `ZodObject`\<..., ...\>; \}, `$strip`\>; `rangeLength`: `ZodOptional`\<`ZodNumber`\>; `text`: `ZodString`; \}, `$strip`\>, `ZodObject`\<\{ `text`: `ZodString`; \}, `$strip`\>\]\>\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; `version`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\> = `DidChangeTextDocumentParamsSchema`

### textDocument/didClose

> `readonly` **textDocument/didClose**: `ZodObject`\<\{ `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; \}, `$strip`\> = `DidCloseTextDocumentParamsSchema`

### textDocument/didOpen

> `readonly` **textDocument/didOpen**: `ZodObject`\<\{ `textDocument`: `ZodObject`\<\{ `languageId`: `ZodString`; `text`: `ZodString`; `uri`: `ZodString`; `version`: `ZodNumber`; \}, `$strip`\>; \}, `$strip`\> = `DidOpenTextDocumentParamsSchema`

### textDocument/didSave

> `readonly` **textDocument/didSave**: `ZodObject`\<\{ `text`: `ZodOptional`\<`ZodString`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; \}, `$strip`\> = `DidSaveTextDocumentParamsSchema`

### textDocument/documentSymbol

> `readonly` **textDocument/documentSymbol**: `ZodObject`\<\{ `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; \}, `$strip`\> = `DocumentSymbolParamsSchema`

### textDocument/hover

> `readonly` **textDocument/hover**: `ZodObject`\<\{ `position`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; \}, `$strip`\> = `HoverParamsSchema`

### textDocument/references

> `readonly` **textDocument/references**: `ZodObject`\<\{ `context`: `ZodObject`\<\{ `includeDeclaration`: `ZodBoolean`; \}, `$strip`\>; `position`: `ZodObject`\<\{ `character`: `ZodNumber`; `line`: `ZodNumber`; \}, `$strip`\>; `textDocument`: `ZodObject`\<\{ `uri`: `ZodString`; \}, `$strip`\>; \}, `$strip`\> = `ReferenceParamsSchema`
