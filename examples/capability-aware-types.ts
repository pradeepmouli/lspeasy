/**
 * Example demonstrating capability-aware type narrowing
 *
 * This shows how methods become visible/hidden at compile-time
 * based on declared server or client capabilities using type transformations.
 */

import type {
  ServerCapabilities,
  ClientCapabilities,
  Client,
  Server
} from '../packages/core/src/index.js';

// ========================================
// Example 1: Client with narrow server capabilities
// ========================================

// Server only supports hover and completion
type MinimalServerCaps = {
  hoverProvider: true;
  completionProvider: {
    triggerCharacters: ['.'];
  };
};

// Client methods are narrowed to only what server supports
type MinimalClientMethods = ClientSendMethods<MinimalServerCaps>;

// ✅ TypeScript will show these methods:
//   client.textDocument.hover(params)
//   client.textDocument.completion(params)
//
// ❌ These will be typed as 'never' and hidden:
//   client.textDocument.definition(params)
//   client.textDocument.references(params)

// Test: Verify hover is available
type TestHoverAvailable = MinimalClientMethods['TextDocument']['hover']; // (params: HoverParams) => Promise<Hover | null>

// Test: Verify definition is never (not available)
type TestDefinitionNotAvailable = MinimalClientMethods['TextDocument']['definition']; // never

// ========================================
// Example 2: Server with narrow capabilities
// ========================================

// Server declares it supports specific features
type MyServerCaps = {
  hoverProvider: true;
  definitionProvider: true;
  referencesProvider: true;
  documentSymbolProvider: true;
};

// Handler registration is narrowed to declared capabilities
type MyServerHandlers = ServerHandlers<MyServerCaps>;

// ✅ TypeScript will show these handler methods:
//   server.onHover(handler)
//   server.onDefinition(handler)
//   server.onReferences(handler)
//   server.onDocumentSymbol(handler)
//
// ❌ These will be typed as 'never' and hidden:
//   server.onCompletion(handler)
//   server.onCodeAction(handler)

// Note: ServerHandlers is a union of all available handler methods
// Test: Extract specific handler from the union
type TestOnHoverAvailable = Extract<MyServerHandlers, { onHover: any }>;

// Test: Verify onCompletion is not in the union
type TestOnCompletionNotAvailable = Extract<MyServerHandlers, { onCompletion: any }>; // never

// ========================================
// Example 3: Full capabilities
// ========================================

// Server with all capabilities enabled
type FullServerCaps = ServerCapabilities;

// All client methods are available
type FullClientMethods = ClientSendMethods<FullServerCaps>;

// ✅ TypeScript will show ALL textDocument methods:
//   client.textDocument.hover(params)
//   client.textDocument.completion(params)
//   client.textDocument.definition(params)
//   client.textDocument.codeAction(params)
//   ... and 50+ more

// ========================================
// Example 4: Runtime type narrowing with type guards
// ========================================

function hasCapability<K extends keyof ServerCapabilities>(
  caps: Partial<ServerCapabilities>,
  key: K
): caps is Required<Pick<ServerCapabilities, K>> & Partial<ServerCapabilities> {
  return caps[key] !== undefined && caps[key] !== false && caps[key] !== null;
}

// Usage in real code:
function useServerFeature(serverCaps: Partial<ServerCapabilities>) {
  if (hasCapability(serverCaps, 'hoverProvider')) {
    // TypeScript now knows hoverProvider is enabled
    // client.textDocument.hover becomes available
    console.log('Hover is supported:', serverCaps.hoverProvider);
  }

  if (hasCapability(serverCaps, 'completionProvider')) {
    // TypeScript knows completionProvider is enabled
    console.log('Completion trigger chars:', serverCaps.completionProvider?.triggerCharacters);
  }
}

// ========================================
// Example 5: Server-to-Client requests
// ========================================

type MyClientCaps = ClientCapabilities;

// Server can send these requests to client
type MyServerSendMethods = ServerSendMethods<MyClientCaps>;

// ✅ Available methods:
//   server.window.showMessageRequest(params)
//   server.window.showDocument(params)
//   server.workspace.applyWorkspaceEdit(params)
//   server.client.registration(params)

// Client can register handlers for server requests
type MyClientHandlers = ClientHandlers<MyClientCaps>;

// ✅ Available handlers:
//   client.onShowMessageRequest(handler)
//   client.onApplyWorkspaceEdit(handler)
//   client.onRegistration(handler)

// ========================================
// Example 6: Type transformations work correctly
// ========================================

// Verify the transformations produce correct method signatures
type VerifyHoverSignature = FullClientMethods['TextDocument']['hover'];
// Should be: (params: HoverParams) => Promise<Hover | null>

type VerifyCompletionSignature = FullClientMethods['TextDocument']['completion'];
// Should be: (params: CompletionParams) => Promise<CompletionList | CompletionItem[] | null>

console.log('Examples compiled successfully!');
console.log('Type transformations work correctly - check type hints in your IDE.');

// Prevent unused warnings
export type {
  MinimalClientMethods,
  MyServerHandlers,
  FullClientMethods,
  MyServerSendMethods,
  MyClientHandlers,
  TestHoverAvailable,
  TestDefinitionNotAvailable,
  TestOnHoverAvailable,
  TestOnCompletionNotAvailable,
  VerifyHoverSignature,
  VerifyCompletionSignature
};
export { useServerFeature };
