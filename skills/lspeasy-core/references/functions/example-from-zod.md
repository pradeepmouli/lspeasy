# Functions

## example-from-zod

### `exampleFromZod`
Build an illustrative, required-only example value from a Zod schema.
Strings → "example", numbers → 1, booleans → false, enum/literal → first value,
objects → required props (optionals/nullables/defaults omitted), arrays → one sample element.
Recursion is capped at MAX_DEPTH (returns null).
The lsproxy CLI uses this to show example request/response payloads.

Uses Zod 4 public `instanceof` checks and typed accessors — no internal `_def` reads.
```ts
exampleFromZod(schema: ZodType, depth: number): unknown
```
**Parameters:**
- `schema: ZodType`
- `depth: number` — default: `0`
**Returns:** `unknown`
