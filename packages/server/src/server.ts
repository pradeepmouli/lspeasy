/**
 * LSP Server - Main server class for handling LSP connections
 */

import type {
  Transport,
  Message,
  Disposable,
  Logger,
  ServerCapabilities,
  ClientCapabilities,
  InitializeParams,
  InitializedParams,
  LSPRequestMethod,
  LSPNotificationMethod,
  ParamsForRequest,
  ResultForRequest,
  ParamsForNotification,
  Server
} from '@lspeasy/core';
import { ConsoleLogger, LogLevel, ResponseError, isRequestMessage } from '@lspeasy/core';
import type { ServerOptions, RequestHandler, NotificationHandler } from './types.js';
import { ServerState } from './types.js';
import { MessageDispatcher } from './dispatcher.js';
import { LifecycleManager } from './lifecycle.js';
import { validateParams } from './validation.js';
import { CapabilityGuard } from './capability-guard.js';
import { initializeServerHandlerMethods, initializeServerSendMethods } from './capability-proxy.js';

/**
 * Type alias to add capability-aware methods to LSPServer
 * These methods are added at runtime based on registered handlers
 */
export type LSPServerWithCapabilities<
  Capabilities extends Partial<ServerCapabilities> = ServerCapabilities
> = LSPServer & Server<ClientCapabilities, Capabilities>;

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
export class LSPServer<Capabilities extends Partial<ServerCapabilities> = ServerCapabilities> {
  private readonly logger: Logger;
  private readonly dispatcher: MessageDispatcher;
  private readonly lifecycleManager: LifecycleManager;
  private readonly name: string;
  private readonly version: string;
  private readonly options: ServerOptions;
  private capabilityGuard?: CapabilityGuard;

  private transport?: Transport | undefined;
  private state: ServerState = ServerState.Created;
  private cancellationTokens = new Map<number | string, AbortController>();
  private clientCapabilities?: ClientCapabilities;
  private disposables: Disposable[] = [];

  constructor(options: ServerOptions = {}) {
    this.options = options;
    this.name = options.name ?? 'lsp-server';
    this.version = options.version ?? '1.0.0';

    // Setup logger
    const logLevelMap: Record<string, LogLevel> = {
      trace: LogLevel.Trace,
      debug: LogLevel.Debug,
      info: LogLevel.Info,
      warn: LogLevel.Warn,
      error: LogLevel.Error
    };
    const logLevel = logLevelMap[options.logLevel ?? 'info'];
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
  ): this;

  /**
   * Register a request handler with explicit type parameters (backwards compatible)
   */
  onRequest<Method extends string, Params = unknown, Result = unknown>(
    method: Method,
    handler: RequestHandler<Params, Result>
  ): this;

  // Implementation
  onRequest<Method extends string, Params = unknown, Result = unknown>(
    method: Method,
    handler: RequestHandler<Params, Result>
  ): this {
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
      // Validate params if schema exists
      const validatedParams = validateParams(
        method,
        params,
        context,
        this.options.onValidationError
      ) as Params;

      // Call user handler
      return handler(validatedParams, token, context);
    };

    this.dispatcher.registerRequest(method, wrappedHandler);
    return this;
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
  ): this;

  /**
   * Register a notification handler with explicit type parameters (backwards compatible)
   */
  onNotification<Method extends string, Params = unknown>(
    method: Method,
    handler: NotificationHandler<Params>
  ): this;

  // Implementation
  onNotification<Method extends string, Params = unknown>(
    method: Method,
    handler: NotificationHandler<Params>
  ): this {
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
      // Validate params if schema exists
      const validatedParams = validateParams(
        method,
        params,
        context,
        this.options.onValidationError
      ) as Params;

      // Call user handler
      return handler(validatedParams, context);
    };

    this.dispatcher.registerNotification(method, wrappedHandler);
    return this;
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
    initializeServerHandlerMethods(this);
    initializeServerSendMethods(this);
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): ServerCapabilities {
    return this.lifecycleManager.getCapabilities();
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
    const current = this.getCapabilities();
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
   * Start listening on a transport
   */
  async listen(transport: Transport): Promise<void> {
    if (this.transport) {
      throw new Error('Server is already listening');
    }

    this.transport = transport;
    this.logger.info(`Server listening: ${this.name} v${this.version}`);

    // Subscribe to messages
    const messageDisposable = transport.onMessage(async (message) => {
      await this.handleMessage(message);
    });
    this.disposables.push(messageDisposable);

    // Subscribe to errors
    const errorDisposable = transport.onError((error) => {
      this.logger.error('Transport error:', error);
    });
    this.disposables.push(errorDisposable);
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

    // Dispose all subscriptions
    for (const disposable of this.disposables) {
      disposable.dispose();
    }
    this.disposables = [];

    // Close transport
    if (this.transport) {
      await this.transport.close();
      this.transport = undefined;
    }

    this.logger.info('Server closed');
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
    }
  }
}
