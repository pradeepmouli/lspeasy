# Functions

## transport

### `isMessage`
Runtime guard for JSON-RPC message envelopes.
```ts
isMessage(value: unknown): value is Message
```
**Parameters:**
- `value: unknown`
**Returns:** `value is Message`

### `isWorkerTransportEnvelope`
Runtime guard for shared worker transport envelope payloads.
```ts
isWorkerTransportEnvelope(value: unknown): value is WorkerTransportEnvelope
```
**Parameters:**
- `value: unknown`
**Returns:** `value is WorkerTransportEnvelope`
