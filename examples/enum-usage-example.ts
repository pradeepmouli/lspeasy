/**
 * Example demonstrating enum usage for LSP kind types
 *
 * The SDK now exports enums for all *Kind types, providing:
 * - Type-safe constants
 * - Better IDE autocomplete
 * - Readable code without magic numbers
 */

import {
  CompletionItemKind,
  SymbolKind,
  DiagnosticSeverity,
  TextDocumentSyncKind,
  InsertTextFormat,
  MessageType,
  FileChangeType,
  DocumentHighlightKind,
  CodeActionKind,
  FoldingRangeKind,
  TokenFormat,
  TextDocumentSaveReason,
  type CodeActionClientCapabilities,
  type FoldingRangeClientCapabilities,
  type SemanticTokensClientCapabilities
} from '@lspy/core';

// ============================================================================
// Completion Items
// ============================================================================

const completionItems = [
  {
    label: 'myFunction',
    kind: CompletionItemKind.Function,
    insertText: 'myFunction()',
    insertTextFormat: InsertTextFormat.PlainText
  },
  {
    label: 'MyClass',
    kind: CompletionItemKind.Class,
    insertText: 'MyClass',
    insertTextFormat: InsertTextFormat.PlainText
  },
  {
    label: 'CONSTANT',
    kind: CompletionItemKind.Constant,
    insertText: 'CONSTANT',
    insertTextFormat: InsertTextFormat.PlainText
  },
  {
    label: 'forSnippet',
    kind: CompletionItemKind.Snippet,
    insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t$0\n}',
    insertTextFormat: InsertTextFormat.Snippet
  }
];

console.log('Completion items:', completionItems);

// ============================================================================
// Document Symbols
// ============================================================================

const documentSymbols = [
  {
    name: 'MyClass',
    kind: SymbolKind.Class,
    range: { start: { line: 0, character: 0 }, end: { line: 10, character: 0 } },
    selectionRange: { start: { line: 0, character: 6 }, end: { line: 0, character: 13 } }
  },
  {
    name: 'myMethod',
    kind: SymbolKind.Method,
    range: { start: { line: 2, character: 2 }, end: { line: 5, character: 3 } },
    selectionRange: { start: { line: 2, character: 2 }, end: { line: 2, character: 10 } }
  },
  {
    name: 'myProperty',
    kind: SymbolKind.Property,
    range: { start: { line: 7, character: 2 }, end: { line: 7, character: 20 } },
    selectionRange: { start: { line: 7, character: 2 }, end: { line: 7, character: 12 } }
  }
];

console.log('Document symbols:', documentSymbols);

// ============================================================================
// Diagnostics
// ============================================================================

const diagnostics = [
  {
    range: { start: { line: 5, character: 10 }, end: { line: 5, character: 15 } },
    severity: DiagnosticSeverity.Error,
    message: 'Undefined variable'
  },
  {
    range: { start: { line: 10, character: 0 }, end: { line: 10, character: 20 } },
    severity: DiagnosticSeverity.Warning,
    message: 'Unused variable'
  },
  {
    range: { start: { line: 15, character: 5 }, end: { line: 15, character: 10 } },
    severity: DiagnosticSeverity.Information,
    message: 'Consider using const'
  },
  {
    range: { start: { line: 20, character: 0 }, end: { line: 20, character: 10 } },
    severity: DiagnosticSeverity.Hint,
    message: 'This can be simplified'
  }
];

console.log('Diagnostics:', diagnostics);

// ============================================================================
// Server Configuration
// ============================================================================

const serverCapabilities = {
  textDocumentSync: TextDocumentSyncKind.Incremental,
  completionProvider: {
    resolveProvider: true,
    triggerCharacters: ['.', ':']
  },
  hoverProvider: true,
  definitionProvider: true
};

console.log('Server capabilities:', serverCapabilities);

// ============================================================================
// File Watching
// ============================================================================

const fileEvents = [
  { uri: 'file:///path/to/file1.ts', type: FileChangeType.Created },
  { uri: 'file:///path/to/file2.ts', type: FileChangeType.Changed },
  { uri: 'file:///path/to/file3.ts', type: FileChangeType.Deleted }
];

console.log('File events:', fileEvents);

// ============================================================================
// Window Messages
// ============================================================================

function showMessage(message: string, type: MessageType) {
  console.log(`[${MessageType[type]}] ${message}`);
}

showMessage('Build completed successfully', MessageType.Info);
showMessage('Deprecated API usage detected', MessageType.Warning);
showMessage('Build failed', MessageType.Error);
showMessage('Debug: Processing file', MessageType.Log);

// ============================================================================
// Code Actions
// ============================================================================

const codeActions = [
  {
    title: 'Quick fix: Add missing import',
    kind: CodeActionKind.QuickFix
  },
  {
    title: 'Refactor: Extract to function',
    kind: CodeActionKind.RefactorExtract
  },
  {
    title: 'Source action: Organize imports',
    kind: CodeActionKind.SourceOrganizeImports
  },
  {
    title: 'Source action: Fix all',
    kind: CodeActionKind.SourceFixAll
  }
];

console.log('Code actions:', codeActions);

// ============================================================================
// Text Document Save
// ============================================================================

function handleWillSaveTextDocument(reason: TextDocumentSaveReason) {
  switch (reason) {
    case TextDocumentSaveReason.Manual:
      console.log('Document saved manually');
      break;
    case TextDocumentSaveReason.AfterDelay:
      console.log('Document auto-saved after delay');
      break;
    case TextDocumentSaveReason.FocusOut:
      console.log('Document saved on focus out');
      break;
  }
}

handleWillSaveTextDocument(TextDocumentSaveReason.Manual);

// ============================================================================
// Document Highlights
// ============================================================================

const highlights = [
  {
    range: { start: { line: 5, character: 10 }, end: { line: 5, character: 15 } },
    kind: DocumentHighlightKind.Text
  },
  {
    range: { start: { line: 8, character: 5 }, end: { line: 8, character: 10 } },
    kind: DocumentHighlightKind.Read
  },
  {
    range: { start: { line: 12, character: 0 }, end: { line: 12, character: 5 } },
    kind: DocumentHighlightKind.Write
  }
];

console.log('Document highlights:', highlights);

// ============================================================================
// Code Actions with Extensible Kinds
// ============================================================================

// Use predefined enum values
const quickFixAction = {
  title: 'Add missing semicolon',
  kind: CodeActionKind.QuickFix
};

// Or custom string values (LSP spec allows this)
const customRefactorAction = {
  title: 'Extract to custom helper',
  kind: 'refactor.extract.helper' // Custom kind - still type-safe!
};

console.log('Code actions:', [quickFixAction, customRefactorAction]);

// ============================================================================
// Folding Ranges with Extensible Kinds
// ============================================================================

// Use predefined enum values
const commentFold = {
  startLine: 0,
  endLine: 10,
  kind: FoldingRangeKind.Comment
};

const importsFold = {
  startLine: 0,
  endLine: 5,
  kind: FoldingRangeKind.Imports
};

// Or custom string values for language-specific folds
const customFold = {
  startLine: 20,
  endLine: 50,
  kind: 'jsx-fragment' // Custom kind - fully supported!
};

console.log('Folding ranges:', [commentFold, importsFold, customFold]);

// ============================================================================
// Client Capabilities with Enum Support
// ============================================================================

// Declare supported code action kinds with enum autocomplete
const codeActionCapabilities: CodeActionClientCapabilities = {
  codeActionLiteralSupport: {
    codeActionKind: {
      valueSet: [
        CodeActionKind.QuickFix,
        CodeActionKind.Refactor,
        CodeActionKind.Source,
        'custom.myExtension.action' // Custom kinds also supported
      ]
    }
  }
};

// Declare supported folding range kinds with enum autocomplete
const foldingRangeCapabilities: FoldingRangeClientCapabilities = {
  foldingRangeKind: {
    valueSet: [
      FoldingRangeKind.Comment,
      FoldingRangeKind.Imports,
      FoldingRangeKind.Region,
      'jsx-fragment' // Custom kinds for language-specific features
    ]
  }
};

// Declare semantic token formats with enum autocomplete
const semanticTokensCapabilities: SemanticTokensClientCapabilities = {
  requests: {
    full: true,
    range: true
  },
  tokenTypes: ['keyword', 'string', 'number'],
  tokenModifiers: ['declaration', 'readonly'],
  formats: [
    TokenFormat.Relative // Standard format
    // Custom formats could be added if spec extends in future
  ]
};

console.log('Capabilities:', {
  codeActionCapabilities,
  foldingRangeCapabilities,
  semanticTokensCapabilities
});

// ============================================================================
// Benefits of Using Enums
// ============================================================================

/**
 * Using enums provides several advantages:
 *
 * 1. **Type Safety**: TypeScript ensures you use valid values
 * 2. **IDE Support**: Autocomplete shows all available options
 * 3. **Readability**: `CompletionItemKind.Function` is clearer than `2`
 * 4. **Refactoring**: Easier to find and update usages
 * 5. **Reverse Lookup**: Can get name from value (e.g., MessageType[1] = 'Error')
 * 6. **Documentation**: Hover over enum member shows the numeric value
 * 7. **Extensibility**: LiteralUnion allows custom kinds alongside enum values
 * 8. **Capabilities**: Enhanced client capability types provide enum autocomplete
 */
