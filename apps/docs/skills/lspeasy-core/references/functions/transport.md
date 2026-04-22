# Functions

## transport

### `isMessage`
Runtime guard for JSON-RPC message envelopes.
```ts
isMessage(value: unknown): value is Message
```
**Parameters:**
- `value: unknown` — The unknown value to test.
**Returns:** `value is Message` — `true` when `value` is an object with `jsonrpc: "2.0"`.

### `isWorkerTransportEnvelope`
Runtime guard for shared worker transport envelope payloads.
```ts
isWorkerTransportEnvelope(value: unknown): value is WorkerTransportEnvelope
```
**Parameters:**
- `value: unknown` — The unknown value to test.
**Returns:** `value is WorkerTransportEnvelope` — `true` when `value` is a `WorkerTransportEnvelope` with a valid `clientId` and `message`.
