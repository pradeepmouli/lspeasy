# Functions

## protocol

### `getSchemaForMethod`
Looks up the Zod validation schema for a given LSP method.
```ts
getSchemaForMethod(method: string): ZodType<any, unknown, $ZodTypeInternals<any, unknown>> | undefined
```
**Parameters:**
- `method: string` — The LSP method string to look up (e.g. `'textDocument/hover'`).
**Returns:** `ZodType<any, unknown, $ZodTypeInternals<any, unknown>> | undefined` — The Zod schema for the method's params, or `undefined` if none is registered.
