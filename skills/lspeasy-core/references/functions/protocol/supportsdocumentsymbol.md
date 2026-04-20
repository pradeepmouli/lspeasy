# Functions

## protocol

### `supportsDocumentSymbol`
Helper to check if document symbols are supported
```ts
supportsDocumentSymbol(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { documentSymbolProvider: NonNullable<boolean | DocumentSymbolOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities`
**Returns:** `capabilities is ServerCapabilities<any> & { documentSymbolProvider: NonNullable<boolean | DocumentSymbolOptions | undefined> }`
