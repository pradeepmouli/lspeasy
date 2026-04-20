# Functions

## protocol

### `supportsReferences`
Helper to check if references are supported
```ts
supportsReferences(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { referencesProvider: NonNullable<boolean | ReferenceOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities`
**Returns:** `capabilities is ServerCapabilities<any> & { referencesProvider: NonNullable<boolean | ReferenceOptions | undefined> }`
