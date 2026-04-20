# Functions

## protocol

### `supportsReferences`
Returns `true` when `referencesProvider` is declared in the server capabilities.
```ts
supportsReferences(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { referencesProvider: NonNullable<boolean | ReferenceOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities<any> & { referencesProvider: NonNullable<boolean | ReferenceOptions | undefined> }` — `true` when find-references is supported.
