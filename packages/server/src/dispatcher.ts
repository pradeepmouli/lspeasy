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
 * Routes incoming JSON-RPC requests and notifications to their registered handlers.
 *
 * @remarks
 * `MessageDispatcher` is an internal component of `LSPServer`. It maintains
 * separate handler registries for requests (which require a response) and
 * notifications (fire-and-forget), and handles cancellation via `AbortController`.
 *
 * Most users should interact with `LSPServer.onRequest` / `LSPServer.onNotification`
 * instead of using `MessageDispatcher` directly.
 *
 * @never
 * NEVER register the same method in both the request and notification handler
 * registries — the dispatcher uses separate lookup tables and the method will
 * only match one path, silently ignoring the other.
 *
 * NEVER call `dispatch` before calling `setClientCapabilities` if your handler
 * reads `context.clientCapabilities` — the value will be `undefined` until
 * the `initialize` request is processed.
 *
 * @category Server
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
   * Register a typed request handler for the given LSP method.
   *
   * @param method - The LSP method string (e.g. `'textDocument/hover'`).
   * @param handler - The handler function to invoke for matching requests.
   *
   * @see {@link RequestHandler} for the handler signature.
   */
  registerRequest<Params, Result>(method: string, handler: RequestHandler<Params, Result>): void {
    this.requestHandlers.register(method, handler as RequestHandler);
    this.logger.debug(`Registered request handler: ${method}`);
  }

  /**
   * Register a typed notification handler for the given LSP method.
   *
   * @param method - The LSP method string (e.g. `'textDocument/didOpen'`).
   * @param handler - The handler function to invoke for matching notifications.
   *
   * @see {@link NotificationHandler} for the handler signature.
   */
  registerNotification<Params>(method: string, handler: NotificationHandler<Params>): void {
    this.notificationHandlers.register(method, handler as NotificationHandler);
    this.logger.debug(`Registered notification handler: ${method}`);
  }

  /**
   * Unregister a request handler.
   *
   * @param method - The LSP method string whose handler should be removed.
   */
  unregisterRequest(method: string): void {
    this.requestHandlers.unregister(method);
    this.logger.debug(`Unregistered request handler: ${method}`);
  }

  /**
   * Unregister a notification handler.
   *
   * @param method - The LSP method string whose handler should be removed.
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
   * Dispatch an incoming message to the registered handler.
   *
   * @param message - The incoming JSON-RPC message to route.
   * @param transport - The transport to send the response or error on.
   * @param cancellationTokens - Map of pending request IDs to their `AbortController`s.
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
      // Normalize undefined → null per JSON-RPC 2.0 spec:
      // a response MUST contain either "result" or "error" — omitting
      // "result" (which happens when JSON.stringify drops undefined)
      // produces an invalid message the client can never resolve.
      await transport.send({
        jsonrpc: '2.0',
        id,
        result: result ?? null
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
   * Cancel a pending request.
   *
   * @param id - The request ID to cancel.
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
