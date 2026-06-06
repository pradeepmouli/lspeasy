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
        // Prefix with LSP namespace for imported types (unless skipPrefix is true for proposed types)
        return `LSP.${type.name}`;
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

  // Output paths
  private readonly typesOutputPath: string;
  private readonly namespacesOutputPath: string;
  private readonly enumsOutputPath: string;
  private readonly schemasOutputPath: string;

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

    // Create source file with ts-morph
    const sourceFile = this.outputProject.createSourceFile(this.typesOutputPath, '', {
      overwrite: true
    });

    // Add header and re-export using template literal with actual newlines
    sourceFile.addStatements(`/**
 * LSP Protocol Types
 *
 * Auto-generated from metaModel.json
 * DO NOT EDIT MANUALLY
 */

export type * from 'vscode-languageserver-protocol';

export type TextDocumentContentParams = unknown;
export type TextDocumentContent = unknown;

export type TextDocumentContentResult = unknown;

export type TextDocumentContentRegistrationOptions = unknown;

export type TextDocumentContentRefreshParams = unknown;

export type CancelParams = { id: number | string };

export type ProgressParams = {
  token: string | number;
};`);

    // Save file (ts-morph will format it)
    await sourceFile.save();

    console.log(`   ✅ Generated ${this.typesOutputPath}`);
    console.log(`   ✅ Generated protocol type re-exports\n`);
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
        const inner = (type as LiteralType).value as { kind: string; value: unknown };
        return build.literal(inner.value as string | number | boolean | null);
      }
      case 'stringLiteral':
        return build.literal((type as StringLiteralTypeReference).value);
      default:
        return build.unknown();
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

    const sourceFile = this.outputProject.createSourceFile(this.enumsOutputPath, '', {
      overwrite: true
    });

    sourceFile.addStatements(`/**
 * LSP Protocol Enums
 *
 * Auto-generated from metaModel.json
 * DO NOT EDIT MANUALLY
 */`);

    const enums = this.parser
      .getAllEnumerations()
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const enumeration of enums) {
      const enumDeclaration = sourceFile.addEnum({
        name: enumeration.name,
        isExported: true
      });

      for (const entry of enumeration.values) {
        enumDeclaration.addMember({
          name: entry.name,
          initializer:
            typeof entry.value === 'string' ? JSON.stringify(entry.value) : String(entry.value)
        });
      }
    }

    sourceFile.formatText();
    await sourceFile.save();

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
