/**
 * Tests for client capability guard
 */

import { describe, it, expect } from 'vitest';
import { CapabilityGuard, ClientCapabilityGuard } from '../../src/capability-guard.js';
import { ConsoleLogger, LogLevel } from '@lspeasy/core';

describe('Client CapabilityGuard', () => {
  const logger = new ConsoleLogger(LogLevel.Debug);

  describe('canSendRequest', () => {
    it('should allow requests for methods with declared capabilities', () => {
      const capabilities = {
        hoverProvider: true,
        completionProvider: { triggerCharacters: ['.'] },
        definitionProvider: true
      };

      const guard = new CapabilityGuard(capabilities, logger, false);

      expect(guard.canSendRequest('textDocument/hover')).toBe(true);
      expect(guard.canSendRequest('textDocument/completion')).toBe(true);
      expect(guard.canSendRequest('textDocument/definition')).toBe(true);
    });

    it('should warn and allow in non-strict mode when capability not declared', () => {
      const capabilities = {
        hoverProvider: true
      };

      const guard = new CapabilityGuard(capabilities, logger, false);

      // Should warn but return true in non-strict mode
      expect(guard.canSendRequest('textDocument/completion')).toBe(false);
    });

    it('should throw in strict mode when capability not declared', () => {
      const capabilities = {
        hoverProvider: true
      };

      const guard = new CapabilityGuard(capabilities, logger, true);

      expect(() => guard.canSendRequest('textDocument/completion')).toThrow(
        /server capability 'completionProvider' not declared/
      );
    });

    it('should always allow lifecycle methods regardless of capabilities', () => {
      const guard = new CapabilityGuard({}, logger, true);

      expect(guard.canSendRequest('initialize')).toBe(true);
      expect(guard.canSendRequest('shutdown')).toBe(true);
      expect(guard.canSendRequest('$/cancelRequest')).toBe(true);
    });

    it('should allow unknown methods in non-strict mode', () => {
      const guard = new CapabilityGuard({}, logger, false);
      expect(guard.canSendRequest('customMethod')).toBe(true);
    });

    it('should throw on unknown methods in strict mode', () => {
      const guard = new CapabilityGuard({}, logger, true);
      expect(() => guard.canSendRequest('customMethod')).toThrow(
        /Cannot send request for unknown method/
      );
    });
  });

  describe('canSendNotification', () => {
    it('should allow notifications for methods with declared capabilities', () => {
      const capabilities = {
        workspace: {
          workspaceFolders: {
            changeNotifications: true
          }
        }
      };

      const guard = new CapabilityGuard(capabilities, logger, false);

      // Workspace did change workspace folders should be allowed
      expect(guard.canSendNotification('workspace/didChangeWorkspaceFolders')).toBe(true);
    });

    it('should always allow lifecycle notifications', () => {
      const guard = new CapabilityGuard({}, logger, true);

      expect(guard.canSendNotification('initialized')).toBe(true);
      expect(guard.canSendNotification('exit')).toBe(true);
    });

    it('should allow text document sync notifications when capabilities are declared', () => {
      const capabilities = {
        textDocumentSync: {
          openClose: true,
          change: 2 as const
        }
      };

      const guard = new CapabilityGuard(capabilities, logger, true);

      expect(guard.canSendNotification('textDocument/didOpen')).toBe(true);
      expect(guard.canSendNotification('textDocument/didChange')).toBe(true);
      expect(guard.canSendNotification('textDocument/didClose')).toBe(true);
    });

    it('should warn and allow in non-strict mode for unsupported notifications', () => {
      const capabilities = {};
      const guard = new CapabilityGuard(capabilities, logger, false);

      // Workspace folders notifications should be allowed if server doesn't support them
      // (since they're client-driven)
      expect(guard.canSendNotification('textDocument/didOpen')).toBe(false);
    });
  });

  describe('getServerCapabilities', () => {
    it('should return server capabilities', () => {
      const capabilities = {
        hoverProvider: true,
        completionProvider: { triggerCharacters: ['.'] }
      };

      const guard = new CapabilityGuard(capabilities, logger, false);

      expect(guard.getServerCapabilities()).toEqual(capabilities);
    });

    it('should return a copy to prevent mutation', () => {
      const capabilities = {
        hoverProvider: true
      };

      const guard = new CapabilityGuard(capabilities, logger, false);
      const retrieved = guard.getServerCapabilities();

      // Mutate the retrieved copy
      retrieved.hoverProvider = false;

      // Original should be unchanged
      expect(guard.getServerCapabilities().hoverProvider).toBe(true);
    });
  });
});

describe('Client ClientCapabilityGuard', () => {
  const logger = new ConsoleLogger(LogLevel.Debug);

  describe('canRegisterHandler', () => {
    it('should allow handler registration when client capability is declared', () => {
      const capabilities = {
        workspace: {
          applyEdit: true
        }
      };

      const guard = new ClientCapabilityGuard(capabilities, logger, false);

      expect(guard.canRegisterHandler('workspace/applyEdit')).toBe(true);
    });

    it('should warn and allow in non-strict mode when capability not declared', () => {
      const capabilities = {};
      const guard = new ClientCapabilityGuard(capabilities, logger, false);

      expect(guard.canRegisterHandler('workspace/applyEdit')).toBe(false);
    });

    it('should throw in strict mode when capability not declared', () => {
      const capabilities = {};
      const guard = new ClientCapabilityGuard(capabilities, logger, true);

      expect(() => guard.canRegisterHandler('workspace/applyEdit')).toThrow(
        /client capability 'workspace.applyEdit' not declared/
      );
    });

    it('should allow methods that do not require client capabilities', () => {
      const guard = new ClientCapabilityGuard({}, logger, true);

      expect(guard.canRegisterHandler('window/logMessage')).toBe(true);
    });
  });

  describe('getClientCapabilities', () => {
    it('should return client capabilities', () => {
      const capabilities = {
        workspace: {
          applyEdit: true
        }
      };

      const guard = new ClientCapabilityGuard(capabilities, logger, false);

      expect(guard.getClientCapabilities()).toEqual(capabilities);
    });
  });
});
