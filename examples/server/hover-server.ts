/**
 * Hover + Completion Server Example
 * Demonstrates multiple handlers and text document sync
 */

import { LSPServer, StdioTransport, ConsoleLogger } from '@lspy/server';
import type {
  HoverParams,
  Hover,
  CompletionParams,
  CompletionList,
  DidOpenTextDocumentParams,
  DidChangeTextDocumentParams
} from '@lspy/server';
import { LogLevel } from '@lspy/core';

// Create server with logging
const server = new LSPServer({
  name: 'hover-completion-server',
  version: '1.0.0',
  logger: new ConsoleLogger(LogLevel.Info)
});

// Set capabilities
server.setCapabilities({
  textDocumentSync: 1, // Full sync
  hoverProvider: true,
  completionProvider: {
    triggerCharacters: ['.', ':']
  }
});

// Track open documents
const documents = new Map<string, string>();

// Text document lifecycle handlers
server
  .onNotification<'textDocument/didOpen', DidOpenTextDocumentParams>(
    'textDocument/didOpen',
    (params) => {
      documents.set(params.textDocument.uri, params.textDocument.text);
    }
  )
  .onNotification<'textDocument/didChange', DidChangeTextDocumentParams>(
    'textDocument/didChange',
    (params) => {
      // For full sync, replace entire document
      if (params.contentChanges.length > 0) {
        const change = params.contentChanges[0];
        if ('text' in change) {
          documents.set(params.textDocument.uri, change.text);
        }
      }
    }
  )
  .onNotification('textDocument/didClose', (params: any) => {
    documents.delete(params.textDocument.uri);
  });

// Hover handler
server.onRequest<'textDocument/hover', HoverParams, Hover | null>(
  'textDocument/hover',
  async (params, token) => {
    if (token.isCancellationRequested) {
      return null;
    }

    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
      return null;
    }

    return {
      contents: {
        kind: 'markdown',
        value: [
          '# Hover Information',
          '',
          `**Document**: ${params.textDocument.uri}`,
          `**Position**: Line ${params.position.line}, Character ${params.position.character}`,
          '',
          'This is sample hover content from the LSP server.'
        ].join('\n')
      },
      range: {
        start: params.position,
        end: { line: params.position.line, character: params.position.character + 1 }
      }
    };
  }
);

// Completion handler
server.onRequest<'textDocument/completion', CompletionParams, CompletionList>(
  'textDocument/completion',
  async (params, token) => {
    if (token.isCancellationRequested) {
      return { isIncomplete: false, items: [] };
    }

    const doc = documents.get(params.textDocument.uri);
    if (!doc) {
      return { isIncomplete: false, items: [] };
    }

    // Return sample completions
    return {
      isIncomplete: false,
      items: [
        {
          label: 'function',
          kind: 3, // Function
          detail: 'Function keyword',
          documentation: 'Declares a function',
          insertText: 'function ${1:name}() {\n  $0\n}'
        },
        {
          label: 'const',
          kind: 6, // Variable
          detail: 'Const keyword',
          documentation: 'Declares a constant',
          insertText: 'const ${1:name} = $0'
        },
        {
          label: 'class',
          kind: 7, // Class
          detail: 'Class keyword',
          documentation: 'Declares a class',
          insertText: 'class ${1:ClassName} {\n  $0\n}'
        }
      ]
    };
  }
);

// Start server
const transport = new StdioTransport();
await server.listen(transport);

console.error('Hover + Completion server started');
