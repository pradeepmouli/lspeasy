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
  SourceFile,
  VariableDeclarationKind,
  type CodeBlockWriter
} from 'ts-morph';
import * as fs from 'node:fs';
import * as path from 'node:path';
import camelCase from 'camelcase';
import { fetchMetaModel } from './fetch-metamodel.ts';
import { MetaModelParser } from './lib/metamodel-parser.ts';
import type {
  MetaModel,
  Structure,
  Enumeration,
  TypeAlias,
  Request,
  Notification,
  Type,
  ArrayType,
  OrType,
  AndType,
  TupleType,
  LiteralType,
  StringLiteralTypeReference,
  MapType
} from './lib/metamodel-types.ts';

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
  }

  async generate() {
    console.log('🔍 Generating LSP protocol from metaModel.json...\n');

    // Step 1: Fetch and parse metaModel.json
    await this.initialize();

    // Step 2: Extract categories from request/notification method names
    this.extractCategories();

    // Step 3: Generate types.ts
    //await this.generateTypesFile();

    // Step 3b: Generate enums.ts
    await this.generateEnumsFile();

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

// Re-export all LSP protocol types
export * from './types.js';`);

    // Save file (ts-morph will format it)
    await sourceFile.save();

    console.log(`   ✅ Generated ${this.typesOutputPath}`);
    console.log(`   ✅ Re-exporting all types from ./types.js\n`);
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
              const usedNames = new Set<string>();
              for (const request of categoryInfo.requests) {
                this.writeRequestType(writer, request, usedNames);
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
              const usedNames = new Set<string>();
              for (const notification of categoryInfo.notifications) {
                this.writeNotificationType(writer, notification, usedNames);
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
                  const usedNames = new Set<string>();
                  for (const request of categoryInfo.requests) {
                    this.writeRequestConst(writer, request, usedNames);
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
                  const usedNames = new Set<string>();
                  for (const notification of categoryInfo.notifications) {
                    this.writeNotificationConst(writer, notification, usedNames);
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
  private writeRequestType(writer: CodeBlockWriter, request: Request, usedNames: Set<string>) {
    const finalName = this.getUniqueName(request.method, usedNames);

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
  private writeNotificationType(
    writer: CodeBlockWriter,
    notification: Notification,
    usedNames: Set<string>
  ) {
    const finalName = this.getUniqueName(notification.method, usedNames);

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
  private writeRequestConst(writer: CodeBlockWriter, request: Request, usedNames: Set<string>) {
    const finalName = this.getUniqueName(request.method, usedNames);

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
  private writeNotificationConst(
    writer: CodeBlockWriter,
    notification: Notification,
    usedNames: Set<string>
  ) {
    const finalName = this.getUniqueName(notification.method, usedNames);

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

  /**
   * Get a unique name for a method, handling duplicates
   */
  private getUniqueName(method: string, usedNames: Set<string>): string {
    const methodParts = method.split('/');
    let constName: string;

    if (methodParts.length > 2) {
      const secondLast = camelCase(methodParts[methodParts.length - 2], { pascalCase: true });
      const last = camelCase(methodParts[methodParts.length - 1], { pascalCase: true });
      constName = secondLast + last;
    } else {
      const methodName = methodParts[methodParts.length - 1];
      constName = camelCase(methodName, { pascalCase: true });
    }

    let finalName = constName;
    let counter = 2;
    while (usedNames.has(finalName)) {
      finalName = `${constName}${counter}`;
      counter++;
    }
    usedNames.add(finalName);

    return finalName;
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
