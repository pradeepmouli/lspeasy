/**
 * Quick test to verify enum exports work correctly
 */

import { describe, it, expect } from 'vitest';
import {
  CompletionItemKind,
  SymbolKind,
  DiagnosticSeverity,
  TextDocumentSyncKind,
  InsertTextFormat,
  MessageType,
  FileChangeType,
  DocumentHighlightKind,
  CompletionItemTag,
  SymbolTag,
  DiagnosticTag,
  TextDocumentSaveReason,
  CodeActionKind,
  FoldingRangeKind
} from '@lspeasy/core';

describe('LSP Kind Enums', () => {
  describe('CompletionItemKind', () => {
    it('should have correct numeric values', () => {
      expect(CompletionItemKind.Text).toBe(1);
      expect(CompletionItemKind.Method).toBe(2);
      expect(CompletionItemKind.Function).toBe(3);
      expect(CompletionItemKind.Class).toBe(7);
      expect(CompletionItemKind.Variable).toBe(6);
    });

    it('should support reverse lookup', () => {
      expect(CompletionItemKind[1]).toBe('Text');
      expect(CompletionItemKind[2]).toBe('Method');
      expect(CompletionItemKind[7]).toBe('Class');
    });
  });

  describe('SymbolKind', () => {
    it('should have correct numeric values', () => {
      expect(SymbolKind.File).toBe(1);
      expect(SymbolKind.Class).toBe(5);
      expect(SymbolKind.Method).toBe(6);
      expect(SymbolKind.Function).toBe(12);
      expect(SymbolKind.Variable).toBe(13);
    });

    it('should support reverse lookup', () => {
      expect(SymbolKind[5]).toBe('Class');
      expect(SymbolKind[12]).toBe('Function');
    });
  });

  describe('DiagnosticSeverity', () => {
    it('should have correct numeric values', () => {
      expect(DiagnosticSeverity.Error).toBe(1);
      expect(DiagnosticSeverity.Warning).toBe(2);
      expect(DiagnosticSeverity.Information).toBe(3);
      expect(DiagnosticSeverity.Hint).toBe(4);
    });
  });

  describe('TextDocumentSyncKind', () => {
    it('should have correct numeric values', () => {
      expect(TextDocumentSyncKind.None).toBe(0);
      expect(TextDocumentSyncKind.Full).toBe(1);
      expect(TextDocumentSyncKind.Incremental).toBe(2);
    });
  });

  describe('InsertTextFormat', () => {
    it('should have correct numeric values', () => {
      expect(InsertTextFormat.PlainText).toBe(1);
      expect(InsertTextFormat.Snippet).toBe(2);
    });
  });

  describe('MessageType', () => {
    it('should have correct numeric values', () => {
      expect(MessageType.Error).toBe(1);
      expect(MessageType.Warning).toBe(2);
      expect(MessageType.Info).toBe(3);
      expect(MessageType.Log).toBe(4);
    });
  });

  describe('FileChangeType', () => {
    it('should have correct numeric values', () => {
      expect(FileChangeType.Created).toBe(1);
      expect(FileChangeType.Changed).toBe(2);
      expect(FileChangeType.Deleted).toBe(3);
    });
  });

  describe('DocumentHighlightKind', () => {
    it('should have correct numeric values', () => {
      expect(DocumentHighlightKind.Text).toBe(1);
      expect(DocumentHighlightKind.Read).toBe(2);
      expect(DocumentHighlightKind.Write).toBe(3);
    });
  });

  describe('Tags', () => {
    it('should have correct numeric values for CompletionItemTag', () => {
      expect(CompletionItemTag.Deprecated).toBe(1);
    });

    it('should have correct numeric values for SymbolTag', () => {
      expect(SymbolTag.Deprecated).toBe(1);
    });

    it('should have correct numeric values for DiagnosticTag', () => {
      expect(DiagnosticTag.Unnecessary).toBe(1);
      expect(DiagnosticTag.Deprecated).toBe(2);
    });
  });

  describe('TextDocumentSaveReason', () => {
    it('should have correct numeric values', () => {
      expect(TextDocumentSaveReason.Manual).toBe(1);
      expect(TextDocumentSaveReason.AfterDelay).toBe(2);
      expect(TextDocumentSaveReason.FocusOut).toBe(3);
    });
  });

  describe('CodeActionKind', () => {
    it('should have correct string values', () => {
      expect(CodeActionKind.Empty).toBe('');
      expect(CodeActionKind.QuickFix).toBe('quickfix');
      expect(CodeActionKind.Refactor).toBe('refactor');
      expect(CodeActionKind.RefactorExtract).toBe('refactor.extract');
      expect(CodeActionKind.Source).toBe('source');
      expect(CodeActionKind.SourceOrganizeImports).toBe('source.organizeImports');
    });

    it('should work with code actions', () => {
      const action = {
        title: 'Quick fix',
        kind: CodeActionKind.QuickFix
      };

      expect(action.kind).toBe('quickfix');
    });
  });

  describe('Type compatibility', () => {
    it('should work with completion items', () => {
      const item = {
        label: 'test',
        kind: CompletionItemKind.Function,
        insertText: 'test()',
        insertTextFormat: InsertTextFormat.PlainText
      };

      expect(item.kind).toBe(3);
      expect(item.insertTextFormat).toBe(1);
    });

    it('should work with diagnostics', () => {
      const diagnostic = {
        range: { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } },
        severity: DiagnosticSeverity.Error,
        message: 'Test error'
      };

      expect(diagnostic.severity).toBe(1);
    });

    it('should work with symbols', () => {
      const symbol = {
        name: 'MyClass',
        kind: SymbolKind.Class,
        location: {
          uri: 'file:///test.ts',
          range: { start: { line: 0, character: 0 }, end: { line: 10, character: 0 } }
        }
      };

      expect(symbol.kind).toBe(5);
    });

    it('should work with code actions using enum or custom kinds', () => {
      const action1 = {
        title: 'Quick fix',
        kind: CodeActionKind.QuickFix
      };

      const action2 = {
        title: 'Custom refactor',
        kind: 'refactor.extract.custom' // Custom kind allowed
      };

      expect(action1.kind).toBe('quickfix');
      expect(action2.kind).toBe('refactor.extract.custom');
    });

    it('should work with folding ranges using enum or custom kinds', () => {
      const fold1 = {
        startLine: 0,
        endLine: 10,
        kind: FoldingRangeKind.Comment
      };

      const fold2 = {
        startLine: 0,
        endLine: 10,
        kind: 'custom-fold' // Custom kind allowed
      };

      expect(fold1.kind).toBe('comment');
      expect(fold2.kind).toBe('custom-fold');
    });
  });
});
