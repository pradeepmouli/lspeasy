# Migration Guide: TypeScript AST to metaModel.json Code Generation

**Status**: Planning
**Priority**: Medium
**Effort**: 3-5 days
**Impact**: Improved maintainability, better type inference, official protocol compliance

## Overview

Migrate the LSP protocol type code generator from parsing TypeScript AST (`protocol.d.ts`) to using the official `metaModel.json` from the VSCode Language Server repository. This provides a more reliable, structured, and officially-supported source of truth for type generation.

### Why This Matters

| Aspect | Current Approach | metaModel Approach |
|--------|-----------------|-------------------|
| **Source** | TypeScript `.d.ts` (parsed via ts-morph) | Structured JSON (official source) |
| **Reliability** | Fragile to `.d.ts` structure changes | Stable, versioned format |
| **Message Direction** | Inferred from code structure | Explicit in metadata |
| **Capabilities** | Missing | Direct client/server capability mapping |
| **Versions** | Single version only | Multi-version support possible |
| **Parse Speed** | Slow (full AST walk) | Fast (direct JSON parse) |
| **Code Complexity** | ~1100 LOC, AST traversal logic | ~500 LOC, direct mapping |

## Architecture Changes

### Current Architecture
```
protocol.d.ts (npm module)
  ↓ (ts-morph AST parsing)
analyze-protocol-file()
  → Extract namespaces
  → Infer categories
  → Build enum candidates
  ↓
Generate types.ts + namespaces.ts
```

### New Architecture
```
metaModel.json (fetch from GitHub OR use npm version)
  ↓ (direct JSON parsing)
parseMetaModel()
  → Build type registry
  → Extract requests/notifications
  → Map capabilities
  ↓
Generate types.ts + namespaces.ts + capability-map.ts
```

## Implementation Plan

### Phase 1: Foundation (Day 1)

#### 1.1 Add metaModel Fetching
Create new file: `scripts/fetch-metamodel.ts`

```typescript
/**
 * Download metaModel.json from VSCode Language Server repository
 * Falls back to local node_modules version if offline
 */
import https from 'https';
import fs from 'fs';
import path from 'path';

interface MetaModelFetchOptions {
  version?: string; // e.g., "3.17.0"
  cache?: boolean; // Cache locally
}

export async function fetchMetaModel(
  options: MetaModelFetchOptions = {}
): Promise<MetaModel> {
  const version = options.version || '3.17.0';
  const cacheDir = path.join(process.cwd(), '.cache/metamodel');
  const cachePath = path.join(cacheDir, `metaModel-${version}.json`);

  // Try cache first
  if (options.cache && fs.existsSync(cachePath)) {
    console.log(`📦 Using cached metaModel ${version}`);
    return JSON.parse(fs.readFileSync(cachePath, 'utf-8'));
  }

  // Try GitHub
  try {
    console.log(`🔍 Fetching metaModel ${version} from GitHub...`);
    const url =
      `https://raw.githubusercontent.com/microsoft/vscode-languageserver-node/` +
      `main/protocol/metaModel.json`;

    return await downloadJSON<MetaModel>(url);
  } catch (error) {
    console.warn(`⚠️  GitHub fetch failed, trying npm fallback...`);
    return fallbackToNpmVersion();
  }
}

async function downloadJSON<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

function fallbackToNpmVersion(): MetaModel {
  // Try to extract from protocol.d.ts or use pre-bundled version
  const fallbackPath = path.join(
    process.cwd(),
    'node_modules/vscode-languageserver-protocol/lib/common/metaModel.json'
  );
  if (fs.existsSync(fallbackPath)) {
    return JSON.parse(fs.readFileSync(fallbackPath, 'utf-8'));
  }
  throw new Error('Could not fetch metaModel.json from any source');
}
```

#### 1.2 Define Type Interfaces
Create new file: `scripts/lib/metamodel-types.ts`

```typescript
/**
 * Type definitions matching metaModel.json schema
 * Based on: https://github.com/microsoft/vscode-languageserver-node/blob/main/protocol/metaModel.schema.json
 */

export interface MetaModel {
  metaData: MetaData;
  requests: Request[];
  notifications: Notification[];
  structures: Structure[];
  enumerations: Enumeration[];
  typeAliases: TypeAlias[];
}

export interface MetaData {
  version: string;
}

export interface Request {
  method: string;
  typeName?: string;
  documentation?: string;
  messageDirection: MessageDirection;
  clientCapability?: string;
  serverCapability?: string;
  params?: Type | Type[];
  result: Type;
  partialResult?: Type;
  registrationMethod?: string;
  registrationOptions?: Type;
  errorData?: Type;
  proposed?: boolean;
  since?: string;
  sinceTags?: string[];
}

export interface Notification {
  method: string;
  typeName?: string;
  documentation?: string;
  messageDirection: MessageDirection;
  clientCapability?: string;
  serverCapability?: string;
  params?: Type | Type[];
  registrationMethod?: string;
  registrationOptions?: Type;
  proposed?: boolean;
  since?: string;
  sinceTags?: string[];
}

export interface Structure {
  name: string;
  documentation?: string;
  properties: Property[];
  extends?: Type[];
  mixins?: Type[];
  proposed?: boolean;
  since?: string;
  sinceTags?: string[];
}

export interface Property {
  name: string;
  type: Type;
  documentation?: string;
  optional?: boolean;
  proposed?: boolean;
  since?: string;
  sinceTags?: string[];
}

export interface Enumeration {
  name: string;
  type: EnumerationType;
  values: EnumerationEntry[];
  documentation?: string;
  supportsCustomValues?: boolean;
  proposed?: boolean;
  since?: string;
  sinceTags?: string[];
}

export interface EnumerationEntry {
  name: string;
  value: string | number;
  documentation?: string;
  proposed?: boolean;
  since?: string;
}

export interface TypeAlias {
  name: string;
  type: Type;
  documentation?: string;
  proposed?: boolean;
  since?: string;
  sinceTags?: string[];
}

export type MessageDirection = 'clientToServer' | 'serverToClient' | 'both';

export type Type =
  | BaseType
  | ReferenceType
  | ArrayType
  | MapType
  | OrType
  | AndType
  | TupleType
  | StructureLiteralType
  | StringLiteralType
  | IntegerLiteralType
  | BooleanLiteralType;

export interface BaseType {
  kind: 'base';
  name: BaseTypeName;
}

export interface ReferenceType {
  kind: 'reference';
  name: string;
}

export interface ArrayType {
  kind: 'array';
  element: Type;
}

export interface MapType {
  kind: 'map';
  key: MapKeyType;
  value: Type;
}

export interface OrType {
  kind: 'or';
  items: Type[];
}

export interface AndType {
  kind: 'and';
  items: Type[];
}

export interface TupleType {
  kind: 'tuple';
  items: Type[];
}

export interface StructureLiteralType {
  kind: 'literal';
  value: StructureLiteral;
}

export interface StructureLiteral {
  properties: Property[];
}

export interface StringLiteralType {
  kind: 'stringLiteral';
  value: string;
}

export interface IntegerLiteralType {
  kind: 'integerLiteral';
  value: number;
}

export interface BooleanLiteralType {
  kind: 'booleanLiteral';
  value: boolean;
}

export type MapKeyType = BaseType | ReferenceType;

export type BaseTypeName =
  | 'URI'
  | 'DocumentUri'
  | 'integer'
  | 'uinteger'
  | 'decimal'
  | 'RegExp'
  | 'string'
  | 'boolean'
  | 'null';

export interface EnumerationType {
  kind: 'base';
  name: 'string' | 'integer' | 'uinteger';
}
```

#### 1.3 Create MetaModel Parser
Create new file: `scripts/lib/metamodel-parser.ts`

```typescript
/**
 * Parses metaModel.json and builds internal registries for code generation
 */

import type { MetaModel, Request, Notification, Type } from './metamodel-types.js';

export interface MethodRegistry {
  requests: Map<string, Request>;
  notifications: Map<string, Notification>;
  byCapability: {
    server: Map<string, (Request | Notification)[]>;
    client: Map<string, (Request | Notification)[]>;
  };
}

export class MetaModelParser {
  constructor(private model: MetaModel) {}

  /**
   * Build a registry mapping method names and capabilities
   */
  buildRegistry(): MethodRegistry {
    const registry: MethodRegistry = {
      requests: new Map(),
      notifications: new Map(),
      byCapability: {
        server: new Map(),
        client: new Map()
      }
    };

    // Index requests
    for (const req of this.model.requests) {
      registry.requests.set(req.method, req);

      if (req.serverCapability) {
        if (!registry.byCapability.server.has(req.serverCapability)) {
          registry.byCapability.server.set(req.serverCapability, []);
        }
        registry.byCapability.server.get(req.serverCapability)!.push(req);
      }

      if (req.clientCapability) {
        if (!registry.byCapability.client.has(req.clientCapability)) {
          registry.byCapability.client.set(req.clientCapability, []);
        }
        registry.byCapability.client.get(req.clientCapability)!.push(req);
      }
    }

    // Index notifications
    for (const notif of this.model.notifications) {
      registry.notifications.set(notif.method, notif);

      if (notif.serverCapability) {
        if (!registry.byCapability.server.has(notif.serverCapability)) {
          registry.byCapability.server.set(notif.serverCapability, []);
        }
        registry.byCapability.server.get(notif.serverCapability)!.push(notif);
      }

      if (notif.clientCapability) {
        if (!registry.byCapability.client.has(notif.clientCapability)) {
          registry.byCapability.client.set(notif.clientCapability, []);
        }
        registry.byCapability.client.get(notif.clientCapability)!.push(notif);
      }
    }

    return registry;
  }

  /**
   * Resolve a type reference to its full definition
   */
  resolveType(type: Type): Type {
    if (type.kind === 'reference') {
      // Look up in structures, enums, type aliases
      const struct = this.model.structures.find(s => s.name === type.name);
      if (struct) return type; // Keep as reference for generation

      const enumDef = this.model.enumerations.find(e => e.name === type.name);
      if (enumDef) return type;

      const alias = this.model.typeAliases.find(a => a.name === type.name);
      if (alias) return type;
    }
    return type;
  }

  /**
   * Get all server capabilities (unique set)
   */
  getServerCapabilities(): Set<string> {
    const caps = new Set<string>();
    for (const req of this.model.requests) {
      if (req.serverCapability) caps.add(req.serverCapability);
    }
    for (const notif of this.model.notifications) {
      if (notif.serverCapability) caps.add(notif.serverCapability);
    }
    return caps;
  }

  /**
   * Get all client capabilities (unique set)
   */
  getClientCapabilities(): Set<string> {
    const caps = new Set<string>();
    for (const req of this.model.requests) {
      if (req.clientCapability) caps.add(req.clientCapability);
    }
    for (const notif of this.model.notifications) {
      if (notif.clientCapability) caps.add(notif.clientCapability);
    }
    return caps;
  }

  /**
   * Extract categories from method names
   * e.g., "textDocument/hover" → "textDocument"
   */
  getCategories(): Map<string, { requests: Set<string>; notifications: Set<string> }> {
    const categories = new Map();

    for (const req of this.model.requests) {
      const cat = req.method.split('/')[0];
      if (!categories.has(cat)) {
        categories.set(cat, { requests: new Set(), notifications: new Set() });
      }
      categories.get(cat).requests.add(req.method);
    }

    for (const notif of this.model.notifications) {
      const cat = notif.method.split('/')[0];
      if (!categories.has(cat)) {
        categories.set(cat, { requests: new Set(), notifications: new Set() });
      }
      categories.get(cat).notifications.add(notif.method);
    }

    return categories;
  }
}
```

### Phase 2: Code Generation (Day 2-3)

#### 2.1 Refactor Type Generation
Update `scripts/generate-protocol-types.ts` to use metaModel:

**Key changes:**
- Remove `analyzeProtocolFile()` and `analyzeTypesFile()`
- Replace with single `fetchAndParseMetaModel()`
- Use `MetaModelParser` to build registries
- Simplify enum extraction (use `Enumeration` directly from model)
- Generate capability mapping file

#### 2.2 Create Capability Map Generator
New file: `scripts/lib/generate-capability-map.ts`

```typescript
/**
 * Generate capability-to-methods mapping for capability-aware dispatch
 * Used by capability-guard.ts and capability-proxy.ts
 */

export function generateCapabilityMap(parser: MetaModelParser): string {
  const serverCaps = parser.getServerCapabilities();
  const clientCaps = parser.getClientCapabilities();

  let output = `/**
 * Auto-generated capability mappings from metaModel.json
 * Maps LSP capabilities to their associated requests/notifications
 */

export const SERVER_CAPABILITIES = {
`;

  for (const cap of Array.from(serverCaps).sort()) {
    output += `  '${cap}': true as const,\n`;
  }

  output += `} as const;\n\n`;

  output += `export const CLIENT_CAPABILITIES = {\n`;
  for (const cap of Array.from(clientCaps).sort()) {
    output += `  '${cap}': true as const,\n`;
  }

  output += `} as const;\n`;

  return output;
}
```

### Phase 3: Testing & Validation (Day 4)

#### 3.1 Test Coverage Strategy

**Unit Tests** (`scripts/__tests__/metamodel.test.ts`):
```typescript
describe('MetaModel Migration', () => {
  let model: MetaModel;
  let parser: MetaModelParser;

  beforeAll(async () => {
    model = await fetchMetaModel();
    parser = new MetaModelParser(model);
  });

  describe('Registry Building', () => {
    it('should index all requests by method', () => {
      const registry = parser.buildRegistry();
      expect(registry.requests.size).toBeGreaterThan(0);
      expect(registry.requests.has('textDocument/hover')).toBe(true);
    });

    it('should index all notifications by method', () => {
      const registry = parser.buildRegistry();
      expect(registry.notifications.size).toBeGreaterThan(0);
    });

    it('should map capabilities correctly', () => {
      const registry = parser.buildRegistry();
      const hoverMethods = registry.byCapability.server.get('hoverProvider');
      expect(hoverMethods).toBeDefined();
      expect(hoverMethods?.some(m => m.method === 'textDocument/hover')).toBe(true);
    });
  });

  describe('Type Resolution', () => {
    it('should resolve reference types', () => {
      const refType: ReferenceType = { kind: 'reference', name: 'Position' };
      const resolved = parser.resolveType(refType);
      expect(resolved.kind).toBe('reference');
    });
  });

  describe('Backward Compatibility', () => {
    it('should generate same types.ts output', async () => {
      // Compare generated types with current types.ts
      const generated = await generateTypesFile(model);
      const current = fs.readFileSync(
        'packages/core/src/protocol/types.ts',
        'utf-8'
      );
      expect(generated.trim()).toEqual(current.trim());
    });

    it('should generate same namespaces.ts output', async () => {
      // Compare generated namespaces with current namespaces.ts
      const generated = await generateNamespacesFile(model);
      const current = fs.readFileSync(
        'packages/core/src/protocol/namespaces.ts',
        'utf-8'
      );
      expect(generated.trim()).toEqual(current.trim());
    });
  });

  describe('Integration Tests', () => {
    it('infer.ts should still work with generated types', () => {
      // Test that ParamsForRequest<'textDocument/hover'> works
      type HoverParams = ParamsForRequest<'textDocument/hover'>;
      const params: HoverParams = { textDocument: { uri: 'file://test' }, position: { line: 0, character: 0 } };
      expect(params).toBeDefined();
    });
  });
});
```

#### 3.2 E2E Validation

**Checklist before merging:**

- [ ] Generated types.ts compiles without errors
- [ ] Generated namespaces.ts compiles without errors
- [ ] All existing tests pass
- [ ] `infer.ts` type inference still works
- [ ] `capability-guard.ts` builds correctly
- [ ] `capability-proxy.ts` builds correctly
- [ ] E2E tests in `e2e/` directory pass
- [ ] No regressions in `examples/`

#### 3.3 Validation Script
Create: `scripts/validate-metamodel-migration.ts`

```typescript
/**
 * Validate that migration didn't break anything
 */

async function validateMigration() {
  console.log('🔍 Validating metaModel migration...\n');

  // 1. Check types.ts is valid
  console.log('✓ Checking types.ts...');
  try {
    await import('../packages/core/src/protocol/types.js');
  } catch (e) {
    console.error('✗ types.ts has errors:', e.message);
    process.exit(1);
  }

  // 2. Check namespaces.ts is valid
  console.log('✓ Checking namespaces.ts...');
  try {
    await import('../packages/core/src/protocol/namespaces.js');
  } catch (e) {
    console.error('✗ namespaces.ts has errors:', e.message);
    process.exit(1);
  }

  // 3. Check infer.ts type inference
  console.log('✓ Checking type inference...');
  try {
    // Compile-time check via TypeScript
    execSync('tsc --noEmit', { cwd: process.cwd() });
  } catch (e) {
    console.error('✗ Type checking failed:', e.message);
    process.exit(1);
  }

  // 4. Run test suite
  console.log('✓ Running tests...');
  try {
    execSync('pnpm test', { cwd: process.cwd() });
  } catch (e) {
    console.error('✗ Tests failed:', e.message);
    process.exit(1);
  }

  console.log('\n✅ Migration validation passed!');
}
```

### Phase 4: Documentation (Day 5)

#### 4.1 Update Architecture Docs
Update `docs/ARCHITECTURE.md`:

```markdown
## Code Generation

### metaModel.json Source

The LSP protocol types are generated from the official `metaModel.json`
provided by the VSCode Language Server team.

**Source**: https://github.com/microsoft/vscode-languageserver-node/blob/main/protocol/metaModel.json

**Generation Process**:

1. Fetch metaModel.json (cached locally)
2. Parse into type-safe TypeScript interfaces
3. Generate:
   - `types.ts` - All LSP types with proper exports
   - `namespaces.ts` - Organized by category with correct method signatures
   - `capability-map.ts` - Server/client capability mappings
4. Validate output compiles and passes tests

**Advantages**:
- Official, versioned source of truth
- Structured metadata (message direction, capabilities)
- More reliable than parsing TypeScript definitions
- Enables multi-version support

### Running Code Generation

```bash
# Generate from metaModel.json
pnpm exec tsx scripts/generate-protocol-types.ts

# Validate output
pnpm exec tsx scripts/validate-metamodel-migration.ts
```
```

#### 4.2 Update Contributing Guide
Add section to `CONTRIBUTING.md`:

```markdown
## Updating LSP Protocol Support

When a new LSP protocol version is released:

1. The metaModel.json will be updated in vscode-languageserver-node
2. Run: `pnpm exec tsx scripts/generate-protocol-types.ts`
3. This will:
   - Fetch the latest metaModel.json
   - Regenerate types, namespaces, and capability maps
   - Update `CHANGELOG.md` with new methods/types
4. Review generated diff and commit
5. Test with real language servers to ensure compatibility

No manual type updates needed - generation handles everything.
```

## Rollback Plan

If issues arise during migration:

### Quick Rollback (within same branch)
```bash
# Restore original files
git checkout HEAD -- packages/core/src/protocol/

# Revert generator script
git checkout HEAD -- scripts/generate-protocol-types.ts
```

### Full Rollback (keep current branch, revert commits)
```bash
# Revert to commit before migration
git revert <migration-commit-sha>
```

### Hybrid Approach (if partial issues)
```bash
# Keep AST-based generation temporarily
git stash
# Work on problematic area
# Create parallel metaModel branch
```

## Success Criteria

✅ **Completion achieved when**:

- [ ] All protocol types generated from metaModel.json
- [ ] All tests pass (unit, integration, e2e)
- [ ] Backward compatibility verified (same type exports)
- [ ] New capability mapping file generated and working
- [ ] Documentation updated
- [ ] CI pipeline updated (if applicable)
- [ ] Performance improved (faster generation)
- [ ] Code complexity reduced (fewer AST-related modules)

## Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Phase 1: Foundation | 1 day | ⏳ Not started |
| Phase 2: Code Gen | 2 days | ⏳ Not started |
| Phase 3: Testing | 1 day | ⏳ Not started |
| Phase 4: Docs | 1 day | ⏳ Not started |
| **Total** | **5 days** | ⏳ Not started |

## Related Issues/PRs

- Spec: [001-typed-lsp-sdk](./spec.md)
- Current code gen: `scripts/generate-protocol-types.ts`
- Type inference: `packages/core/src/protocol/infer.ts`
- Capability guards: `packages/core/src/capability-guard.ts`

## Questions & Decisions

**Q: Should we support multiple protocol versions?**
A: Deferred to Phase 2 - current implementation will use latest stable. Multi-version support can be added later if needed.

**Q: What about custom/vendor-specific LSP extensions?**
A: metaModel.json includes only official LSP. Custom extensions would need separate type definitions (future enhancement).

**Q: How do we handle metaModel.json schema changes?**
A: Pin to specific version in `scripts/fetch-metamodel.ts`, update type interfaces as schema evolves.
