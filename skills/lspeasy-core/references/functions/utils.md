# Functions

## utils

### `checkMethod`
Shared validation logic for checking if a method is allowed based on capabilities.

Returns `true` if allowed, `false` if disallowed in non-strict mode, or throws in strict mode.
```ts
checkMethod(opts: CheckMethodOptions): boolean
```
**Parameters:**
- `opts: CheckMethodOptions` — Validation options including the method, capability lookup helpers, and logger.
**Returns:** `boolean` — `true` when the method is allowed; `false` when disallowed in non-strict mode.
**Throws:** When the method is disallowed and `opts.strict` is `true`.

### `tokenizeCommand`
Split a server launch command into argv tokens, honoring single- and
double-quoted spans so an argument containing spaces survives intact (e.g.
`node "/path with spaces/server.js" --stdio`). A naive `split(/\s+/)` shredded
such commands into broken fragments.

This is a deliberately small, dependency-free tokenizer (matching the repo's
"no extra dependency" ethos): quotes group and unquoted whitespace separates
tokens. Crucially, a backslash is a LITERAL path separator (so Windows paths
like `"C:\Program Files\server.exe"` survive intact) — it escapes ONLY a
following quote character (`\"` inside a double-quoted span yields a literal
`"`). It is not a full POSIX shell parser (no variable/glob expansion) — only
the quoting needed to pass paths/args.
```ts
tokenizeCommand(command: string): string[]
```
**Parameters:**
- `command: string`
**Returns:** `string[]`
