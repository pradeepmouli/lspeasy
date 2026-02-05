// Test to verify the type filtering works
import type { LSPClient } from './packages/client/src/client.js';
import type { ClientCapabilities } from './packages/core/src/index.js';

// Test with minimal capabilities
type MinimalCaps = {
  hoverProvider: true;
  // completion intentionally omitted
};

const testClient = new LSPClient<ClientCapabilities, MinimalCaps>();

// Try to access hover - should work
type HoverMethod = typeof testClient.textDocument.hover;
// ^? Should be: (params: HoverParams) => Promise<Hover | null>

// Try to access completion - should cause error if filtering works
// @ts-expect-error - completion should not exist since completionProvider is not in MinimalCaps
const shouldError = testClient.textDocument.completion;

// List all properties of textDocument to see what's there
type TextDocMethods = keyof typeof testClient.textDocument;
// ^? Should only show methods that don't require capabilities or have them in MinimalCaps

export { testClient };
