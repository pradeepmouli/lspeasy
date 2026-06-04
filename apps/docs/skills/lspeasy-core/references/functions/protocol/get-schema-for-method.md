# Functions

## protocol

### `getSchemaForMethod`
Looks up the Zod validation schema for a given LSP method.
```ts
getSchemaForMethod(method: string): ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined
```
**Parameters:**
- `method: string`
**Returns:** `ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined`
