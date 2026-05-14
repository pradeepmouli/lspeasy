# Functions

## protocol

### `supportsDocumentSymbol`
Returns `true` when `documentSymbolProvider` is declared in the server capabilities.
```ts
supportsDocumentSymbol(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { documentSymbolProvider: NonNullable<boolean | DocumentSymbolOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities<any> & { documentSymbolProvider: NonNullable<boolean | DocumentSymbolOptions | undefined> }` — `true` when document symbols are supported.
