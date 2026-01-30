/**
 * LSP Client implementation
 */

import EventEmitter from 'node:events';
import type {
  Transport,
  Message,
  RequestMessage,
  ResponseMessage,
  NotificationMessage,
  Disposable,
  Logger,
  CancellationToken
} from '@lspy/core';
import { ConsoleLogger, LogLevel, CancellationTokenSource } from '@lspy/core';
import type { ClientOptions, InitializeResult, CancellableRequest } from './types.js';
import { TextDocumentRequests } from './requests/text-document.js';
import { WorkspaceRequests } from './requests/workspace.js';

/**
 * LSP Client for connecting to language servers
 */
export class LSPClient {
  private transport?: Transport;
  private connected: boolean;
  private initialized: boolean;
  private nextRequestId: number;
  private pendingRequests: Map<
    number | string,
    {
      resolve: (value: any) => void;
      reject: (error: Error) => void;
      method: string;
    }
  >;
  private requestHandlers: Map<string, (params: any) => Promise<any> | any>;
  private notificationHandlers: Map<string, (params: any) => void>;
  private events: EventEmitter;
  private readonly logger: Logger;
  private readonly options: Required<Omit<ClientOptions, 'capabilities' | 'onValidationError'>>;
  private readonly capabilities?: import('vscode-languageserver-protocol').ClientCapabilities;
  private serverCapabilities?: import('vscode-languageserver-protocol').ServerCapabilities;
  private serverInfo?: { name: string; version?: string };
  private readonly onValidationError?: ClientOptions['onValidationError'];

  /**
   * High-level textDocument.* methods
   */
  public readonly textDocument: TextDocumentRequests;

  /**
   * High-level workspace.* methods
   */
  public readonly workspace: WorkspaceRequests;

  constructor(options: ClientOptions = {}) {
    this.transport = undefined;
    this.connected = false;
    this.initialized = false;
    this.nextRequestId = 1;
    this.pendingRequests = new Map();
    this.requestHandlers = new Map();
    this.notificationHandlers = new Map();
    this.events = new EventEmitter();

    // Set up options with defaults
    this.options = {
      name: options.name ?? 'lspy-client',
      version: options.version ?? '1.0.0',
      logger: options.logger ?? new ConsoleLogger(options.logLevel ?? LogLevel.Info),
      logLevel: options.logLevel ?? LogLevel.Info
    };

    this.logger = this.options.logger;
    this.capabilities = options.capabilities;
    this.onValidationError = options.onValidationError;

    // Initialize high-level methods
    this.textDocument = new TextDocumentRequests(this);
    this.workspace = new WorkspaceRequests(this);
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

    // Set up transport handlers
    transport.onMessage((message) => this.handleMessage(message));
    transport.onError((error) => this.handleError(error));
    transport.onClose(() => this.handleClose());

    try {
      // Send initialize request
      this.logger.debug('Sending initialize request');

      const initializeParams: import('vscode-languageserver-protocol').InitializeParams = {
        processId: process.pid,
        clientInfo: {
          name: this.options.name,
          version: this.options.version
        },
        capabilities: this.capabilities ?? {},
        rootUri: null
      };

      const result = await this.sendRequest<
        import('vscode-languageserver-protocol').InitializeParams,
        InitializeResult
      >('initialize', initializeParams);

      this.serverCapabilities = result.capabilities;
      this.serverInfo = result.serverInfo;
      this.initialized = true;

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
        await this.sendRequest('shutdown', null);

        // Send exit notification
        this.logger.debug('Sending exit notification');
        await this.sendNotification('exit', null);
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
  async sendRequest<Params = any, Result = any>(
    method: string,
    params: Params,
    token?: CancellationToken
  ): Promise<Result> {
    if (!this.connected || !this.transport) {
      throw new Error('Client is not connected');
    }

    const id = this.nextRequestId++;

    const request: RequestMessage = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    this.logger.debug(`Sending request ${method}`, { id, params });

    return new Promise<Result>((resolve, reject) => {
      // Set up cancellation if token provided
      if (token) {
        token.onCancellationRequested(() => {
          // Send cancellation notification
          this.sendNotification('$/cancelRequest', { id }).catch((err) => {
            this.logger.error('Failed to send cancellation', err);
          });

          // Reject the promise
          this.pendingRequests.delete(id);
          reject(new Error('Request was cancelled'));
        });
      }

      // Store pending request
      this.pendingRequests.set(id, {
        resolve,
        reject,
        method
      });

      // Send request
      this.transport!.send(request).catch((error) => {
        this.pendingRequests.delete(id);
        reject(error);
      });
    });
  }

  /**
   * Send a notification to the server
   */
  async sendNotification<Params = any>(method: string, params: Params): Promise<void> {
    if (!this.connected || !this.transport) {
      throw new Error('Client is not connected');
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
  sendCancellableRequest<Params = any, Result = any>(
    method: string,
    params: Params
  ): CancellableRequest<Result> {
    const cancelSource = new CancellationTokenSource();

    const promise = this.sendRequest<Params, Result>(method, params, cancelSource.token);

    return {
      promise,
      cancel: () => cancelSource.cancel()
    };
  }

  /**
   * Register handler for server-to-client requests
   */
  onRequest<Params = any, Result = any>(
    method: string,
    handler: (params: Params) => Promise<Result> | Result
  ): Disposable {
    this.requestHandlers.set(method, handler);

    return {
      dispose: () => {
        this.requestHandlers.delete(method);
      }
    };
  }

  /**
   * Register handler for server notifications
   */
  onNotification<Params = any>(method: string, handler: (params: Params) => void): Disposable {
    this.notificationHandlers.set(method, handler);

    return {
      dispose: () => {
        this.notificationHandlers.delete(method);
      }
    };
  }

  /**
   * Subscribe to connection events
   */
  onConnected(handler: () => void): Disposable {
    this.events.on('connected', handler);
    return {
      dispose: () => {
        this.events.off('connected', handler);
      }
    };
  }

  /**
   * Subscribe to disconnection events
   */
  onDisconnected(handler: () => void): Disposable {
    this.events.on('disconnected', handler);
    return {
      dispose: () => {
        this.events.off('disconnected', handler);
      }
    };
  }

  /**
   * Subscribe to error events
   */
  onError(handler: (error: Error) => void): Disposable {
    this.events.on('error', handler);
    return {
      dispose: () => {
        this.events.off('error', handler);
      }
    };
  }

  /**
   * Get server capabilities
   */
  getServerCapabilities(): import('vscode-languageserver-protocol').ServerCapabilities | undefined {
    return this.serverCapabilities;
  }

  /**
   * Get server info
   */
  getServerInfo(): { name: string; version?: string } | undefined {
    return this.serverInfo;
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
      this.handleRequest(message as RequestMessage);
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
    const pending = this.pendingRequests.get(id);

    if (!pending) {
      this.logger.warn(`Received response for unknown request ${id}`);
      return;
    }

    this.pendingRequests.delete(id);

    if ('error' in response && response.error) {
      this.logger.error(`Request ${pending.method} failed`, response.error);
      pending.reject(new Error(`${response.error.message} (code: ${response.error.code})`));
    } else if ('result' in response) {
      this.logger.debug(`Request ${pending.method} succeeded`, { id });
      pending.resolve(response.result);
    } else {
      pending.reject(new Error('Invalid response message'));
    }
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

      await this.transport!.send(response);
      return;
    }

    try {
      const result = await handler(params);

      const response: ResponseMessage = {
        jsonrpc: '2.0',
        id,
        result
      };

      await this.transport!.send(response);
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

      await this.transport!.send(response);
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
    this.transport = undefined;

    // Reject all pending requests
    for (const [, pending] of this.pendingRequests.entries()) {
      pending.reject(new Error('Connection closed'));
    }
    this.pendingRequests.clear();

    this.events.emit('disconnected');
  }
}
