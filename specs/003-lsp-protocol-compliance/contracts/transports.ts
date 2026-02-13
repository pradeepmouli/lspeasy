/**
 * Transport breadth contracts for TCP, IPC, Dedicated Worker, and Shared Worker.
 */

export interface Transport {
  send(message: unknown): Promise<void>;
  onMessage(handler: (message: unknown) => void): { dispose(): void };
  onError(handler: (error: Error) => void): { dispose(): void };
  onClose(handler: () => void): { dispose(): void };
  close(): Promise<void>;
}

export interface TcpTransportOptions {
  mode: 'client' | 'server';
  host?: string;
  port: number;
  reconnect?: {
    enabled: boolean;
    initialDelayMs: number;
    maxDelayMs: number;
    multiplier: number;
  };
}

export interface IpcTransportOptions {
  role: 'parent' | 'child';
}

export interface DedicatedWorkerTransportOptions {
  worker: Worker;
}

export interface SharedWorkerTransportOptions {
  worker: SharedWorker;
  port: MessagePort;
  clientId: string;
}

/**
 * Shared worker contracts:
 * - route isolation per MessagePort/clientId
 * - error + closed state when port activation fails
 */
export interface SharedWorkerRoutingContract {
  ensureIsolatedRouting: true;
  rejectSendsWhenUnavailable: true;
}
