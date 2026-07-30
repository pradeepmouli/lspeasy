# Functions

## plugin-resolver

### `defaultPluginsRoot`
Default install root for plugin marketplaces.
```ts
defaultPluginsRoot(): string
```
**Returns:** `string`

### `listInstalledPluginServers`
Map every installed plugin's servers, keyed by `&lt;plugin&gt;@&lt;marketplace&gt;`.
`&lt;marketplace&gt;` is the first path segment under the root; `&lt;plugin&gt;` is the
directory directly containing the `.lsp.json` (handles flat and nested layouts).
Each plugin's value is a record of server name (the outer key in `.lsp.json`) → entry.
```ts
listInstalledPluginServers(pluginsRoot: string): Record<string, Record<string, LspServerEntry>>
```
**Parameters:**
- `pluginsRoot: string` — default: `...`
**Returns:** `Record<string, Record<string, LspServerEntry>>`

### `resolvePlugin`
Canonical servers for one `&lt;plugin&gt;@&lt;marketplace&gt;` id, keyed by server name, or {} when not installed.
```ts
resolvePlugin(pluginId: string, pluginsRoot: string): Record<string, LspServerEntry>
```
**Parameters:**
- `pluginId: string`
- `pluginsRoot: string` — default: `...`
**Returns:** `Record<string, LspServerEntry>`

### `findPluginFor`
Find the plugin id a canonical entry maps to: prefer stamped provenance, else match by command.
```ts
findPluginFor(entry: LspServerEntry, pluginsRoot: string): string | undefined
```
**Parameters:**
- `entry: LspServerEntry`
- `pluginsRoot: string` — default: `...`
**Returns:** `string | undefined`
