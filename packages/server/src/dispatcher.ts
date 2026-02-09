/**
 * Message dispatcher - routes incoming requests to registered handlers
 */

import type {
  Message,
  RequestMessage,
  NotificationMessage,
  Transport,
  CancellationToken,
  Logger,
  ClientCapabilities
} from '@lspeasy/core';
import { ResponseError, isRequestMessage, isNotificationMessage } from '@lspeasy/core';
import type { RequestHandler, NotificationHandler, HandlerRegistration } from './types.js';

/**
 * Message dispatcher manages request/notification routing
 */
export class MessageDispatcher {
  private handlers = new Map<string, HandlerRegistration>();
  private pendingRequests = new Map<number | string, AbortController>();
  private clientCapabilities?: ClientCapabilities;

  constructor(private readonly logger: Logger) {}

  /**
   * Register a request handler
   */
  registerRequest<Params, Result>(method: string, handler: RequestHandler<Params, Result>): void {
    this.handlers.set(method, { handler, isRequest: true });
    this.logger.debug(`Registered request handler: ${method}`);
  }

  /**
   * Register a notification handler
   */
  registerNotification<Params>(method: string, handler: NotificationHandler<Params>): void {
    this.handlers.set(method, { handler, isRequest: false });
    this.logger.debug(`Registered notification handler: ${method}`);
  }

  /**
   * Unregister a request handler
   */
  unregisterRequest(method: string): void {
    if (this.handlers.has(method)) {
      this.handlers.delete(method);
      this.logger.debug(`Unregistered request handler: ${method}`);
    }
  }

  /**
   * Unregister a notification handler
   */
  unregisterNotification(method: string): void {
    if (this.handlers.has(method)) {
      this.handlers.delete(method);
      this.logger.debug(`Unregistered notification handler: ${method}`);
    }
  }

  /**
   * Set client capabilities (from initialize request)
   */
  setClientCapabilities(capabilities: ClientCapabilities): void {
    this.clientCapabilities = capabilities;
  }

  /**
   * Dispatch an incoming message
   */
  async dispatch(
    message: Message,
    transport: Transport,
    cancellationTokens: Map<number | string, AbortController>
  ): Promise<void> {
    if (isRequestMessage(message)) {
      await this.dispatchRequest(message, transport, cancellationTokens);
    } else if (isNotificationMessage(message)) {
      await this.dispatchNotification(message);
    }
  }

  /**
   * Dispatch a request message
   */
  private async dispatchRequest(
    request: RequestMessage,
    transport: Transport,
    cancellationTokens: Map<number | string, AbortController>
  ): Promise<void> {
    const { id, method, params } = request;

    try {
      // Check if handler exists
      const registration = this.handlers.get(method);
      if (!registration || !registration.isRequest) {
        await this.sendError(transport, id, ResponseError.methodNotFound(method));
        return;
      }

      // Create cancellation token for this request
      const abortController = new AbortController();
      cancellationTokens.set(id, abortController);

      const cancellationToken: CancellationToken = {
        get isCancellationRequested() {
          return abortController.signal.aborted;
        },
        onCancellationRequested: (listener) => {
          abortController.signal.addEventListener('abort', listener);
          return { dispose: () => abortController.signal.removeEventListener('abort', listener) };
        }
      };

      // Execute handler
      const handler = registration.handler as RequestHandler;
      const result = await handler(params, cancellationToken, {
        id,
        method,
        clientCapabilities: this.clientCapabilities
      });

      // Send success response
      await transport.send({
        jsonrpc: '2.0',
        id,
        result
      });
    } catch (error) {
      // Send error response
      if (error instanceof ResponseError) {
        await this.sendError(transport, id, error);
      } else {
        const message = error instanceof Error ? error.message : 'Internal error';
        await this.sendError(transport, id, ResponseError.internalError(message, { error }));
      }
    } finally {
      cancellationTokens.delete(id);
    }
  }

  /**
   * Dispatch a notification message
   */
  private async dispatchNotification(notification: NotificationMessage): Promise<void> {
    const { method, params } = notification;

    try {
      const registration = this.handlers.get(method);
      if (!registration || registration.isRequest) {
        this.logger.debug(`No handler for notification: ${method}`);
        return;
      }

      const handler = registration.handler as NotificationHandler;
      await handler(params, {
        method,
        clientCapabilities: this.clientCapabilities
      });
    } catch (error) {
      // Notifications don't send error responses, just log
      this.logger.error(`Error in notification handler ${method}:`, error);
    }
  }

  /**
   * Send error response
   */
  private async sendError(
    transport: Transport,
    id: number | string,
    error: ResponseError
  ): Promise<void> {
    try {
      await transport.send({
        jsonrpc: '2.0',
        id,
        error: error.toJSON()
      });
    } catch (sendError) {
      this.logger.error('Failed to send error response:', sendError);
    }
  }

  /**
   * Cancel a pending request
   */
  cancelRequest(id: number | string): void {
    const controller = this.pendingRequests.get(id);
    if (controller) {
      controller.abort();
      this.pendingRequests.delete(id);
      this.logger.debug(`Cancelled request ${id}`);
    }
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.pendingRequests.clear();
  }
}
