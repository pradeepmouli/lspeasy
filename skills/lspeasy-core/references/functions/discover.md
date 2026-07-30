# Functions

## discover

### `selectServer`
```ts
selectServer(config: LspJson, fileExt: string): ResolvedServer | null
```
**Parameters:**
- `config: LspJson`
- `fileExt: string`
**Returns:** `ResolvedServer | null`

### `selectServerByLanguageId`
```ts
selectServerByLanguageId(config: LspJson, languageId: string): ResolvedServer | null
```
**Parameters:**
- `config: LspJson`
- `languageId: string`
**Returns:** `ResolvedServer | null`

### `selectExtensionMap`
```ts
selectExtensionMap(config: LspJson): Record<string, string>
```
**Parameters:**
- `config: LspJson`
**Returns:** `Record<string, string>`

### `discoverServer`
Resolve an LSP server for a file extension by walking up from `root` to the filesystem root then falling back to the global user config.
```ts
discoverServer(root: string, fileExt: string): ResolvedServer | null
```
**Parameters:**
- `root: string`
- `fileExt: string`
**Returns:** `ResolvedServer | null`

### `discoverServerByLanguageId`
Resolve an LSP server for a language ID by walking up from `root` to the filesystem root then falling back to the global user config.
```ts
discoverServerByLanguageId(root: string, languageId: string): ResolvedServer | null
```
**Parameters:**
- `root: string`
- `languageId: string`
**Returns:** `ResolvedServer | null`

### `discoverExtensionMap`
```ts
discoverExtensionMap(root: string): Record<string, string>
```
**Parameters:**
- `root: string`
**Returns:** `Record<string, string>`

### `discoverServers`
Enumerate every server configured in the discovered lsp.json. Unlike
discoverServer, which resolves a single server, this returns the full
set so callers can present available languages without connecting.
```ts
discoverServers(root: string): ConfiguredServer[]
```
**Parameters:**
- `root: string`
**Returns:** `ConfiguredServer[]`

### `buildServerCommand`
Build the full spawn command string for an `lsp.json` entry: `entry.command`
is itself tokenized (via tokenizeCommand) before being combined with
`entry.args`, so a `command` field that embeds flags (e.g.
`"typescript-language-server --stdio"` with no separate `args` array) still
splits into separate argv tokens instead of collapsing into one bogus binary
name once re-quoted below. The common case — a bare executable name/path
with no embedded spaces — tokenizes to a single token, unchanged from before.

Caveat: because `entry.command` is tokenized on whitespace, a legitimately
space-containing executable path (not embedded flags) must itself be quoted
in `lsp.json` (e.g. `"\"/path with spaces/my-server\""`) or it will be
split into multiple bogus tokens — the same requirement a real shell would
impose.
```ts
buildServerCommand(entry: LspServerEntry): string
```
**Parameters:**
- `entry: LspServerEntry`
**Returns:** `string`

### `readLspJsonFile`
Read a single lsp.json file's `lspServers` map. Returns {} when missing or unparseable.
```ts
readLspJsonFile(path: string): Record<string, LspServerEntry>
```
**Parameters:**
- `path: string`
**Returns:** `Record<string, LspServerEntry>`

### `writeLspJsonFile`
Write an `lspServers` map to a file as pretty JSON, creating parent dirs.
```ts
writeLspJsonFile(path: string, servers: Record<string, LspServerEntry>): void
```
**Parameters:**
- `path: string`
- `servers: Record<string, LspServerEntry>`

### `mergeServers`
Merge incoming servers over base; report which keys were added vs updated.
```ts
mergeServers(base: Record<string, LspServerEntry>, incoming: Record<string, LspServerEntry>): { merged: Record<string, LspServerEntry>; added: string[]; updated: string[] }
```
**Parameters:**
- `base: Record<string, LspServerEntry>`
- `incoming: Record<string, LspServerEntry>`
**Returns:** `{ merged: Record<string, LspServerEntry>; added: string[]; updated: string[] }`
