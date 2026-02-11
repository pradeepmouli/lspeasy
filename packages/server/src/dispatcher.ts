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
import { HandlerRegistry } from '@lspeasy/core/utils';
import type {
  RequestHandler,
  NotificationHandler,
  RequestContext,
  NotificationContext
} from './types.js';

/**
 * Message dispatcher manages request/notification routing
 */
export class MessageDispatcher {
  private requestHandlers = new HandlerRegistry<
    unknown,
    unknown,
    [CancellationToken, RequestContext]
  >();
  private notificationHandlers = new HandlerRegistry<unknown, void, [NotificationContext]>();
  private pendingRequests = new Map<number | string, AbortController>();
  private clientCapabilities?: ClientCapabilities;

  constructor(private readonly logger: Logger) {}

  /**
   * Register a request handler
   */
  registerRequest<Params, Result>(method: string, handler: RequestHandler<Params, Result>): void {
    this.requestHandlers.register(method, handler as RequestHandler);
    this.logger.debug(`Registered request handler: ${method}`);
  }

  /**
   * Register a notification handler
   */
  registerNotification<Params>(method: string, handler: NotificationHandler<Params>): void {
    this.notificationHandlers.register(method, handler as NotificationHandler);
    this.logger.debug(`Registered notification handler: ${method}`);
  }

  /**
   * Unregister a request handler
   */
  unregisterRequest(method: string): void {
    this.requestHandlers.unregister(method);
    this.logger.debug(`Unregistered request handler: ${method}`);
  }

  /**
   * Unregister a notification handler
   */
  unregisterNotification(method: string): void {
    this.notificationHandlers.unregister(method);
    this.logger.debug(`Unregistered notification handler: ${method}`);
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
      const handler = this.requestHandlers.get(method) as RequestHandler | undefined;
      if (!handler) {
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
      const handler = this.notificationHandlers.get(method) as NotificationHandler | undefined;
      if (!handler) {
        this.logger.debug(`No handler for notification: ${method}`);
        return;
      }

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
    this.requestHandlers.clear();
    this.notificationHandlers.clear();
    this.pendingRequests.clear();
  }
}
