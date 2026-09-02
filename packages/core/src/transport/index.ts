/**
 * Convenience barrel for the browser-safe transports.
 *
 * `package.json` had declared this subpath for some time while the file it
 * points at never existed — importing '@lspeasy/core/transport' simply failed.
 * This makes it real.
 *
 * **Prefer a per-transport subpath.** Each transport has its own entry point,
 * and that is the better default because they carry different baggage:
 *
 * | Subpath | Environment | Pulls |
 * |---|---|---|
 * | `@lspeasy/core/transport/websocket` | browser + Node | — |
 * | `@lspeasy/core/transport/dedicated-worker` | browser | — |
 * | `@lspeasy/core/transport/events` | any | — |
 * | `@lspeasy/core/transport/shared-worker` | browser | zod |
 * | `@lspeasy/core/transport/stdio` | Node | `node:` builtins |
 * | `@lspeasy/core/transport/ipc` | Node | `node:` builtins |
 * | `@lspeasy/core/transport/tcp` | Node | `node:` builtins, zod |
 * | `@lspeasy/core/transport/socket` | Node | `node:` builtins, zod |
 *
 * `shared-worker`, `tcp` and `socket` validate incoming data with
 * `messageSchema`, which is why only those three pull zod — they read from a
 * pipe or a port that anything can write to. `stdio` and `ipc` do not, so the
 * transport `lsproxy` actually uses costs nothing.
 *
 * Importing THIS barrel pulls zod for every browser transport, and
 * '@lspeasy/core/node' pulls it for every Node one, because each aggregates a
 * validating transport. Importing a single subpath does not.
 *
 * Node transports are excluded from this barrel so browser bundles never see
 * `node:` builtins. They remain aggregated by '@lspeasy/core/node'.
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
