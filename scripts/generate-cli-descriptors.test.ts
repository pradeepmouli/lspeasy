import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  FoldingRangeParamsSchema,
  InlayHintParamsSchema,
  RenameParamsSchema,
  TextDocumentPositionParamsSchema,
  WorkspaceSymbolParamsSchema,
  getSchemaForMethod
} from '@lspeasy/core/schemas';

import {
  buildDescriptor,
  detectArgPattern,
  paramsResidualExample
} from './generate-cli-descriptors.js';

describe('buildDescriptor', () => {
  it('detects the file-position-newname pattern for rename', () => {
    const d = buildDescriptor('textDocument/rename', getSchemaForMethod('textDocument/rename')!);
    expect(d.pattern).toBe('file-position-newname');
  });

  it('omits choices for a union with an open-ended arm (CodeActionKind)', () => {
    const d = buildDescriptor(
      'textDocument/codeAction',
      getSchemaForMethod('textDocument/codeAction')!
    );
    const only = d.fields.find((f) => f.cliKey === 'code-action-only');
    expect(only).toBeDefined();
    expect(only?.isArray).toBe(true);
    expect(only?.choices).toBeUndefined();
  });

  it('flattens nested objects into hyphenated cliKeys with dotted paramsPaths', () => {
    const d = buildDescriptor(
      'textDocument/formatting',
      getSchemaForMethod('textDocument/formatting')!
    );
    const tabSize = d.fields.find((f) => f.cliKey === 'formatting-tab-size');
    expect(tabSize).toBeDefined();
    expect(tabSize?.paramsPath).toBe('options.tabSize');
    expect(tabSize?.kind).toBe('number');
  });

  it('marks optional fields optional', () => {
    const d = buildDescriptor(
      'textDocument/codeAction',
      getSchemaForMethod('textDocument/codeAction')!
    );
    expect(d.fields.every((f) => typeof f.optional === 'boolean')).toBe(true);
  });
});

// Moved here from apps/cli/src/zod-to-commander.test.ts when Task 7 deleted the
// runtime walker. The behaviour still exists — it just lives in the generator
// now — so the coverage moves with it rather than being dropped.

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
