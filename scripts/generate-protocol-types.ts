#!/usr/bin/env tsx
/**
 * Code generator for LSP protocol types and namespaces (metaModel-based)
 *
 * This script uses the official LSP metaModel.json to generate:
 * 1. Complete type re-exports in packages/core/src/protocol/types.ts
 * 2. Complete namespace definitions in packages/core/src/protocol/namespaces.ts
 *
 * Migration: Replaced TypeScript AST parsing with metaModel.json parsing
 * Performance: ~100ms (was ~2-3 seconds with AST parsing)
 * Complexity: ~500 LOC (was ~1,100 LOC with AST parsing)
 *
 * Usage: pnpm tsx scripts/generate-protocol-types.ts
 */

import {
  IndentationText,
  Project,
  QuoteKind,
  VariableDeclarationKind,
  type CodeBlockWriter
} from 'ts-morph';
import * as path from 'node:path';
import * as fs from 'node:fs';
import camelCase from 'camelcase';
import { ZodBuilder as ZB, type Builder as ZodSchemaBuilder } from 'x-to-zod';
import { fetchMetaModel } from './fetch-metamodel.ts';
import { MetaModelParser } from './lib/metamodel-parser.ts';
import type {
  MetaModel,
  Request,
  Notification,
  Type,
  BaseTypes,
  ReferenceType,
  ArrayType,
  OrType,
  AndType,
  TupleType,
  LiteralType,
  StringLiteralTypeReference,
  MapType,
  Property
} from './lib/metamodel-types.ts';

const { buildV4: build } = ZB;

interface CategoryInfo {
  name: string;
  requests: Request[];
  notifications: Notification[];
}

// Valid TypeScript identifier pattern — names from the network are checked before
// being interpolated into generated source files to prevent code injection.
const TS_IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
function assertSafeIdentifier(name: string): string {
  if (!TS_IDENTIFIER.test(name)) {
    throw new Error(`Unsafe identifier in metaModel data: ${JSON.stringify(name)}`);
  }
  return name;
}

class ProtocolTypeGenerator {
  private outputProject: Project;
  private metaModel!: MetaModel;
  private parser!: MetaModelParser;
  private categories = new Map<string, CategoryInfo>();

  /**
   * Convert a metaModel Type to a TypeScript type string
   * @param skipLSPPrefix - If true, don't add LSP prefix for references (used for proposed types)
   */
  private typeToString(type: Type | undefined, skipLSPPrefix = false): string {
    if (!type) return 'void';

    switch (type.kind) {
      case 'reference':
        // Prefix with LSP namespace for imported types (unless skipLSPPrefix is true)
        return skipLSPPrefix ? type.name : `LSP.${type.name}`;
      case 'base':
        // Base types don't need prefix
        return type.name;
      case 'array':
        return `${this.typeToString((type as ArrayType).element, skipLSPPrefix)}[]`;
      case 'or':
        return (type as OrType).items
          .map((t: Type) => this.typeToString(t, skipLSPPrefix))
          .join(' | ');
      case 'and':
        return (type as AndType).items
          .map((t: Type) => this.typeToString(t, skipLSPPrefix))
          .join(' & ');
      case 'tuple':
        return `[${(type as TupleType).items.map((t: Type) => this.typeToString(t, skipLSPPrefix)).join(', ')}]`;
      case 'literal':
        return JSON.stringify((type as LiteralType).value);
      case 'stringLiteral':
        return `'${(type as StringLiteralTypeReference).value}'`;
      case 'map':
        return `{ [key: ${this.typeToString((type as MapType).key, skipLSPPrefix)}]: ${this.typeToString((type as MapType).value, skipLSPPrefix)} }`;
      default:
        return 'unknown';
    }
  }

  // Struct types whose VSCode equivalent exists in vscode-languageserver-protocol.
  // These drive the generated _type-compat-check.ts bidirectional assertions.
  private static readonly COMPAT_CHECK_TYPES = [
    'ServerCapabilities',
    'ClientCapabilities',
    'InitializeParams',
    'CompletionItem',
    'Diagnostic',
    'TextEdit',
    'Location',
    'Position',
    'Range',
    'Hover',
    'DocumentSymbol',
    'WorkspaceFolder',
    'ProgressToken',
    'WorkDoneProgressBegin',
    'WorkDoneProgressReport',
    'WorkDoneProgressEnd',
    'TextDocumentContentChangeEvent',
    'VersionedTextDocumentIdentifier',
    'DidChangeTextDocumentParams',
    'DidOpenTextDocumentParams',
    'DidCloseTextDocumentParams',
    'DidSaveTextDocumentParams'
  ] as const;

  // Enum types exported as named union type aliases in vscode-languageserver-protocol.
  // Skipped: SemanticTokenTypes/Modifiers (VSCode uses nominal TS enum),
  //          WatchKind/ErrorCodes/LSPErrorCodes (VSCode uses uinteger/integer — broader),
  //          PositionEncodingKind (VSCode: string, ours: specific values — _fromVscode fails).
  private static readonly COMPAT_CHECK_ENUMS = [
    'ApplyKind',
    'CodeActionKind',
    'CodeActionTag',
    'CodeActionTriggerKind',
    'CompletionItemKind',
    'CompletionItemTag',
    'CompletionTriggerKind',
    'DiagnosticSeverity',
    'DiagnosticTag',
    'DocumentDiagnosticReportKind',
    'DocumentHighlightKind',
    'FailureHandlingKind',
    'FileChangeType',
    'FileOperationPatternKind',
    'FoldingRangeKind',
    'InlayHintKind',
    'InlineCompletionTriggerKind',
    'InsertTextFormat',
    'InsertTextMode',
    'LanguageKind',
    'MarkupKind',
    'MessageType',
    'MonikerKind',
    'NotebookCellKind',
    'PrepareSupportDefaultBehavior',
    'ResourceOperationKind',
    'SignatureHelpTriggerKind',
    'SymbolKind',
    'SymbolTag',
    'TextDocumentSaveReason',
    'TextDocumentSyncKind',
    'TokenFormat',
    'TraceValue',
    'UniquenessLevel'
  ] as const;

  // Output paths
  private readonly typesOutputPath: string;
  private readonly namespacesOutputPath: string;
  private readonly enumsOutputPath: string;
  private readonly schemasOutputPath: string;
  private readonly typeCompatCheckOutputPath: string;

  constructor() {
    // Initialize ts-morph project for output generation (import management)
    this.outputProject = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      compilerOptions: {
        declaration: true,

        outDir: path.join(process.cwd(), 'packages/core/src/protocol')
      },
      manipulationSettings: {
        quoteKind: QuoteKind.Single,
        indentationText: IndentationText.Tab,
        insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: true
      }
    });

    this.typesOutputPath = path.join(process.cwd(), 'packages/core/src/protocol/types.ts');
    this.namespacesOutputPath = path.join(
      process.cwd(),
      'packages/core/src/protocol/namespaces.ts'
    );
    this.enumsOutputPath = path.join(process.cwd(), 'packages/core/src/protocol/enums.ts');
    this.schemasOutputPath = path.join(process.cwd(), 'packages/core/src/protocol/schemas.ts');
    this.typeCompatCheckOutputPath = path.join(
      process.cwd(),
      'packages/server/test/_type-compat-check.ts'
    );
  }

  async generate() {
    console.log('🔍 Generating LSP protocol from metaModel.json...\n');

    // Step 1: Fetch and parse metaModel.json
    await this.initialize();

    // Step 2: Extract categories from request/notification method names
    this.extractCategories();

    // Step 3: Generate types.ts
    await this.generateTypesFile();

    // Step 3b: Generate enums.ts
    await this.generateEnumsFile();

    // Step 3c: Generate schemas.ts
    this.generateSchemasFile();

    // Step 4: Generate namespaces.ts
    await this.generateNamespacesFile();

    // Step 5: Generate _type-compat-check.ts
    this.generateTypeCompatCheckFile();

    console.log('\n✅ Generation complete!');
    console.log(`   Structures: ${this.parser.getAllStructures().length}`);
    console.log(`   Enumerations: ${this.parser.getAllEnumerations().length}`);
    console.log(`   Type Aliases: ${this.parser.getAllTypeAliases().length}`);
    console.log(`   Requests: ${this.parser.getAllRequests().length}`);
    console.log(`   Notifications: ${this.parser.getAllNotifications().length}`);
    console.log(`   Categories: ${this.categories.size}`);
  }

  private async initialize() {
    console.log('📡 Fetching metaModel.json...');
    this.metaModel = (await fetchMetaModel({ cache: true })) as MetaModel;

    console.log('🔧 Initializing parser...');
    this.parser = new MetaModelParser(this.metaModel);
    this.parser.buildRegistry();

    console.log('✅ Initialization complete\n');
  }

  private extractCategories() {
    console.log('📁 Extracting categories...');

    const categoryMap = new Map<string, CategoryInfo>();
    const categories = this.parser.getCategories();
    categories.add('lifecycle'); // Ensure 'lifecycle' category is included

    for (const category of categories) {
      const requests = this.parser.getRequestsByCategory(category);
      const notifications = this.parser.getNotificationsByCategory(category);

      categoryMap.set(category, {
        name: category,
        requests,
        notifications
      });
    }

    this.categories = categoryMap;
    console.log(`   Found ${this.categories.size} categories\n`);
  }

  private async generateTypesFile() {
    console.log('📝 Generating types.ts...');

    const structures = this.parser.getAllStructures();
    const typeAliases = this.parser.getAllTypeAliases();
    const enumerations = this.parser.getAllEnumerations();
    const enumNames = new Set(enumerations.map((e) => e.name));

    const lines: string[] = [];

    lines.push('/**');
    lines.push(' * LSP Protocol Types');
    lines.push(' *');
    lines.push(' * Generated directly from metaModel.json — not inferred from Zod schemas.');
    lines.push(' * Optional properties use `prop?: T` (no `| undefined`) so these types are');
    lines.push(' * compatible with packages compiled with exactOptionalPropertyTypes: true.');
    lines.push(' *');
    lines.push(' * Auto-generated — DO NOT EDIT MANUALLY');
    lines.push(' */');
    lines.push('');
    lines.push(`export type * from './enums.js';`);
    lines.push('');

    for (const s of structures) {
      const props = this.collectAllProperties(s.name);
      if (props.length === 0) {
        lines.push(`export type ${assertSafeIdentifier(s.name)} = {};`);
      } else {
        lines.push(`export type ${assertSafeIdentifier(s.name)} = {`);
        for (const p of props) {
          const tsType = this.typeToTsType(p.type);
          lines.push(
            p.optional
              ? `  ${assertSafeIdentifier(p.name)}?: ${tsType};`
              : `  ${assertSafeIdentifier(p.name)}: ${tsType};`
          );
        }
        lines.push(`};`);
      }
      lines.push('');
    }

    for (const a of typeAliases) {
      if (enumNames.has(a.name)) continue;
      // Mutually-recursive JSON-value aliases (LSPAny ↔ LSPArray ↔ LSPObject)
      // recurse THROUGH structural types — object index signatures and arrays —
      // which TypeScript permits; TS2456 only fires on a DIRECT type-alias
      // self-cycle. Emitting the real metaModel type therefore preserves the
      // JSON shape (so callers can't pass non-JSON values) and keeps these types
      // in lockstep with the recursive runtime zod schemas (LSPAnySchema etc.),
      // instead of collapsing to `unknown`.
      lines.push(`export type ${assertSafeIdentifier(a.name)} = ${this.typeToTsType(a.type)};`);
    }

    lines.push('');
    lines.push('// TextDocumentContent has no schema in the metamodel yet');
    lines.push('export type TextDocumentContent = unknown;');

    fs.writeFileSync(this.typesOutputPath, lines.join('\n') + '\n', 'utf8');

    console.log(`   ✅ Generated ${this.typesOutputPath}`);
    console.log(
      `   ✅ Generated ${structures.length} structure types, ${typeAliases.length} alias types\n`
    );
  }

  private async generateNamespacesFile() {
    console.log('📝 Generating namespaces.ts...');

    // Create source file with ts-morph
    const sourceFile = this.outputProject.createSourceFile(this.namespacesOutputPath, '', {
      overwrite: true
    });

    // Add header comment
    sourceFile.insertStatements(0, (writer) => {
      writer.writeLine('/**');
      writer.writeLine(' * LSP Request and Notification namespaces');
      writer.writeLine(' * Auto-generated from metaModel.json');
      writer.writeLine(' *');
      writer.writeLine(' * DO NOT EDIT MANUALLY');
      writer.writeLine(' */');
    });

    // Add import statement
    sourceFile.addImportDeclaration({
      namespaceImport: 'LSP',
      moduleSpecifier: './types.js',
      isTypeOnly: true
    });

    // Generate a namespace for each category
    const sortedCategories = Array.from(this.categories.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    // Build LSPRequest type using ts-morph
    const lspRequestType = sourceFile.addTypeAlias({
      name: 'LSPRequest',
      isExported: true,
      type: (writer) => {
        writer.block(() => {
          for (const [categoryName, categoryInfo] of sortedCategories) {
            if (categoryInfo.requests.length === 0) continue;

            writer.write(`${camelCase(categoryName, { pascalCase: true })}: `);
            writer.block(() => {
              for (const request of categoryInfo.requests) {
                this.writeRequestType(writer, request);
              }
            });
            writer.write(';').newLine();
          }
        });
      }
    });

    // Add JSDoc to LSPRequest
    lspRequestType.addJsDoc({
      description: 'LSP Request type definitions organized by namespace'
    });

    // Build LSPNotification type using ts-morph
    const lspNotificationType = sourceFile.addTypeAlias({
      name: 'LSPNotification',
      isExported: true,
      type: (writer) => {
        writer.block(() => {
          for (const [categoryName, categoryInfo] of sortedCategories) {
            if (categoryInfo.notifications.length === 0) continue;

            writer.write(`${camelCase(categoryName, { pascalCase: true })}: `);
            writer.block(() => {
              for (const notification of categoryInfo.notifications) {
                this.writeNotificationType(writer, notification);
              }
            });
            writer.write(';').newLine();
          }
        });
      }
    });

    // Add JSDoc to LSPNotification
    lspNotificationType.addJsDoc({
      description: 'LSP Notification type definitions organized by namespace'
    });

    // Build LSPRequest const using ts-morph
    const lspRequestConst = sourceFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,
      declarations: [
        {
          name: 'LSPRequest',
          initializer: (writer) => {
            writer.block(() => {
              for (const [categoryName, categoryInfo] of sortedCategories) {
                if (categoryInfo.requests.length === 0) continue;

                writer.write(`${camelCase(categoryName, { pascalCase: true })}: `);
                writer.block(() => {
                  for (const request of categoryInfo.requests) {
                    this.writeRequestConst(writer, request);
                  }
                });
                writer.write(',').newLine();
              }
            });
          }
        }
      ]
    });

    // Add JSDoc to LSPRequest const
    lspRequestConst.addJsDoc({
      description: 'LSP Request methods organized by namespace',
      tags: [
        {
          tagName: 'deprecated',
          text: 'Use individual namespace exports instead'
        }
      ]
    });

    let r = lspRequestConst.getDeclarations()[0].getText();
    r = r.replace(/,\s*}$/, '\n} as const');
    lspRequestConst.getDeclarations()[0].replaceWithText(r);

    // Build LSPNotification const using ts-morph
    const lspNotificationConst = sourceFile.addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      isExported: true,

      declarations: [
        {
          name: 'LSPNotification',

          initializer: (writer: CodeBlockWriter) => {
            writer.block(() => {
              for (const [categoryName, categoryInfo] of sortedCategories) {
                if (categoryInfo.notifications.length === 0) continue;

                writer.write(`${camelCase(categoryName, { pascalCase: true })}: `);
                writer.block(() => {
                  for (const notification of categoryInfo.notifications) {
                    this.writeNotificationConst(writer, notification);
                  }
                });
                writer.write(',').newLine();
              }
            });
          }
        }
      ]
    });

    // Add JSDoc to LSPNotification const
    lspNotificationConst.addJsDoc({
      description: 'LSP Notification methods organized by namespace',
      tags: [
        {
          tagName: 'deprecated',
          text: 'Use individual namespace exports instead'
        }
      ]
    });
    let n = lspNotificationConst.getDeclarations()[0].getText();
    n = n.replace(/,\s*}$/, '\n} as const');
    lspNotificationConst.getDeclarations()[0].replaceWithText(n);

    sourceFile.formatText();

    // Save file (ts-morph will format it)
    await sourceFile.save();

    // Post-process to add 'as const' assertions to the const objects
    /*let content = sourceFile.getFullText();

    // Find and replace the trailing comma after the last category with 'as const'
    // Match pattern: }, (with optional whitespace) then }; at the end of LSPRequest
    content = content.replace(
      /(export const LSPRequest = \{[\s\S]*?\n\s+\}\s*,\s*\n\s+\})\s*;/,
      '$1 as const;'
    );

    // Same for LSPNotification
    content = content.replace(
      /(export const LSPNotification = \{[\s\S]*?\n\s+\}\s*,\s*\n\s+\})\s*;$/m,
      '$1 as const;'
    );

    // Write back the modified content
    sourceFile.replaceWithText(content);*/
    await sourceFile.save();

    console.log(`   ✅ Generated ${this.namespacesOutputPath}`);
    console.log(`   ✅ Generated ${this.categories.size} namespaces\n`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Schema generation helpers
  // ─────────────────────────────────────────────────────────────────────────

  /** Collect all properties for a structure, merging extends + mixins recursively. */
  private collectAllProperties(structName: string, visiting = new Set<string>()): Property[] {
    if (visiting.has(structName)) return [];
    visiting.add(structName);
    const struct = this.parser.getStructure(structName);
    if (!struct) return [];

    const inherited: Property[] = [
      ...(struct.extends ?? []).flatMap((e) =>
        e.kind === 'reference' ? this.collectAllProperties((e as ReferenceType).name, visiting) : []
      ),
      ...(struct.mixins ?? []).flatMap((m) =>
        m.kind === 'reference' ? this.collectAllProperties((m as ReferenceType).name, visiting) : []
      )
    ];

    const byName = new Map<string, Property>();
    for (const p of inherited) byName.set(p.name, p);
    for (const p of struct.properties) byName.set(p.name, p);
    return [...byName.values()];
  }

  /** Collect all named type references from a Type tree. */
  private collectTypeRefs(t: Type, refs: Set<string>): void {
    if (t.kind === 'reference') refs.add((t as ReferenceType).name);
    else if (t.kind === 'array') this.collectTypeRefs((t as ArrayType).element, refs);
    else if (t.kind === 'or') (t as OrType).items.forEach((i) => this.collectTypeRefs(i, refs));
    else if (t.kind === 'and') (t as AndType).items.forEach((i) => this.collectTypeRefs(i, refs));
    else if (t.kind === 'tuple')
      (t as TupleType).items.forEach((i) => this.collectTypeRefs(i, refs));
    else if (t.kind === 'map') {
      this.collectTypeRefs((t as MapType).key, refs);
      this.collectTypeRefs((t as MapType).value, refs);
    }
  }

  /**
   * Convert a metaModel Type to a ZodBuilder using the x-to-zod builder API.
   *
   * @param selfName – name of the enclosing schema (self-reference → z.lazy)
   * @param lazyRefs – schema names that must use z.lazy() due to forward/cyclic refs
   */
  private typeToBuilder(type: Type, selfName?: string, lazyRefs?: Set<string>): ZodSchemaBuilder {
    switch (type.kind) {
      case 'base': {
        const n = (type as BaseTypes).name;
        if (n === 'string' || n === 'URI' || n === 'DocumentUri' || n === 'RegExp')
          return build.string();
        if (n === 'integer') return build.number().int();
        if (n === 'uinteger') return build.number().int().min(0);
        if (n === 'decimal') return build.number();
        if (n === 'boolean') return build.boolean();
        if (n === 'null') return build.literal(null);
        return build.unknown();
      }
      case 'reference': {
        const refName = (type as ReferenceType).name;
        const ref = build.raw(`${refName}Schema`);
        const needsLazy = selfName === refName || (lazyRefs !== undefined && lazyRefs.has(refName));
        return needsLazy ? build.lazy(ref) : ref;
      }
      case 'array':
        return build.array(this.typeToBuilder((type as ArrayType).element, selfName, lazyRefs));
      case 'map': {
        const mt = type as MapType;
        return build.record(
          this.typeToBuilder(mt.key, selfName, lazyRefs),
          this.typeToBuilder(mt.value, selfName, lazyRefs)
        );
      }
      case 'or': {
        const items = (type as OrType).items.map((t) => this.typeToBuilder(t, selfName, lazyRefs));
        return items.length === 1 ? items[0] : build.union(items);
      }
      case 'and': {
        const items = (type as AndType).items.map((t) => this.typeToBuilder(t, selfName, lazyRefs));
        return items.reduce((acc, cur) => build.intersection(acc, cur));
      }
      case 'tuple':
        return build.tuple(
          (type as TupleType).items.map((t) => this.typeToBuilder(t, selfName, lazyRefs))
        );
      case 'literal': {
        const raw = (type as LiteralType).value;
        // Structure literal (anonymous object like `{}` in LSP spec): {properties: [...]}
        if (typeof raw === 'object' && raw !== null && 'properties' in raw) {
          return build.object({});
        }
        const inner = raw as { kind: string; value: unknown };
        return build.literal(inner.value as string | number | boolean | null);
      }
      case 'stringLiteral':
        return build.literal((type as StringLiteralTypeReference).value);
      default:
        return build.unknown();
    }
  }

  /**
   * Convert a metaModel Type to a TypeScript type string for use in inline declarations
   * inside schemas.ts (where LSP namespace isn't available, but schema consts are).
   *
   * @param selfName – name of the enclosing struct; self-references become `_${selfName}`
   */
  private typeToInlineTsType(type: Type, selfName: string): string {
    switch (type.kind) {
      case 'base': {
        const n = (type as BaseTypes).name;
        if (n === 'string' || n === 'URI' || n === 'DocumentUri' || n === 'RegExp') return 'string';
        if (n === 'integer' || n === 'uinteger' || n === 'decimal') return 'number';
        if (n === 'boolean') return 'boolean';
        if (n === 'null') return 'null';
        return 'unknown';
      }
      case 'reference': {
        const refName = (type as ReferenceType).name;
        // Self-reference becomes the private inline type name
        if (refName === selfName) return `_${selfName}`;
        // Other references: use z.infer<typeof …Schema> since schemas are in scope
        return `z.infer<typeof ${refName}Schema>`;
      }
      case 'array':
        return `${this.typeToInlineTsType((type as ArrayType).element, selfName)}[]`;
      case 'map': {
        const mt = type as MapType;
        return `Record<${this.typeToInlineTsType(mt.key, selfName)}, ${this.typeToInlineTsType(mt.value, selfName)}>`;
      }
      case 'or':
        return (type as OrType).items.map((t) => this.typeToInlineTsType(t, selfName)).join(' | ');
      case 'and':
        return (type as AndType).items.map((t) => this.typeToInlineTsType(t, selfName)).join(' & ');
      case 'tuple':
        return `[${(type as TupleType).items.map((t) => this.typeToInlineTsType(t, selfName)).join(', ')}]`;
      case 'literal': {
        const raw = (type as LiteralType).value;
        if (typeof raw === 'object' && raw !== null && 'properties' in raw) return 'object';
        const inner = raw as { kind: string; value: unknown };
        return JSON.stringify(inner.value);
      }
      case 'stringLiteral':
        return JSON.stringify((type as StringLiteralTypeReference).value);
      default:
        return 'unknown';
    }
  }

  /**
   * Convert a metaModel Type to a TypeScript type string for use in types.ts.
   *
   * Produces EOPT-compatible types: optional properties use `prop?: T` (not `T | undefined`),
   * matching how vscode-languageserver-protocol is compiled. All references are bare names
   * since every generated type lives in the same file (or is re-exported from enums.js).
   */
  private typeToTsType(type: Type): string {
    switch (type.kind) {
      case 'base': {
        const n = (type as BaseTypes).name;
        if (n === 'string' || n === 'URI' || n === 'DocumentUri' || n === 'RegExp') return 'string';
        if (n === 'integer' || n === 'uinteger' || n === 'decimal') return 'number';
        if (n === 'boolean') return 'boolean';
        if (n === 'null') return 'null';
        return 'unknown';
      }
      case 'reference': {
        const refName = (type as ReferenceType).name;
        // Expand enum references to their literal unions for structural compatibility
        // with vscode-languageserver-protocol (which uses string/number union type aliases,
        // not nominal TypeScript enums). This ensures `"markdown"` is assignable to
        // `MarkupContent.kind` even though `MarkupKind` is a TypeScript enum in enums.ts.
        const enumDef = this.parser.getAllEnumerations().find((e) => e.name === refName);
        if (enumDef) {
          const literals = enumDef.values.map((v) => JSON.stringify(v.value));
          if (enumDef.supportsCustomValues) {
            literals.push(enumDef.type.name === 'string' ? 'string' : 'number');
          }
          return literals.join(' | ');
        }
        return refName;
      }
      case 'array': {
        const elem = this.typeToTsType((type as ArrayType).element);
        return elem.includes(' | ') || elem.includes(' & ') ? `(${elem})[]` : `${elem}[]`;
      }
      case 'map': {
        const mt = type as MapType;
        const key = this.typeToTsType(mt.key);
        const value = this.typeToTsType(mt.value);
        // String-keyed maps use an inline index signature rather than
        // `Record<string, V>`: TS resolves index-signature value types lazily, so
        // mutually-recursive JSON aliases (LSPObject ↔ LSPArray ↔ LSPAny) compile,
        // whereas `Record<string, LSPAny>` instantiates eagerly and trips TS2456.
        // Non-`string` keys (e.g. identifier aliases) keep `Record<>` — index
        // signature key types are restricted to string/number/symbol.
        return key === 'string' ? `{ [key: string]: ${value} }` : `Record<${key}, ${value}>`;
      }
      case 'or': {
        // Dedupe structurally-identical members: integer/uinteger/decimal all map
        // to `number`, so a raw union (e.g. LSPAny) would emit `number | number |
        // number`. Set-dedup on the rendered member keeps the union minimal.
        const members = (type as OrType).items.map((t) => this.typeToTsType(t));
        return [...new Set(members)].join(' | ');
      }
      case 'and':
        return (type as AndType).items.map((t) => this.typeToTsType(t)).join(' & ');
      case 'tuple':
        return `[${(type as TupleType).items.map((t) => this.typeToTsType(t)).join(', ')}]`;
      case 'literal': {
        const raw = (type as LiteralType).value;
        if (typeof raw === 'object' && raw !== null && 'properties' in raw) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const litProps = (raw as any).properties as Array<{
            name: string;
            type: Type;
            optional?: boolean;
          }>;
          if (litProps.length === 0) return '{}';
          const fields = litProps.map((p) =>
            p.optional
              ? `${p.name}?: ${this.typeToTsType(p.type)}`
              : `${p.name}: ${this.typeToTsType(p.type)}`
          );
          return `{ ${fields.join('; ')} }`;
        }
        const inner = raw as { kind: string; value: unknown };
        return JSON.stringify(inner.value);
      }
      case 'stringLiteral':
        return JSON.stringify((type as StringLiteralTypeReference).value);
      default:
        return 'unknown';
    }
  }

  /** Generate `schemas.ts` — Zod schemas for all LSP structures, enumerations, and type aliases. */
  private generateSchemasFile(): void {
    console.log('📝 Generating schemas.ts...');

    const structures = this.parser.getAllStructures();
    const enumerations = this.parser.getAllEnumerations();
    const typeAliases = this.parser.getAllTypeAliases();
    const requests = this.parser.getAllRequests();
    const notifications = this.parser.getAllNotifications();

    // ── Unified topological sort across all schema kinds ──────────────────
    // Enums are dependency sinks (no deps of their own).
    type SchemaKind = 'enum' | 'struct' | 'alias';
    const allSchemas = new Map<string, SchemaKind>();
    for (const e of enumerations) allSchemas.set(e.name, 'enum');
    for (const s of structures) allSchemas.set(s.name, 'struct');
    for (const a of typeAliases) allSchemas.set(a.name, 'alias');

    const schemaDeps = (name: string): string[] => {
      const kind = allSchemas.get(name);
      if (!kind || kind === 'enum') return [];
      const refs = new Set<string>();
      if (kind === 'struct') {
        for (const p of this.collectAllProperties(name)) this.collectTypeRefs(p.type, refs);
      } else {
        const ta = typeAliases.find((a) => a.name === name)!;
        this.collectTypeRefs(ta.type, refs);
      }
      refs.delete(name);
      return [...refs].filter((r) => allSchemas.has(r));
    };

    // DFS topo sort; schemas discovered as cycle edges go into `lazyRefs`
    const visited = new Set<string>();
    const inProgress = new Set<string>();
    const lazyRefs = new Set<string>(); // these schema names need z.lazy() at their call sites
    const ordered: string[] = [];

    const visit = (name: string): void => {
      if (visited.has(name)) return;
      if (inProgress.has(name)) {
        lazyRefs.add(name); // forward ref — wrap usages in z.lazy()
        return;
      }
      inProgress.add(name);
      for (const dep of schemaDeps(name)) visit(dep);
      inProgress.delete(name);
      visited.add(name);
      ordered.push(name);
    };
    for (const name of allSchemas.keys()) visit(name);

    // Detect self-referential schemas (their property types reference the schema itself)
    // These need an explicit `: z.ZodType<unknown>` annotation to break TS inference cycles.
    const selfReferential = new Set<string>();
    for (const [name, kind] of allSchemas) {
      if (kind === 'enum') continue;
      const refs = new Set<string>();
      if (kind === 'struct') {
        for (const p of this.collectAllProperties(name)) this.collectTypeRefs(p.type, refs);
      } else {
        const ta = typeAliases.find((a) => a.name === name)!;
        this.collectTypeRefs(ta.type, refs);
      }
      if (refs.has(name)) selfReferential.add(name);
    }

    // Schemas needing explicit type annotation to break TS inference cycles
    const needsTypeAnnotation = new Set<string>([...selfReferential, ...lazyRefs]);

    // ── Emit ──────────────────────────────────────────────────────────────
    const lines: string[] = [];

    lines.push('/**');
    lines.push(' * Zod schemas for LSP protocol types');
    lines.push(' * Runtime validators derived from the official LSP metaModel.json');
    lines.push(' *');
    lines.push(' * Auto-generated from metaModel.json — DO NOT EDIT MANUALLY');
    lines.push(' */');
    lines.push('');
    lines.push("import { z } from 'zod';");
    lines.push('');

    for (const name of ordered) {
      const kind = allSchemas.get(name)!;

      if (kind === 'enum') {
        const en = enumerations.find((e) => e.name === name)!;
        const literals = en.values.map((v) =>
          build.literal(v.value as string | number | boolean | null).text()
        );
        // Open enums (supportsCustomValues) widen with the enum's base type so
        // numeric enums (e.g. ErrorCodes, WatchKind) accept numbers, not strings.
        if (en.supportsCustomValues) {
          const fallback =
            en.type.name === 'string'
              ? build.string().text()
              : en.type.name === 'integer'
                ? build.number().int().text()
                : build.number().text();
          literals.push(fallback);
        }
        const schema =
          literals.length === 1
            ? literals[0]
            : build.union(literals.map((l) => build.raw(l))).text();
        lines.push(`export const ${name}Schema = ${schema};`);
        continue;
      }

      if (kind === 'alias') {
        const ta = typeAliases.find((a) => a.name === name)!;
        const ann = needsTypeAnnotation.has(name) ? ': z.ZodType<unknown>' : '';
        const schema = this.typeToBuilder(ta.type, name, lazyRefs).text();
        lines.push(`export const ${name}Schema${ann} = ${schema};`);
        continue;
      }

      // kind === 'struct'
      const props = this.collectAllProperties(name);
      if (selfReferential.has(name)) {
        // Self-referential struct: declare explicit TS type first so z.ZodType<_Name>
        // gives z.infer<typeof NameSchema> the correct concrete shape (not Record<string,unknown>).
        const typePropLines = props.map((p) => {
          const tsType = this.typeToInlineTsType(p.type, name);
          return p.optional ? `  ${p.name}?: ${tsType} | undefined;` : `  ${p.name}: ${tsType};`;
        });
        lines.push(`type _${name} = {`);
        lines.push(typePropLines.join('\n'));
        lines.push(`};`);
        const propEntries = props.map((p) => {
          let builder = this.typeToBuilder(p.type, name, lazyRefs);
          if (p.optional) builder = builder.optional();
          return `  ${p.name}: ${builder.text()}`;
        });
        lines.push(`export const ${name}Schema: z.ZodType<_${name}> = z.object({`);
        lines.push(propEntries.join(',\n'));
        lines.push(`});`);
        continue;
      }
      const ann = needsTypeAnnotation.has(name) ? ': z.ZodObject<z.ZodRawShape>' : '';
      if (props.length === 0) {
        lines.push(`export const ${name}Schema${ann} = z.object({});`);
        continue;
      }
      const propEntries = props.map((p) => {
        let builder = this.typeToBuilder(p.type, name, lazyRefs);
        if (p.optional) builder = builder.optional();
        return `  ${p.name}: ${builder.text()}`;
      });
      lines.push(`export const ${name}Schema${ann} = z.object({`);
      lines.push(propEntries.join(',\n'));
      lines.push(`});`);
    }
    lines.push('');

    // LSPSchemas registry — maps method strings to their params schema
    lines.push('/**');
    lines.push(' * Schema registry for method-based lookup');
    lines.push(' */');
    lines.push('export const LSPSchemas = {');
    for (const req of [...requests, ...notifications].sort((a, b) =>
      a.method.localeCompare(b.method)
    )) {
      if (!req.params || req.params.kind !== 'reference') continue;
      const paramsName = (req.params as ReferenceType).name;
      lines.push(`  ${JSON.stringify(req.method)}: ${paramsName}Schema,`);
    }
    lines.push('} as const;');
    lines.push('');

    // getSchemaForMethod helper
    lines.push('/**');
    lines.push(' * Looks up the Zod validation schema for a given LSP method.');
    lines.push(' */');
    lines.push(
      'export function getSchemaForMethod(method: string): z.ZodType<unknown> | undefined {'
    );
    lines.push('  return LSPSchemas[method as keyof typeof LSPSchemas];');
    lines.push('}');

    fs.writeFileSync(this.schemasOutputPath, lines.join('\n') + '\n', 'utf8');
    console.log(`   ✅ Generated ${this.schemasOutputPath}`);
    console.log(
      `   ✅ Generated ${structures.length} structures, ${enumerations.length} enums, ${typeAliases.length} type aliases\n`
    );
  }

  private async generateEnumsFile() {
    console.log('📝 Generating enums.ts...');

    const enums = this.parser
      .getAllEnumerations()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    const lines: string[] = [];
    lines.push('/**');
    lines.push(' * LSP Protocol Enums');
    lines.push(' *');
    lines.push(' * Emitted as const objects + union type aliases for structural compatibility');
    lines.push(' * with vscode-languageserver-protocol, which uses the same pattern.');
    lines.push(' *');
    lines.push(' * Auto-generated from metaModel.json');
    lines.push(' * DO NOT EDIT MANUALLY');
    lines.push(' */');

    for (const enumeration of enums) {
      lines.push('');
      lines.push(`export const ${assertSafeIdentifier(enumeration.name)} = {`);
      for (const entry of enumeration.values) {
        lines.push(`  ${assertSafeIdentifier(entry.name)}: ${JSON.stringify(entry.value)},`);
      }
      lines.push(`} as const;`);
      lines.push('');
      const literals = enumeration.values.map((v) => JSON.stringify(v.value));
      if (enumeration.supportsCustomValues) {
        literals.push(enumeration.type.name === 'string' ? 'string' : 'number');
      }
      lines.push(`export type ${enumeration.name} = ${literals.join(' | ')};`);
    }

    lines.push('');
    fs.writeFileSync(this.enumsOutputPath, lines.join('\n'), 'utf8');
    console.log(`   ✅ Generated ${this.enumsOutputPath}`);
    console.log(`   ✅ Generated ${enums.length} enums\n`);
  }

  /**
   * Write a request type definition using ts-morph CodeBlockWriter
   */
  private writeRequestType(writer: CodeBlockWriter, request: Request) {
    writer.write(`${request.typeName}: `);
    writer.block(() => {
      writer.writeLine(`Method: '${request.method}';`);

      if (request.params) {
        writer.writeLine(`Params: ${this.typeToString(request.params, request.proposed)};`);
      } else {
        writer.writeLine(`Params: undefined;`);
      }

      if (request.result) {
        writer.writeLine(`Result: ${this.typeToString(request.result, request.proposed)};`);
      }

      if (request.partialResult) {
        writer.writeLine(
          `PartialResult: ${this.typeToString(request.partialResult, request.proposed)};`
        );
      }

      if (request.registrationOptions) {
        writer.writeLine(
          `RegistrationOptions: ${this.typeToString(request.registrationOptions, request.proposed)};`
        );
      }

      if (request.errorData) {
        writer.writeLine(`ErrorData: ${this.typeToString(request.errorData, request.proposed)};`);
      }

      if (request.serverCapability) {
        writer.writeLine(`ServerCapability: '${request.serverCapability}';`);
      }

      if (request.clientCapability) {
        writer.writeLine(`ClientCapability: '${request.clientCapability}';`);
      }

      if (request.registrationMethod) {
        writer.writeLine(`RegistrationMethod: '${request.registrationMethod}';`);
      }

      if (request.since) {
        writer.writeLine(`Since: '${request.since.split(' ')[0]}';`);
      }

      if (request.proposed) {
        writer.writeLine(`Proposed: true;`);
      }

      writer.writeLine(`Direction: '${request.messageDirection}';`);
    });
    writer.write(';').newLine();
  }

  /**
   * Write a notification type definition using ts-morph CodeBlockWriter
   */
  private writeNotificationType(writer: CodeBlockWriter, notification: Notification) {
    writer.write(`${notification.typeName}: `);
    writer.block(() => {
      writer.writeLine(`Method: '${notification.method}';`);

      if (notification.params) {
        writer.writeLine(
          `Params: ${this.typeToString(notification.params, notification.proposed)};`
        );
      } else {
        writer.writeLine(`Params: undefined;`);
      }

      if (notification.clientCapability) {
        writer.writeLine(`ClientCapability: '${notification.clientCapability}';`);
      }

      if (notification.serverCapability) {
        writer.writeLine(`ServerCapability: '${notification.serverCapability}';`);
      }

      if (notification.registrationMethod) {
        writer.writeLine(`RegistrationMethod: '${notification.registrationMethod}';`);
      }

      if (notification.registrationOptions) {
        writer.writeLine(
          `RegistrationOptions: ${this.typeToString(notification.registrationOptions, notification.proposed)};`
        );
      }

      if (notification.since) {
        writer.writeLine(`Since: '${notification.since.split(' ')[0]}';`);
      }

      if (notification.proposed) {
        writer.writeLine(`Proposed: true;`);
      }

      writer.writeLine(`Direction: '${notification.messageDirection}';`);
    });
    writer.write(';').newLine();
  }

  /**
   * Write a request const definition using ts-morph CodeBlockWriter
   */
  private writeRequestConst(writer: CodeBlockWriter, request: Request) {
    writer.write(`${request.typeName}: `);
    writer.block(() => {
      writer.writeLine(`Method: '${request.method}',`);
      writer.writeLine(`Direction: '${request.messageDirection}'`);

      if (request.serverCapability) {
        writer.write(`,`).newLine();
        writer.writeLine(`ServerCapability: '${request.serverCapability}'`);
      }

      if (request.clientCapability) {
        writer.write(`,`).newLine();
        writer.writeLine(`ClientCapability: '${request.clientCapability}'`);
      }

      if (request.registrationMethod) {
        writer.write(`,`).newLine();
        writer.writeLine(`RegistrationMethod: '${request.registrationMethod}'`);
      }
    });
    writer.write(',').newLine();
  }

  /**
   * Write a notification const definition using ts-morph CodeBlockWriter
   */
  private writeNotificationConst(writer: CodeBlockWriter, notification: Notification) {
    writer.write(`${notification.typeName}: `);
    writer.block(() => {
      writer.writeLine(`Method: '${notification.method}',`);
      writer.writeLine(`Direction: '${notification.messageDirection}'`);

      if (notification.serverCapability) {
        writer.write(`,`).newLine();
        writer.writeLine(`ServerCapability: '${notification.serverCapability}'`);
      }

      if (notification.clientCapability) {
        writer.write(`,`).newLine();
        writer.writeLine(`ClientCapability: '${notification.clientCapability}'`);
      }

      if (notification.registrationMethod) {
        writer.write(`,`).newLine();
        writer.writeLine(`RegistrationMethod: '${notification.registrationMethod}'`);
      }
    });
    writer.write(',').newLine();
  }
  private generateTypeCompatCheckFile() {
    console.log('📝 Generating _type-compat-check.ts...');

    const types = ProtocolTypeGenerator.COMPAT_CHECK_TYPES;
    const enums = ProtocolTypeGenerator.COMPAT_CHECK_ENUMS;
    const lines: string[] = [];

    lines.push('/**');
    lines.push(
      ' * Type-compatibility verification between @lspeasy/core and vscode-languageserver-protocol.'
    );
    lines.push(' *');
    lines.push(' * Every struct in COMPAT_CHECK_TYPES and every enum in COMPAT_CHECK_ENUMS is');
    lines.push(' * checked bidirectionally against its VSCode counterpart:');
    lines.push(' *   _fromVscode  — every VSCode value is accepted by our type  (not too narrow)');
    lines.push(" *   _toVscode    — our value is accepted by VSCode's type       (not too wide)");
    lines.push(' *');
    lines.push(' * Our enums are emitted as const objects + union type aliases (matching the');
    lines.push(
      ' * vscode-languageserver-protocol pattern), so checks are direct _Extends assertions'
    );
    lines.push(' * — no normalization helper needed.');
    lines.push(' *');
    lines.push(' * Auto-generated — DO NOT EDIT MANUALLY');
    lines.push(' */');
    lines.push('');

    // VSCode imports — structs + enums in one block
    lines.push(`import type {`);
    for (const name of types) {
      lines.push(`  ${name} as Vscode${name},`);
    }
    for (const name of enums) {
      lines.push(`  ${name} as Vscode${name},`);
    }
    lines.push(`} from 'vscode-languageserver-protocol';`);
    lines.push('');

    // Core imports — structs + enums in one block
    lines.push(`import type {`);
    for (const name of types) {
      lines.push(`  ${name},`);
    }
    for (const name of enums) {
      lines.push(`  ${name},`);
    }
    lines.push(`} from '@lspeasy/core';`);
    lines.push('');

    // Structural assertion helper
    lines.push(`// Structural assertion helper.`);
    lines.push(`type _Extends<Sub extends Sup, Sup> = void;`);
    lines.push('');

    // Struct _fromVscode assertions
    lines.push(`// ── Structs: not-too-narrow ──────────────────────────────────────────────────`);
    for (const name of types) {
      lines.push(`type _${name}_fromVscode = _Extends<Vscode${name}, ${name}>;`);
    }
    lines.push('');

    // Struct _toVscode assertions
    lines.push(`// ── Structs: not-too-wide ────────────────────────────────────────────────────`);
    for (const name of types) {
      lines.push(`type _${name}_toVscode = _Extends<${name}, Vscode${name}>;`);
    }
    lines.push('');

    // Enum _fromVscode assertions
    lines.push(`// ── Enums: not-too-narrow ────────────────────────────────────────────────────`);
    for (const name of enums) {
      lines.push(`type _${name}_fromVscode = _Extends<Vscode${name}, ${name}>;`);
    }
    lines.push('');

    // Enum _toVscode assertions
    lines.push(`// ── Enums: not-too-wide ──────────────────────────────────────────────────────`);
    for (const name of enums) {
      lines.push(`type _${name}_toVscode = _Extends<${name}, Vscode${name}>;`);
    }
    lines.push('');

    // Export block (forces TypeScript to evaluate all aliases)
    lines.push(`export type {`);
    lines.push(`  // Structs — not-too-narrow`);
    for (const name of types) {
      lines.push(`  _${name}_fromVscode,`);
    }
    lines.push(`  // Structs — not-too-wide`);
    for (const name of types) {
      lines.push(`  _${name}_toVscode,`);
    }
    lines.push(`  // Enums — not-too-narrow`);
    for (const name of enums) {
      lines.push(`  _${name}_fromVscode,`);
    }
    lines.push(`  // Enums — not-too-wide`);
    for (const name of enums) {
      lines.push(`  _${name}_toVscode,`);
    }
    lines.push(`};`);
    lines.push('');

    fs.writeFileSync(this.typeCompatCheckOutputPath, lines.join('\n'), 'utf8');

    console.log(
      `   ✅ Generated ${this.typeCompatCheckOutputPath.split('/').pop()} with ${types.length} struct pairs + ${enums.length} enum pairs`
    );
  }
}

// Main execution
async function main() {
  try {
    const generator = new ProtocolTypeGenerator();
    await generator.generate();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Generation failed:');
    console.error((error as Error).message);
    console.error((error as Error).stack);
    process.exit(1);
  }
}

// Run if executed directly
if (process.argv[1]?.includes('generate-protocol-types')) {
  main();
}
