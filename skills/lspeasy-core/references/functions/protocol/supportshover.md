# Functions

## protocol

### `supportsHover`
Returns `true` when `hoverProvider` is declared in the server capabilities.
```ts
supportsHover(capabilities: ServerCapabilities): capabilities is ServerCapabilities<any> & { hoverProvider: NonNullable<boolean | HoverOptions | undefined> }
```
**Parameters:**
- `capabilities: ServerCapabilities` — The server capabilities to check.
**Returns:** `capabilities is ServerCapabilities<any> & { hoverProvider: NonNullable<boolean | HoverOptions | undefined> }` — `true` when hover is supported.
