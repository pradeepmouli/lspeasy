/**
 * LSP Server - Main server class for handling LSP connections
 */

import type {
  Transport,
  Message,
  RequestMessage,
  NotificationMessage,
  ResponseMessage,
  Disposable,
  Logger,
  ServerCapabilities,
  ClientCapabilities,
  LSPRequestMethod,
  LSPNotificationMethod,
  ParamsForRequest,
  ResultForRequest,
  ParamsForNotification,
  Server
} from '@lspeasy/core';
import {
  ConsoleLogger,
  LogLevel,
  ResponseError,
  isRequestMessage,
  isResponseMessage
} from '@lspeasy/core';
import { DisposableEventEmitter } from '@lspeasy/core/utils';
import { PendingRequestTracker, TransportAttachment } from '@lspeasy/core/utils/internal';
import type { ServerOptions, RequestHandler, NotificationHandler } from './types.js';
import { ServerState } from './types.js';
import { MessageDispatcher } from './dispatcher.js';
import { LifecycleManager } from './lifecycle.js';
import { validateParams } from './validation.js';
import { CapabilityGuard, ClientCapabilityGuard } from './capability-guard.js';
import { initializeServerHandlerMethods, initializeServerSendMethods } from './capability-proxy.js';

/**
 * LSP Server class with dynamic capability-aware typing
 *
 * This class dynamically provides handler registration and send methods based on capabilities.
 * Methods are type-safe and conditionally available based on the Capabilities type parameter.
 *
 * @template Capabilities - Server capabilities (defaults to ServerCapabilities)
 *
 * @example
 * // Create a server with specific capabilities
 * type MyCaps = { hoverProvider: true; completionProvider: { triggerCharacters: ['.'] } };
 * const server = new LSPServer<MyCaps>();
 * server.setCapabilities({ hoverProvider: true, completionProvider: { triggerCharacters: ['.'] } });
 * // server.textDocument.onHover is available for registration
 * // server.textDocument.onCompletion is available for registration
 */
export class BaseLSPServer<Capabilities extends Partial<ServerCapabilities> = ServerCapabilities> {
  private readonly logger: Logger;
  private readonly dispatcher: MessageDispatcher;
  private readonly lifecycleManager: LifecycleManager;
  private readonly name: string;
  private readonly version: string;
  private readonly options: ServerOptions<Capabilities>;
  private capabilityGuard?: CapabilityGuard;
  private clientCapabilityGuard?: ClientCapabilityGuard;
  private events: DisposableEventEmitter<{
    listening: [];
    shutdown: [];
    error: [Error];
  }>;
  private transportAttachment: TransportAttachment;
  private pendingRequests: PendingRequestTracker<unknown, string>;

  private transport?: Transport | undefined;
  private state: ServerState = ServerState.Created;
  private cancellationTokens = new Map<number | string, AbortController>();
  private clientCapabilities?: ClientCapabilities;
  private clientInfo?: { name: string; version?: string };

  constructor(options: ServerOptions<Capabilities> = {}) {
    this.options = options;
    this.name = options.name ?? 'lsp-server';
    this.version = options.version ?? '1.0.0';
    this.events = new DisposableEventEmitter();
    this.transportAttachment = new TransportAttachment();
    this.pendingRequests = new PendingRequestTracker(this.options.requestTimeout);

    // Setup logger
    const logLevel = options.logLevel ?? LogLevel.Info;
    this.logger = options.logger ?? new ConsoleLogger(logLevel);

    // Create dispatcher and lifecycle manager
    this.dispatcher = new MessageDispatcher(this.logger);
    this.lifecycleManager = new LifecycleManager(this.name, this.version, this.logger);

    // Register built-in handlers
    this.registerBuiltinHandlers();
  }

  /**
   * Register a request handler with automatic type inference
   *
   * @example
   * // Type parameters are automatically inferred from method name
   * server.onRequest('textDocument/hover', async (params) => {
   *   // params is automatically typed as HoverParams
   *   return { contents: 'Hover text' };
   * });
   */
  onRequest<Method extends LSPRequestMethod & string>(
    method: Method,
    handler: RequestHandler<ParamsForRequest<Method>, ResultForRequest<Method>>
  ): Disposable;

  /**
   * Register a request handler with explicit type parameters (backwards compatible)
   */
  onRequest<Method extends string, Params = unknown, Result = unknown>(
    method: Method,
    handler: RequestHandler<Params, Result>
  ): Disposable;

  // Implementation
  onRequest<Method extends string, Params = unknown, Result = unknown>(
    method: Method,
    handler: RequestHandler<Params, Result>
  ): Disposable {
    // Check if handler can be registered based on capabilities
    if (this.capabilityGuard && !this.capabilityGuard.canRegisterHandler(method)) {
      // In non-strict mode, warning was already logged
      if (!this.options.strictCapabilities) {
        this.logger.debug(
          `Registering handler for ${method} despite missing capability (non-strict mode)`
        );
      }
      // In strict mode, canRegisterHandler already threw an error
    }

    // Wrap handler with validation
    const wrappedHandler: RequestHandler<Params, Result> = async (params, token, context) => {
      const validatedParams =
        this.options.validateParams === false
          ? params
          : (validateParams(method, params, context, this.options.onValidationError) as Params);

      return handler(validatedParams, token, context);
    };

    this.dispatcher.registerRequest(method, wrappedHandler);
    return {
      dispose: () => {
        this.dispatcher.unregisterRequest(method);
      }
    };
  }

  /**
   * Register a notification handler with automatic type inference
   *
   * @example
   * // Type parameters are automatically inferred from method name
   * server.onNotification('textDocument/didOpen', (params) => {
   *   // params is automatically typed as DidOpenTextDocumentParams
   * });
   */
  onNotification<Method extends LSPNotificationMethod & string>(
    method: Method,
    handler: NotificationHandler<ParamsForNotification<Method>>
  ): Disposable;

  /**
   * Register a notification handler with explicit type parameters (backwards compatible)
   */
  onNotification<Method extends string, Params = unknown>(
    method: Method,
    handler: NotificationHandler<Params>
  ): Disposable;

  // Implementation
  onNotification<Method extends string, Params = unknown>(
    method: Method,
    handler: NotificationHandler<Params>
  ): Disposable {
    // Check if handler can be registered based on capabilities
    if (this.capabilityGuard && !this.capabilityGuard.canRegisterHandler(method)) {
      // In non-strict mode, warning was already logged
      if (!this.options.strictCapabilities) {
        this.logger.debug(
          `Registering handler for ${method} despite missing capability (non-strict mode)`
        );
      }
      // In strict mode, canRegisterHandler already threw an error
    }

    // Wrap handler with validation
    const wrappedHandler: NotificationHandler<Params> = async (params, context) => {
      const validatedParams =
        this.options.validateParams === false
          ? params
          : (validateParams(method, params, context, this.options.onValidationError) as Params);

      return handler(validatedParams, context);
    };

    this.dispatcher.registerNotification(method, wrappedHandler);
    return {
      dispose: () => {
        this.dispatcher.unregisterNotification(method);
      }
    };
  }

  /**
   * Set server capabilities
   */
  setCapabilities(capabilities: Capabilities): void {
    this.lifecycleManager.setCapabilities(capabilities as ServerCapabilities);
    // Create capability guard with the new capabilities
    this.capabilityGuard = new CapabilityGuard(
      capabilities as ServerCapabilities,
      this.logger,
      this.options.strictCapabilities ?? false
    );

    // Initialize capability-aware handler methods based on declared capabilities
    initializeServerHandlerMethods(this as any);
    initializeServerSendMethods(this as any);
  }

  /**
   * Get server capabilities
   */
  getServerCapabilities(): ServerCapabilities {
    return this.lifecycleManager.getCapabilities();
  }

  /**
   * Get client capabilities (available after initialization)
   */
  getClientCapabilities(): ClientCapabilities | undefined {
    return this.clientCapabilities;
  }

  /**
   * Register a single capability, returning a new typed reference via intersection.
   * The returned reference is the same instance, with a narrowed type that includes
   * the newly registered capability.
   *
   * @template K - The capability key to register
   * @param key - The server capability key (e.g. 'hoverProvider')
   * @param value - The capability value
   * @returns The same server instance with an expanded capability type
   *
   * @example
   * const server = new LSPServer();
   * const withHover = server.registerCapability('hoverProvider', true);
   * // withHover is typed as LSPServer<Capabilities & Pick<ServerCapabilities, 'hoverProvider'>>
   */
  registerCapability<K extends keyof ServerCapabilities>(
    key: K,
    value: ServerCapabilities[K]
  ): LSPServer<Capabilities & Pick<ServerCapabilities, K>> {
    const current = this.getServerCapabilities();
    const updated = { ...current, [key]: value } as Capabilities & Pick<ServerCapabilities, K>;
    this.setCapabilities(updated);
    return this as unknown as LSPServer<Capabilities & Pick<ServerCapabilities, K>>;
  }

  /**
   * Zero-cost type narrowing for client capabilities.
   * Returns `this` cast to include capability-aware send methods for the given ClientCaps.
   *
   * @template C - The expected client capabilities shape
   * @returns The same server instance, typed with capability-aware methods
   *
   * @example
   * const server = new LSPServer<MyCaps>();
   * const typed = server.expect<MyClientCaps>();
   * // typed now has send methods gated by MyClientCaps
   */
  expect<C extends Partial<ClientCapabilities>>(): this & Server<C, Capabilities> {
    return this as this & Server<C, Capabilities>;
  }

  /**
   * Send a server-to-client request.
   */
  async sendRequest<Method extends LSPRequestMethod<'serverToClient'>>(
    method: Method,
    params?: ParamsForRequest<Method>
  ): Promise<ResultForRequest<Method>> {
    if (!this.transport) {
      throw new Error('Server is not listening');
    }

    if (this.clientCapabilityGuard && !this.clientCapabilityGuard.canSendRequest(method)) {
      this.logger.warn(`Client capability not declared for request ${method}`);
    }

    const { id, promise } = this.pendingRequests.create(this.options.requestTimeout, method);

    const request: RequestMessage = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    this.transport.send(request).catch((error) => {
      const rejection = error instanceof Error ? error : new Error(String(error));
      this.pendingRequests.reject(id, rejection);
    });

    return promise as Promise<ResultForRequest<Method>>;
  }

  /**
   * Send a server-to-client notification.
   */
  async sendNotification<Method extends LSPNotificationMethod<'serverToClient'>>(
    method: Method,
    params?: ParamsForNotification<Method>
  ): Promise<void> {
    if (!this.transport) {
      throw new Error('Server is not listening');
    }

    if (this.clientCapabilityGuard && !this.clientCapabilityGuard.canSendNotification(method)) {
      this.logger.warn(`Client capability not declared for notification ${method}`);
    }

    const notification: NotificationMessage = {
      jsonrpc: '2.0',
      method,
      params
    };

    await this.transport.send(notification);
  }

  /**
   * Start listening on a transport
   */
  async listen(transport: Transport): Promise<void> {
    if (this.transport) {
      throw new Error('Server is already listening');
    }

    this.transport = transport;
    this.logger.info(`Server listening: ${this.name} v${this.version}`);

    this.transportAttachment.attach(transport, {
      onMessage: (message) => {
        void this.handleMessage(message);
      },
      onError: (error) => {
        this.logger.error('Transport error:', error);
        this.events.emit('error', error);
      },
      onClose: () => {
        this.logger.info('Transport closed');
        void this.close();
      }
    });

    this.events.emit('listening');
  }

  /**
   * Graceful shutdown
   */
  async shutdown(timeout: number = 5000): Promise<void> {
    if (this.state === ServerState.Shutdown) {
      return;
    }

    this.logger.info('Server shutting down...');
    this.state = ServerState.ShuttingDown;

    // Wait for pending requests with timeout
    const startTime = Date.now();
    while (this.cancellationTokens.size > 0 && Date.now() - startTime < timeout) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Cancel any remaining requests
    for (const [id, controller] of this.cancellationTokens.entries()) {
      this.logger.warn(`Cancelling pending request: ${id}`);
      controller.abort();
    }

    this.events.emit('shutdown');
    await this.close();
  }

  /**
   * Force close
   */
  async close(): Promise<void> {
    if (this.state === ServerState.Shutdown) {
      return;
    }

    this.logger.info('Server closing...');
    this.state = ServerState.Shutdown;

    this.transportAttachment.detach();
    this.pendingRequests.clear(new Error('Connection closed'));

    // Close transport
    if (this.transport) {
      await this.transport.close();
      this.transport = undefined;
    }

    this.logger.info('Server closed');
  }

  /**
   * Check if server is listening and initialized
   */
  isListening(): boolean {
    return this.state === ServerState.Initialized && this.transport !== undefined;
  }

  /**
   * Get current server state
   */
  getState(): ServerState {
    return this.state;
  }

  /**
   * Get client info (available after initialization)
   */
  getClientInfo(): { name: string; version?: string } | undefined {
    return this.clientInfo;
  }

  /**
   * Subscribe to listening events
   */
  onListening(handler: () => void): Disposable {
    return this.events.on('listening', handler);
  }

  /**
   * Subscribe to shutdown events
   */
  onShutdown(handler: () => void): Disposable {
    return this.events.on('shutdown', handler);
  }

  /**
   * Subscribe to error events
   */
  onError(handler: (error: Error) => void): Disposable {
    return this.events.on('error', handler);
  }

  /**
   * Register built-in lifecycle handlers
   */
  private registerBuiltinHandlers(): void {
    // Initialize request - use onRequest to get validation
    this.onRequest('initialize', async (params, token, context) => {
      if (this.state !== ServerState.Created) {
        throw ResponseError.invalidRequest('Server already initialized');
      }

      this.state = ServerState.Initializing;
      this.clientCapabilities = params.capabilities;
      this.clientCapabilityGuard = new ClientCapabilityGuard(
        params.capabilities ?? {},
        this.logger,
        this.options.strictCapabilities ?? false
      );
      if (params.clientInfo) {
        this.clientInfo = params.clientInfo;
      }
      this.dispatcher.setClientCapabilities(params.capabilities);

      const result = await this.lifecycleManager.handleInitialize(
        params,
        this.transport!,
        context.id
      );
      this.state = ServerState.Initialized;

      return result;
    });

    // Initialized notification - use onNotification to get validation
    this.onNotification('initialized', (params) => {
      this.lifecycleManager.handleInitialized(params);
    });

    // Shutdown request
    this.onRequest('shutdown', async (_params, _token, context) => {
      if (this.state !== ServerState.Initialized) {
        throw ResponseError.invalidRequest('Server not initialized');
      }

      await this.lifecycleManager.handleShutdown(this.transport!, context.id);
      this.state = ServerState.ShuttingDown;

      return null;
    });

    // Exit notification
    this.onNotification('exit', () => {
      this.lifecycleManager.handleExit();
      void this.close();
    });

    // Cancellation notification
    this.onNotification('$/cancelRequest', (params: { id: number | string }) => {
      const controller = this.cancellationTokens.get(params.id);
      if (controller) {
        controller.abort();
        this.cancellationTokens.delete(params.id);
        this.logger.debug(`Cancelled request: ${params.id}`);
      }
    });
  }

  /**
   * Handle incoming message
   */
  private async handleMessage(message: Message): Promise<void> {
    try {
      if (isResponseMessage(message)) {
        this.handleResponse(message as ResponseMessage);
        return;
      }

      // Check if server is initialized for non-lifecycle messages
      if (isRequestMessage(message)) {
        const method = message.method;
        const isLifecycleMethod = ['initialize', 'shutdown'].includes(method);

        if (!isLifecycleMethod && this.state !== ServerState.Initialized) {
          await this.transport!.send({
            jsonrpc: '2.0',
            id: message.id,
            error: ResponseError.serverNotInitialized().toJSON()
          });
          return;
        }
      }

      // Dispatch to handlers
      await this.dispatcher.dispatch(message, this.transport!, this.cancellationTokens);
    } catch (error) {
      this.logger.error('Error handling message:', error);
      this.events.emit('error', error as Error);
    }
  }

  /**
   * Handle response messages for server-initiated requests.
   */
  private handleResponse(response: ResponseMessage): void {
    const { id } = response;
    const method = this.pendingRequests.getMetadata(String(id));

    if (!method) {
      this.logger.warn(`Received response for unknown request ${id}`);
      return;
    }

    if ('error' in response && response.error) {
      this.logger.error(`Request ${method} failed`, response.error);
      this.pendingRequests.reject(
        String(id),
        new Error(`${response.error.message} (code: ${response.error.code})`)
      );
      return;
    }

    if ('result' in response) {
      this.pendingRequests.resolve(String(id), response.result);
      return;
    }

    this.pendingRequests.reject(String(id), new Error('Invalid response message'));
  }
}

export type LSPServer<ServerCaps extends Partial<ServerCapabilities> = ServerCapabilities> =
  BaseLSPServer<ServerCaps> & Server<ClientCapabilities, ServerCaps>;

// Generic constructor that preserves type parameters
export const LSPServer: new <ServerCaps extends Partial<ServerCapabilities> = ServerCapabilities>(
  options?: ServerOptions<ServerCaps>
) => LSPServer<ServerCaps> = BaseLSPServer as any;
