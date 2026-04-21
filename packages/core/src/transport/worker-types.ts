import type { Message } from '../jsonrpc/messages.js';

/** Lightweight event shape shared by worker and message port adapters. */
export interface WorkerMessageEventLike {
  /** The raw payload received from the worker or message port. */
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
  /** The dedicated message port for communicating with this shared worker. */
  port: MessagePortLike;
}

/** Envelope used by shared worker transport to preserve client isolation. */
export interface WorkerTransportEnvelope {
  /** Unique identifier for the client connection that sent or should receive this message. */
  clientId: string;
  /** The JSON-RPC message payload. */
  message: Message;
}

/**
 * Runtime guard for JSON-RPC message envelopes.
 *
 * @param value - The unknown value to test.
 * @returns `true` when `value` is an object with `jsonrpc: "2.0"`.
 */
export function isMessage(value: unknown): value is Message {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return candidate['jsonrpc'] === '2.0';
}

/**
 * Runtime guard for shared worker transport envelope payloads.
 *
 * @param value - The unknown value to test.
 * @returns `true` when `value` is a `WorkerTransportEnvelope` with a valid `clientId` and `message`.
 */
export function isWorkerTransportEnvelope(value: unknown): value is WorkerTransportEnvelope {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate['clientId'] === 'string' && isMessage(candidate['message']);
}
