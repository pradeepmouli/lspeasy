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
Walk the directory tree from `root` to the filesystem root, checking
`lsp.json`, `.claude/lsp.json`, and `.github/lsp.json` at each level, then
fall back to `~/.claude/lsp.json`.  Returns the first entry whose
`fileExtensions` map contains `fileExt` (or the first entry overall when
`fileExt` is empty).
```ts
discoverServer(root: string, fileExt: string): ResolvedServer | null
```
**Parameters:**
- `root: string`
- `fileExt: string`
**Returns:** `ResolvedServer | null`

### `discoverServerByLanguageId`
Walk the directory tree from `root` looking for a `lsp.json` entry whose
`fileExtensions` map maps any extension to `languageId`.
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
