/**
 * Unit tests for JSON-RPC message framing
 */

import { describe, it, expect } from 'vitest';
import {
  parseHeaders,
  parseMessage,
  serializeMessage,
  CONTENT_LENGTH_HEADER,
  CONTENT_TYPE_HEADER,
  DEFAULT_CONTENT_TYPE
} from '../../src/jsonrpc/framing.js';
import type { Message } from '../../src/jsonrpc/messages.js';

describe('JSON-RPC Message Framing', () => {
  describe('parseHeaders', () => {
    it('should parse valid headers', () => {
      const buffer = Buffer.from('Content-Length: 42\r\nContent-Type: application/json\r\n\r\n');
      const result = parseHeaders(buffer);

      expect(result).not.toBeNull();
      expect(result?.headers.get('Content-Length')).toBe('42');
      expect(result?.headers.get('Content-Type')).toBe('application/json');
      // bodyStart should be right after \r\n\r\n
      expect(result?.bodyStart).toBe(54);
    });

    it('should return null for incomplete headers', () => {
      const buffer = Buffer.from('Content-Length: 42');
      const result = parseHeaders(buffer);

      expect(result).toBeNull();
    });

    it('should handle empty headers correctly', () => {
      const buffer = Buffer.from('\r\n');
      const result = parseHeaders(buffer);

      expect(result).not.toBeNull();
      expect(result?.headers.size).toBe(0);
      expect(result?.bodyStart).toBe(2);
    });

    it('should throw error for invalid header line', () => {
      const buffer = Buffer.from('InvalidHeaderWithoutColon\r\n\r\n');

      expect(() => parseHeaders(buffer)).toThrow('Invalid header line');
    });

    it('should trim whitespace from header names and values', () => {
      const buffer = Buffer.from('  Content-Length  :  42  \r\n\r\n');
      const result = parseHeaders(buffer);

      expect(result?.headers.get('Content-Length')).toBe('42');
    });
  });

  describe('parseMessage', () => {
    it('should parse complete JSON-RPC request message', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'textDocument/hover',
        params: { textDocument: { uri: 'file:///test.ts' }, position: { line: 0, character: 0 } }
      };

      const serialized = serializeMessage(message);
      const result = parseMessage(serialized);

      expect(result).not.toBeNull();
      expect(result?.message).toEqual(message);
      expect(result?.bytesRead).toBe(serialized.length);
    });

    it('should parse complete JSON-RPC notification message', () => {
      const message: Message = {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen',
        params: {
          textDocument: { uri: 'file:///test.ts', languageId: 'typescript', version: 1, text: '' }
        }
      };

      const serialized = serializeMessage(message);
      const result = parseMessage(serialized);

      expect(result).not.toBeNull();
      expect(result?.message).toEqual(message);
    });

    it('should parse complete JSON-RPC response message', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        result: { contents: 'hover text' }
      };

      const serialized = serializeMessage(message);
      const result = parseMessage(serialized);

      expect(result).not.toBeNull();
      expect(result?.message).toEqual(message);
    });

    it('should return null for incomplete message (headers only)', () => {
      const buffer = Buffer.from('Content-Length: 100\r\n\r\n{"jsonrpc":"2.0"}');
      const result = parseMessage(buffer);

      expect(result).toBeNull();
    });

    it('should return null for incomplete message (partial body)', () => {
      const buffer = Buffer.from('Content-Length: 50\r\n\r\n{"jsonrpc":"2.0"');
      const result = parseMessage(buffer);

      expect(result).toBeNull();
    });

    it('should throw error for missing Content-Length header', () => {
      const buffer = Buffer.from('Content-Type: application/json\r\n\r\n{}');

      expect(() => parseMessage(buffer)).toThrow('Missing Content-Length header');
    });

    it('should throw error for invalid Content-Length value', () => {
      const buffer = Buffer.from('Content-Length: invalid\r\n\r\n{}');

      expect(() => parseMessage(buffer)).toThrow('Invalid Content-Length');
    });

    it('should throw error for negative Content-Length', () => {
      const buffer = Buffer.from('Content-Length: -1\r\n\r\n{}');

      expect(() => parseMessage(buffer)).toThrow('Invalid Content-Length');
    });

    it('should throw error for invalid JSON body', () => {
      const buffer = Buffer.from('Content-Length: 16\r\n\r\n{invalid json}}}');

      expect(() => parseMessage(buffer)).toThrow('Failed to parse JSON-RPC message');
    });

    it('should handle multiple messages in buffer', () => {
      const message1: Message = { jsonrpc: '2.0', id: 1, method: 'test1' };
      const message2: Message = { jsonrpc: '2.0', id: 2, method: 'test2' };

      const serialized1 = serializeMessage(message1);
      const serialized2 = serializeMessage(message2);
      const combined = Buffer.concat([serialized1, serialized2]);

      const result1 = parseMessage(combined);
      expect(result1).not.toBeNull();
      expect(result1?.message).toEqual(message1);

      const remaining = combined.subarray(result1!.bytesRead);
      const result2 = parseMessage(remaining);
      expect(result2).not.toBeNull();
      expect(result2?.message).toEqual(message2);
    });
  });

  describe('serializeMessage', () => {
    it('should serialize message with correct headers', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test'
      };

      const buffer = serializeMessage(message);
      const text = buffer.toString('utf8');

      expect(text).toContain(`${CONTENT_LENGTH_HEADER}:`);
      expect(text).toContain(`${CONTENT_TYPE_HEADER}: ${DEFAULT_CONTENT_TYPE}`);
      expect(text).toContain('\r\n\r\n');
      expect(text).toContain('"jsonrpc":"2.0"');
    });

    it('should include correct Content-Length', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test'
      };

      const buffer = serializeMessage(message);
      const bodyLength = JSON.stringify(message).length;

      const text = buffer.toString('utf8');
      expect(text).toContain(`${CONTENT_LENGTH_HEADER}: ${bodyLength}`);
    });

    it('should serialize request message correctly', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'textDocument/hover',
        params: { uri: 'file:///test.ts' }
      };

      const buffer = serializeMessage(message);
      const result = parseMessage(buffer);

      expect(result?.message).toEqual(message);
    });

    it('should serialize notification message correctly', () => {
      const message: Message = {
        jsonrpc: '2.0',
        method: 'textDocument/didOpen'
      };

      const buffer = serializeMessage(message);
      const result = parseMessage(buffer);

      expect(result?.message).toEqual(message);
    });

    it('should serialize response message correctly', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        result: { value: 42 }
      };

      const buffer = serializeMessage(message);
      const result = parseMessage(buffer);

      expect(result?.message).toEqual(message);
    });

    it('should handle unicode characters in message', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        result: { text: '你好世界 🌍' }
      };

      const buffer = serializeMessage(message);
      const result = parseMessage(buffer);

      expect(result?.message).toEqual(message);
    });

    it('should round-trip serialize and parse', () => {
      const message: Message = {
        jsonrpc: '2.0',
        id: 1,
        method: 'test',
        params: {
          nested: {
            array: [1, 2, 3],
            string: 'value',
            bool: true,
            null: null
          }
        }
      };

      const serialized = serializeMessage(message);
      const parsed = parseMessage(serialized);

      expect(parsed?.message).toEqual(message);
    });
  });
});
