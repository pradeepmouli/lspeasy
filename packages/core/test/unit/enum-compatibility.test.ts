/**
 * Test to verify our enums are compatible with protocol types without OverrideProperties
 */

import { describe, it, expect } from 'vitest';
import type {
  CompletionItem,
  Diagnostic,
  SymbolInformation,
  DocumentHighlight
} from 'vscode-languageserver-protocol';
import type {
  CodeActionClientCapabilities,
  CodeActionOptions,
  FoldingRangeClientCapabilities,
  SemanticTokensClientCapabilities
} from '../../src/protocol/types.js';
import {
  CompletionItemKind,
  DiagnosticSeverity,
  SymbolKind,
  DocumentHighlightKind,
  InsertTextFormat,
  CodeActionKind,
  FoldingRangeKind,
  TokenFormat
} from '../../src/protocol/enums.js';

describe('Enum Compatibility with Protocol Types', () => {
  it('should allow enum values in CompletionItem', () => {
    const item: CompletionItem = {
      label: 'test',
      kind: CompletionItemKind.Function, // enum → number literal union
      insertTextFormat: InsertTextFormat.Snippet
    };

    expect(item.kind).toBe(3);
    expect(item.insertTextFormat).toBe(2);
  });

  it('should allow enum values in Diagnostic', () => {
    const diagnostic: Diagnostic = {
      range: {
        start: { line: 0, character: 0 },
        end: { line: 0, character: 5 }
      },
      severity: DiagnosticSeverity.Error, // enum → number literal union
      message: 'Test error'
    };

    expect(diagnostic.severity).toBe(1);
  });

  it('should allow enum values in SymbolInformation', () => {
    const symbol: SymbolInformation = {
      name: 'MyClass',
      kind: SymbolKind.Class, // enum → number literal union
      location: {
        uri: 'file:///test.ts',
        range: {
          start: { line: 0, character: 0 },
          end: { line: 10, character: 0 }
        }
      }
    };

    expect(symbol.kind).toBe(5);
  });

  it('should allow enum values in DocumentHighlight', () => {
    const highlight: DocumentHighlight = {
      range: {
        start: { line: 5, character: 10 },
        end: { line: 5, character: 15 }
      },
      kind: DocumentHighlightKind.Write // enum → number literal union
    };

    expect(highlight.kind).toBe(3);
  });

  it('should allow enum and custom values in CodeActionClientCapabilities', () => {
    const capabilities: CodeActionClientCapabilities = {
      codeActionLiteralSupport: {
        codeActionKind: {
          valueSet: [
            CodeActionKind.QuickFix, // enum value
            CodeActionKind.Refactor,
            'custom.action.kind' // custom string
          ]
        }
      }
    };

    expect(capabilities.codeActionLiteralSupport?.codeActionKind.valueSet).toHaveLength(3);
    expect(capabilities.codeActionLiteralSupport?.codeActionKind.valueSet[0]).toBe('quickfix');
  });

  it('should allow enum and custom values in CodeActionOptions', () => {
    const options: CodeActionOptions = {
      codeActionKinds: [
        CodeActionKind.QuickFix, // enum value
        CodeActionKind.Refactor,
        CodeActionKind.Source,
        'myextension.custom.action' // custom string
      ]
    };

    expect(options.codeActionKinds).toHaveLength(4);
    expect(options.codeActionKinds?.[0]).toBe('quickfix');
  });

  it('should allow enum and custom values in FoldingRangeClientCapabilities', () => {
    const capabilities: FoldingRangeClientCapabilities = {
      foldingRangeKind: {
        valueSet: [
          FoldingRangeKind.Comment, // enum value
          FoldingRangeKind.Imports,
          'jsx-fragment' // custom string
        ]
      }
    };

    expect(capabilities.foldingRangeKind?.valueSet).toHaveLength(3);
    expect(capabilities.foldingRangeKind?.valueSet?.[0]).toBe('comment');
  });

  it('should allow enum and custom values in SemanticTokensClientCapabilities', () => {
    const capabilities: SemanticTokensClientCapabilities = {
      requests: {
        full: true
      },
      tokenTypes: ['keyword', 'string'],
      tokenModifiers: ['declaration'],
      formats: [TokenFormat.Relative] // enum value
    };

    expect(capabilities.formats).toHaveLength(1);
    expect(capabilities.formats[0]).toBe('relative');
  });
});
