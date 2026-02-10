/**
 * LSP Client implementation
 */

import type {
  Transport,
  Message,
  RequestMessage,
  ResponseMessage,
  NotificationMessage,
  Disposable,
  Logger,
  CancellationToken,
  LSPRequestMethod,
  ParamsForRequest,
  ResultForRequest,
  LSPNotificationMethod,
  ParamsForNotification,
  InitializeParams,
  ServerCapabilities,
  ClientCapabilities,
  Client
} from '@lspeasy/core';
import { ConsoleLogger, LogLevel, CancellationTokenSource } from '@lspeasy/core';
import { DisposableEventEmitter, HandlerRegistry } from '@lspeasy/core/utils';
import { PendingRequestTracker, TransportAttachment } from '@lspeasy/core/utils/internal';
import type { ClientOptions, InitializeResult, CancellableRequest } from './types.js';
import { initializeCapabilityMethods, updateCapabilityMethods } from './capability-proxy.js';
import { CapabilityGuard } from './capability-guard.js';

/**
 * Interface for dynamically added namespace methods
 */

/**
 * Type alias to add capability-aware methods to LSPClient
 * These methods are added at runtime via capability-proxy.ts
 */

/**
 * LSP Client for connecting to language servers
 *
 * This class dynamically extends with capability-aware methods based on server capabilities.
 * Use `.expect<ServerCaps>()` after initialization to get typed access to server capabilities.
 *
 * @template ClientCaps - Client capabilities (defaults to ClientCapabilities)
 *
 * @example
 * // Create a client, then narrow server capabilities after connecting
 * const client = new LSPClient<MyClientCaps>();
 * await client.connect(transport);
 * const typed = client.expect<{ hoverProvider: true; completionProvider: {} }>();
 * // typed.textDocument.hover is available (typed)
 * // typed.textDocument.completion is available (typed)
 */
class BaseLSPClient<ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities> {
  private transport?: Transport;
  private connected: boolean;
  private initialized: boolean;
  private pendingRequests: PendingRequestTracker<unknown, string>;
  private requestHandlers: HandlerRegistry<unknown, unknown>;
  private notificationHandlers: HandlerRegistry<unknown, void>;
  private events: DisposableEventEmitter<{
    connected: [];
    disconnected: [];
    error: [Error];
  }>;
  private transportAttachment: TransportAttachment;
  private readonly logger: Logger;
  private readonly options: {
    name: string;
    version: string;
    logger: Logger;
    logLevel: LogLevel;
    requestTimeout: number | undefined;
  };
  private capabilities?: ClientCaps;
  public serverCapabilities?: ServerCapabilities;
  private serverInfo?: { name: string; version?: string };
  private readonly onValidationError?: ClientOptions<ClientCaps>['onValidationError'];
  private capabilityGuard?: CapabilityGuard;

  constructor(options: ClientOptions<ClientCaps> = {}) {
    this.connected = false;
    this.initialized = false;
    // Set up options with defaults
    this.options = {
      name: options.name ?? 'lspeasy-client',
      version: options.version ?? '1.0.0',
      logger: options.logger ?? new ConsoleLogger(options.logLevel ?? LogLevel.Info),
      logLevel: options.logLevel ?? LogLevel.Info,
      requestTimeout: options.requestTimeout
    };

    this.logger = this.options.logger;
    this.pendingRequests = new PendingRequestTracker(this.options.requestTimeout);
    this.requestHandlers = new HandlerRegistry();
    this.notificationHandlers = new HandlerRegistry();
    this.events = new DisposableEventEmitter();
    this.transportAttachment = new TransportAttachment();
    if (options.capabilities) {
      this.capabilities = options.capabilities;
    }
    if (options.onValidationError) {
      this.onValidationError = options.onValidationError;
    }

    // Initialize capability-aware methods on the client object
    // These will be empty initially and populated after server capabilities are received
    initializeCapabilityMethods(this as unknown as LSPClient<ClientCaps>);
  }

  /**
   * Connect to server and complete initialization
   */
  async connect(transport: Transport): Promise<InitializeResult> {
    if (this.connected) {
      throw new Error('Client is already connected');
    }

    this.transport = transport;
    this.connected = true;

    this.transportAttachment.attach(transport, {
      onMessage: (message) => this.handleMessage(message),
      onError: (error) => this.handleError(error),
      onClose: () => this.handleClose()
    });

    try {
      // Send initialize request
      this.logger.debug('Sending initialize request');

      const initializeParams: InitializeParams = {
        processId: process.pid,
        clientInfo: {
          name: this.options.name,
          version: this.options.version
        },
        capabilities: this.capabilities ?? {},
        rootUri: null
      };

      const result = await this.sendRequest('initialize', initializeParams);

      this.serverCapabilities = result.capabilities;
      if (result.serverInfo) {
        this.serverInfo = result.serverInfo;
      }
      this.initialized = true;

      // Create capability guard to validate outgoing requests
      this.capabilityGuard = new CapabilityGuard(
        result.capabilities,
        this.logger,
        false // non-strict mode by default
      );

      // Update capability-aware methods based on server capabilities
      updateCapabilityMethods(this as unknown as LSPClient<ClientCaps>);

      // Send initialized notification
      await this.sendNotification('initialized', {});

      this.logger.info('Client initialized', {
        serverName: this.serverInfo?.name,
        serverVersion: this.serverInfo?.version
      });

      this.events.emit('connected');

      return result;
    } catch (error) {
      // Ensure we clean up state and transport on initialization failure
      try {
        if (this.transport) {
          await this.transport.close();
        }
      } catch (closeError) {
        this.logger.error('Error closing transport after failed initialize', closeError as Error);
      }
      // Reset client state and detach listeners via common close handler
      this.handleClose();
      throw error;
    }
  }

  /**
   * Disconnect from server
   */
  async disconnect(): Promise<void> {
    if (!this.connected) {
      return;
    }

    try {
      // Send shutdown request
      if (this.initialized) {
        this.logger.debug('Sending shutdown request');
        await this.sendRequest('shutdown');

        // Send exit notification
        this.logger.debug('Sending exit notification');
        await this.sendNotification('exit');
      }
    } catch (error) {
      this.logger.error('Error during shutdown', error);
    } finally {
      // Close transport
      if (this.transport) {
        await this.transport.close();
      }
      this.handleClose();
    }
  }

  /**
   * Check if client is connected
   */
  isConnected(): boolean {
    return this.connected && this.initialized;
  }

  /**
   * Send a request to the server
   */
  async sendRequest<K extends LSPRequestMethod<'clientToServer'>>(
    method: K,
    params?: ParamsForRequest<K>,
    token?: CancellationToken
  ): Promise<ResultForRequest<K>> {
    if (!this.connected || !this.transport) {
      throw new Error('Client is not connected');
    }

    // Validate request against server capabilities
    if (this.capabilityGuard && !this.capabilityGuard.canSendRequest(method)) {
      this.logger.warn(`Server does not support request method ${method}`);
    }

    // Check if already cancelled before doing anything
    if (token?.isCancellationRequested) {
      return Promise.reject(new Error('Request was cancelled'));
    }

    const { id, promise } = this.pendingRequests.create(this.options.requestTimeout, method);

    const request: RequestMessage = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    this.logger.debug(`Sending request ${method}`, { id, params });

    let cancellationDisposable: Disposable | undefined;

    if (token) {
      cancellationDisposable = token.onCancellationRequested(() => {
        this.sendNotification('$/cancelRequest', { id }).catch((err) => {
          this.logger.error('Failed to send cancellation', err);
        });

        this.pendingRequests.reject(id, new Error('Request was cancelled'));
      });
    }

    void promise.finally(() => {
      cancellationDisposable?.dispose();
    });

    this.transport.send(request).catch((error) => {
      const rejection = error instanceof Error ? error : new Error(String(error));
      this.pendingRequests.reject(id, rejection);
    });

    return promise as Promise<ResultForRequest<K>>;
  }

  /**
   * Send a notification to the server
   */
  async sendNotification<M extends LSPNotificationMethod<'clientToServer'>>(
    method: M,
    params?: ParamsForNotification<M>
  ): Promise<void> {
    if (!this.connected || !this.transport) {
      throw new Error('Client is not connected');
    }

    // Validate notification against server capabilities
    if (this.capabilityGuard && !this.capabilityGuard.canSendNotification(method)) {
      this.logger.warn(`Server does not support notification method ${method}`);
    }

    const notification: NotificationMessage = {
      jsonrpc: '2.0',
      method,
      params
    };

    this.logger.debug(`Sending notification ${method}`, { params });

    await this.transport.send(notification);
  }

  /**
   * Send a cancellable request
   */
  sendCancellableRequest<M extends LSPRequestMethod<'clientToServer'>>(
    method: M,
    params?: ParamsForRequest<M>
  ): CancellableRequest<ResultForRequest<M>> {
    const cancelSource = new CancellationTokenSource();

    const promise = this.sendRequest(method, params, cancelSource.token);

    return {
      promise,
      cancel: () => cancelSource.cancel()
    };
  }

  /**
   * Register handler for server-to-client requests
   */
  onRequest<M extends LSPRequestMethod<'serverToClient'>>(
    method: M,
    handler: (params: ParamsForRequest<M>) => Promise<ResultForRequest<M>> | ResultForRequest<M>
  ): Disposable {
    return this.requestHandlers.register(method, handler as (params: unknown) => unknown);
  }

  /**
   * Register handler for server notifications
   */
  onNotification<M extends LSPNotificationMethod<'serverToClient'>>(
    method: M,
    handler: (params: ParamsForNotification<M>) => void
  ): Disposable {
    return this.notificationHandlers.register(method, handler as (params: unknown) => void);
  }

  /**
   * Subscribe to connection events
   */
  onConnected(handler: () => void): Disposable {
    return this.events.on('connected', handler);
  }

  /**
   * Subscribe to disconnection events
   */
  onDisconnected(handler: () => void): Disposable {
    return this.events.on('disconnected', handler);
  }

  /**
   * Subscribe to error events
   */
  onError(handler: (error: Error) => void): Disposable {
    return this.events.on('error', handler);
  }

  /**
   * Get server capabilities
   */
  getServerCapabilities(): ServerCapabilities | undefined {
    return this.serverCapabilities;
  }

  /**
   * Get server info
   */
  getServerInfo(): { name: string; version?: string } | undefined {
    return this.serverInfo;
  }

  /**
   * Set client capabilities
   */
  setCapabilities(capabilities: ClientCaps): void {
    this.capabilities = capabilities;
    // Note: Client capabilities are sent during initialize, so this only affects
    // the local reference. To update server-side, would need client/registerCapability request.
  }

  /**
   * Get client capabilities
   */
  getClientCapabilities(): ClientCaps | undefined {
    return this.capabilities;
  }

  /**
   * Register a single client capability, returning a new typed reference via intersection.
   * The returned reference is the same instance, with a narrowed type that includes
   * the newly registered capability.
   *
   * Note: This updates the local capability reference. To notify the server of capability
   * changes, the LSP 3.17 client/registerCapability request should be used separately.
   *
   * @template K - The capability key to register
   * @param key - The client capability key
   * @param value - The capability value
   * @returns The same client instance with an expanded capability type
   *
   * @example
   * const client = new LSPClient();
   * const withWorkspace = client.registerCapability('workspace', { workspaceFolders: true });
   * // withWorkspace is typed as LSPClient<ClientCaps & Pick<ClientCapabilities, 'workspace'>>
   */
  registerCapability<K extends keyof ClientCapabilities>(
    key: K,
    value: ClientCapabilities[K]
  ): LSPClient<ClientCaps & Pick<ClientCapabilities, K>> {
    const current = this.capabilities ?? ({} as ClientCaps);
    const updated = { ...current, [key]: value } as ClientCaps & Pick<ClientCapabilities, K>;
    this.setCapabilities(updated);
    return this as unknown as LSPClient<ClientCaps & Pick<ClientCapabilities, K>>;
  }

  /**
   * Zero-cost type narrowing for server capabilities.
   * Returns `this` cast to include capability-aware methods for the given ServerCaps.
   *
   * @template S - The expected server capabilities shape
   * @returns The same client instance, typed with capability-aware methods
   *
   * @example
   * const client = new LSPClient<MyClientCaps>();
   * await client.connect(transport);
   * const typed = client.expect<{ hoverProvider: true }>();
   * const result = await typed.textDocument.hover(params);
   */
  expect<S extends Partial<ServerCapabilities>>(): this & Client<ClientCaps, S> {
    return this as this & Client<ClientCaps, S>;
  }

  /**
   * Handle incoming message from transport
   */
  private handleMessage(message: Message): void {
    // Response message
    if ('id' in message && ('result' in message || 'error' in message)) {
      this.handleResponse(message as ResponseMessage);
      return;
    }

    // Request message
    if ('id' in message && 'method' in message) {
      // Fire and forget with error handling
      void this.handleRequest(message as RequestMessage).catch((error) => {
        this.logger.error('Error handling server request', error);
      });
      return;
    }

    // Notification message
    if ('method' in message && !('id' in message)) {
      this.handleNotification(message as NotificationMessage);
      return;
    }

    this.logger.warn('Received unknown message type', message);
  }

  /**
   * Handle response message
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
      this.logger.debug(`Request ${method} succeeded`, { id });
      this.pendingRequests.resolve(String(id), response.result);
      return;
    }

    this.pendingRequests.reject(String(id), new Error('Invalid response message'));
  }

  /**
   * Handle request message from server
   */
  private async handleRequest(request: RequestMessage): Promise<void> {
    const { id, method, params } = request;
    const handler = this.requestHandlers.get(method);

    if (!handler) {
      this.logger.warn(`No handler for server request ${method}`);

      // Send method not found error
      const response: ResponseMessage = {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      };

      try {
        if (this.transport) {
          await this.transport.send(response);
        }
      } catch (error) {
        this.logger.error('Failed to send error response', error);
      }
      return;
    }

    try {
      const result = await handler(params);

      const response: ResponseMessage = {
        jsonrpc: '2.0',
        id,
        result
      };

      try {
        if (this.transport) {
          await this.transport.send(response);
        }
      } catch (error) {
        this.logger.error('Failed to send success response', error);
      }
    } catch (error) {
      this.logger.error(`Handler for ${method} threw error`, error);

      const response: ResponseMessage = {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32603,
          message: error instanceof Error ? error.message : 'Internal error'
        }
      };

      try {
        if (this.transport) {
          await this.transport.send(response);
        }
      } catch (sendError) {
        this.logger.error('Failed to send error response', sendError);
      }
    }
  }

  /**
   * Handle notification message from server
   */
  private handleNotification(notification: NotificationMessage): void {
    const { method, params } = notification;
    const handler = this.notificationHandlers.get(method);

    if (!handler) {
      this.logger.debug(`No handler for server notification ${method}`);
      return;
    }

    try {
      handler(params);
    } catch (error) {
      this.logger.error(`Handler for ${method} threw error`, error);
    }
  }

  /**
   * Handle transport error
   */
  private handleError(error: Error): void {
    this.logger.error('Transport error', error);
    this.events.emit('error', error);
  }

  /**
   * Handle connection close
   */
  private handleClose(): void {
    if (!this.connected) {
      return;
    }

    this.logger.info('Connection closed');

    this.connected = false;
    this.initialized = false;
    delete this.transport;

    this.transportAttachment.detach();
    this.pendingRequests.clear(new Error('Connection closed'));

    this.events.emit('disconnected');
  }
}

export type LSPClient<ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities> =
  BaseLSPClient<ClientCaps> & Client<ClientCaps, ServerCapabilities>;

// Generic constructor that preserves type parameters
export const LSPClient: new <ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities>(
  options?: ClientOptions<ClientCaps>
) => LSPClient<ClientCaps> = BaseLSPClient as any;
