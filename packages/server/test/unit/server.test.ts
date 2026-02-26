/**
 * Unit tests for LSPServer constructor and registerCapabilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LSPServer } from '../../src/server.js';
import { ConsoleLogger, LogLevel } from '@lspeasy/core';
import type { TextDocumentSyncKind } from '@lspeasy/core';

describe('LSPServer', () => {
  describe('constructor', () => {
    it('should create server with default options', () => {
      const server = new LSPServer();
      expect(server).toBeDefined();
      expect(server.getServerCapabilities()).toEqual({});
    });

    it('should create server with custom options', () => {
      const logger = new ConsoleLogger(LogLevel.Debug);
      const server = new LSPServer({
        name: 'test-server',
        version: '2.0.0',
        logger,
        logLevel: LogLevel.Debug
      });

      expect(server).toBeDefined();
    });

    it('should accept custom validation error handler', () => {
      const onValidationError = () => ({
        code: -32602,
        message: 'Custom validation error'
      });

      const server = new LSPServer({
        onValidationError
      });

      expect(server).toBeDefined();
    });

    it('should accept request timeout and validation toggle', () => {
      const server = new LSPServer({
        requestTimeout: 5000,
        validateParams: false
      });

      expect(server).toBeDefined();
    });
  });

  describe('registerCapabilities', () => {
    let server: LSPServer;

    beforeEach(() => {
      server = new LSPServer();
    });

    it('should set server capabilities', () => {
      const capabilities = {
        hoverProvider: true,
        completionProvider: {
          triggerCharacters: ['.']
        }
      };

      server.registerCapabilities(capabilities);
      expect(server.getServerCapabilities()).toEqual(capabilities);
    });

    it('should override previous capabilities', () => {
      server.registerCapabilities({ hoverProvider: true });
      server.registerCapabilities({ completionProvider: {} });

      expect(server.getServerCapabilities()).toEqual({
        completionProvider: {}
      });
    });

    it('should accept empty capabilities', () => {
      server.registerCapabilities({});
      expect(server.getServerCapabilities()).toEqual({});
    });

    it('should accept partial capabilities', () => {
      const fullSync = 1 as TextDocumentSyncKind;
      const capabilities = {
        textDocumentSync: fullSync,
        hoverProvider: true
      };

      server.registerCapabilities(capabilities);
      const result = server.getServerCapabilities();

      expect(result.textDocumentSync).toBe(fullSync);
      expect(result.hoverProvider).toBe(true);
    });
  });

  describe('handler registration', () => {
    let server: LSPServer;

    beforeEach(() => {
      server = new LSPServer();
    });

    it('should return disposable for request handlers', () => {
      const disposable = server.onRequest('textDocument/hover', async () => null);
      expect(disposable.dispose).toBeDefined();
    });

    it('should return disposable for notification handlers', () => {
      const disposable = server.onNotification('textDocument/didOpen', () => {});
      expect(disposable.dispose).toBeDefined();
    });

    it('should register multiple handlers independently', () => {
      const first = server.onRequest('textDocument/hover', async () => null);
      const second = server.onNotification('textDocument/didOpen', () => {});

      expect(first.dispose).toBeDefined();
      expect(second.dispose).toBeDefined();
    });
  });
});
