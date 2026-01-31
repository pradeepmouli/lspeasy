#!/usr/bin/env node
/**
 * Audit script to verify all LSP protocol types are re-exported
 */

const fs = require('fs');
const path = require('path');

// Read vscode-languageserver-protocol's main export file
const protocolPath = path.join(__dirname, '../node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/lib/common/api.d.ts');
const protocolContent = fs.readFileSync(protocolPath, 'utf8');

// Read vscode-languageserver-types exports
const typesPath = path.join(__dirname, '../node_modules/.pnpm/vscode-languageserver-types@3.17.5/node_modules/vscode-languageserver-types/lib/esm/main.d.ts');
const typesContent = fs.readFileSync(typesPath, 'utf8');

// Read our core exports
const coreIndexPath = path.join(__dirname, '../packages/core/src/index.ts');
const coreIndex = fs.readFileSync(coreIndexPath, 'utf8');

const coreTypesPath = path.join(__dirname, '../packages/core/src/protocol/types.ts');
const coreTypes = fs.readFileSync(coreTypesPath, 'utf8');

const coreNamespacesPath = path.join(__dirname, '../packages/core/src/protocol/namespaces.ts');
const coreNamespaces = fs.readFileSync(coreNamespacesPath, 'utf8');

// Extract exports from protocol
function extractExports(content, _source) {
  const exports = new Set();

  // Match: export { Name, Name2 } from '...'
  // Also handle: export type { Name, Name2 } from '...'
  const reExportRegex = /export\s+(?:type\s+)?{([^}]+)}\s*from/g;
  let match;
  while ((match = reExportRegex.exec(content)) !== null) {
    const names = match[1].split(',').map(n => {
      // Handle "Name as Alias" and "type Name"
      const cleaned = n.trim()
        .split(' as ')[0]
        .replace(/^type\s+/, '')
        .trim();
      return cleaned;
    });
    names.forEach(n => n && exports.add(n));
  }

  // Match: export * from '...' or export * as Name from '...'
  const exportStarRegex = /export\s+\*(?:\s+as\s+([A-Za-z_$][A-Za-z0-9_$]*))?\s+from/g;
  while ((match = exportStarRegex.exec(content)) !== null) {
    if (match[1]) {
      exports.add(match[1]); // namespace re-export
    }
    // For bare export *, we can't enumerate what's exported
  }

  // Match: export interface Name / export type Name / export class Name / export const Name / export enum Name
  const directExportRegex = /export\s+(?:interface|type|class|const|enum|namespace|declare\s+(?:namespace|const|enum))\s+([A-Za-z_$][A-Za-z0-9_$]*)/g;
  while ((match = directExportRegex.exec(content)) !== null) {
    exports.add(match[1]);
  }

  // Match: export { Name, Name2 }; (without from)
  const namedExportRegex = /export\s*{\s*([^}]+)\s*};/g;
  while ((match = namedExportRegex.exec(content)) !== null) {
    const names = match[1].split(',').map(n => {
      const cleaned = n.trim()
        .split(' as ')[0]
        .replace(/^type\s+/, '')
        .trim();
      return cleaned;
    });
    names.forEach(n => n && exports.add(n));
  }

  return exports;
}

console.log('🔍 Auditing LSP Protocol Exports...\n');

// Get protocol exports
const protocolExports = extractExports(protocolContent, 'protocol');
const typesExports = extractExports(typesContent, 'types');

// Combine all LSP exports
const allLspExports = new Set([...protocolExports, ...typesExports]);

console.log(`📦 Total LSP exports found: ${allLspExports.size}`);
console.log(`   - From protocol: ${protocolExports.size}`);
console.log(`   - From types: ${typesExports.size}`);

// Get our exports
const ourExports = new Set([
  ...extractExports(coreIndex, 'core/index'),
  ...extractExports(coreTypes, 'core/types'),
  ...extractExports(coreNamespaces, 'core/namespaces')
]);

console.log(`📤 Our exports: ${ourExports.size}\n`);

// Find missing exports
const missing = new Set();
for (const exp of allLspExports) {
  if (!ourExports.has(exp)) {
    missing.add(exp);
  }
}

if (missing.size === 0) {
  console.log('✅ All LSP exports are re-exported!');
} else {
  console.log(`⚠️  Missing ${missing.size} exports:\n`);

  // Categorize missing exports
  const categories = {
    types: [],
    requests: [],
    notifications: [],
    enums: [],
    other: []
  };

  for (const exp of Array.from(missing).sort()) {
    if (exp.includes('Request') || exp.includes('Handler')) {
      categories.requests.push(exp);
    } else if (exp.includes('Notification')) {
      categories.notifications.push(exp);
    } else if (exp.includes('Kind') || exp.includes('Type') || exp.includes('Tag')) {
      categories.enums.push(exp);
    } else if (exp.endsWith('Params') || exp.endsWith('Result') || exp.endsWith('Options') || exp.endsWith('Capabilities')) {
      categories.types.push(exp);
    } else {
      categories.other.push(exp);
    }
  }

  if (categories.types.length > 0) {
    console.log('📝 Missing Types/Params/Results:');
    categories.types.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }

  if (categories.enums.length > 0) {
    console.log('🔢 Missing Enums/Kinds:');
    categories.enums.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }

  if (categories.requests.length > 0) {
    console.log('📨 Missing Requests/Handlers:');
    categories.requests.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }

  if (categories.notifications.length > 0) {
    console.log('📢 Missing Notifications:');
    categories.notifications.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }

  if (categories.other.length > 0) {
    console.log('❓ Other Missing:');
    categories.other.forEach(t => console.log(`   - ${t}`));
    console.log('');
  }
}

// Also check for exports we have that might be renamed
console.log('\n📊 Summary:');
console.log(`   LSP Exports: ${allLspExports.size}`);
console.log(`   Our Exports: ${ourExports.size}`);
console.log(`   Missing: ${missing.size}`);
console.log(`   Coverage: ${((1 - missing.size / allLspExports.size) * 100).toFixed(1)}%`);

process.exit(missing.size > 0 ? 1 : 0);
