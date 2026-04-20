# Functions

## protocol

### `supportsDefinition`
Returns `true` when `definitionProvider` is declared in the server capabilities.
```ts
supportsDefinition(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { definitionProvider: NonNullable<boolean | DefinitionOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities<any> & { definitionProvider: NonNullable<boolean | DefinitionOptions | undefined> }` — `true` when go-to-definition is supported.
