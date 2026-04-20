# Functions

## protocol

### `supportsHover`
Helper to check if hover is supported
```ts
supportsHover(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { hoverProvider: NonNullable<boolean | HoverOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities`
**Returns:** `capabilities is ServerCapabilities<any> & { hoverProvider: NonNullable<boolean | HoverOptions | undefined> }`
