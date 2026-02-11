/**
 * Hover + Completion Server Example
 * Demonstrates multiple handlers and text document sync with type inference
 */

import { LSPServer, StdioTransport, ConsoleLogger } from '@lspeasy/server';
import { LogLevel } from '@lspeasy/core';

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

// Text document lifecycle handlers - types automatically inferred!
server
  .onNotification('textDocument/didOpen', (params) => {
    // params automatically typed as DidOpenTextDocumentParams
    documents.set(params.textDocument.uri, params.textDocument.text);
  })
  .onNotification('textDocument/didChange', (params) => {
    // params automatically typed as DidChangeTextDocumentParams
    // For full sync, replace entire document
    if (params.contentChanges.length > 0) {
      const change = params.contentChanges[0];
      if ('text' in change) {
        documents.set(params.textDocument.uri, change.text);
      }
    }
  })
  .onNotification('textDocument/didClose', (params) => {
    // params automatically typed as DidCloseTextDocumentParams
    documents.delete(params.textDocument.uri);
  });

// Hover handler - types automatically inferred!
server.onRequest('textDocument/hover', async (params, token) => {
  // params automatically typed as HoverParams
  // return type automatically Hover | null
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
});

// Completion handler - types automatically inferred!
server.onRequest('textDocument/completion', async (params, token) => {
  // params automatically typed as CompletionParams
  // return type automatically CompletionList | CompletionItem[] | null
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
});

// Start server
const transport = new StdioTransport();
await server.listen(transport);

console.error('Hover + Completion server started');
