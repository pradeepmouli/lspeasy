/**
 * Example demonstrating dynamic typing with LSPClient and LSPServer
 */

import { LSPClient } from '../packages/client/src/client.js';
import { LSPServer } from '../packages/server/src/server.js';
import type { ClientCapabilities } from '../packages/core/src/index.js';

// ===============================================
// CLIENT DYNAMIC TYPING EXAMPLE
// ===============================================

// Create client parameterized by client capabilities only
const client = new LSPClient<ClientCapabilities>();

// After connect(), use .expect<>() to narrow server capabilities:
// const typed = client.expect<{
//   hoverProvider: true;
//   completionProvider: { triggerCharacters: ['.', ':'] };
// }>();

// ✅ These methods ARE available on `typed`:
// typed.textDocument.hover(params) -> Returns typed Promise
// typed.textDocument.completion(params) -> Returns typed Promise

// ❌ These methods are NOT available (missing from expected ServerCaps):
// typed.textDocument.definition(params) -> Type error at compile time

// ===============================================
// SERVER DYNAMIC TYPING EXAMPLE
// ===============================================

// Create server and register capabilities incrementally
const server = new LSPServer();
const typedServer = server
  .registerCapability('hoverProvider', true)
  .registerCapability('completionProvider', { triggerCharacters: ['.'] });

// After registerCapability(), the server has dynamically typed handler methods:
// typedServer.textDocument.onHover((params) => { ... })
// typedServer.textDocument.onCompletion((params) => { ... })

// Use .expect<>() to type-narrow client capabilities for send methods:
// const withClientCaps = typedServer.expect<ClientCapabilities>();

// You can also use the traditional onRequest/onNotification methods:
server.onRequest('textDocument/hover', async (params: any) => {
  // params is automatically typed as HoverParams
  return {
    contents: `Hover text at ${params.position.line}:${params.position.character}`
  };
});

server.onRequest('textDocument/completion', async (params: any) => {
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
