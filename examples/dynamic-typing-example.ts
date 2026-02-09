/**
 * Example demonstrating dynamic typing with LSPClient and LSPServer
 */

import { LSPClient } from '../packages/client/src/client.js';
import { LSPServer } from '../packages/server/src/server.js';
import type { ClientCapabilities, ServerCapabilities } from '../packages/core/src/index.js';

// ===============================================
// CLIENT DYNAMIC TYPING EXAMPLE
// ===============================================

// Define specific server capabilities your client expects
type MyServerCapabilities = {
  hoverProvider: true;
  completionProvider: {
    triggerCharacters: ['.', ':'];
  };
  // Note: definition is NOT included
};

// Create client with typed capabilities
const client = new LSPClient<ClientCapabilities>();

// After connect(), the client will have dynamically typed methods:
// ✅ These methods ARE available (based on MyServerCapabilities):
// client.textDocument.hover(params) -> Returns typed Promise
// client.textDocument.completion(params) -> Returns typed Promise

// ❌ These methods are NOT available (missing from MyServerCapabilities):
// client.textDocument.definition(params) -> Type error at compile time

// ===============================================
// SERVER DYNAMIC TYPING EXAMPLE
// ===============================================

// Define server capabilities you want to implement
type MyImplementedCapabilities = {
  hoverProvider: true;
  completionProvider: {
    triggerCharacters: ['.'];
  };
};

// Create server with typed capabilities
const server = new LSPServer<MyImplementedCapabilities>();

// Set capabilities (this initializes dynamic methods)
server.setCapabilities({
  hoverProvider: true,
  completionProvider: {
    triggerCharacters: ['.']
  }
});

// After setCapabilities(), the server has dynamically typed handler methods:
// ✅ These handler registration methods ARE available:
// server.textDocument.onHover((params) => { ... })
// server.textDocument.onCompletion((params) => { ... })

// ❌ These methods are NOT available (missing from MyImplementedCapabilities):
// server.textDocument.onDefinition((params) => { ... }) -> Type error

// You can also use the traditional onRequest/onNotification methods:
server.onRequest('textDocument/hover', async (params) => {
  // params is automatically typed as HoverParams
  return {
    contents: {
      kind: 'markdown',
      value: `Hover text for ${params.position.line}:${params.position.character}`
    }
  };
});

server.onRequest('textDocument/completion', async (params) => {
  // params is automatically typed as CompletionParams
  return {
    isIncomplete: false,
    items: [
      {
        label: 'example',
        kind: 1 // CompletionItemKind.Text
      }
    ]
  };
});

export { client, server };
