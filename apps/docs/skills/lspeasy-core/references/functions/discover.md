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
```ts
discoverServer(root: string, fileExt: string): ResolvedServer | null
```
**Parameters:**
- `root: string`
- `fileExt: string`
**Returns:** `ResolvedServer | null`

### `discoverServerByLanguageId`
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
