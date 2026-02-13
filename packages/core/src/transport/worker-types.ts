import type { Message } from '../jsonrpc/messages.js';

/** Lightweight event shape shared by worker and message port adapters. */
export interface WorkerMessageEventLike {
  data: unknown;
}

/** Minimal worker contract required by dedicated worker transport. */
export interface WorkerLike {
  postMessage(message: Message): void;
  addEventListener(event: 'message', handler: (event: WorkerMessageEventLike) => void): void;
  addEventListener(event: 'error', handler: (event: unknown) => void): void;
  removeEventListener(event: 'message', handler: (event: WorkerMessageEventLike) => void): void;
  removeEventListener(event: 'error', handler: (event: unknown) => void): void;
  terminate?(): void;
}

/** Minimal message port contract required by shared worker transport. */
export interface MessagePortLike {
  postMessage(message: unknown): void;
  addEventListener(event: 'message', handler: (event: WorkerMessageEventLike) => void): void;
  addEventListener(event: 'messageerror', handler: (event: unknown) => void): void;
  addEventListener(event: 'error', handler: (event: unknown) => void): void;
  removeEventListener(event: 'message', handler: (event: WorkerMessageEventLike) => void): void;
  removeEventListener(event: 'messageerror', handler: (event: unknown) => void): void;
  removeEventListener(event: 'error', handler: (event: unknown) => void): void;
  start?(): void;
  close?(): void;
}

/** Shared worker wrapper exposing a message port. */
export interface SharedWorkerLike {
  port: MessagePortLike;
}

/** Envelope used by shared worker transport to preserve client isolation. */
export interface WorkerTransportEnvelope {
  clientId: string;
  message: Message;
}

/** Runtime guard for JSON-RPC message envelopes. */
export function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return candidate['jsonrpc'] === '2.0';
}

/** Runtime guard for shared worker transport envelope payloads. */
export function isWorkerTransportEnvelope(value: unknown): value is WorkerTransportEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate['clientId'] === 'string' && isMessage(candidate['message']);
}
