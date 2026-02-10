// Test to verify the type filtering works
import { LSPClient } from './packages/client/src/client.js';

const testClient = new LSPClient<{ textDocument: { hover: {} } }>();

// Try to access hover - should work
type HoverMethod = typeof testClient.textDocument.hover;
// ^? Should be: (params: HoverParams) => Promise<Hover | null>

// Try to access completion - should cause error if filtering works
//@ts-expect-error
const shouldError = testClient.textDocument.completion;
void shouldError;

// List all properties of textDocument to see what's there
type TextDocMethods = keyof typeof testClient.textDocument;
// ^? Should only show methods that don't require capabilities or have them in MinimalCaps

export type { HoverMethod, TextDocMethods };
export { testClient };
