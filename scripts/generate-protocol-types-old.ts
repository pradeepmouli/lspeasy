#!/usr/bin/env tsx
/**
 * Code generator for LSP protocol types and namespaces
 *
 * This script analyzes the vscode-languageserver-protocol package and generates:
 * 1. Complete type re-exports in packages/core/src/protocol/types.ts
 * 2. Complete namespace definitions in packages/core/src/protocol/namespaces.ts
 *
 * Conventions (derived from protocol.d.ts structure):
 * - Categories: Extracted from *Request/*Notification namespace names
 * - Enum candidates: Namespaces exported as both namespace + literal union type
 * - Type categorization: Based on name prefixes from discovered categories
 * - Type overrides: For string-based extensible kinds (Kind/Format suffixes)
 *
 * Usage: pnpm tsx scripts/generate-protocol-types.ts
 */

import { Project, Node, TypeAliasDeclaration, InterfaceDeclaration, SyntaxKind } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';
import camelCase from 'camelcase';

interface EnumCandidate {
  name: string;
  members: Map<string, number | string>;
  isStringBased: boolean;
  documentation?: string;
  isRealEnum?: boolean; // True if this is a real TypeScript enum (not namespace+type)
}

interface CategoryInfo {
  name: string;
  prefixes: Set<string>; // e.g., "Completion", "Hover", "DidOpenTextDocument"
  requests: Set<string>; // Request namespace names
  notifications: Set<string>; // Notification namespace names
}

class ProtocolTypeGenerator {
  private project: Project;
  private protocolFile: string;
  private typesFile: string;

  // Discovered data
  private allTypes = new Set<string>();
  private allNamespaces = new Set<string>();
  private enumCandidates = new Map<string, EnumCandidate>();
  private categories = new Map<string, CategoryInfo>();

  // Convention-based rules
  private readonly INTERNAL_TYPES = new Set([
    'Proposed',
    'ProtocolConnection',
    'SelectedCompletionInfo',
    'StringValue',
    'createProtocolConnection'
  ]);

  constructor() {
    this.project = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json')
    });

    // The main protocol definition file
    this.protocolFile = path.join(
      process.cwd(),
      'node_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts'
    );

    // The core types definition file
    this.typesFile = path.join(
      process.cwd(),
      'node_modules/.pnpm/vscode-languageserver-types@3.17.5/node_modules/vscode-languageserver-types/lib/esm/main.d.ts'
    );
  }

  async generate() {
    console.log('🔍 Analyzing LSP protocol definitions...\n');

    // Step 1: Analyze protocol.d.ts and types
    await this.analyzeProtocolFile();
    await this.analyzeTypesFile();

    // Step 2: Extract enum candidates
    await this.extractEnumCandidates();

    // Step 3: Extract categories from Request/Notification namespaces
    await this.extractCategories();

    // Step 4: Fix missing imports from protocol subdirectories
    await this.fixMissingImports();

    // Step 5: Generate types.ts (now includes subdirectory types)
    await this.generateTypesFile();

    // Step 6: Generate namespaces.ts
    await this.generateNamespacesFile();

    console.log('\n✅ Generation complete!');
    console.log(`   Types: ${this.allTypes.size}`);
    console.log(`   Enum candidates: ${this.enumCandidates.size}`);
    console.log(`   Categories: ${this.categories.size}`);
  }

  private async analyzeProtocolFile() {
    console.log('   Analyzing protocol.d.ts...');
    const sourceFile = this.project.addSourceFileAtPath(this.protocolFile);

    // Also add all protocol.*.d.ts files so we can analyze imported namespaces
    const protocolDir = path.dirname(this.protocolFile);
    const protocolFiles = fs
      .readdirSync(protocolDir)
      .filter((f) => f.startsWith('protocol.') && f.endsWith('.d.ts') && f !== 'protocol.d.ts')
      .map((f) => path.join(protocolDir, f));

    for (const file of protocolFiles) {
      this.project.addSourceFileAtPath(file);
    }

    // Extract all exported types, interfaces, and namespaces
    // Use getExportedDeclarations for things defined in the file
    for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
      for (const decl of declarations) {
        if (Node.isInterfaceDeclaration(decl) || Node.isTypeAliasDeclaration(decl)) {
          this.allTypes.add(name);
        } else if (Node.isModuleDeclaration(decl)) {
          this.allNamespaces.add(name);
        }
      }
    }

    // Also get types from export { ... } from './module' statements
    for (const exportDecl of sourceFile.getExportDeclarations()) {
      const moduleSpecifier = exportDecl.getModuleSpecifierValue();
      if (moduleSpecifier) {
        // It's a re-export from another module - get the named exports
        for (const namedExport of exportDecl.getNamedExports()) {
          const exportName = namedExport.getName();
          this.allTypes.add(exportName);
        }
      }
    }

    console.log(`     Found ${this.allTypes.size} types, ${this.allNamespaces.size} namespaces`);
  }

  /**
   * Analyze vscode-languageserver-types to discover core data structure types
   * like CodeAction, Hover, Location, etc.
   */
  private async analyzeTypesFile() {
    console.log('   Analyzing vscode-languageserver-types...');

    if (!fs.existsSync(this.typesFile)) {
      console.log('     ⚠️  Types file not found, skipping');
      return;
    }

    const sourceFile = this.project.addSourceFileAtPath(this.typesFile);

    // Extract all exported types, interfaces, and enums
    for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
      for (const decl of declarations) {
        if (Node.isInterfaceDeclaration(decl) || Node.isTypeAliasDeclaration(decl)) {
          this.allTypes.add(name);
        } else if (Node.isEnumDeclaration(decl)) {
          // Also track real TypeScript enums (like SemanticTokenTypes)
          const members = new Map<string, string | number>();
          for (const member of decl.getMembers()) {
            const memberName = member.getName();
            const initializer = member.getInitializer();
            if (initializer) {
              const value = initializer.getText().replace(/['"]/g, '');
              members.set(memberName, value);
            }
          }

          // Check if it's string-based
          const isStringBased = Array.from(members.values()).some(
            (v) => typeof v === 'string' || isNaN(Number(v))
          );

          this.enumCandidates.set(name, {
            name,
            members,
            isStringBased,
            isRealEnum: true // Mark as a real TypeScript enum
          });
        }
      }
    }

    console.log(`     Found ${this.allTypes.size} total types (including core data structures)`);
  }

  /**
   * Find enum candidates: exported as both namespace + type (not interface)
   * If something has both a namespace and a type export, it's an enum candidate
   */
  private async extractEnumCandidates() {
    console.log('   Extracting enum candidates...');

    // Scan both protocol.d.ts and types file
    const protocolFile = this.project.getSourceFile(this.protocolFile)!;
    const typesSourceFile = fs.existsSync(this.typesFile)
      ? this.project.getSourceFile(this.typesFile)
      : null;

    const sourceFiles = [protocolFile];
    if (typesSourceFile) {
      sourceFiles.push(typesSourceFile);
    }

    // Find exports that have BOTH a namespace AND a type
    const enumCandidatesByFile = new Map<string, any>(); // name -> source file

    for (const sourceFile of sourceFiles) {
      for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
        let hasNamespace = false;
        let hasTypeAlias = false;

        for (const decl of declarations) {
          if (Node.isModuleDeclaration(decl)) {
            hasNamespace = true;
          }
          if (Node.isTypeAliasDeclaration(decl)) {
            hasTypeAlias = true;
          }
        }

        // If has both namespace and type alias (not interface), it's an enum candidate
        if (hasNamespace && hasTypeAlias) {
          // Use the first file we found it in (prefer protocol over types)
          if (!enumCandidatesByFile.has(name)) {
            enumCandidatesByFile.set(name, sourceFile);
          }
        }
      }
    }

    // Extract enum values from namespaces
    for (const [namespaceName, sourceFile] of enumCandidatesByFile) {
      // This is an enum candidate! Extract the values from the namespace
      const namespaceDecl = sourceFile.getModule(namespaceName);
      if (!namespaceDecl) continue;

      const members = new Map<string, number | string>();
      let isStringBased = false;

      const body = namespaceDecl.getBody();
      if (body && Node.isModuleBlock(body)) {
        for (const statement of body.getStatements()) {
          if (Node.isVariableStatement(statement)) {
            for (const decl of statement.getDeclarations()) {
              const varName = decl.getName();
              const initializer = decl.getInitializer();
              const typeNode = decl.getTypeNode();

              // In .d.ts files, const declarations use type annotations instead of initializers
              // e.g., "const Error: 1;" instead of "const Error = 1;"
              if (initializer) {
                if (Node.isNumericLiteral(initializer)) {
                  members.set(varName, parseInt(initializer.getLiteralText()));
                } else if (Node.isStringLiteral(initializer)) {
                  members.set(varName, initializer.getLiteralText());
                  isStringBased = true;
                }
              } else if (typeNode && Node.isLiteralTypeNode(typeNode)) {
                const literal = typeNode.getLiteral();
                if (Node.isNumericLiteral(literal)) {
                  members.set(varName, parseInt(literal.getLiteralText()));
                } else if (Node.isStringLiteral(literal)) {
                  members.set(varName, literal.getLiteralText());
                  isStringBased = true;
                }
              }
            }
          }
        }
      }

      if (members.size > 0) {
        this.enumCandidates.set(namespaceName, {
          name: namespaceName,
          members,
          isStringBased: isStringBased || this.isStringBasedKind(namespaceName),
          documentation: namespaceDecl.getJsDocs()[0]?.getDescription().trim()
        });
      }
    }

    console.log(
      `     Found ${this.enumCandidates.size} enum candidates: ${Array.from(this.enumCandidates.keys()).join(', ')}`
    );
  }

  /**
   * Extract categories from *Request and *Notification namespaces
   * Examples: CompletionRequest → "completion", HoverRequest → "hover"
   */
  private async extractCategories() {
    console.log('   Extracting categories from Request/Notification namespaces...');
    const sourceFile = this.project.getSourceFile(this.protocolFile)!;

    for (const namespaceName of this.allNamespaces) {
      let categoryName: string | null = null;
      let prefix: string | null = null;
      let isRequest = false;
      let isNotification = false;

      if (namespaceName.endsWith('Request')) {
        prefix = namespaceName.replace(/Request$/, '');
        categoryName = camelCase(prefix);
        isRequest = true;
      } else if (namespaceName.endsWith('Notification')) {
        prefix = namespaceName.replace(/Notification$/, '');
        categoryName = camelCase(prefix);
        isNotification = true;
      }

      if (categoryName && prefix) {
        if (!this.categories.has(categoryName)) {
          this.categories.set(categoryName, {
            name: categoryName,
            prefixes: new Set(),
            requests: new Set(),
            notifications: new Set()
          });
        }

        const category = this.categories.get(categoryName)!;
        category.prefixes.add(prefix);

        if (isRequest) {
          category.requests.add(namespaceName);
        } else if (isNotification) {
          category.notifications.add(namespaceName);
        }
      }
    }

    console.log(`     Found ${this.categories.size} categories`);
    for (const [name, info] of this.categories) {
      console.log(`       ${name}: ${Array.from(info.prefixes).join(', ')}`);
    }
  }

  /**
   * Convention: Check if a name suggests string-based extensible values
   */
  private isStringBasedKind(name: string): boolean {
    return name.endsWith('Kind') || name.endsWith('Format');
  }

  /**
   * Categorize a type name based on discovered category prefixes
   */
  private categorizeType(typeName: string): string {
    // Core fundamental types - including data structures
    const coreTypes = [
      'Position',
      'Range',
      'Location',
      'LocationLink',
      'Diagnostic',
      'Command',
      'TextEdit',
      'TextDocument',
      'URI',
      'DocumentUri',
      'LSPAny',
      'LSPObject',
      'LSPArray',
      'MarkupContent',
      'MarkupKind',
      'WorkspaceEdit',
      'VersionedTextDocumentIdentifier',
      'TextDocumentIdentifier',
      'TextDocumentItem',
      // Result types that are commonly used
      'CompletionItem',
      'CompletionList',
      'Hover',
      'SignatureHelp',
      'Definition',
      'CodeAction',
      'CodeLens',
      'DocumentLink',
      'DocumentSymbol',
      'SymbolInformation',
      'DocumentHighlight',
      'WorkspaceSymbol',
      'ColorInformation',
      'ColorPresentation',
      'FoldingRange',
      'SelectionRange',
      'CallHierarchyItem',
      'SemanticTokens',
      'InlayHint',
      'InlineValue',
      'DocumentDiagnosticReport',
      'WorkspaceDiagnosticReport'
    ];

    if (coreTypes.includes(typeName)) {
      return 'core';
    }

    // Check against discovered category prefixes
    for (const [categoryName, info] of this.categories) {
      for (const prefix of info.prefixes) {
        if (typeName.startsWith(prefix)) {
          return categoryName;
        }
      }
    }

    return 'other';
  }

  private async generateTypesFile() {
    console.log('📝 Generating types.ts...');

    const output: string[] = [];

    // Header
    output.push(`/**
 * Re-export LSP protocol types from vscode-languageserver-protocol
 * Auto-generated by scripts/generate-protocol-types.ts
 *
 * DO NOT EDIT MANUALLY - regenerate using: pnpm run generate:protocol
 */

import {LiteralUnion, OverrideProperties} from 'type-fest';

// ============================================================================
// Enums for LSP Kind Types
// ============================================================================
`);

    // Generate enums from discovered enum candidates
    output.push(this.generateEnumDefinitions());

    // Find types that need overrides (string-based kinds)
    const overrides = this.findTypesNeedingOverrides();

    if (overrides.size > 0) {
      output.push(this.generateOverrideImports(overrides));
      output.push(this.generateTypeOverrides(overrides));
    }

    // Re-export all types (categorized by discovered categories)
    output.push(this.generateTypeExports(overrides));

    const outputPath = path.join(process.cwd(), 'packages/core/src/protocol/types.ts');
    fs.writeFileSync(outputPath, output.join('\n'));
    console.log(`   Written to ${outputPath}`);
  }

  private generateEnumDefinitions(): string {
    const output: string[] = [];

    for (const [name, info] of this.enumCandidates) {
      // Generate all enums, whether from namespace+type or real enums
      if (info.documentation) {
        output.push(`/**\n * ${info.documentation}\n */`);
      }
      output.push(`export enum ${name} {`);

      for (const [memberName, value] of info.members) {
        if (typeof value === 'string') {
          output.push(`  ${memberName} = '${value}',`);
        } else {
          output.push(`  ${memberName} = ${value},`);
        }
      }

      output.push(`}\n`);
    }

    return output.join('\n');
  }

  /**
   * Find types that need overrides for string-based kinds
   * Convention: Only string-based kinds (with string literal values) need LiteralUnion
   */
  private findTypesNeedingOverrides(): Map<
    string,
    { baseName: string; overrides: Map<string, string> }
  > {
    const overrides = new Map<string, { baseName: string; overrides: Map<string, string> }>();

    // Only string-based kinds (not numeric)
    const stringKinds = Array.from(this.enumCandidates.entries())
      .filter(([name, info]) => {
        // Must be genuinely string-based (have at least one string member)
        return (
          info.isStringBased && Array.from(info.members.values()).some((v) => typeof v === 'string')
        );
      })
      .map(([name]) => name);

    console.log(`     String-based kinds for overrides: ${stringKinds.join(', ') || 'none'}`);

    for (const kindName of stringKinds) {
      // Pattern: Type with 'kind' property (e.g., CodeAction, FoldingRange)
      const mainType = kindName.replace(/Kind$/, '').replace(/Format$/, '');

      if (this.allTypes.has(mainType)) {
        overrides.set(mainType, {
          baseName: mainType,
          overrides: new Map([['kind', `LiteralUnion<${kindName}, string>`]])
        });
      }

      // Pattern: ClientCapabilities with valueSet
      const clientCapType = `${mainType}ClientCapabilities`;
      if (this.allTypes.has(clientCapType)) {
        // Detect the correct property path from the protocol
        let property: string;
        if (kindName === 'TokenFormat') {
          property = 'formats';
        } else if (kindName === 'CodeActionKind') {
          property = 'codeActionLiteralSupport.codeActionKind.valueSet';
        } else {
          property = `${camelCase(kindName)}.valueSet`;
        }

        overrides.set(clientCapType, {
          baseName: clientCapType,
          overrides: new Map([[property, `Array<LiteralUnion<${kindName}, string>>`]])
        });
      }

      // Pattern: Options with kinds array
      // Note: Skip this pattern as most *Options types don't actually have these properties
      // They extend WorkDoneProgressOptions but don't add kind-specific fields
      const optionsType = `${mainType}Options`;
      if (this.allTypes.has(optionsType)) {
        const propertyName = `${camelCase(kindName)}s`;
        console.log(
          `     Skipping ${optionsType}.${propertyName} - base type doesn't have this property`
        );
      }
    }

    console.log(`   Generated ${overrides.size} type overrides`);
    return overrides;
  }

  private generateOverrideImports(overrides: Map<string, any>): string {
    const output: string[] = [
      `
// ============================================================================
// Import types that need overrides
// ============================================================================

import type {`
    ];

    const imports: string[] = [];
    for (const [typeName] of overrides) {
      imports.push(`  ${typeName} as ${typeName}Base`);
    }

    output.push(imports.join(',\n'));
    output.push(`} from 'vscode-languageserver-protocol';\n`);

    return output.join('\n');
  }

  private generateTypeOverrides(
    overrides: Map<string, { baseName: string; overrides: Map<string, string> }>
  ): string {
    const output: string[] = [
      `
// ============================================================================
// Type Overrides for Extensible String-Based Kinds
// ============================================================================
`
    ];

    for (const [typeName, info] of overrides) {
      output.push(
        `/**\n * ${typeName} with enhanced type support for extensible string-based kinds\n */`
      );
      output.push(`export type ${typeName} = OverrideProperties<${typeName}Base, {`);

      for (const [propPath, propType] of info.overrides) {
        if (propPath.includes('.')) {
          // Nested property - build the full nested structure
          const parts = propPath.split('.');

          // Build complete nested structure
          let indent = '  ';
          for (let i = 0; i < parts.length; i++) {
            if (i < parts.length - 1) {
              output.push(`${indent}${parts[i]}?: {`);
              indent += '  ';
            } else {
              output.push(`${indent}${parts[i]}: ${propType};`);
            }
          }

          // Close all nested braces
          for (let i = parts.length - 2; i >= 0; i--) {
            indent = '  ' + '  '.repeat(i);
            output.push(`${indent}};`);
          }
        } else {
          output.push(`  ${propPath}?: ${propType};`);
        }
      }

      output.push(`}>;\n`);
    }

    return output.join('\n');
  }

  private generateTypeExports(overrides: Map<string, any>): string {
    // Filter out types we define ourselves or override
    const excludeFromReExport = new Set([
      ...overrides.keys(),
      ...this.INTERNAL_TYPES,
      ...this.enumCandidates.keys() // Don't re-export enum type aliases
    ]);

    const typesToExport = Array.from(this.allTypes)
      .filter((t) => !excludeFromReExport.has(t))
      .sort();

    // Categorize types using discovered categories
    const categorized = new Map<string, string[]>();
    for (const typeName of typesToExport) {
      const category = this.categorizeType(typeName);
      if (!categorized.has(category)) {
        categorized.set(category, []);
      }
      categorized.get(category)!.push(typeName);
    }

    const output: string[] = [
      `
// ============================================================================
// Re-export Protocol Types (categorized by LSP features)
// ============================================================================
`
    ];

    // Sort categories: core first, other last
    const sortedCategories = Array.from(categorized.entries()).sort(([a], [b]) => {
      if (a === 'core') return -1;
      if (b === 'core') return 1;
      if (a === 'other') return 1;
      if (b === 'other') return -1;
      return a.localeCompare(b);
    });

    for (const [category, types] of sortedCategories) {
      if (types.length === 0) continue;

      const title =
        category === 'core'
          ? 'Core Types'
          : category === 'other'
            ? 'Other Types'
            : category.charAt(0).toUpperCase() +
              category
                .slice(1)
                .replace(/([A-Z])/g, ' $1')
                .trim();

      output.push(`\n// ${title}`);
      output.push(`export type {`);
      output.push(types.map((t) => `  ${t}`).join(',\n'));
      output.push(`} from 'vscode-languageserver-protocol';`);
    }

    return output.join('\n');
  }

  private async fixMissingImports() {
    // Don't add any extra types - only use what's directly exported from protocol.d.ts
    // Types from subdirectories that aren't re-exported are internal and shouldn't be used
    console.log('🔧 Checking protocol exports...');
  }

  private async generateNamespacesFile() {
    console.log('📝 Generating namespaces.ts...');

    const output: string[] = [];

    // Header
    output.push(`/**
 * LSP Request and Notification namespaces
 * Auto-generated by scripts/generate-protocol-types.ts
 *
 * DO NOT EDIT MANUALLY - regenerate using: pnpm run generate:protocol
 */
`);

    // Extract namespace information from protocol.d.ts and related files
    const namespaceInfo = new Map<
      string,
      {
        method: string;
        paramsType: string;
        resultType: string;
        registrationOptionsType: string;
        optionsType: string;
        clientCapabilitiesType: string;
        categoryName: string;
        displayName: string;
        categoryTypes: Set<string>;
        isNotification: boolean;
        serverCapability: string;
        messageDirection: 'clientToServer' | 'serverToClient' | 'both';
      }
    >();

    // Parse Request/Notification namespaces from all protocol files
    const allSourceFiles = this.project.getSourceFiles();
    const moduleDeclarations: any[] = [];

    for (const file of allSourceFiles) {
      moduleDeclarations.push(...file.getDescendantsOfKind(SyntaxKind.ModuleDeclaration));
    }

    for (const namespace of moduleDeclarations) {
      const namespaceName = namespace.getName();

      if (!namespaceName.endsWith('Request') && !namespaceName.endsWith('Notification')) {
        continue;
      }

      const body = namespace.getBody();
      if (!body || !Node.isModuleBlock(body)) {
        continue;
      }

      // Get the source file for this namespace
      const namespaceSourceFile = namespace.getSourceFile();

      let method = '';
      let paramsType = '';
      let resultType = '';
      let registrationOptionsType = '';
      let messageDirection: 'clientToServer' | 'serverToClient' | 'both' = 'clientToServer'; // default

      // Get all variable statements in the namespace
      const varStatements = body.getStatements().filter(Node.isVariableStatement);

      for (const varStmt of varStatements) {
        for (const decl of varStmt.getDeclarations()) {
          const declName = decl.getName();

          if (declName === 'method') {
            const typeNode = decl.getTypeNode();
            if (typeNode && Node.isLiteralTypeNode(typeNode)) {
              const literal = typeNode.getLiteral();
              if (Node.isStringLiteral(literal)) {
                method = literal.getLiteralValue();
              }
            }
          } else if (declName === 'type') {
            const typeNode = decl.getTypeNode();
            if (typeNode && Node.isTypeReference(typeNode)) {
              const typeArgs = typeNode.getTypeArguments();
              if (typeArgs.length >= 2) {
                paramsType = typeArgs[0].getText();
                resultType = typeArgs[1].getText();
                // 5th type parameter is registration options
                if (typeArgs.length >= 5) {
                  registrationOptionsType = typeArgs[4].getText();
                }
              }
            }
          } else if (declName === 'messageDirection') {
            // messageDirection is a const with type annotation, but we need the JS value
            // We'll parse it from the compiled JS file later
          }
        }
      }

      // Extract messageDirection from compiled JS
      if (method) {
        const jsFilePath = namespaceSourceFile.getFilePath().replace(/\.d\.ts$/, '.js');
        if (fs.existsSync(jsFilePath)) {
          const jsContent = fs.readFileSync(jsFilePath, 'utf-8');
          // Look for pattern: NamespaceName.messageDirection = messages_1.MessageDirection.XXX
          const directionPattern = new RegExp(
            `${namespaceName}\\.messageDirection\\s*=\\s*messages_\\d+\\.MessageDirection\\.(\\w+)`,
            'i'
          );
          const match = jsContent.match(directionPattern);
          if (match && match[1]) {
            messageDirection = match[1] as 'clientToServer' | 'serverToClient' | 'both';
          }
        }
      }

      if (method && paramsType && resultType) {
        // Find the category for this namespace and get its types
        for (const [catName, catInfo] of this.categories) {
          if (catInfo.requests.has(namespaceName) || catInfo.notifications.has(namespaceName)) {
            // Get all types for this category from allTypes
            const categoryTypes = new Set<string>();
            for (const typeName of this.allTypes) {
              if (this.categorizeType(typeName) === catName) {
                categoryTypes.add(typeName);
              }
            }

            // Generate server capability name: categoryName + 'Provider'
            const serverCapability = catName + 'Provider';

            // Derive Options and ClientCapabilities types
            // If RegistrationOptions is void, all related types should be void
            let optionsType: string;
            let clientCapabilitiesType: string;

            if (registrationOptionsType === 'void') {
              // When RegistrationOptions is void, Options and ClientCapabilities should also be void
              optionsType = 'void';
              clientCapabilitiesType = 'void';
            } else if (registrationOptionsType) {
              // Extract base from RegistrationOptions (e.g., "ReferenceRegistrationOptions" -> "Reference")
              const baseName = registrationOptionsType.replace(/RegistrationOptions$/, '');

              // Check for Options and ClientCapabilities with this base name
              // Search across ALL types, not just the category
              const hasOptions = this.allTypes.has(baseName + 'Options');
              const hasClientCaps = this.allTypes.has(baseName + 'ClientCapabilities');

              optionsType = hasOptions ? baseName + 'Options' : 'void';
              clientCapabilitiesType = hasClientCaps ? baseName + 'ClientCapabilities' : 'void';
            } else {
              // No RegistrationOptions extracted - use void
              optionsType = 'void';
              clientCapabilitiesType = 'void';
            }

            namespaceInfo.set(namespaceName, {
              method,
              paramsType,
              resultType,
              registrationOptionsType: registrationOptionsType || 'void',
              optionsType,
              clientCapabilitiesType,
              categoryName: catName,
              displayName: catInfo.name,
              categoryTypes,
              isNotification: namespaceName.endsWith('Notification'),
              serverCapability,
              messageDirection
            });

            break;
          }
        }
      }
    }

    const requestCount = Array.from(namespaceInfo.values()).filter(
      (info) => !info.isNotification
    ).length;
    const notificationCount = Array.from(namespaceInfo.values()).filter(
      (info) => info.isNotification
    ).length;
    console.log(`     Extracted ${requestCount} requests and ${notificationCount} notifications`);

    // Collect all types that need to be imported
    const allImports = new Set<string>();
    for (const info of namespaceInfo.values()) {
      // Add params type
      const paramsType = info.paramsType;
      if (paramsType && !['void', 'never', 'any', 'null'].includes(paramsType)) {
        allImports.add(paramsType);
      }

      // Add result types (parse them from the union/array syntax)
      const resultType = info.resultType;
      // Extract type names from complex types like "Type[]", "Type | null", etc.
      const typeMatches = resultType.matchAll(/([A-Z][A-Za-z0-9_]*)/g);
      for (const match of typeMatches) {
        const typeName = match[1];
        // Skip built-in types
        if (!['void', 'never', 'any', 'null'].includes(typeName)) {
          allImports.add(typeName);
        }
      }

      // Add Options type
      const optionsType = info.optionsType;
      if (optionsType && !['void', 'never', 'any', 'null'].includes(optionsType)) {
        allImports.add(optionsType);
      }

      // Add ClientCapabilities type
      const clientCapType = info.clientCapabilitiesType;
      if (clientCapType && !['void', 'never', 'any', 'null'].includes(clientCapType)) {
        allImports.add(clientCapType);
      }

      // Add RegistrationOptions type
      const regOptionsType = info.registrationOptionsType;
      if (regOptionsType && !['void', 'never', 'any', 'null'].includes(regOptionsType)) {
        // Parse compound types like "WorkDoneProgressOptions & TextDocumentRegistrationOptions"
        const regTypeMatches = regOptionsType.matchAll(/([A-Z][A-Za-z0-9_]*)/g);
        for (const match of regTypeMatches) {
          const typeName = match[1];
          if (!['void', 'never', 'any', 'null'].includes(typeName)) {
            allImports.add(typeName);
          }
        }
      }
    }

    // Generate imports
    output.push('import type {');
    const sortedImports = Array.from(allImports)
      // Filter out invalid type names (must be valid identifiers)
      .filter((imp) => /^[A-Z][A-Za-z0-9_]*$/.test(imp))
      .sort();
    sortedImports.forEach((imp, i) => {
      output.push(`  ${imp}${i < sortedImports.length - 1 ? ',' : ''}`);
    });
    output.push("} from './types.js';");
    output.push('');

    // Group methods by namespace prefix (textDocument/, workspace/, etc.)
    // Separate requests and notifications
    const groupedRequests = new Map<string, typeof namespaceInfo>();
    const groupedNotifications = new Map<string, typeof namespaceInfo>();

    for (const [nsName, info] of namespaceInfo) {
      const parts = info.method.split('/');
      const namespacePrefix = parts.length > 1 ? parts[0] : 'general';

      const targetMap = info.isNotification ? groupedNotifications : groupedRequests;

      if (!targetMap.has(namespacePrefix)) {
        targetMap.set(namespacePrefix, new Map());
      }

      // Use namespace name as key to avoid duplicates (e.g., ShowMessageRequest vs ShowMessageNotification)
      targetMap.get(namespacePrefix)!.set(nsName, info);
    }

    // Generate LSPRequest type with nested structure
    output.push('export type LSPRequest = {');

    for (const [nsPrefix, methods] of groupedRequests) {
      const capitalizedNs = nsPrefix.charAt(0).toUpperCase() + nsPrefix.slice(1);

      output.push(`  ${capitalizedNs}: {`);

      for (const [nsName, info] of methods) {
        // Use extracted types from namespace
        const params = info.paramsType;
        const result = info.resultType;
        const clientCap = info.clientCapabilitiesType;
        const serverCap = info.serverCapability;
        const options = info.optionsType;
        const regOptions = info.registrationOptionsType;

        // Use namespace name as unique key
        // For requests, check if there's also a notification with the same base
        let uniqueKey = nsName;
        if (nsName.endsWith('Request')) {
          const baseName = nsName.replace(/Request$/, '');
          const hasNotification = namespaceInfo.has(baseName + 'Notification');
          if (!hasNotification) {
            uniqueKey = baseName; // Use base name like 'Initialize'
          }
        }

        output.push(`    ${uniqueKey}: {`);
        output.push(`      Method: '${info.method}';`);
        output.push(`      Params: ${params};`);
        output.push(`      Result?: ${result};`);
        output.push(`      ClientCapability: ${clientCap};`);
        output.push(`      ServerCapability: '${serverCap}';`);
        output.push(`      Options: ${options};`);
        output.push(`      RegistrationOptions: ${regOptions};`);
        output.push(`      Direction: '${info.messageDirection}';`);
        output.push(`    };`);
      }

      output.push(`  };`);
    }

    output.push('};');
    output.push('');

    // Generate LSPNotification type with nested structure
    output.push('export type LSPNotification = {');

    for (const [nsPrefix, methods] of groupedNotifications) {
      const capitalizedNs = nsPrefix.charAt(0).toUpperCase() + nsPrefix.slice(1);

      output.push(`  ${capitalizedNs}: {`);

      for (const [nsName, info] of methods) {
        // Use extracted types from namespace
        const params = info.paramsType;
        const clientCap = info.clientCapabilitiesType;
        const serverCap = info.serverCapability;
        const options = info.optionsType;
        const regOptions = info.registrationOptionsType;

        // Use namespace name as unique key (strip Notification suffix for cleaner names)
        let uniqueKey = nsName.replace(/Notification$/, '');

        output.push(`    ${uniqueKey}: {`);
        output.push(`      Method: '${info.method}';`);
        output.push(`      Params: ${params};`);
        output.push(`      ClientCapability: ${clientCap};`);
        output.push(`      ServerCapability: '${serverCap}';`);
        output.push(`      Options: ${options};`);
        output.push(`      RegistrationOptions: ${regOptions};`);
        output.push(`      Direction: '${info.messageDirection}';`);
        output.push(`    };`);
      }

      output.push(`  };`);
    }

    output.push('};');
    output.push('');

    // Generate LSPRequest const with method strings
    output.push('export const LSPRequest = {');

    for (const [nsPrefix, methods] of groupedRequests) {
      const capitalizedNs = nsPrefix.charAt(0).toUpperCase() + nsPrefix.slice(1);

      output.push(`  ${capitalizedNs}: {`);

      for (const [nsName, info] of methods) {
        // Use the same unique key logic as in the type
        let uniqueKey = nsName;
        if (nsName.endsWith('Request')) {
          const baseName = nsName.replace(/Request$/, '');
          const hasNotification = namespaceInfo.has(baseName + 'Notification');
          if (!hasNotification) {
            uniqueKey = baseName;
          }
        }

        output.push(
          `    ${uniqueKey}: { Method: '${info.method}' as const, ServerCapability: '${info.serverCapability}' as const, Direction: '${info.messageDirection}' as const },`
        );
      }

      output.push(`  },`);
    }

    output.push('} as const;');
    output.push('');

    // Generate LSPNotification const with method strings
    output.push('export const LSPNotification = {');

    for (const [nsPrefix, methods] of groupedNotifications) {
      const capitalizedNs = nsPrefix.charAt(0).toUpperCase() + nsPrefix.slice(1);

      output.push(`  ${capitalizedNs}: {`);

      for (const [nsName, info] of methods) {
        // Use the same unique key logic as in the type
        let uniqueKey = nsName.replace(/Notification$/, '');

        output.push(
          `    ${uniqueKey}: { Method: '${info.method}' as const, ServerCapability: '${info.serverCapability}' as const, Direction: '${info.messageDirection}' as const },`
        );
      }

      output.push(`  },`);
    }

    output.push('} as const;');
    output.push('');

    const outputPath = path.join(process.cwd(), 'packages/core/src/protocol/namespaces.ts');
    fs.writeFileSync(outputPath, output.join('\n') + '\n');
    console.log(`   Written to ${outputPath}`);

    // Use ts-morph to fix imports
    const generatedFile = this.project.addSourceFileAtPath(outputPath);
    generatedFile.fixMissingImports();
    await generatedFile.save();
    console.log(`   Fixed imports in ${outputPath}`);
  }
}

// Run generator
const generator = new ProtocolTypeGenerator();
generator.generate().catch(console.error);
