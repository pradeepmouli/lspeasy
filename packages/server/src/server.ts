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
  InitializedParams
} from '@lspy/core';
import { ConsoleLogger, LogLevel, ResponseError, isRequestMessage } from '@lspy/core';
import type { ServerOptions, RequestHandler, NotificationHandler } from './types.js';
import { ServerState } from './types.js';
import { MessageDispatcher } from './dispatcher.js';
import { LifecycleManager } from './lifecycle.js';
import { validateParams } from './validation.js';

/**
 * LSP Server class
 */
export class LSPServer<Capabilities extends Partial<ServerCapabilities> = ServerCapabilities> {
  private readonly logger: Logger;
  private readonly dispatcher: MessageDispatcher;
  private readonly lifecycle: LifecycleManager;
  private readonly name: string;
  private readonly version: string;
  private readonly options: ServerOptions;

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
    this.lifecycle = new LifecycleManager(this.name, this.version, this.logger);

    // Register built-in handlers
    this.registerBuiltinHandlers();
  }

  /**
   * Register a request handler
   */
  onRequest<Method extends string, Params = unknown, Result = unknown>(
    method: Method,
    handler: RequestHandler<Params, Result>
  ): this {
    // Wrap handler with validation
    const wrappedHandler: RequestHandler<Params, Result> = async (params, token, context) => {
      // Validate params if schema exists
      const validatedParams = validateParams(
        method,
        params,
        this.options.onValidationError
      ) as Params;

      // Call user handler
      return handler(validatedParams, token, context);
    };

    this.dispatcher.registerRequest(method, wrappedHandler);
    return this;
  }

  /**
   * Register a notification handler
   */
  onNotification<Method extends string, Params = unknown>(
    method: Method,
    handler: NotificationHandler<Params>
  ): this {
    // Wrap handler with validation
    const wrappedHandler: NotificationHandler<Params> = async (params, context) => {
      // Validate params if schema exists
      const validatedParams = validateParams(
        method,
        params,
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
    this.lifecycle.setCapabilities(capabilities as ServerCapabilities);
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): ServerCapabilities {
    return this.lifecycle.getCapabilities();
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
    this.onRequest<'initialize', InitializeParams, any>(
      'initialize',
      async (params, token, context) => {
        if (this.state !== ServerState.Created) {
          throw ResponseError.invalidRequest('Server already initialized');
        }

        this.state = ServerState.Initializing;
        this.clientCapabilities = params.capabilities;
        this.dispatcher.setClientCapabilities(params.capabilities);

        const result = await this.lifecycle.handleInitialize(params, this.transport!, context.id);
        this.state = ServerState.Initialized;

        return result;
      }
    );

    // Initialized notification - use onNotification to get validation
    this.onNotification<'initialized', InitializedParams>('initialized', (params) => {
      this.lifecycle.handleInitialized(params);
    });

    // Shutdown request
    this.onRequest('shutdown', async (params, token, context) => {
      if (this.state !== ServerState.Initialized) {
        throw ResponseError.invalidRequest('Server not initialized');
      }

      await this.lifecycle.handleShutdown(this.transport!, context.id);
      this.state = ServerState.ShuttingDown;

      return null;
    });

    // Exit notification
    this.onNotification('exit', () => {
      this.lifecycle.handleExit();
      void this.close();
    });

    // Cancellation notification
    this.onNotification<'$/cancelRequest', { id: number | string }>('$/cancelRequest', (params) => {
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
