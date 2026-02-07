/**
 * Example: Capability-Aware Type System
 *
 * Demonstrates how to work with server capabilities and check
 * method support at runtime.
 */

import type { ServerCapabilities, LSPRequestMethod } from '../packages/core/src/index.js';
import { getCapabilityForRequestMethod, hasCapability } from '../packages/core/src/index.js';

// Example 1: Define server capabilities
// ======================================

type MyServerCaps = {
  hoverProvider: true;
  completionProvider: { triggerCharacters: ['.'] };
  definitionProvider: true;
  // referencesProvider is not defined, so it's not supported
};

const myCapabilities: MyServerCaps = {
  hoverProvider: true,
  completionProvider: { triggerCharacters: ['.'] },
  definitionProvider: true
};

// Example 2: Runtime capability checking
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
const hoverCapKey = getCapabilityForRequestMethod('textDocument/hover' as any);
console.log('Hover capability key:', hoverCapKey); // 'hoverProvider'

// Check if a capability exists
const hasHover = hasCapability(serverCapabilities, 'hoverProvider');
console.log('Has hover capability:', hasHover); // true

const hasReferences = hasCapability(serverCapabilities, 'referencesProvider');
console.log('Has references capability:', hasReferences); // false

const hasCompletion = hasCapability(serverCapabilities, 'completionProvider');
console.log('Has completion capability:', hasCompletion); // true

// Example 3: Dynamic capability filtering
// ========================================

function checkMethodSupport(method: string, capabilities: ServerCapabilities): boolean {
  const capKey = getCapabilityForRequestMethod(method as any);
  if (!capKey || capKey === 'alwaysOn') {
    return true;
  }
  return hasCapability(capabilities, capKey as any);
}

const methods = [
  'textDocument/hover',
  'textDocument/completion',
  'textDocument/definition',
  'textDocument/references',
  'textDocument/documentSymbol'
];

console.log('\nMethod support:');
for (const method of methods) {
  const supported = checkMethodSupport(method, serverCapabilities);
  console.log(`  ${method}: ${supported ? '✓' : '✗'}`);
}

// Example 4: Type-safe capability checks
// =======================================

function requiresCapability(method: LSPRequestMethod, capabilities: ServerCapabilities): boolean {
  const capKey = getCapabilityForRequestMethod(method);

  if (!capKey || capKey === 'alwaysOn') {
    return true; // Method doesn't require specific capability
  }

  return hasCapability(capabilities, capKey as any);
}

// Check specific methods
const methods2: LSPRequestMethod[] = [
  'textDocument/hover',
  'textDocument/completion',
  'textDocument/references'
];

console.log('\nCapability requirements:');
for (const method of methods2) {
  const required = requiresCapability(method, serverCapabilities);
  console.log(`  ${method}: ${required ? '✓ supported' : '✗ not supported'}`);
}

console.log('\n✓ Capability checking complete!');
