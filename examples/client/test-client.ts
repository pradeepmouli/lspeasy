/**
 * Test Client Harness
 *
 * This provides a reusable test harness for running LSP client tests
 * against real language servers.
 */

import { LSPClient } from '@lspy/client';
import { StdioTransport } from '@lspy/core';
import type { ChildProcess } from 'node:child_process';
import { spawn } from 'node:child_process';

/**
 * Configuration for test client
 */
export interface TestClientConfig {
  /**
   * Command to start the language server
   */
  command: string;

  /**
   * Arguments for the language server command
   */
  args: string[];

  /**
   * Working directory for the server process
   */
  cwd?: string;

  /**
   * Client capabilities to advertise
   */
  capabilities?: import('vscode-languageserver-protocol').ClientCapabilities;
}

/**
 * Test client harness for automated testing
 */
export class TestClientHarness {
  private client?: LSPClient;
  private serverProcess?: ChildProcess;
  private transport?: StdioTransport;

  constructor(private config: TestClientConfig) {}

  /**
   * Start the server and connect the client
   */
  async start(): Promise<import('@lspy/client').InitializeResult> {
    // Spawn language server process
    this.serverProcess = spawn(this.config.command, this.config.args, {
      cwd: this.config.cwd,
      stdio: ['pipe', 'pipe', 'inherit']
    });

    // Create transport
    this.transport = new StdioTransport({
      input: this.serverProcess.stdout,
      output: this.serverProcess.stdin
    });

    // Create client
    this.client = new LSPClient({
      name: 'test-client',
      version: '1.0.0',
      capabilities: this.config.capabilities ?? {}
    });

    // Connect and initialize
    const result = await this.client.connect(this.transport);

    return result;
  }

  /**
   * Stop the client and kill the server
   */
  async stop(): Promise<void> {
    if (this.client) {
      try {
        await this.client.disconnect();
      } catch (error) {
        // Ignore disconnect errors
      }
      this.client = undefined;
    }

    if (this.serverProcess) {
      this.serverProcess.kill();
      this.serverProcess = undefined;
    }

    this.transport = undefined;
  }

  /**
   * Get the client instance
   */
  getClient(): LSPClient {
    if (!this.client) {
      throw new Error('Client not started. Call start() first.');
    }
    return this.client;
  }

  /**
   * Helper: Open a text document
   */
  async openDocument(uri: string, languageId: string, text: string): Promise<void> {
    await this.getClient().textDocument.didOpen({
      textDocument: {
        uri,
        languageId,
        version: 1,
        text
      }
    });
  }

  /**
   * Helper: Close a text document
   */
  async closeDocument(uri: string): Promise<void> {
    await this.getClient().textDocument.didClose({
      textDocument: { uri }
    });
  }

  /**
   * Helper: Send hover request
   */
  async hover(uri: string, line: number, character: number) {
    return this.getClient().textDocument.hover({
      textDocument: { uri },
      position: { line, character }
    });
  }

  /**
   * Helper: Send completion request
   */
  async completion(uri: string, line: number, character: number) {
    return this.getClient().textDocument.completion({
      textDocument: { uri },
      position: { line, character }
    });
  }

  /**
   * Helper: Send definition request
   */
  async definition(uri: string, line: number, character: number) {
    return this.getClient().textDocument.definition({
      textDocument: { uri },
      position: { line, character }
    });
  }

  /**
   * Helper: Send references request
   */
  async references(
    uri: string,
    line: number,
    character: number,
    includeDeclaration: boolean = false
  ) {
    return this.getClient().textDocument.references({
      textDocument: { uri },
      position: { line, character },
      context: { includeDeclaration }
    });
  }

  /**
   * Helper: Send document symbol request
   */
  async documentSymbol(uri: string) {
    return this.getClient().textDocument.documentSymbol({
      textDocument: { uri }
    });
  }
}

/**
 * Example usage:
 *
 * ```typescript
 * const harness = new TestClientHarness({
 *   command: 'npx',
 *   args: ['typescript-language-server', '--stdio']
 * });
 *
 * await harness.start();
 * await harness.openDocument('file:///test.ts', 'typescript', 'const x = 1;');
 * const hover = await harness.hover('file:///test.ts', 0, 6);
 * await harness.closeDocument('file:///test.ts');
 * await harness.stop();
 * ```
 */
