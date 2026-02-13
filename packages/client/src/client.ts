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
  DynamicRegistration,
  DynamicRegistrationBehavior,
  LSPRequestMethod,
  ParamsForRequest,
  ResultForRequest,
  LSPNotificationMethod,
  ParamsForNotification,
  InitializeParams,
  ServerCapabilities,
  ClientCapabilities,
  Client,
  Middleware,
  MiddlewareContext,
  MiddlewareResult,
  ScopedMiddleware
} from '@lspeasy/core';
import {
  CancellationTokenSource,
  ConsoleLogger,
  executeMiddlewarePipeline,
  isRegisterCapabilityParams,
  isUnregisterCapabilityParams,
  LogLevel
} from '@lspeasy/core';
import { DisposableEventEmitter, HandlerRegistry } from '@lspeasy/core/utils';
import { PendingRequestTracker, TransportAttachment } from '@lspeasy/core/utils/internal';
import type {
  ClientOptions,
  InitializeResult,
  CancellableRequest,
  NotebookDocumentNamespace,
  PartialRequestOptions,
  PartialRequestResult
} from './types.js';
import { initializeCapabilityMethods, updateCapabilityMethods } from './capability-proxy.js';
import { CapabilityGuard, ClientCapabilityGuard } from './capability-guard.js';
import { ConnectionHealthTracker, ConnectionState, HeartbeatMonitor } from './connection/index.js';
import type { ConnectionHealth, HeartbeatConfig, StateChangeEvent } from './connection/index.js';
import { RegistrationStore } from './connection/registration-store.js';
import { PartialResultCollector } from './connection/partial-result-collector.js';

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
  private readonly middlewareRegistrations: Array<Middleware | ScopedMiddleware>;
  private readonly options: {
    name: string;
    version: string;
    logger: Logger;
    logLevel: LogLevel;
    requestTimeout: number | undefined;
    strictCapabilities: boolean;
    heartbeat: HeartbeatConfig | undefined;
    dynamicRegistration: DynamicRegistrationBehavior;
  };
  private capabilities?: ClientCaps;
  public serverCapabilities?: ServerCapabilities;
  private serverInfo?: { name: string; version?: string };
  private readonly onValidationError?: ClientOptions<ClientCaps>['onValidationError'];
  private capabilityGuard?: CapabilityGuard;
  private clientCapabilityGuard?: ClientCapabilityGuard;
  private readonly healthTracker: ConnectionHealthTracker;
  private heartbeatMonitor: HeartbeatMonitor | undefined;
  private readonly registrationStore: RegistrationStore;
  private notificationWaiters: Set<{
    method: string;
    filter?: (params: unknown) => boolean;
    resolve: (params: unknown) => void;
    reject: (error: Error) => void;
    cleanup: () => void;
  }>;
  private readonly partialCollectors: Map<string | number, unknown[]>;
  private readonly partialCollector: PartialResultCollector;
  public readonly notebookDocument: NotebookDocumentNamespace;

  constructor(options: ClientOptions<ClientCaps> = {}) {
    this.connected = false;
    this.initialized = false;
    // Set up options with defaults
    this.options = {
      name: options.name ?? 'lspeasy-client',
      version: options.version ?? '1.0.0',
      logger: options.logger ?? new ConsoleLogger(options.logLevel ?? LogLevel.Info),
      logLevel: options.logLevel ?? LogLevel.Info,
      requestTimeout: options.requestTimeout,
      strictCapabilities: options.strictCapabilities ?? false,
      heartbeat: options.heartbeat,
      dynamicRegistration: options.dynamicRegistration ?? {
        allowUndeclaredDynamicRegistration: false
      }
    };

    this.logger = this.options.logger;
    this.middlewareRegistrations = options.middleware ?? [];
    this.pendingRequests = new PendingRequestTracker(this.options.requestTimeout);
    this.requestHandlers = new HandlerRegistry();
    this.notificationHandlers = new HandlerRegistry();
    this.events = new DisposableEventEmitter();
    this.transportAttachment = new TransportAttachment();
    this.notificationWaiters = new Set();
    this.registrationStore = new RegistrationStore();
    this.partialCollectors = new Map();
    this.partialCollector = new PartialResultCollector();
    this.notebookDocument = {
      didOpen: async (params) => this.sendNotification('notebookDocument/didOpen', params),
      didChange: async (params) => this.sendNotification('notebookDocument/didChange', params),
      didSave: async (params) => this.sendNotification('notebookDocument/didSave', params),
      didClose: async (params) => this.sendNotification('notebookDocument/didClose', params)
    };
    this.healthTracker = new ConnectionHealthTracker();
    if (options.capabilities) {
      this.capabilities = options.capabilities;
    }
    if (options.onValidationError) {
      this.onValidationError = options.onValidationError;
    }

    // Initialize capability guard for server-to-client handlers
    this.clientCapabilityGuard = new ClientCapabilityGuard(
      this.capabilities ?? {},
      this.logger,
      this.options.strictCapabilities
    );

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

    this.healthTracker.setState(ConnectionState.Connecting);
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
        this.options.strictCapabilities
      );

      // Update capability-aware methods based on server capabilities
      updateCapabilityMethods(this as unknown as LSPClient<ClientCaps>);

      // Send initialized notification
      await this.sendNotification('initialized', {});

      this.healthTracker.setState(ConnectionState.Connected);
      this.startHeartbeatIfConfigured(this.options.heartbeat);

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

    this.healthTracker.setState(ConnectionState.Disconnecting);

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
      // Return a promise that rejects asynchronously to allow handlers to attach
      return Promise.resolve().then(() => {
        throw new Error('Request was cancelled');
      });
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

        // Defer rejection asynchronously to allow handlers to attach
        Promise.resolve().then(() => {
          this.pendingRequests.reject(id, new Error('Request was cancelled'));
        });
      });
    }

    void promise.then(
      () => {
        cancellationDisposable?.dispose();
      },
      () => {
        cancellationDisposable?.dispose();
      }
    );

    this.sendWithMiddleware({
      direction: 'clientToServer',
      messageType: 'request',
      method,
      message: request,
      onSend: async () => {
        this.healthTracker.markMessageSent();
        await this.transport!.send(request);
      },
      onShortCircuit: (result) => {
        this.resolveShortCircuitRequest(id, result);
      },
      onError: (error) => {
        this.pendingRequests.reject(id, error);
      }
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

    await this.sendWithMiddleware({
      direction: 'clientToServer',
      messageType: 'notification',
      method,
      message: notification,
      onSend: async () => {
        this.healthTracker.markMessageSent();
        await this.transport!.send(notification);
      }
    });
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
   * Send a request with partial-result streaming support.
   */
  async sendRequestWithPartialResults<
    M extends LSPRequestMethod<'clientToServer'>,
    TPartial = unknown
  >(
    method: M,
    params: ParamsForRequest<M>,
    options: PartialRequestOptions<TPartial>,
    token?: CancellationToken
  ): Promise<PartialRequestResult<TPartial, ResultForRequest<M>>> {
    const partialToken = options.token ?? `${Date.now()}-${Math.random()}`;
    const partials: TPartial[] = [];
    this.partialCollectors.set(partialToken, partials as unknown[]);
    this.partialCollector.start(partialToken, (value: TPartial) => {
      partials.push(value);
      options.onPartial(value);
    });

    try {
      const requestParams =
        params && typeof params === 'object'
          ? ({
              ...(params as object),
              partialResultToken: partialToken
            } as ParamsForRequest<M>)
          : params;

      const finalResult = await this.sendRequest(method, requestParams, token);
      return {
        cancelled: false,
        partialResults: partials,
        finalResult
      };
    } catch (error) {
      const isCancelled = error instanceof Error && error.message.includes('cancel');
      if (isCancelled) {
        return {
          cancelled: true,
          partialResults: partials,
          finalResult: undefined
        };
      }

      throw error;
    } finally {
      this.partialCollectors.delete(partialToken);
      this.partialCollector.abort(partialToken);
    }
  }

  /**
   * Return static server capabilities plus dynamic registrations seen at runtime.
   */
  getRuntimeCapabilities(): {
    staticCapabilities: ServerCapabilities | undefined;
    dynamicRegistrations: DynamicRegistration[];
  } {
    return {
      staticCapabilities: this.serverCapabilities,
      dynamicRegistrations: this.registrationStore.getAll()
    };
  }

  /**
   * Register handler for server-to-client requests
   */
  onRequest<M extends LSPRequestMethod<'serverToClient'>>(
    method: M,
    handler: (params: ParamsForRequest<M>) => Promise<ResultForRequest<M>> | ResultForRequest<M>
  ): Disposable {
    if (this.clientCapabilityGuard && !this.clientCapabilityGuard.canRegisterHandler(method)) {
      this.logger.warn(`Client capability not declared for handler ${method}`);
    }
    return this.requestHandlers.register(method, handler as (params: unknown) => unknown);
  }

  /**
   * Register handler for server notifications
   */
  onNotification<M extends LSPNotificationMethod<'serverToClient'>>(
    method: M,
    handler: (params: ParamsForNotification<M>) => void
  ): Disposable {
    if (this.clientCapabilityGuard && !this.clientCapabilityGuard.canRegisterHandler(method)) {
      this.logger.warn(`Client capability not declared for handler ${method}`);
    }
    return this.notificationHandlers.register(method, handler as (params: unknown) => void);
  }

  /**
   * Wait for the next matching server notification.
   */
  waitForNotification<M extends LSPNotificationMethod<'serverToClient'>>(
    method: M,
    options: {
      timeout: number;
      filter?: (params: ParamsForNotification<M>) => boolean;
    }
  ): Promise<ParamsForNotification<M>> {
    return new Promise<ParamsForNotification<M>>((resolve, reject) => {
      let timeoutHandle: NodeJS.Timeout | undefined;

      const waiter: {
        method: string;
        filter?: (params: unknown) => boolean;
        resolve: (params: unknown) => void;
        reject: (error: Error) => void;
        cleanup: () => void;
      } = {
        method,
        resolve: (params: unknown) => {
          resolve(params as ParamsForNotification<M>);
        },
        reject: (error: Error) => {
          reject(error);
        },
        cleanup: () => {
          if (timeoutHandle) {
            clearTimeout(timeoutHandle);
            timeoutHandle = undefined;
          }
          this.notificationWaiters.delete(waiter);
        }
      };

      if (options.filter) {
        waiter.filter = options.filter as (params: unknown) => boolean;
      }

      this.notificationWaiters.add(waiter);

      timeoutHandle = setTimeout(() => {
        waiter.cleanup();
        reject(
          new Error(`Timed out waiting for notification '${method}' after ${options.timeout}ms`)
        );
      }, options.timeout);
    });
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

  onConnectionStateChange(handler: (event: StateChangeEvent) => void): Disposable {
    const dispose = this.healthTracker.onStateChange(handler);
    return { dispose };
  }

  onConnectionHealthChange(handler: (health: ConnectionHealth) => void): Disposable {
    const dispose = this.healthTracker.onHealthChange(handler);
    return { dispose };
  }

  getConnectionHealth(): ConnectionHealth {
    return this.healthTracker.getHealth();
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
    this.clientCapabilityGuard = new ClientCapabilityGuard(
      capabilities,
      this.logger,
      this.options.strictCapabilities
    );
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
    this.healthTracker.markMessageReceived();
    this.heartbeatMonitor?.markPong();
    if (this.heartbeatMonitor) {
      this.healthTracker.setHeartbeat(this.heartbeatMonitor.getStatus());
    }

    // Response message
    if ('id' in message && ('result' in message || 'error' in message)) {
      void this.handleResponse(message as ResponseMessage).catch((error) => {
        this.logger.error('Error handling response', error);
      });
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
  private async handleResponse(response: ResponseMessage): Promise<void> {
    const { id } = response;
    const method = this.pendingRequests.getMetadata(String(id));

    if (!method) {
      this.logger.warn(`Received response for unknown request ${id}`);
      return;
    }

    await this.sendWithMiddleware({
      direction: 'serverToClient',
      messageType: 'error' in response ? 'error' : 'response',
      method,
      message: response,
      onSend: async () => {
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
      },
      onShortCircuit: (result) => {
        this.resolveShortCircuitRequest(String(id), result);
      },
      onError: (error) => {
        this.pendingRequests.reject(String(id), error);
      }
    });
  }

  private resolveShortCircuitRequest(id: string, result: MiddlewareResult): void {
    if (result.error) {
      this.pendingRequests.reject(
        id,
        new Error(`${result.error.error.message} (code: ${result.error.error.code})`)
      );
      return;
    }

    if (result.response && 'error' in result.response && result.response.error) {
      this.pendingRequests.reject(
        id,
        new Error(`${result.response.error.message} (code: ${result.response.error.code})`)
      );
      return;
    }

    if (result.response && 'result' in result.response) {
      this.pendingRequests.resolve(id, result.response.result);
      return;
    }

    this.pendingRequests.reject(id, new Error('Middleware short-circuit missing response payload'));
  }

  private buildMiddlewareContext(
    direction: 'clientToServer' | 'serverToClient',
    messageType: 'request' | 'response' | 'notification' | 'error',
    method: string,
    message: MiddlewareContext['message']
  ): MiddlewareContext {
    return {
      direction,
      messageType,
      method,
      message,
      metadata: {},
      transport: this.transport?.constructor.name ?? 'unknown'
    };
  }

  private async sendWithMiddleware(options: {
    direction: 'clientToServer' | 'serverToClient';
    messageType: 'request' | 'response' | 'notification' | 'error';
    method: string;
    message: MiddlewareContext['message'];
    onSend: () => Promise<void>;
    onShortCircuit?: (result: MiddlewareResult) => void;
    onError?: (error: Error) => void;
  }): Promise<void> {
    const context = this.buildMiddlewareContext(
      options.direction,
      options.messageType,
      options.method,
      options.message
    );

    try {
      const result = await executeMiddlewarePipeline(
        this.middlewareRegistrations,
        context,
        async () => {
          await options.onSend();
          return undefined;
        }
      );

      if (result?.shortCircuit && options.onShortCircuit) {
        options.onShortCircuit(result);
      }
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      this.handleError(normalized);
      if (options.onError) {
        options.onError(normalized);
        return;
      }
      throw normalized;
    }
  }

  /**
   * Handle request message from server
   */
  private async handleRequest(request: RequestMessage): Promise<void> {
    const { id, method, params } = request;

    if (method === 'client/registerCapability') {
      await this.handleDynamicRegister(id, params);
      return;
    }

    if (method === 'client/unregisterCapability') {
      await this.handleDynamicUnregister(id, params);
      return;
    }

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

  private supportsDynamicRegistration(method: string): boolean {
    const capabilities = this.capabilities as Record<string, unknown> | undefined;
    if (!capabilities) {
      return false;
    }

    // Methods are of the form "<root>/<subKey>", e.g. "textDocument/hover".
    const separatorIndex = method.indexOf('/');
    if (separatorIndex === -1) {
      return false;
    }

    const root = method.slice(0, separatorIndex);
    const subKey = method.slice(separatorIndex + 1);
    if (!root || !subKey) {
      return false;
    }

    const rootCapabilities = capabilities[root] as Record<string, unknown> | undefined;
    if (!rootCapabilities || typeof rootCapabilities !== 'object') {
      return false;
    }

    // Map method names to capability keys when they differ or need special handling.
    const methodToCapabilityKey: Record<string, string> = {
      // Current known methods follow the "<root>/<propertyKey>" pattern, so this
      // map is empty for now. It can be extended in the future for any special cases.
    };

    const capabilityKey = methodToCapabilityKey[method] ?? subKey;
    const capability = rootCapabilities[capabilityKey] as Record<string, unknown> | undefined;

    if (!capability || typeof capability !== 'object') {
      return false;
    }

    return capability['dynamicRegistration'] === true;
  }

  private async sendResponseMessage(response: ResponseMessage): Promise<void> {
    if (!this.transport) {
      return;
    }

    await this.transport.send(response);
  }

  private async handleDynamicRegister(id: string | number, params: unknown): Promise<void> {
    if (!isRegisterCapabilityParams(params)) {
      await this.sendResponseMessage({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32602,
          message: 'Invalid params for client/registerCapability'
        }
      });
      return;
    }

    const unsupported = params.registrations.find(
      (registration) =>
        !this.supportsDynamicRegistration(registration.method) &&
        !this.options.dynamicRegistration.allowUndeclaredDynamicRegistration
    );

    if (unsupported) {
      await this.sendResponseMessage({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32602,
          message: `Dynamic registration not declared for ${unsupported.method}`
        }
      });
      return;
    }

    for (const registration of params.registrations) {
      this.registrationStore.upsert(registration);
    }

    updateCapabilityMethods(this as unknown as LSPClient<ClientCaps>);

    await this.sendResponseMessage({
      jsonrpc: '2.0',
      id,
      result: null
    });
  }

  private async handleDynamicUnregister(id: string | number, params: unknown): Promise<void> {
    if (!isUnregisterCapabilityParams(params)) {
      await this.sendResponseMessage({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32602,
          message: 'Invalid params for client/unregisterCapability'
        }
      });
      return;
    }

    const unknownIds: string[] = [];
    for (const unregister of params.unregisterations) {
      const removed = this.registrationStore.remove(unregister.id);
      if (!removed) {
        unknownIds.push(unregister.id);
      }
    }

    if (unknownIds.length > 0) {
      await this.sendResponseMessage({
        jsonrpc: '2.0',
        id,
        error: {
          code: -32602,
          message: `Unknown registration id(s): ${unknownIds.join(', ')}`
        }
      });
      return;
    }

    updateCapabilityMethods(this as unknown as LSPClient<ClientCaps>);

    await this.sendResponseMessage({
      jsonrpc: '2.0',
      id,
      result: null
    });
  }

  /**
   * Handle notification message from server
   */
  private handleNotification(notification: NotificationMessage): void {
    const { method, params } = notification;

    if (method === '$/progress') {
      this.handleProgressNotification(params);
    }

    for (const waiter of Array.from(this.notificationWaiters)) {
      if (waiter.method !== method) {
        continue;
      }

      try {
        if (waiter.filter && !waiter.filter(params)) {
          continue;
        }
        waiter.cleanup();
        waiter.resolve(params);
      } catch (error) {
        waiter.cleanup();
        const normalized = error instanceof Error ? error : new Error(String(error));
        waiter.reject(normalized);
      }
    }

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

  private handleProgressNotification(params: unknown): void {
    if (typeof params !== 'object' || params === null) {
      return;
    }

    const candidate = params as Record<string, unknown>;
    const token = candidate['token'];

    if (typeof token !== 'string' && typeof token !== 'number') {
      return;
    }

    this.partialCollector.push(token, candidate['value']);
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
    this.heartbeatMonitor?.stop();
    this.heartbeatMonitor = undefined;
    this.healthTracker.setState(ConnectionState.Disconnected);

    this.transportAttachment.detach();
    this.pendingRequests.clear(new Error('Connection closed'));
    this.partialCollector.clear();

    for (const waiter of Array.from(this.notificationWaiters)) {
      waiter.cleanup();
      waiter.reject(new Error('Connection closed before notification was received'));
    }

    this.events.emit('disconnected');
  }

  private startHeartbeatIfConfigured(config: HeartbeatConfig | undefined): void {
    if (!config || !config.enabled) {
      return;
    }

    this.heartbeatMonitor?.stop();

    this.heartbeatMonitor = new HeartbeatMonitor({
      config,
      onPing: () => {
        this.healthTracker.setHeartbeat(this.heartbeatMonitor!.getStatus());
      },
      onUnresponsive: () => {
        this.healthTracker.setHeartbeat(this.heartbeatMonitor!.getStatus());
      },
      onResponsive: () => {
        this.healthTracker.setHeartbeat(this.heartbeatMonitor!.getStatus());
      }
    });

    this.healthTracker.setHeartbeat(this.heartbeatMonitor.getStatus());
    this.heartbeatMonitor.start();
  }
}

export type LSPClient<ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities> =
  BaseLSPClient<ClientCaps> & Client<ClientCaps, ServerCapabilities>;

// Generic constructor that preserves type parameters
export const LSPClient: new <ClientCaps extends Partial<ClientCapabilities> = ClientCapabilities>(
  options?: ClientOptions<ClientCaps>
) => LSPClient<ClientCaps> = BaseLSPClient as any;
