# Functions

## protocol

### `supportsCompletion`
Returns `true` when `completionProvider` is declared in the server capabilities.
```ts
supportsCompletion(capabilities: ServerCapabilities): capabilities is ServerCapabilities & { completionProvider: CompletionOptions }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities & { completionProvider: CompletionOptions }` — `true` when completion is supported.
