/**
 * Demo file to test intellisense for dynamic typing
 *
 * IMPORTANT: The dynamic methods appear at the TYPE level for intellisense,
 * but are only injected at RUNTIME after initialization.
 *
 * Open this file in VS Code and:
 * 1. Type `client1.` to see namespaces
 * 2. Type `client1.textDocument.` to see available methods
 * 3. Hover over method names to see their signatures
 */

import { LSPClient } from './packages/client/src/client.js';
import { LSPServer } from './packages/server/src/server.js';
import type { ClientCapabilities, ServerCapabilities } from './packages/core/src/index.js';

// ========================================
// INTELLISENSE TEST 1: Default Client
// ========================================
const client1 = new LSPClient();

// Try typing: client1.
//
// You should see in intellisense:
// - callHierarchy
// - client
// - codeAction
// - codeLens
// - completionItem
// - documentLink
// - inlayHint
// - lifecycle
// - textDocument ⭐
// - typeHierarchy
// - window
// - workspace
// - workspaceSymbol
// ... and more

// Now try typing: client1.textDocument.
//
// You should see methods like:
// - codeAction(params)
// - codeLens(params)
// - colorPresentation(params)
// - completion(params) ⭐
// - declaration(params)
// - definition(params) ⭐
// - diagnostic(params)
// - documentColor(params)
// - documentHighlight(params)
// - documentLink(params)
// - documentSymbol(params)
// - foldingRange(params)
// - formatting(params)
// - hover(params) ⭐
// - implementation(params)
// - inlayHint(params)
// - inlineValue(params)
// - linkedEditingRange(params)
// - moniker(params)
// - onTypeFormatting(params)
// - prepareCallHierarchy(params)
// - prepareRename(params)
// - prepareTypeHierarchy(params)
// - rangeFormatting(params)
// - references(params) ⭐
// - rename(params)
// - selectionRange(params)
// - semanticTokensFull(params)
// - semanticTokensFullDelta(params)
// - semanticTokensRange(params)
// - signatureHelp(params)
// - typeDefinition(params)
// - willSave(params)
// - willSaveWaitUntil(params)

// ========================================
// INTELLISENSE TEST 2: Limited Client
// ========================================
type LimitedServerCaps = {
  hoverProvider: true;
  completionProvider: { triggerCharacters: ['.'] };
  // Note: definitionProvider is NOT included
};

const client2 = new LSPClient<ClientCapabilities, LimitedServerCaps>();

// Try typing: client2.textDocument.
//
// Now you should see ONLY:
// - hover(params) ⭐ (included because hoverProvider is true)
// - completion(params) ⭐ (included because completionProvider exists)
//
// Methods like definition, references, etc. should NOT appear
// because they're not in LimitedServerCaps

// ========================================
// INTELLISENSE TEST 3: Default Server
// ========================================
const server1 = new LSPServer();
server1.setCapabilities({
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] }
});

// Try typing: server1.textDocument.
//
// You should see HANDLER registration methods:
// - onCodeAction(handler)
// - onCodeLens(handler)
// - onCompletion(handler) ⭐
// - onDeclaration(handler)
// - onDefinition(handler) ⭐
// - onHover(handler) ⭐
// - onReferences(handler) ⭐
// ... etc.

// ========================================
// INTELLISENSE TEST 4: Limited Server
// ========================================
type LimitedCaps = {
  hoverProvider: true;
  completionProvider: { triggerCharacters: ['.'] };
};

const server2 = new LSPServer<LimitedCaps>();
server2.setCapabilities({
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] }
});

// Try typing: server2.textDocument.
//
// Now you should see ONLY:
// - onHover(handler) ⭐
// - onCompletion(handler) ⭐
//
// Methods like onDefinition, onReferences should NOT appear

// ========================================
// TRY IT OUT:
// ========================================
// Uncomment the lines below and see the intellisense:

// client1.textDocument.
// client2.textDocument.
// server1.textDocument.
// server2.textDocument.

export { client1, client2, server1, server2 };
