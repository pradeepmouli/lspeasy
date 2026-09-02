/**
 * Convenience barrel for the browser-safe transports.
 *
 * `package.json` had declared this subpath for some time while the file it
 * points at never existed — importing '@lspeasy/core/transport' simply failed.
 * This makes it real.
 *
 * **Prefer a per-transport subpath.** Every transport is also individually
 * importable, and that is the better default because each one carries
 * different baggage:
 *
 * ```ts
 * import { WebSocketTransport } from '@lspeasy/core/transport/websocket';
 * import { SharedWorkerTransport } from '@lspeasy/core/transport/shared-worker';
 * import { StdioTransport } from '@lspeasy/core/transport/stdio';
 * ```
 *
 * Only `shared-worker` validates with `messageSchema`, so it is the only
 * browser transport that pulls zod — importing this barrel pulls it for all of
 * them, while importing `transport/websocket` directly does not. Likewise the
 * Node transports (`stdio`, `tcp`, `ipc`, `socket`) import `node:` builtins;
 * they are excluded here and aggregated by '@lspeasy/core/node'.
 */
export type { Transport } from './transport.js';

export { DedicatedWorkerTransport } from './dedicated-worker.js';
export type { DedicatedWorkerTransportOptions } from './dedicated-worker.js';

export { SharedWorkerTransport } from './shared-worker.js';
export type { SharedWorkerTransportOptions } from './shared-worker.js';

export { WebSocketTransport, createWebSocketClient } from './websocket.js';
export type { WebSocketTransportOptions } from './websocket.js';

export { TransportEventEmitter } from './events.js';

export { isMessage, isWorkerTransportEnvelope } from './worker-types.js';
export type {
  MessagePortLike,
  SharedWorkerLike,
  WorkerMessageEventLike,
  WorkerTransportEnvelope
} from './worker-types.js';
