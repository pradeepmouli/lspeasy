# Functions

## protocol

### `getResultSchemaForMethod`
Looks up the result schema for a request method.
Returns `undefined` for notifications or unknown methods.
```ts
getResultSchemaForMethod(method: string): ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined
```
**Parameters:**
- `method: string`
**Returns:** `ZodType<unknown, unknown, $ZodTypeInternals<unknown, unknown>> | undefined`
