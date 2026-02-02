#!/usr/bin/env node
/**
 * Generate complete LSP namespaces from protocol definitions
 *
 * This script uses ts-morph to parse the vscode-languageserver-protocol
 * type definitions and generate a complete namespaces.ts file covering
 * all LSP 3.17 requests and notifications.
 */

import { Project } from 'ts-morph';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '../..');

// Initialize ts-morph project
const project = new Project({
  tsConfigFilePath: join(projectRoot, 'tsconfig.json')
});

// Add protocol source files
const protocolPath = join(
  projectRoot,
  'node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/lib/common'
);

console.log('🔍 Analyzing LSP protocol definitions...\n');

// Parse protocol files
const protocolFile = project.addSourceFileAtPath(join(protocolPath, 'protocol.d.ts'));
const apiFile = project.addSourceFileAtPath(join(protocolPath, 'api.d.ts'));

// Collect all request and notification types
const requests = new Map();
const notifications = new Map();

// Helper to extract request/notification info
function extractRequestInfo(namespace) {
  const methodProp = namespace.getProperty('method');
  const typeProp = namespace.getProperty('type');

  if (!methodProp || !typeProp) return null;

  const method = methodProp.getInitializer()?.getText().replace(/['"]/g, '');
  const typeText = typeProp.getType().getText();

  // Parse ProtocolRequestType or ProtocolNotificationType generic parameters
  const match = typeText.match(/Protocol(?:Request|Notification)Type(?:0)?<(.+)>/);
  if (!match) return null;

  const params = match[1].split(',').map((p) => p.trim());

  return {
    method,
    params: params[0] !== 'void' ? params[0] : undefined,
    result: params[1],
    partialResult: params[2],
    error: params[3],
    registrationOptions: params[4]
  };
}

// Find all request namespaces (they have a 'type' property with ProtocolRequestType)
function findRequests(sourceFile) {
  const namespaces = sourceFile.getDescendantsOfKind(
    project.getTypeChecker().compilerObject.SyntaxKind.ModuleDeclaration
  );

  for (const ns of namespaces) {
    const name = ns.getName();
    if (!name.endsWith('Request') && !name.endsWith('Notification')) continue;

    const info = extractRequestInfo(ns);
    if (info) {
      if (name.endsWith('Request')) {
        requests.set(name, info);
      } else {
        notifications.set(name, info);
      }
    }
  }
}

// Scan protocol files
[protocolFile, apiFile].forEach(findRequests);

// Also check protocol.*.d.ts files
const additionalProtocolFiles = [
  'protocol.implementation.d.ts',
  'protocol.typeDefinition.d.ts',
  'protocol.declaration.d.ts',
  'protocol.selectionRange.d.ts',
  'protocol.progress.d.ts',
  'protocol.callHierarchy.d.ts',
  'protocol.semanticTokens.d.ts',
  'protocol.linkedEditingRange.d.ts',
  'protocol.fileOperations.d.ts',
  'protocol.moniker.d.ts',
  'protocol.typeHierarchy.d.ts',
  'protocol.inlineValue.d.ts',
  'protocol.inlayHint.d.ts',
  'protocol.diagnostic.d.ts',
  'protocol.notebook.d.ts',
  'protocol.inlineCompletion.d.ts',
  'protocol.foldingRange.d.ts',
  'protocol.colorProvider.d.ts',
  'protocol.workspaceFolder.d.ts',
  'protocol.configuration.d.ts',
  'protocol.showDocument.d.ts'
];

for (const fileName of additionalProtocolFiles) {
  try {
    const file = project.addSourceFileAtPath(join(protocolPath, fileName));
    findRequests(file);
  } catch (e) {
    // File might not exist in this version
  }
}

console.log(`📦 Found ${requests.size} requests`);
console.log(`📢 Found ${notifications.size} notifications\n`);

// Generate namespace code
function generateNamespace() {
  let code = `/**
 * LSP Request and Notification type definitions
 *
 * This file is auto-generated from the LSP protocol definitions.
 * DO NOT EDIT MANUALLY - run 'pnpm run codegen' to regenerate.
 *
 * Generated on: ${new Date().toISOString()}
 */

// Import all types from protocol
import type {
`;

  // Collect all type references
  const typeRefs = new Set();

  for (const [name, info] of [...requests, ...notifications]) {
    if (info.params && info.params !== 'void') {
      // Extract type names from params
      const paramTypes = info.params.match(/[A-Z][A-Za-z0-9_]*/g) || [];
      paramTypes.forEach((t) => typeRefs.add(t));
    }
    if (info.result && info.result !== 'void' && info.result !== 'null') {
      const resultTypes = info.result.match(/[A-Z][A-Za-z0-9_]*/g) || [];
      resultTypes.forEach((t) => typeRefs.add(t));
    }
  }

  // Add imports
  const sortedTypes = Array.from(typeRefs).sort();
  sortedTypes.forEach((t) => {
    code += `  ${t},\n`;
  });

  code += `} from 'vscode-languageserver-protocol';\n\n`;

  // Generate request namespace
  code += `/**
 * LSP Request types namespace
 */
export namespace LSPRequest {
`;

  // Group requests by category
  const categories = new Map();

  for (const [name, info] of requests) {
    // Extract category from method name (e.g., 'textDocument/hover' -> 'TextDocument')
    const parts = info.method.split('/');
    const category = parts[0]
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1$2');
    const methodName = parts[1]
      ? parts[1].replace(/^./, (c) => c.toUpperCase())
      : name.replace('Request', '');

    if (!categories.has(category)) {
      categories.set(category, []);
    }
    categories.get(category).push({ name, methodName, info });
  }

  // Generate each category
  for (const [category, items] of categories) {
    code += `\n  export namespace ${category} {\n`;

    for (const { methodName, info } of items) {
      code += `    export namespace ${methodName} {\n`;
      code += `      export type Method = '${info.method}';\n`;
      code += `      export const Method = '${info.method}';\n`;
      code += `      export type Params = ${info.params || 'void'};\n`;
      code += `      export type Result = ${info.result || 'void'};\n`;
      if (info.partialResult && info.partialResult !== 'void') {
        code += `      export type PartialResult = ${info.partialResult};\n`;
      }
      code += `    }\n`;
    }

    code += `  }\n`;
  }

  code += `}\n\n`;

  // Generate notification namespace
  code += `/**
 * LSP Notification types namespace
 */
export namespace LSPNotification {
`;

  const notifCategories = new Map();

  for (const [name, info] of notifications) {
    const parts = info.method.split('/');
    const category = parts[0]
      .replace(/^./, (c) => c.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1$2');
    const methodName = parts[1]
      ? parts[1].replace(/^./, (c) => c.toUpperCase())
      : name.replace('Notification', '');

    if (!notifCategories.has(category)) {
      notifCategories.set(category, []);
    }
    notifCategories.get(category).push({ name, methodName, info });
  }

  for (const [category, items] of notifCategories) {
    code += `\n  export namespace ${category} {\n`;

    for (const { methodName, info } of items) {
      code += `    export namespace ${methodName} {\n`;
      code += `      export type Method = '${info.method}';\n`;
      code += `      export const Method = '${info.method}';\n`;
      code += `      export type Params = ${info.params || 'void'};\n`;
      code += `    }\n`;
    }

    code += `  }\n`;
  }

  code += `}\n\n`;

  // Add helper type for extracting params/results
  code += `/**
 * Helper type to infer request params from method
 */
export type InferRequestParams<M extends string> =
  M extends LSPRequest.TextDocument.Hover.Method ? LSPRequest.TextDocument.Hover.Params :
  // Add more method mappings as needed
  never;

/**
 * Helper type to infer request result from method
 */
export type InferRequestResult<M extends string> =
  M extends LSPRequest.TextDocument.Hover.Method ? LSPRequest.TextDocument.Hover.Result :
  // Add more method mappings as needed
  never;
`;

  return code;
}

const generatedCode = generateNamespace();

// Write to file
const outputPath = join(projectRoot, 'packages/core/src/protocol/namespaces.ts');
writeFileSync(outputPath, generatedCode, 'utf8');

console.log(`✅ Generated ${outputPath}`);
console.log('\nNext steps:');
console.log('1. Review the generated file');
console.log(
  '2. Update packages/core/src/protocol/namespaces.ts to re-export from namespaces.generated.ts'
);
console.log('3. Run type-check and tests');
