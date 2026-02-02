/**
 * Example: Capability-Aware Type System
 *
 * Demonstrates how the capability types automatically traverse
 * the LSP namespace structure to determine supported methods.
 */

import type {
  ServerCapabilities,
  MethodsForCapabilities,
  CapabilityForMethod
} from '@lspeasy/core';
import { getCapabilityForMethod, supportsMethod } from '@lspeasy/core';
import type { LSPRequestMethod } from '../packages/core/dist/protocol/infer';

// Example 1: Type-level capability checking
// ==========================================

// Define server capabilities
type MyServerCaps = {
  hoverProvider: true;
  completionProvider: { triggerCharacters: ['.'] };
  definitionProvider: true;
  // referencesProvider is not defined, so it's not supported
};

// This type automatically includes only the supported methods
// Result: 'textDocument/hover' | 'textDocument/completion' | 'textDocument/definition'
type _SupportedMethods = MethodsForCapabilities<MyServerCaps>;

// Example 2: Get capability key from method name
// ===============================================

// Type-level: Get the capability key for a specific method
type _HoverCapKey = CapabilityForMethod<'textDocument/hover'>;
// Result: 'hoverProvider'

type _CompletionCapKey = CapabilityForMethod<'textDocument/completion'>;
// Result: 'completionProvider'

// Example 3: Runtime capability checking
// =======================================

const serverCapabilities: ServerCapabilities = {
  hoverProvider: true,
  completionProvider: {
    triggerCharacters: ['.', ':']
  },
  definitionProvider: true,
  textDocumentSync: 1
};

// Get the capability key for a method
const hoverCapKey = getCapabilityForMethod('textDocument/hover');
console.log('Hover capability key:', hoverCapKey); // 'hoverProvider'

// Check if a method is supported
const supportsHover = supportsMethod('textDocument/hover', serverCapabilities);
console.log('Supports hover:', supportsHover); // true

const supportsReferences = supportsMethod('textDocument/references', serverCapabilities);
console.log('Supports references:', supportsReferences); // false

const supportsCompletion = supportsMethod('textDocument/completion', serverCapabilities);
console.log('Supports completion:', supportsCompletion); // true

// Example 4: Dynamic capability filtering
// ========================================

function getAvailableMethods(capabilities: ServerCapabilities): LSPRequestMethod[] {
  const methods = [
    'textDocument/hover',
    'textDocument/completion',
    'textDocument/definition',
    'textDocument/references',
    'textDocument/documentSymbol',
    'textDocument/codeAction',
    'textDocument/formatting',
    'textDocument/rename',
    'workspace/symbol',
    'workspace/executeCommand'
  ] as LSPRequestMethod[];

  return methods.filter((method) => supportsMethod(method, capabilities));
}

const availableMethods = getAvailableMethods(serverCapabilities);
console.log('\nAvailable methods:', availableMethods);
// Output: ['textDocument/hover', 'textDocument/completion', 'textDocument/definition']

// Example 5: Type-safe method handler registration
// =================================================

interface MethodHandler<M extends LSPRequestMethod> {
  method: M;
  capability: CapabilityForMethod<M>;
  handler: (params: any) => any;
}

// The type system ensures the capability matches the method
const _hoverHandler: MethodHandler<'textDocument/hover'> = {
  method: 'textDocument/hover',
  capability: 'hoverProvider', // ✓ Type-safe: must be 'hoverProvider'
  handler: (_params) => {
    // Handle hover request
    return null;
  }
};

// This would be a type error:
// const badHandler: MethodHandler<'textDocument/hover'> = {
//   method: 'textDocument/hover',
//   capability: 'completionProvider', // ✗ Type error!
//   handler: (params) => null,
// };

console.log('\n✓ Type system successfully maps methods to capabilities!');
