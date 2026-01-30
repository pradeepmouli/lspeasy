/**
 * LSP lifecycle management - initialize/initialized handshake
 */

import type {
  Transport,
  InitializeParams,
  InitializeResult,
  InitializedParams,
  ServerCapabilities,
  Logger
} from '@lspy/core';

/**
 * Manages LSP server lifecycle (initialize/initialized/shutdown/exit)
 */
export class LifecycleManager {
  private serverCapabilities: ServerCapabilities = {};

  constructor(
    private readonly name: string,
    private readonly version: string,
    private readonly logger: Logger
  ) {}

  /**
   * Set server capabilities
   */
  setCapabilities(capabilities: ServerCapabilities): void {
    this.serverCapabilities = capabilities;
  }

  /**
   * Get current capabilities
   */
  getCapabilities(): ServerCapabilities {
    return this.serverCapabilities;
  }

  /**
   * Handle initialize request
   */
  async handleInitialize(
    params: InitializeParams,
    transport: Transport,
    id: number | string
  ): Promise<InitializeResult> {
    this.logger.info('Initializing server...');
    this.logger.debug('Initialize params:', params);

    const result: InitializeResult = {
      capabilities: this.serverCapabilities,
      serverInfo: {
        name: this.name,
        version: this.version
      }
    };

    this.logger.info('Server initialized');
    return result;
  }

  /**
   * Handle initialized notification
   */
  handleInitialized(params: InitializedParams): void {
    this.logger.info('Client sent initialized notification');
    this.logger.debug('Initialized params:', params);
  }

  /**
   * Handle shutdown request
   */
  async handleShutdown(transport: Transport, id: number | string): Promise<void> {
    this.logger.info('Shutting down server...');
    this.logger.info('Server shutdown complete');
  }

  /**
   * Handle exit notification
   */
  handleExit(): void {
    this.logger.info('Server exit');
  }
}
