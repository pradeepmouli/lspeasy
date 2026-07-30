# Functions

## zod-introspection

### `unwrapZodType`
Peel Zod 4 Optional/Nullable/Default wrappers to the underlying type (recursively).

Uses Zod 4 public `instanceof` checks and `.unwrap()` — no internal `_def` reads.
The cast to `z.ZodType` is safe at runtime: `.unwrap()` is typed as returning
`core.$ZodType` (the internal base class) but always yields a classic ZodType instance.
```ts
unwrapZodType(schema: ZodType): ZodType
```
**Parameters:**
- `schema: ZodType`
**Returns:** `ZodType`
