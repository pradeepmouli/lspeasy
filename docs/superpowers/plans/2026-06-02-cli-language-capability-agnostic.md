# CLI Language & Capability Agnostic Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded TypeScript-only CLI with a language-agnostic CLI that discovers the LSP server from `lsp.json` and dynamically builds its command surface from `InitializeResult.capabilities` by translating Zod schemas to Commander commands at runtime.

**Architecture:** A two-pass parse: `util.parseArgs` extracts global flags first (no Commander), then the CLI connects to the server, reads capabilities, filters `LSPSchemas` against advertised capabilities, translates each matching Zod schema to a Commander `Command` via `zodToCommander()`, assembles a `namespace subcommand` tree, then hands `process.argv` to Commander for final dispatch. The old flat commands (`rename`, `move-file`, `move-symbol`, `query`) are deleted — no aliases.

**Tech Stack:** TypeScript 5, Node ≥22, `commander ^12.1.0`, `vitest` (tests), `@lspeasy/core` (LSPSchemas, getCapabilityForRequestMethod, getSchemaForMethod — all already exported from `@lspeasy/core`).

---

## File Map

| Status | Path | Responsibility |
|---|---|---|
| Modify | `packages/cli/package.json` | Add `commander` dependency |
| Modify | `packages/cli/src/session.ts` | Add `languageId` to `SessionOptions`; expose `get capabilities()` |
| Modify | `packages/core/src/protocol/schemas.ts` | Expand `LSPSchemas` with all standard capabilities |
| Create | `packages/cli/src/discover.ts` | lsp.json file walk + server selection |
| Create | `packages/cli/src/discover.test.ts` | Unit tests for discovery |
| Create | `packages/cli/src/zod-to-commander.ts` | `detectArgPattern`, `marshalParams`, `zodToCommander` |
| Create | `packages/cli/src/zod-to-commander.test.ts` | Unit tests |
| Create | `packages/cli/src/build-commands.ts` | Capability filter + Commander namespace/subcommand tree |
| Create | `packages/cli/src/build-commands.test.ts` | Unit tests |
| Rewrite | `packages/cli/src/cli.ts` | Two-pass parse entry point |
| Delete | `packages/cli/src/commands/rename.ts` | Replaced by capability-derived command |
| Delete | `packages/cli/src/commands/move-file.ts` | Out of scope per spec |
| Delete | `packages/cli/src/commands/move-symbol.ts` | Out of scope per spec |
| Delete | `packages/cli/src/commands/query.ts` | Replaced by capability-derived commands |
| Keep | `packages/cli/src/apply.ts` | WorkspaceEdit application — unchanged |
| Keep | `packages/cli/src/io.ts` | Path helpers, output — unchanged |

---

## Task 1: Add Commander + languageId to session

**Files:**
- Modify: `packages/cli/package.json`
- Modify: `packages/cli/src/session.ts`

- [ ] **Step 1: Add Commander to CLI package**

Edit `packages/cli/package.json` — add to `dependencies`:
```json
"commander": "^12.1.0"
```

- [ ] **Step 2: Install**

```bash
pnpm install
```
Expected: commander appears in `packages/cli/node_modules`.

- [ ] **Step 3: Add languageId + capabilities to session**

In `packages/cli/src/session.ts`, update `SessionOptions`:
```typescript
export interface SessionOptions {
  serverCommand: string;
  root: string;
  /** languageId for textDocument/didOpen (e.g. 'typescript', 'rust'). */
  languageId?: string;
  indexWaitMs?: number;
  verbose?: boolean;
}
```

Update `this.opts` defaults in the constructor:
```typescript
this.opts = {
  indexWaitMs: 15000,
  verbose: false,
  languageId: 'plaintext',
  ...opts
};
```

Remove the `languageId` parameter from `openAndWait` and use `this.opts.languageId` instead:
```typescript
async openAndWait(anchorFile: string): Promise<void> {
  const client = this.requireClient();
  await client.sendNotification('textDocument/didOpen', {
    textDocument: {
      uri: pathToFileURL(anchorFile).href,
      languageId: this.opts.languageId,
      version: 1,
      text: readFileSync(anchorFile, 'utf8')
    }
  });
  this.log(`didOpen ${anchorFile}; waiting ${this.opts.indexWaitMs}ms for indexing…`);
  await sleep(this.opts.indexWaitMs);
}
```

Add a `capabilities` getter after the `lsp` getter (import `ServerCapabilities` from `@lspeasy/core` if not already imported):
```typescript
get capabilities(): ServerCapabilities {
  return this.requireClient().getServerCapabilities() ?? {} as ServerCapabilities;
}
```

- [ ] **Step 4: Type-check**

```bash
pnpm run type-check
```
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add packages/cli/package.json packages/cli/src/session.ts pnpm-lock.yaml
git commit -m "feat(cli): add commander dep + languageId/capabilities to RefactorSession"
```

---

## Task 2: Expand LSPSchemas

**Files:**
- Modify: `packages/core/src/protocol/schemas.ts`

- [ ] **Step 1: Write failing test for new schemas**

Add to the bottom of `packages/core/src/protocol/schemas.ts` (we test via imports in a separate test file). First, create `packages/core/src/protocol/schemas.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  RenameParamsSchema,
  CodeActionParamsSchema,
  WorkspaceSymbolParamsSchema,
  FormattingOptionsSchema,
  DocumentFormattingParamsSchema,
  DocumentRangeFormattingParamsSchema,
  LSPSchemas
} from './schemas.js';

describe('expanded LSPSchemas', () => {
  it('exports RenameParamsSchema with newName', () => {
    const result = RenameParamsSchema.safeParse({
      textDocument: { uri: 'file:///foo.ts' },
      position: { line: 0, character: 0 },
      newName: 'bar'
    });
    expect(result.success).toBe(true);
  });

  it('rejects RenameParamsSchema without newName', () => {
    const result = RenameParamsSchema.safeParse({
      textDocument: { uri: 'file:///foo.ts' },
      position: { line: 0, character: 0 }
    });
    expect(result.success).toBe(false);
  });

  it('exports WorkspaceSymbolParamsSchema with query', () => {
    const result = WorkspaceSymbolParamsSchema.safeParse({ query: 'hello' });
    expect(result.success).toBe(true);
  });

  it('has textDocument/rename in LSPSchemas', () => {
    expect(LSPSchemas['textDocument/rename']).toBeDefined();
  });

  it('has workspace/symbol in LSPSchemas', () => {
    expect(LSPSchemas['workspace/symbol']).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

```bash
pnpm test packages/core/src/protocol/schemas.test.ts
```
Expected: FAIL — `RenameParamsSchema is not exported`.

- [ ] **Step 3: Add new schemas to schemas.ts**

In `packages/core/src/protocol/schemas.ts`, add after `DocumentSymbolParamsSchema`:

```typescript
/** Rename params — file + position + new symbol name */
export const RenameParamsSchema = TextDocumentPositionParamsSchema.extend({
  newName: z.string()
});

/** Code action context */
export const CodeActionContextSchema = z.object({
  diagnostics: z.array(DiagnosticSchema),
  only: z.array(z.string()).optional(),
  triggerKind: z.number().int().optional()
});

/** Code action params — file + range + context */
export const CodeActionParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  context: CodeActionContextSchema
});

/** Shared formatting options */
export const FormattingOptionsSchema = z.object({
  tabSize: z.number().int(),
  insertSpaces: z.boolean(),
  trimTrailingWhitespace: z.boolean().optional(),
  insertFinalNewline: z.boolean().optional(),
  trimFinalNewlines: z.boolean().optional()
});

/** Document formatting params — file + options */
export const DocumentFormattingParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  options: FormattingOptionsSchema
});

/** Document range formatting params — file + range + options */
export const DocumentRangeFormattingParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema,
  options: FormattingOptionsSchema
});

/** Workspace symbol params — query string only */
export const WorkspaceSymbolParamsSchema = z.object({
  query: z.string()
});

/** Folding range params — file only */
export const FoldingRangeParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});

/** Inlay hint params — file + range */
export const InlayHintParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema,
  range: RangeSchema
});

/** Code lens params — file only */
export const CodeLensParamsSchema = z.object({
  textDocument: TextDocumentIdentifierSchema
});

// The following all share the TextDocumentPositionParams shape:
export const SignatureHelpParamsSchema = TextDocumentPositionParamsSchema;
export const TypeDefinitionParamsSchema = TextDocumentPositionParamsSchema;
export const ImplementationParamsSchema = TextDocumentPositionParamsSchema;
export const DeclarationParamsSchema = TextDocumentPositionParamsSchema;
export const DocumentHighlightParamsSchema = TextDocumentPositionParamsSchema;
```

- [ ] **Step 4: Expand LSPSchemas registry**

In `packages/core/src/protocol/schemas.ts`, update `LSPSchemas` to add:

```typescript
export const LSPSchemas = {
  // Request params (existing)
  'textDocument/hover': HoverParamsSchema,
  'textDocument/completion': CompletionParamsSchema,
  'textDocument/definition': DefinitionParamsSchema,
  'textDocument/references': ReferenceParamsSchema,
  'textDocument/documentSymbol': DocumentSymbolParamsSchema,
  initialize: InitializeParamsSchema,

  // New request params
  'textDocument/rename': RenameParamsSchema,
  'textDocument/codeAction': CodeActionParamsSchema,
  'textDocument/signatureHelp': SignatureHelpParamsSchema,
  'textDocument/typeDefinition': TypeDefinitionParamsSchema,
  'textDocument/implementation': ImplementationParamsSchema,
  'textDocument/declaration': DeclarationParamsSchema,
  'textDocument/documentHighlight': DocumentHighlightParamsSchema,
  'textDocument/formatting': DocumentFormattingParamsSchema,
  'textDocument/rangeFormatting': DocumentRangeFormattingParamsSchema,
  'textDocument/foldingRange': FoldingRangeParamsSchema,
  'textDocument/inlayHint': InlayHintParamsSchema,
  'textDocument/codeLens': CodeLensParamsSchema,
  'workspace/symbol': WorkspaceSymbolParamsSchema,

  // Notification params (existing)
  'textDocument/didOpen': DidOpenTextDocumentParamsSchema,
  'textDocument/didChange': DidChangeTextDocumentParamsSchema,
  'textDocument/didClose': DidCloseTextDocumentParamsSchema,
  'textDocument/didSave': DidSaveTextDocumentParamsSchema,
} as const;
```

- [ ] **Step 5: Run test to verify it passes**

```bash
pnpm test packages/core/src/protocol/schemas.test.ts
```
Expected: PASS — 5 tests passing.

- [ ] **Step 6: Type-check**

```bash
pnpm run type-check
```
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add packages/core/src/protocol/schemas.ts packages/core/src/protocol/schemas.test.ts
git commit -m "feat(core): expand LSPSchemas with all standard LSP capabilities"
```

---

## Task 3: lsp.json discovery

**Files:**
- Create: `packages/cli/src/discover.ts`
- Create: `packages/cli/src/discover.test.ts`

- [ ] **Step 1: Write failing tests first**

Create `packages/cli/src/discover.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { selectServer } from './discover.js';
import type { LspJson } from './discover.js';

const CONFIG: LspJson = {
  lspServers: {
    typescript: {
      command: 'typescript-language-server',
      args: ['--stdio'],
      fileExtensions: { '.ts': 'typescript', '.tsx': 'typescriptreact' }
    },
    rust: {
      command: 'rust-analyzer',
      args: [],
      fileExtensions: { '.rs': 'rust' }
    }
  }
};

describe('selectServer', () => {
  it('returns matching server for .ts extension', () => {
    const result = selectServer(CONFIG, '.ts');
    expect(result).toEqual({
      serverCommand: 'typescript-language-server --stdio',
      languageId: 'typescript'
    });
  });

  it('maps .tsx to typescriptreact languageId', () => {
    expect(selectServer(CONFIG, '.tsx')?.languageId).toBe('typescriptreact');
  });

  it('matches rust server for .rs extension', () => {
    const result = selectServer(CONFIG, '.rs');
    expect(result).toEqual({ serverCommand: 'rust-analyzer', languageId: 'rust' });
  });

  it('returns null for unknown extension', () => {
    expect(selectServer(CONFIG, '.py')).toBeNull();
  });

  it('omits trailing space when args is empty', () => {
    expect(selectServer(CONFIG, '.rs')?.serverCommand).toBe('rust-analyzer');
  });

  it('returns null for empty lspServers', () => {
    expect(selectServer({ lspServers: {} }, '.ts')).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test packages/cli/src/discover.test.ts
```
Expected: FAIL — `Cannot find module './discover.js'`.

- [ ] **Step 3: Implement discover.ts**

Create `packages/cli/src/discover.ts`:

```typescript
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export interface LspServerEntry {
  command: string;
  args?: string[];
  fileExtensions: Record<string, string>;
}

export interface LspJson {
  lspServers: Record<string, LspServerEntry>;
}

export interface ResolvedServer {
  /** Full spawn command string passed to RefactorSession as serverCommand. */
  serverCommand: string;
  /** languageId for textDocument/didOpen (e.g. 'typescript', 'rust'). */
  languageId: string;
}

const SEARCH_PATHS = ['lsp.json', '.claude/lsp.json', '.github/lsp.json'];

export function findLspJsonPath(root: string): string | null {
  for (const rel of SEARCH_PATHS) {
    const full = join(root, rel);
    if (existsSync(full)) return full;
  }
  const global = join(homedir(), '.claude', 'lsp.json');
  return existsSync(global) ? global : null;
}

export function selectServer(config: LspJson, fileExt: string): ResolvedServer | null {
  for (const entry of Object.values(config.lspServers)) {
    const languageId = entry.fileExtensions[fileExt];
    if (languageId) {
      const parts = [entry.command, ...(entry.args ?? [])].filter(Boolean);
      return { serverCommand: parts.join(' '), languageId };
    }
  }
  return null;
}

export function discoverServer(root: string, fileExt: string): ResolvedServer | null {
  const lspJsonPath = findLspJsonPath(root);
  if (!lspJsonPath) return null;
  let config: LspJson;
  try {
    config = JSON.parse(readFileSync(lspJsonPath, 'utf8')) as LspJson;
  } catch {
    return null;
  }
  return selectServer(config, fileExt);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test packages/cli/src/discover.test.ts
```
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Type-check**

```bash
pnpm run type-check
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/discover.ts packages/cli/src/discover.test.ts
git commit -m "feat(cli): lsp.json discovery — selectServer + findLspJsonPath"
```

---

## Task 4: zodToCommander

**Files:**
- Create: `packages/cli/src/zod-to-commander.ts`
- Create: `packages/cli/src/zod-to-commander.test.ts`

- [ ] **Step 1: Write failing tests**

Create `packages/cli/src/zod-to-commander.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { detectArgPattern, marshalParams } from './zod-to-commander.js';
import {
  TextDocumentPositionParamsSchema,
  RenameParamsSchema,
  FoldingRangeParamsSchema,
  WorkspaceSymbolParamsSchema,
  InlayHintParamsSchema
} from '@lspeasy/core';
import type { GlobalFlags } from './io.js';

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 15000,
  allowOutsideRoot: true,  // allow absolute paths in tests
  overwrite: false
};

describe('detectArgPattern', () => {
  it('returns file-position for TextDocumentPositionParams', () => {
    expect(detectArgPattern(TextDocumentPositionParamsSchema)).toBe('file-position');
  });

  it('returns file-position-newname for RenameParams', () => {
    expect(detectArgPattern(RenameParamsSchema)).toBe('file-position-newname');
  });

  it('returns file for document-only schema', () => {
    expect(detectArgPattern(FoldingRangeParamsSchema)).toBe('file');
  });

  it('returns file-range for schemas with textDocument + range', () => {
    expect(detectArgPattern(InlayHintParamsSchema)).toBe('file-range');
  });

  it('returns raw for schemas without textDocument', () => {
    expect(detectArgPattern(WorkspaceSymbolParamsSchema)).toBe('raw');
  });

  it('returns raw for non-ZodObject schema', () => {
    expect(detectArgPattern(z.string())).toBe('raw');
  });
});

describe('marshalParams', () => {
  it('converts 1-based position to 0-based for file-position', () => {
    const result = marshalParams(
      'file-position',
      ['/project/src/foo.ts', '5:10'],
      {},
      FLAGS
    ) as any;
    expect(result.position).toEqual({ line: 4, character: 9 });
  });

  it('includes URI for file-position', () => {
    const result = marshalParams(
      'file-position',
      ['/project/src/foo.ts', '1:1'],
      {},
      FLAGS
    ) as any;
    expect(result.textDocument.uri).toMatch(/foo\.ts$/);
  });

  it('includes newName for file-position-newname', () => {
    const result = marshalParams(
      'file-position-newname',
      ['/project/src/foo.ts', '5:10', 'newFoo'],
      {},
      FLAGS
    ) as any;
    expect(result.newName).toBe('newFoo');
  });

  it('builds range for file-range', () => {
    const result = marshalParams(
      'file-range',
      ['/project/src/foo.ts', '2:1-4:5'],
      {},
      FLAGS
    ) as any;
    expect(result.range).toEqual({
      start: { line: 1, character: 0 },
      end: { line: 3, character: 4 }
    });
  });

  it('overrides with --params JSON when provided', () => {
    const raw = { textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } };
    const result = marshalParams(
      'file-position',
      ['/project/src/ignored.ts', '1:1'],
      { params: JSON.stringify(raw) },
      FLAGS
    );
    expect(result).toEqual(raw);
  });

  it('throws for raw pattern without --params', () => {
    expect(() => marshalParams('raw', [], {}, FLAGS)).toThrow('--params');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test packages/cli/src/zod-to-commander.test.ts
```
Expected: FAIL — `Cannot find module './zod-to-commander.js'`.

- [ ] **Step 3: Implement zod-to-commander.ts**

Create `packages/cli/src/zod-to-commander.ts`:

```typescript
import { Command } from 'commander';
import { z } from 'zod';
import { pathToFileURL } from 'node:url';

import { parseLineCol, toLspPosition, resolvePathArg } from './io.js';
import type { GlobalFlags } from './io.js';
import type { RefactorSession } from './session.js';

export type ArgPattern =
  | 'file-position-newname'
  | 'file-position'
  | 'file-range'
  | 'file'
  | 'raw';

export function detectArgPattern(schema: z.ZodType<any>): ArgPattern {
  if (!(schema instanceof z.ZodObject)) return 'raw';
  const shape = schema.shape as Record<string, z.ZodType<any>>;
  if ('textDocument' in shape && 'position' in shape && 'newName' in shape)
    return 'file-position-newname';
  if ('textDocument' in shape && 'position' in shape) return 'file-position';
  if ('textDocument' in shape && 'range' in shape) return 'file-range';
  if ('textDocument' in shape) return 'file';
  return 'raw';
}

export function marshalParams(
  pattern: ArgPattern,
  positional: string[],
  opts: Record<string, unknown>,
  flags: GlobalFlags
): unknown {
  if (typeof opts['params'] === 'string') return JSON.parse(opts['params']);

  switch (pattern) {
    case 'file-position-newname': {
      const file = resolvePathArg(positional[0]!, flags);
      const pos = parseLineCol(positional[1]!);
      return {
        textDocument: { uri: pathToFileURL(file).href },
        position: toLspPosition(pos),
        newName: positional[2]
      };
    }
    case 'file-position': {
      const file = resolvePathArg(positional[0]!, flags);
      const pos = parseLineCol(positional[1]!);
      return {
        textDocument: { uri: pathToFileURL(file).href },
        position: toLspPosition(pos)
      };
    }
    case 'file-range': {
      const file = resolvePathArg(positional[0]!, flags);
      const [startStr, endStr] = (positional[1] ?? '').split('-');
      const start = parseLineCol(startStr ?? '1:1');
      const end = parseLineCol(endStr ?? startStr ?? '1:1');
      return {
        textDocument: { uri: pathToFileURL(file).href },
        range: { start: toLspPosition(start), end: toLspPosition(end) }
      };
    }
    case 'file': {
      const file = resolvePathArg(positional[0]!, flags);
      return { textDocument: { uri: pathToFileURL(file).href } };
    }
    case 'raw':
      throw new Error('This method requires --params <json>');
  }
}

export function zodToCommander(
  method: string,
  schema: z.ZodType<any>,
  session: RefactorSession,
  flags: GlobalFlags
): Command {
  const subcommand = method.split('/')[1] ?? method;
  const cmd = new Command(subcommand);
  const pattern = detectArgPattern(schema);

  switch (pattern) {
    case 'file-position-newname':
      cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<line:col>', '1-based position, e.g. 12:7');
      cmd.argument('<newName>', 'new symbol name');
      break;
    case 'file-position':
      cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<line:col>', '1-based position, e.g. 12:7');
      break;
    case 'file-range':
      cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<range>', 'range as startLine:col-endLine:col, e.g. 2:1-4:5');
      break;
    case 'file':
      cmd.argument('<file>', 'file path (relative to --root)');
      break;
    case 'raw':
      // no positional args — --params <json> is the only input
      break;
  }

  cmd.option('--params <json>', 'raw LSP params as JSON, overrides positional args');

  cmd.action(async (...cmdArgs) => {
    const cmdOpts = cmdArgs.at(-1) as Record<string, unknown>;
    const positional = cmdArgs.slice(0, -1).map(String);

    try {
      const params = marshalParams(pattern, positional, cmdOpts, flags);
      const result = await session.lsp.sendRequest(method, params);
      if (flags.json) {
        process.stdout.write(JSON.stringify({ ok: true, method, result }) + '\n');
      } else {
        process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      }
    } catch (err) {
      if (flags.json) {
        process.stdout.write(JSON.stringify({ ok: false, error: String(err) }) + '\n');
      } else {
        process.stderr.write(`error: ${String(err)}\n`);
      }
      process.exit(1);
    }
  });

  return cmd;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test packages/cli/src/zod-to-commander.test.ts
```
Expected: PASS — 11 tests passing.

- [ ] **Step 5: Type-check**

```bash
pnpm run type-check
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/zod-to-commander.ts packages/cli/src/zod-to-commander.test.ts
git commit -m "feat(cli): zodToCommander — pattern detection, param marshaling, Command construction"
```

---

## Task 5: Build command tree

**Files:**
- Create: `packages/cli/src/build-commands.ts`
- Create: `packages/cli/src/build-commands.test.ts`

- [ ] **Step 1: Write failing tests**

Create `packages/cli/src/build-commands.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import { buildCommandTree } from './build-commands.js';
import type { GlobalFlags } from './io.js';

const FLAGS: GlobalFlags = {
  server: '', root: '/project', dryRun: false, json: false,
  verbose: false, waitMs: 15000, allowOutsideRoot: false, overwrite: false
};

const fakeSession = {
  lsp: { sendRequest: vi.fn(async () => null) }
} as any;

describe('buildCommandTree', () => {
  it('registers textDocument/hover when hoverProvider is true', () => {
    const program = new Command();
    buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find(c => c.name() === 'textDocument');
    expect(ns?.commands.find(c => c.name() === 'hover')).toBeDefined();
  });

  it('does not register hover when hoverProvider is absent', () => {
    const program = new Command();
    buildCommandTree(program, {} as any, fakeSession, FLAGS);
    const ns = program.commands.find(c => c.name() === 'textDocument');
    expect(ns?.commands.find(c => c.name() === 'hover')).toBeUndefined();
  });

  it('registers textDocument/rename when renameProvider is true', () => {
    const program = new Command();
    buildCommandTree(program, { renameProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find(c => c.name() === 'textDocument');
    expect(ns?.commands.find(c => c.name() === 'rename')).toBeDefined();
  });

  it('registers workspace/symbol when workspaceSymbolProvider is true', () => {
    const program = new Command();
    buildCommandTree(program, { workspaceSymbolProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find(c => c.name() === 'workspace');
    expect(ns?.commands.find(c => c.name() === 'symbol')).toBeDefined();
  });

  it('always registers the generic call command', () => {
    const program = new Command();
    buildCommandTree(program, {} as any, fakeSession, FLAGS);
    expect(program.commands.find(c => c.name() === 'call')).toBeDefined();
  });

  it('shares one textDocument namespace across multiple capabilities', () => {
    const program = new Command();
    buildCommandTree(
      program,
      { hoverProvider: true, renameProvider: true } as any,
      fakeSession,
      FLAGS
    );
    const textDocCmds = program.commands.filter(c => c.name() === 'textDocument');
    expect(textDocCmds).toHaveLength(1);
    expect(textDocCmds[0]!.commands.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
pnpm test packages/cli/src/build-commands.test.ts
```
Expected: FAIL — `Cannot find module './build-commands.js'`.

- [ ] **Step 3: Implement build-commands.ts**

Create `packages/cli/src/build-commands.ts`:

```typescript
import { Command } from 'commander';
import { getCapabilityForRequestMethod, LSPSchemas, getSchemaForMethod } from '@lspeasy/core';
import type { ServerCapabilities } from '@lspeasy/core';

import { zodToCommander } from './zod-to-commander.js';
import type { RefactorSession } from './session.js';
import type { GlobalFlags } from './io.js';

function getNestedValue(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>(
    (acc, key) => (acc != null && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined),
    obj
  );
}

export function buildCommandTree(
  program: Command,
  capabilities: ServerCapabilities,
  session: RefactorSession,
  flags: GlobalFlags
): void {
  for (const method of Object.keys(LSPSchemas) as Array<keyof typeof LSPSchemas>) {
    const schema = getSchemaForMethod(method);
    if (!schema) continue;

    const capPath = getCapabilityForRequestMethod(method as any);
    // 'alwaysOn' = lifecycle/notification — not a user-facing command
    if (capPath === 'alwaysOn') continue;
    // Only expose if the server advertised this capability
    if (!getNestedValue(capabilities, capPath as string)) continue;

    const parts = (method as string).split('/');
    if (parts.length !== 2) continue;
    const [namespace, subcommand] = parts as [string, string];

    let nsCmd = program.commands.find(c => c.name() === namespace);
    if (!nsCmd) {
      nsCmd = new Command(namespace).description(`${namespace} operations`);
      program.addCommand(nsCmd);
    }

    nsCmd.addCommand(zodToCommander(method as string, schema, session, flags));
  }

  // Generic fallback — always present regardless of capabilities
  program
    .command('call <method>')
    .description('Send any LSP request by method name with raw JSON params')
    .option('--params <json>', 'LSP params as JSON')
    .action(async (method: string, opts: { params?: string }) => {
      const params = opts.params ? JSON.parse(opts.params) : {};
      try {
        const result = await session.lsp.sendRequest(method, params);
        if (flags.json) {
          process.stdout.write(JSON.stringify({ ok: true, method, result }) + '\n');
        } else {
          process.stdout.write(JSON.stringify(result, null, 2) + '\n');
        }
      } catch (err) {
        if (flags.json) {
          process.stdout.write(JSON.stringify({ ok: false, error: String(err) }) + '\n');
        } else {
          process.stderr.write(`error: ${String(err)}\n`);
        }
        process.exit(1);
      }
    });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
pnpm test packages/cli/src/build-commands.test.ts
```
Expected: PASS — 6 tests passing.

- [ ] **Step 5: Type-check**

```bash
pnpm run type-check
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add packages/cli/src/build-commands.ts packages/cli/src/build-commands.test.ts
git commit -m "feat(cli): buildCommandTree — capability-filtered namespace/subcommand Commander tree"
```

---

## Task 6: Rewrite cli.ts + delete legacy files

**Files:**
- Rewrite: `packages/cli/src/cli.ts`
- Delete: `packages/cli/src/commands/rename.ts`
- Delete: `packages/cli/src/commands/move-file.ts`
- Delete: `packages/cli/src/commands/move-symbol.ts`
- Delete: `packages/cli/src/commands/query.ts`

- [ ] **Step 1: Delete legacy command files**

```bash
git rm packages/cli/src/commands/rename.ts \
       packages/cli/src/commands/move-file.ts \
       packages/cli/src/commands/move-symbol.ts \
       packages/cli/src/commands/query.ts
```

Also delete any associated test files:
```bash
git rm packages/cli/src/commands/move-file.test.ts \
       packages/cli/src/commands/move-symbol.test.ts 2>/dev/null || true
```

- [ ] **Step 2: Rewrite cli.ts**

Replace the entire content of `packages/cli/src/cli.ts` with:

```typescript
#!/usr/bin/env node
/**
 * lspeasy CLI entry point.
 *
 * Two-pass parse: util.parseArgs extracts global flags first (no Commander),
 * then the CLI connects to the server, reads capabilities, builds a
 * namespace/subcommand Commander tree, and hands process.argv back to
 * Commander for final dispatch.
 */

import { parseArgs } from 'node:util';
import { argv, exit } from 'node:process';
import { extname } from 'node:path';
import { Command } from 'commander';

import { fail, resolvePathArg } from './io.js';
import type { GlobalFlags } from './io.js';
import { discoverServer } from './discover.js';
import { RefactorSession } from './session.js';
import { buildCommandTree } from './build-commands.js';

const STATIC_HELP = `lspeasy — LSP-driven CLI

Usage:
  lspeasy <namespace> <command> [args]
  lspeasy call <method> --params <json>

Available commands depend on the connected server's advertised capabilities.
Run with a file argument to see available commands for that language:
  lspeasy textDocument --help src/foo.ts

Global flags:
  --server <cmd>        LSP server launch command (overrides lsp.json discovery)
  --root <dir>          Project root (default: cwd)
  --dry-run             Print changes; do not write
  --json                Machine-readable JSON on stdout; diagnostics to stderr
  --wait <ms>           Server index wait in ms (default: 15000)
  --verbose             Progress logging to stderr
  --allow-outside-root  Allow file paths outside --root
  -h, --help            Show this help
`;

const GLOBAL_OPTION_CONFIG = {
  server: { type: 'string' as const },
  root: { type: 'string' as const },
  'dry-run': { type: 'boolean' as const, default: false },
  json: { type: 'boolean' as const, default: false },
  wait: { type: 'string' as const, default: '15000' },
  verbose: { type: 'boolean' as const, default: false },
  'allow-outside-root': { type: 'boolean' as const, default: false },
  help: { type: 'boolean' as const, short: 'h', default: false }
};

async function main(): Promise<void> {
  // Pass 1: extract global flags without Commander
  const { values, positionals } = parseArgs({
    args: argv.slice(2),
    options: GLOBAL_OPTION_CONFIG,
    allowPositionals: true,
    strict: false
  });

  if ((values.help && !positionals.length) || (!positionals.length && argv.length <= 2)) {
    process.stdout.write(STATIC_HELP);
    exit(0);
  }

  const root = values.root ?? process.cwd();
  const waitMs = parseInt(values.wait ?? '15000', 10);

  const flags: GlobalFlags = {
    server: values.server ?? '',
    root,
    dryRun: values['dry-run'] ?? false,
    json: values.json ?? false,
    verbose: values.verbose ?? false,
    waitMs,
    allowOutsideRoot: values['allow-outside-root'] ?? false,
    overwrite: false
  };

  // Resolve server: explicit --server flag OR lsp.json discovery by file extension
  let serverCommand: string;
  let languageId = 'plaintext';

  if (flags.server) {
    serverCommand = flags.server;
  } else {
    const fileArg = positionals.find(p => p.includes('.'));
    const ext = fileArg ? extname(fileArg) : '';

    if (!ext) {
      fail(
        'Cannot determine language: pass a file argument or use --server <cmd>.',
        flags.json
      );
    }

    const discovered = discoverServer(root, ext);
    if (!discovered) {
      fail(
        `No LSP server configured for ${ext} files.\n` +
        'Add an lsp.json to your project (or ~/.claude/lsp.json) or use --server <cmd>.\n' +
        'Format: { "lspServers": { "lang": { "command": "...", "args": [...], "fileExtensions": { ".ext": "languageId" } } } }',
        flags.json
      );
    }

    serverCommand = discovered.serverCommand;
    languageId = discovered.languageId;
  }

  const session = new RefactorSession({ serverCommand, languageId, root, indexWaitMs: waitMs, verbose: flags.verbose });

  try {
    await session.start();

    const fileArg = positionals.find(p => p.includes('.'));
    if (fileArg) {
      const absPath = resolvePathArg(fileArg, flags);
      await session.openAndWait(absPath);
    }

    // Build Commander tree from advertised capabilities
    const program = new Command('lspeasy');

    // Register global options on Commander so it does not reject them in pass 2
    program
      .option('--server <cmd>')
      .option('--root <dir>')
      .option('--dry-run')
      .option('--json')
      .option('--wait <ms>')
      .option('--verbose')
      .option('--allow-outside-root');

    buildCommandTree(program, session.capabilities, session, flags);

    // Pass 2: Commander parses argv and dispatches
    await program.parseAsync(argv);
  } finally {
    await session.stop();
  }
}

main().catch(err => {
  process.stderr.write(`fatal: ${String(err)}\n`);
  exit(1);
});
```

- [ ] **Step 3: Type-check**

```bash
pnpm run type-check
```
Expected: no errors. If there are import errors from deleted command files, remove those import lines.

- [ ] **Step 4: Build**

```bash
pnpm run build
```
Expected: builds successfully to `packages/cli/dist/`.

- [ ] **Step 5: Smoke test — static help**

```bash
node packages/cli/dist/cli.js --help
```
Expected: prints the static help text without connecting to a server.

- [ ] **Step 6: Run full test suite**

```bash
pnpm test
```
Expected: all tests pass. Any tests in the deleted command files are gone; existing tests in `apply.test.ts`, `io.test.ts`, `session.test.ts`, `cli.test.ts` should still pass (or be updated to match the new cli.ts interface).

- [ ] **Step 7: Commit**

```bash
git add packages/cli/src/cli.ts
git commit -m "feat(cli): two-pass parse entry point — lsp.json discovery + Commander capability tree"
```

---

## Task 7: Integration test

**Files:**
- Create: `packages/cli/src/integration.test.ts`

- [ ] **Step 1: Write integration test using fake in-process server**

Create `packages/cli/src/integration.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import { buildCommandTree } from './build-commands.js';
import type { GlobalFlags } from './io.js';

/**
 * Integration test: verifies that buildCommandTree + zodToCommander correctly
 * dispatches a textDocument/hover request when hoverProvider is advertised,
 * and that the session's sendRequest is called with the right params.
 */

const FLAGS: GlobalFlags = {
  server: '', root: '/project', dryRun: false, json: false,
  verbose: false, waitMs: 0, allowOutsideRoot: true, overwrite: false
};

describe('capability → command → dispatch integration', () => {
  it('dispatches textDocument/hover with correct LSP params', async () => {
    const sendRequest = vi.fn(async () => ({ contents: { kind: 'markdown', value: 'hello' } }));
    const fakeSession = { lsp: { sendRequest } } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);

    // Capture stdout
    const writes: string[] = [];
    vi.spyOn(process.stdout, 'write').mockImplementation((s) => { writes.push(String(s)); return true; });

    await program.parseAsync(
      ['node', 'lspeasy', 'textDocument', 'hover', '/project/src/foo.ts', '5:10'],
      { from: 'user' }
    );

    expect(sendRequest).toHaveBeenCalledWith(
      'textDocument/hover',
      expect.objectContaining({
        textDocument: expect.objectContaining({ uri: expect.stringContaining('foo.ts') }),
        position: { line: 4, character: 9 }
      })
    );

    vi.restoreAllMocks();
  });

  it('dispatches textDocument/rename with file + position + newName', async () => {
    const sendRequest = vi.fn(async () => ({ changes: {} }));
    const fakeSession = { lsp: { sendRequest } } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, { renameProvider: true } as any, fakeSession, FLAGS);

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await program.parseAsync(
      ['node', 'lspeasy', 'textDocument', 'rename', '/project/src/bar.ts', '3:5', 'newBar'],
      { from: 'user' }
    );

    expect(sendRequest).toHaveBeenCalledWith(
      'textDocument/rename',
      expect.objectContaining({ newName: 'newBar' })
    );

    vi.restoreAllMocks();
  });

  it('dispatches via generic call command', async () => {
    const sendRequest = vi.fn(async () => null);
    const fakeSession = { lsp: { sendRequest } } as any;

    const program = new Command().exitOverride();
    buildCommandTree(program, {} as any, fakeSession, FLAGS);

    vi.spyOn(process.stdout, 'write').mockImplementation(() => true);

    await program.parseAsync(
      ['node', 'lspeasy', 'call', 'textDocument/hover',
       '--params', JSON.stringify({ textDocument: { uri: 'file:///x.ts' }, position: { line: 0, character: 0 } })],
      { from: 'user' }
    );

    expect(sendRequest).toHaveBeenCalledWith('textDocument/hover', expect.objectContaining({
      textDocument: { uri: 'file:///x.ts' }
    }));

    vi.restoreAllMocks();
  });
});
```

- [ ] **Step 2: Run integration tests**

```bash
pnpm test packages/cli/src/integration.test.ts
```
Expected: PASS — 3 tests passing.

- [ ] **Step 3: Run full test suite**

```bash
pnpm test
```
Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add packages/cli/src/integration.test.ts
git commit -m "test(cli): integration tests for capability → command → LSP dispatch"
```
