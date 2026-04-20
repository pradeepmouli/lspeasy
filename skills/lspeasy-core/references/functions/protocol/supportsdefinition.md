# Functions

## protocol

### `supportsDefinition`
Helper to check if definition is supported
```ts
supportsDefinition(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { definitionProvider: NonNullable<boolean | DefinitionOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities`
**Returns:** `capabilities is ServerCapabilities<any> & { definitionProvider: NonNullable<boolean | DefinitionOptions | undefined> }`
