import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  detectArgPattern,
  marshalParams,
  zodToCommander,
  extractFieldValue,
  paramsResidualExample
} from './zod-to-commander.js';
import {
  TextDocumentPositionParamsSchema,
  RenameParamsSchema,
  FoldingRangeParamsSchema,
  WorkspaceSymbolParamsSchema,
  InlayHintParamsSchema,
  getSchemaForMethod,
  CodeActionContextSchema
} from '@lspeasy/core';
import type { GlobalFlags } from './io.js';
import type { RefactorSession } from './session.js';

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 15000,
  allowOutsideRoot: true,
  overwrite: false,
  noProxy: false
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

  it('returns query for schemas with query field but no textDocument', () => {
    expect(detectArgPattern(WorkspaceSymbolParamsSchema)).toBe('query');
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
    ) as Record<string, unknown>;
    expect(result['position']).toEqual({ line: 4, character: 9 });
  });

  it('includes URI for file-position', () => {
    const result = marshalParams(
      'file-position',
      ['/project/src/foo.ts', '1:1'],
      {},
      FLAGS
    ) as Record<string, unknown>;
    const td = result['textDocument'] as Record<string, unknown>;
    expect(td['uri']).toMatch(/^file:\/\/\//);
    expect(td['uri']).toMatch(/foo\.ts$/);
  });

  it('includes newName for file-position-newname', () => {
    const result = marshalParams(
      'file-position-newname',
      ['/project/src/foo.ts', '5:10', 'newFoo'],
      {},
      FLAGS
    ) as Record<string, unknown>;
    expect(result['newName']).toBe('newFoo');
  });

  it('builds range for file-range', () => {
    const result = marshalParams(
      'file-range',
      ['/project/src/foo.ts', '2:1-4:5'],
      {},
      FLAGS
    ) as Record<string, unknown>;
    expect(result['range']).toEqual({
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

  it('builds query object for query pattern', () => {
    const result = marshalParams('query', ['mySymbol'], {}, FLAGS);
    expect(result).toEqual({ query: 'mySymbol' });
  });

  it('throws for raw pattern without --params', () => {
    expect(() => marshalParams('raw', [], {}, FLAGS)).toThrow('--params');
  });
});

// Minimal stub — zodToCommander only invokes session inside the action handler,
// which is never called during option-inspection tests.
const STUB_SESSION = {} as RefactorSession;

describe('zodToCommander deepened flags', () => {
  it('codeAction surfaces --params fallback and an --*-only flag (enum array), not just raw JSON', () => {
    const schema = getSchemaForMethod('textDocument/codeAction')!;
    const cmd = zodToCommander('textDocument/codeAction', schema, STUB_SESSION, FLAGS);
    const flags = cmd.options.map((o) => o.flags).join(' ');

    // Fallback must always be present
    expect(flags).toContain('--params');

    // The `only` sub-field of CodeActionContext (an array of CodeActionKind enum values)
    // must be surfaced as a dedicated flag — any prefix is acceptable.
    expect(flags).toMatch(/--\S*only\b/);
  });

  it('codeAction trigger-kind flag has Commander choices (union of literals)', () => {
    const schema = getSchemaForMethod('textDocument/codeAction')!;
    const cmd = zodToCommander('textDocument/codeAction', schema, STUB_SESSION, FLAGS);
    const triggerOpt = cmd.options.find((o) => /trigger-kind/.test(o.flags));
    // triggerKind = z.union([z.literal(1), z.literal(2)]) → choices ['1','2']
    expect(triggerOpt).toBeDefined();
    expect(triggerOpt?.argChoices).toBeTruthy();
    expect(triggerOpt?.argChoices?.length).toBeGreaterThan(0);
  });
});

describe('extractFieldValue round-trip (deepened flags)', () => {
  // The codeAction `context` field uses cliKey 'code-action' (fieldCliKey strips
  // the '-context' suffix from 'code-action-context'). extractFieldValue expands
  // one level deep so sub-fields map to: codeActionOnly / codeActionTriggerKind.

  it('reconstructs context.only (scalar array) from comma-separated option value', () => {
    const opts: Record<string, unknown> = {
      codeActionOnly: 'quickfix,refactor'
    };
    const result = extractFieldValue(opts, 'code-action', CodeActionContextSchema) as Record<
      string,
      unknown
    >;
    expect(result).toBeDefined();
    expect(result['only']).toEqual(['quickfix', 'refactor']);
  });

  it('reconstructs context.triggerKind (union-of-literals) as a number via JSON.parse', () => {
    const opts: Record<string, unknown> = {
      codeActionTriggerKind: '1'
    };
    const result = extractFieldValue(opts, 'code-action', CodeActionContextSchema) as Record<
      string,
      unknown
    >;
    expect(result).toBeDefined();
    expect(result['triggerKind']).toBe(1);
  });

  it('reconstructs both context sub-fields together', () => {
    const opts: Record<string, unknown> = {
      codeActionOnly: 'quickfix,refactor',
      codeActionTriggerKind: '1'
    };
    const result = extractFieldValue(opts, 'code-action', CodeActionContextSchema) as Record<
      string,
      unknown
    >;
    expect(result['only']).toEqual(['quickfix', 'refactor']);
    expect(result['triggerKind']).toBe(1);
  });
});

describe('paramsResidualExample — only fields not exposed as args/flags', () => {
  it('codeAction: residual is just context.diagnostics (file/range/only/triggerKind are args/flags)', () => {
    const schema = getSchemaForMethod('textDocument/codeAction');
    expect(schema).toBeDefined();
    const residual = paramsResidualExample(schema!) as Record<string, unknown>;
    expect(residual).toBeDefined();
    // positional / flag fields must be absent from the --params example
    expect(residual['textDocument']).toBeUndefined();
    expect(residual['range']).toBeUndefined();
    const ctx = residual['context'] as Record<string, unknown> | undefined;
    expect(ctx).toBeDefined();
    expect(ctx!['diagnostics']).toBeDefined(); // array-of-objects → --params
    expect(ctx!['only']).toBeUndefined(); // scalar array → flag
    expect(ctx!['triggerKind']).toBeUndefined(); // enum → flag
  });

  it('hover: undefined — all inputs map to positional args', () => {
    const schema = getSchemaForMethod('textDocument/hover');
    expect(paramsResidualExample(schema!)).toBeUndefined();
  });

  it('raw method (executeCommand): full example — everything via --params', () => {
    const schema = getSchemaForMethod('workspace/executeCommand');
    const residual = paramsResidualExample(schema!) as Record<string, unknown>;
    expect(residual).toBeDefined();
    expect(residual['command']).toBeDefined();
  });
});
