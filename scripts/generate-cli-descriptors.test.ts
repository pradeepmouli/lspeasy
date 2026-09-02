import { describe, it, expect } from 'vitest';
import { getSchemaForMethod } from '@lspeasy/core/schemas';

import { buildDescriptor } from './generate-cli-descriptors.js';

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
