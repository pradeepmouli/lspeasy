[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InitializeParamsSchema

# Variable: InitializeParamsSchema

> `const` **InitializeParamsSchema**: `ZodObject`\<\{ `capabilities`: `ZodAny`; `clientInfo`: `ZodOptional`\<`ZodObject`\<\{ `name`: `ZodString`; `version`: `ZodOptional`\<`ZodString`\>; \}, `$strip`\>\>; `initializationOptions`: `ZodOptional`\<`ZodUnknown`\>; `locale`: `ZodOptional`\<`ZodString`\>; `processId`: `ZodUnion`\<readonly \[`ZodNumber`, `ZodNull`\]\>; `rootPath`: `ZodOptional`\<`ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>\>; `rootUri`: `ZodUnion`\<readonly \[`ZodString`, `ZodNull`\]\>; `trace`: `ZodOptional`\<`ZodEnum`\<\{ `messages`: `"messages"`; `off`: `"off"`; `verbose`: `"verbose"`; \}\>\>; `workspaceFolders`: `ZodOptional`\<`ZodNullable`\<`ZodArray`\<`ZodObject`\<\{ `name`: `ZodString`; `uri`: `ZodString`; \}, `$strip`\>\>\>\>; \}, `$strip`\>

Defined in: [packages/core/src/protocol/schemas.ts:207](https://github.com/pradeepmouli/lspeasy/blob/9cfbcabb7e5a7111a570b29f368656ea6b98ee25/packages/core/src/protocol/schemas.ts#L207)

Initialize params
