/**
 * Transport attachment helper for wiring handlers and cleanup.
 */

import type { Message } from '../jsonrpc/messages.js';
import type { Transport } from '../transport/transport.js';
import type { Disposable } from './disposable.js';

/**
 * Handlers for transport events.
 */
export interface TransportHandlers {
  onMessage: (message: Message) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

/**
 * Manages transport event listeners and disposal.
 */
export class TransportAttachment {
  private transport: Transport | undefined;
  private disposables: Disposable[] = [];

  /**
   * Attach to a transport and wire handlers. Returns a disposable to detach.
   */
  attach(transport: Transport, handlers: TransportHandlers): Disposable {
    this.detach();

    this.transport = transport;
    this.disposables = [
      transport.onMessage(handlers.onMessage),
      transport.onError(handlers.onError),
      transport.onClose(() => {
        handlers.onClose();
        this.detach();
      })
    ];

    return {
      dispose: () => this.detach()
    };
  }

  /**
   * Detach from the transport and dispose all listeners.
   */
  detach(): void {
    if (!this.transport) {
      return;
    }

    for (const disposable of this.disposables) {
      disposable.dispose();
    }

    this.disposables = [];
    this.transport = undefined;
  }

  /**
   * Check if a transport is attached.
   */
  isAttached(): boolean {
    return Boolean(this.transport);
  }
}
