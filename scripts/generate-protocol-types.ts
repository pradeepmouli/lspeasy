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

import { Project, SourceFile } from 'ts-morph';
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
        return skipLSPPrefix ? `any /* ${type.name} (proposed) */` : `LSP.${type.name}`;
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

  constructor() {
    // Initialize ts-morph project for output generation (import management)
    this.outputProject = new Project({
      tsConfigFilePath: path.join(process.cwd(), 'tsconfig.json'),
      compilerOptions: {
        declaration: true,
        outDir: path.join(process.cwd(), 'packages/core/src/protocol')
      }
    });

    this.typesOutputPath = path.join(process.cwd(), 'packages/core/src/protocol/types.ts');
    this.namespacesOutputPath = path.join(
      process.cwd(),
      'packages/core/src/protocol/namespaces.ts'
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

    const lines: string[] = [];

    // Header
    lines.push('/**');
    lines.push(' * LSP Protocol Types');
    lines.push(' *');
    lines.push(' * Auto-generated from metaModel.json');
    lines.push(' * DO NOT EDIT MANUALLY');
    lines.push(' */');
    lines.push('');

    // Simply re-export everything from vscode-languageserver-protocol
    // The package itself knows what should be public
    lines.push('// Re-export all LSP protocol types');
    lines.push("export * from 'vscode-languageserver-protocol';");
    lines.push('');

    // Write to file
    const content = lines.join('\n');
    fs.writeFileSync(this.typesOutputPath, content, 'utf-8');

    console.log(`   ✅ Generated ${this.typesOutputPath}`);
    console.log(`   ✅ Re-exporting all types from vscode-languageserver-protocol\n`);
  }

  private async generateNamespacesFile() {
    console.log('📝 Generating namespaces.ts...');

    const lines: string[] = [];

    // Header
    lines.push('/**');
    lines.push(' * LSP Request and Notification namespaces');
    lines.push(' * Auto-generated from metaModel.json');
    lines.push(' *');
    lines.push(' * DO NOT EDIT MANUALLY');
    lines.push(' */');
    lines.push('');
    // Import all types from vscode-languageserver-protocol for type definitions
    lines.push("import type * as LSP from 'vscode-languageserver-protocol';");
    lines.push('');
    // Generate a namespace for each category
    const sortedCategories = Array.from(this.categories.entries()).sort((a, b) =>
      a[0].localeCompare(b[0])
    );

    for (const [categoryName, categoryInfo] of sortedCategories) {
      lines.push(`/**`);
      lines.push(` * ${categoryName} namespace`);
      lines.push(` */`);
      lines.push(`export namespace ${categoryName} {`);

      // Track method names to avoid duplicates
      const usedNames = new Set<string>();

      // Add requests to namespace
      for (const request of categoryInfo.requests) {
        const methodParts = request.method.split('/');
        let constName: string;

        // For multi-level methods like "workspace/foldingRange/refresh",
        // use the last two parts to create a unique name
        if (methodParts.length > 2) {
          const secondLast = camelCase(methodParts[methodParts.length - 2], { pascalCase: true });
          const last = camelCase(methodParts[methodParts.length - 1], { pascalCase: true });
          constName = secondLast + last;
        } else {
          const methodName = methodParts[methodParts.length - 1];
          constName = camelCase(methodName, { pascalCase: true });
        }

        // Make sure name is unique within this namespace
        let finalName = constName;
        let counter = 2;
        while (usedNames.has(finalName)) {
          finalName = `${constName}${counter}`;
          counter++;
        }
        usedNames.add(finalName);

        lines.push(`  /**`);
        if (request.documentation) {
          const docLines = request.documentation.split('\n');
          lines.push(`   * ${docLines[0]}`);
        }
        lines.push(`   * @method ${request.method}`);
        lines.push(`   */`);
        lines.push(`  export const ${finalName} = '${request.method}' as const;`);
      }

      // Add notifications to namespace
      for (const notification of categoryInfo.notifications) {
        const methodParts = notification.method.split('/');
        let constName: string;

        // For multi-level methods like "workspace/foldingRange/refresh",
        // use the last two parts to create a unique name
        if (methodParts.length > 2) {
          const secondLast = camelCase(methodParts[methodParts.length - 2], { pascalCase: true });
          const last = camelCase(methodParts[methodParts.length - 1], { pascalCase: true });
          constName = secondLast + last;
        } else {
          const methodName = methodParts[methodParts.length - 1];
          constName = camelCase(methodName, { pascalCase: true });
        }

        // Make sure name is unique within this namespace
        let finalName = constName;
        let counter = 2;
        while (usedNames.has(finalName)) {
          finalName = `${constName}${counter}`;
          counter++;
        }
        usedNames.add(finalName);

        lines.push(`  /**`);
        if (notification.documentation) {
          const docLines = notification.documentation.split('\n');
          lines.push(`   * ${docLines[0]}`);
        }
        lines.push(`   * @method ${notification.method}`);
        lines.push(`   */`);
        lines.push(`  export const ${finalName} = '${notification.method}' as const;`);
      }

      lines.push('}');
      lines.push('');
    }

    // Generate LSPRequest type for backward compatibility
    lines.push('/**');
    lines.push(' * LSP Request type definitions organized by namespace');
    lines.push(' */');
    lines.push('export type LSPRequest = {');

    for (const [categoryName, categoryInfo] of sortedCategories) {
      if (categoryInfo.requests.length === 0) continue;

      lines.push(`  ${categoryName}: {`);
      const usedNames = new Set<string>();

      for (const request of categoryInfo.requests) {
        const methodParts = request.method.split('/');
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

        lines.push(`    ${finalName}: {`);
        lines.push(`      Method: '${request.method}';`);
        if (request.params) {
          lines.push(`      Params: ${this.typeToString(request.params, request.proposed)};`);
        } else {
          lines.push(`      Params?: never;`);
        }
        if (request.result) {
          lines.push(`      Result: ${this.typeToString(request.result, request.proposed)};`);
        }
        if (request.serverCapability) {
          lines.push(`      ServerCapability: '${request.serverCapability}';`);
        }
        lines.push(`      Direction: 'clientToServer';`);
        lines.push(`    };`);
      }

      lines.push(`  };`);
    }

    lines.push('};');
    lines.push('');

    // Generate LSPNotification type for backward compatibility
    lines.push('/**');
    lines.push(' * LSP Notification type definitions organized by namespace');
    lines.push(' */');
    lines.push('export type LSPNotification = {');

    for (const [categoryName, categoryInfo] of sortedCategories) {
      if (categoryInfo.notifications.length === 0) continue;

      lines.push(`  ${categoryName}: {`);
      const usedNames = new Set<string>();

      for (const notification of categoryInfo.notifications) {
        const methodParts = notification.method.split('/');
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

        lines.push(`    ${finalName}: {`);
        lines.push(`      Method: '${notification.method}';`);
        if (notification.params) {
          lines.push(
            `      Params: ${this.typeToString(notification.params, notification.proposed)};`
          );
        }
        if (notification.clientCapability) {
          lines.push(`      ClientCapability: '${notification.clientCapability}';`);
        }
        lines.push(`      Direction: 'serverToClient';`);
        lines.push(`    };`);
      }

      lines.push(`  };`);
    }

    lines.push('};');
    lines.push('');

    // Generate LSPRequest object for backward compatibility
    lines.push('/**');
    lines.push(' * LSP Request methods organized by namespace');
    lines.push(' * @deprecated Use individual namespace exports instead');
    lines.push(' */');
    lines.push('export const LSPRequest = {');

    for (const [categoryName, categoryInfo] of sortedCategories) {
      if (categoryInfo.requests.length === 0) continue;

      lines.push(`  ${categoryName}: {`);
      const usedNames = new Set<string>();

      for (const request of categoryInfo.requests) {
        const methodParts = request.method.split('/');
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

        lines.push(`    ${finalName}: {`);
        lines.push(`      Method: '${request.method}' as const,`);
        lines.push(`      Direction: 'clientToServer' as const`);
        lines.push(`    },`);
      }

      lines.push(`  },`);
    }

    lines.push('} as const;');
    lines.push('');

    // Generate LSPNotification object for backward compatibility
    lines.push('/**');
    lines.push(' * LSP Notification methods organized by namespace');
    lines.push(' * @deprecated Use individual namespace exports instead');
    lines.push(' */');
    lines.push('export const LSPNotification = {');

    for (const [categoryName, categoryInfo] of sortedCategories) {
      if (categoryInfo.notifications.length === 0) continue;

      lines.push(`  ${categoryName}: {`);
      const usedNames = new Set<string>();

      for (const notification of categoryInfo.notifications) {
        const methodParts = notification.method.split('/');
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

        lines.push(`    ${finalName}: {`);
        lines.push(`      Method: '${notification.method}' as const,`);
        lines.push(`      Direction: 'serverToClient' as const`);
        lines.push(`    },`);
      }

      lines.push(`  },`);
    }

    lines.push('} as const;');
    lines.push('');

    // Write to file
    const content = lines.join('\n');
    fs.writeFileSync(this.namespacesOutputPath, content, 'utf-8');

    console.log(`   ✅ Generated ${this.namespacesOutputPath}`);
    console.log(`   ✅ Generated ${this.categories.size} namespaces\n`);
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
