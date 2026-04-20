# Functions

## Utilities

### `buildMethodSets`
Builds the full set of LSP methods and the subset that are always allowed
(not gated by a capability) for a given capability key.

Iterates every entry in LSPRequest and LSPNotification to
collect method strings, then marks those without a corresponding capability
entry as always-allowed (e.g. `initialize`, `shutdown`, `$/cancelRequest`).
```ts
buildMethodSets(capabilityKey: CapabilityKey): { all: Set<string>; alwaysAllowed: Set<string> }
```
**Parameters:**
- `capabilityKey: CapabilityKey` — Whether to index by `'ServerCapability'` or `'ClientCapability'`.
**Returns:** `{ all: Set<string>; alwaysAllowed: Set<string> }` — An object with `all` (every known method) and `alwaysAllowed`
  (methods that do not require a capability declaration).
