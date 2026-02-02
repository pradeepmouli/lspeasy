/**
 * Unit tests for LSPServer constructor and setCapabilities
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LSPServer } from '@lspeasy/server';
import { ConsoleLogger, LogLevel } from '@lspeasy/core';

describe('LSPServer', () => {
  describe('constructor', () => {
    it('should create server with default options', () => {
      const server = new LSPServer();
      expect(server).toBeDefined();
      expect(server.getCapabilities()).toEqual({});
    });

    it('should create server with custom options', () => {
      const logger = new ConsoleLogger(LogLevel.Debug);
      const server = new LSPServer({
        name: 'test-server',
        version: '2.0.0',
        logger,
        logLevel: 'debug'
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
  });

  describe('setCapabilities', () => {
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

      server.setCapabilities(capabilities);
      expect(server.getCapabilities()).toEqual(capabilities);
    });

    it('should override previous capabilities', () => {
      server.setCapabilities({ hoverProvider: true });
      server.setCapabilities({ completionProvider: {} });

      expect(server.getCapabilities()).toEqual({
        completionProvider: {}
      });
    });

    it('should accept empty capabilities', () => {
      server.setCapabilities({});
      expect(server.getCapabilities()).toEqual({});
    });

    it('should accept partial capabilities', () => {
      const capabilities = {
        textDocumentSync: 1,
        hoverProvider: true
      };

      server.setCapabilities(capabilities);
      const result = server.getCapabilities();

      expect(result.textDocumentSync).toBe(1);
      expect(result.hoverProvider).toBe(true);
    });
  });

  describe('handler registration', () => {
    let server: LSPServer;

    beforeEach(() => {
      server = new LSPServer();
    });

    it('should support chaining onRequest', () => {
      const result = server
        .onRequest('textDocument/hover', async () => null)
        .onRequest('textDocument/completion', async () => ({ items: [] }));

      expect(result).toBe(server);
    });

    it('should support chaining onNotification', () => {
      const result = server
        .onNotification('textDocument/didOpen', () => {})
        .onNotification('textDocument/didChange', () => {});

      expect(result).toBe(server);
    });

    it('should support mixed chaining', () => {
      const result = server
        .onRequest('textDocument/hover', async () => null)
        .onNotification('textDocument/didOpen', () => {})
        .onRequest('textDocument/completion', async () => ({ items: [] }));

      expect(result).toBe(server);
    });
  });
});
