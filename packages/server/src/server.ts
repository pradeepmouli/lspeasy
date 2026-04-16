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
  Server,
  Middleware,
  MiddlewareContext,
  MiddlewareResult,
  ScopedMiddleware
} from '@lspeasy/core';
import {
  ConsoleLogger,
  executeMiddlewarePipeline,
  LogLevel,
  ResponseError,
  isRequestMessage,
  isResponseMessage
} from '@lspeasy/core';
import { DisposableEventEmitter } from '@lspeasy/core/utils';
import { PendingRequestTracker, TransportAttachment } from '@lspeasy/core/utils/internal';
import type {
  ServerOptions,
  RequestHandler,
  NotificationHandler,
  NotebookDocumentHandlerNamespace
} from './types.js';
import { ServerState } from './types.js';
import { MessageDispatcher } from './dispatcher.js';
import { LifecycleManager } from './lifecycle.js';
import { validateParams } from './validation.js';
import { CapabilityGuard, ClientCapabilityGuard } from './capability-guard.js';
import { initializeServerHandlerMethods, initializeServerSendMethods } from './capability-proxy.js';

/**
 * Full-featured LSP server with automatic lifecycle management, typed handlers,
 * capability-aware namespaces, and pluggable middleware.
 *
 * @remarks
 * `LSPServer` manages the complete LSP lifecycle (`initialize` / `initialized`
 * / `shutdown` / `exit`) automatically. Register your handlers with
 * `onRequest` / `onNotification`, declare capabilities with
 * `registerCapabilities`, then start the server with `listen(transport)`.
 *
 * ### Capability-aware namespaces
 *
 * After calling `registerCapabilities(caps)`, the server exposes typed
 * namespaces — e.g. `server.textDocument.onHover(handler)` — that are only
 * present when the corresponding capability is declared. TypeScript enforces
 * this at compile time so you cannot accidentally register a handler for a
 * capability you never advertised.
 *
 * ### Transport selection
 *
 * - **Browser / universal**: `WebSocketTransport` (from `@lspeasy/core`)
 * - **Node.js**: `StdioTransport`, `TcpTransport`, `IpcTransport` (from `@lspeasy/core/node`)
 * - **Web Workers**: `DedicatedWorkerTransport`, `SharedWorkerTransport` (from `@lspeasy/core`)
 *
 * @useWhen
 * You are building an LSP language server that editors and language-client
 * tooling will connect to. `LSPServer` is the primary entry point for all
 * server implementations.
 *
 * @avoidWhen
 * You need a bare JSON-RPC layer without LSP semantics — use the transport
 * and framing utilities directly instead.
 *
 * @pitfalls
 * NEVER call `server.shutdown()` or `server.close()` from inside a request
 * or notification handler — doing so attempts to close the transport while it
 * is actively dispatching, causing a deadlock.
 *
 * NEVER mutate `ServerCapabilities` after `initialized` has been received.
 * The client cached the `InitializeResult` at handshake time; runtime changes
 * are invisible to it.
 *
 * NEVER share one `LSPServer` instance across multiple transports or
 * connections. Each connection requires its own server instance to maintain
 * independent protocol state (lifecycle phase, pending request IDs, etc.).
 *
 * NEVER send a server-to-client notification before the `initialize` response
 * has been dispatched. Use the `initialized` notification handler as the
 * earliest safe point for server-initiated messages.
 *
 * @example
 * ```ts
 * import { LSPServer } from '@lspeasy/server';
 * // Node.js: import { StdioTransport } from '@lspeasy/core/node';
 * // Browser: import { WebSocketTransport } from '@lspeasy/core';
 *
 * const server = new LSPServer({ name: 'my-lsp', version: '1.0.0' })
 *   .registerCapabilities({ hoverProvider: true });
 *
 * server.textDocument.onHover(async (params, token) => {
 *   if (token.isCancellationRequested) return null;
 *   return { contents: { kind: 'plaintext', value: 'Hello from my-lsp' } };
 * });
 *
 * const transport = new StdioTransport();
 * await server.listen(transport);
 * ```
 *
 * @template Capabilities - Shape of the server capabilities, defaults to `ServerCapabilities`.
 * @category Server
 */
export class BaseLSPServer<Capabilities extends Partial<ServerCapabilities> = ServerCapabilities> {
  private readonly logger: Logger;
  private readonly middlewareRegistrations: Array<Middleware | ScopedMiddleware>;
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
  public readonly notebookDocument: NotebookDocumentHandlerNamespace;

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
    this.middlewareRegistrations = options.middleware ?? [];

    // Create dispatcher and lifecycle manager
    this.dispatcher = new MessageDispatcher(this.logger);
    this.lifecycleManager = new LifecycleManager(this.name, this.version, this.logger);
    this.notebookDocument = {
      onDidOpen: (handler) => this.onNotification('notebookDocument/didOpen', handler),
      onDidChange: (handler) => this.onNotification('notebookDocument/didChange', handler),
      onDidSave: (handler) => this.onNotification('notebookDocument/didSave', handler),
      onDidClose: (handler) => this.onNotification('notebookDocument/didClose', handler)
    };

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
   * Declare server capabilities and return this instance narrowed to those capabilities.
   * The returned reference is the same object — use it to access capability-aware
   * handler namespaces (e.g. `server.textDocument.onHover`).
   *
   * @template C - The capabilities shape to declare
   * @param capabilities - The server capabilities to declare
   * @returns The same server instance typed with the declared capabilities
   *
   * @example
   * const server = new LSPServer()
   *   .registerCapabilities({ hoverProvider: true });
   * server.textDocument.onHover(async (params) => { ... });
   */
  registerCapabilities<C extends Partial<ServerCapabilities>>(capabilities: C): LSPServer<C> {
    this.lifecycleManager.registerCapabilities(capabilities as ServerCapabilities);
    // Create capability guard with the new capabilities
    this.capabilityGuard = new CapabilityGuard(
      capabilities as ServerCapabilities,
      this.logger,
      this.options.strictCapabilities ?? false
    );

    // Initialize capability-aware handler methods based on declared capabilities
    initializeServerHandlerMethods(this as any);
    initializeServerSendMethods(this as any);
    return this as unknown as LSPServer<C>;
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

    void this.sendWithMiddleware({
      direction: 'serverToClient',
      messageType: 'request',
      method,
      message: request,
      onSend: async () => {
        await this.transport!.send(request);
      },
      onShortCircuit: (result) => {
        this.resolveShortCircuitRequest(String(id), result);
      },
      onError: (error) => {
        this.pendingRequests.reject(String(id), error);
      }
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

    await this.sendWithMiddleware({
      direction: 'serverToClient',
      messageType: 'notification',
      method,
      message: notification,
      onSend: async () => {
        await this.transport!.send(notification);
      }
    });
  }

  /**
   * Attaches the server to a transport and begins processing messages.
   *
   * @remarks
   * After `listen()` returns the server is ready to receive the `initialize`
   * request from the client. The LSP handshake proceeds automatically.
   *
   * @param transport - The transport to listen on.
   * @throws If the server is already listening (call `close()` first).
   *
   * @category Lifecycle
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
   * Initiates graceful shutdown, waits for in-flight handlers, then closes
   * the transport.
   *
   * @remarks
   * Waits up to `timeout` ms for pending handlers to complete, then
   * cancels any remaining in-flight requests before closing. Use this method
   * to shut down in response to an OS signal or editor session end.
   *
   * @param timeout - Maximum milliseconds to wait for in-flight handlers before
   *   force-cancelling them.
   * @defaultValue 5000
   *
   * @category Lifecycle
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
        const method = this.pendingRequests.getMetadata(String(message.id)) ?? 'unknown';
        await this.sendWithMiddleware({
          direction: 'clientToServer',
          messageType: 'error' in message ? 'error' : 'response',
          method,
          message,
          onSend: async () => {
            this.handleResponse(message as ResponseMessage);
          },
          onShortCircuit: (result) => {
            this.resolveShortCircuitRequest(String(message.id), result);
          },
          onError: (error) => {
            this.pendingRequests.reject(String(message.id), error);
          }
        });
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

      await this.sendWithMiddleware({
        direction: 'clientToServer',
        messageType: this.getMessageType(message),
        method: this.getMessageMethod(message),
        message,
        onSend: async () => {
          await this.dispatcher.dispatch(message, this.transport!, this.cancellationTokens);
        },
        onShortCircuit: async (result) => {
          if (!this.transport || !isRequestMessage(message)) {
            return;
          }

          if (result.error) {
            await this.transport.send(result.error);
            return;
          }

          if (result.response && 'id' in result.response) {
            await this.transport.send(result.response);
          }
        }
      });
    } catch (error) {
      this.logger.error('Error handling message:', error);
      this.events.emit('error', error as Error);
    }
  }

  private getMessageType(message: Message): 'request' | 'response' | 'notification' | 'error' {
    if (isResponseMessage(message)) {
      return 'error' in message ? 'error' : 'response';
    }

    if (isRequestMessage(message)) {
      return 'request';
    }

    return 'notification';
  }

  private getMessageMethod(message: Message): string {
    if ('method' in message) {
      return message.method;
    }

    if ('id' in message) {
      return this.pendingRequests.getMetadata(String(message.id)) ?? 'unknown';
    }

    return 'unknown';
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
    onShortCircuit?: (result: MiddlewareResult) => void | Promise<void>;
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
        await options.onShortCircuit(result);
      }
    } catch (error) {
      const normalized = error instanceof Error ? error : new Error(String(error));
      this.events.emit('error', normalized);
      if (options.onError) {
        options.onError(normalized);
        return;
      }
      throw normalized;
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
