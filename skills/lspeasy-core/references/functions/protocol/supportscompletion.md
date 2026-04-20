# Functions

## protocol

### `supportsCompletion`
Helper to check if completion is supported
```ts
supportsCompletion(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { completionProvider: CompletionOptions }
```
**Parameters:**
- `capabilities: ServerCapabilities`
**Returns:** `capabilities is ServerCapabilities<any> & { completionProvider: CompletionOptions }`
