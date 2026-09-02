import { describe, it, expect } from 'vitest';
import {
  marshalParams,
  zodToCommander,
  extractFieldValue,
  deepMergeInto,
  setAtPath
} from './zod-to-commander.js';
import { COMMAND_DESCRIPTORS } from './generated/command-descriptors.js';
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

  it('non-raw: builds from positionals and IGNORES --params (merge happens at the command layer)', () => {
    const raw = { textDocument: { uri: 'file:///x.ts' }, position: { line: 9, character: 9 } };
    const result = marshalParams(
      'file-position',
      ['/project/src/foo.ts', '1:1'],
      { params: JSON.stringify(raw) },
      FLAGS
    ) as Record<string, unknown>;
    // base comes from the positional, not the --params override
    expect((result['textDocument'] as Record<string, string>)['uri']).toMatch(/foo\.ts$/);
    expect(result['position']).toEqual({ line: 0, character: 0 });
  });

  it('builds query object for query pattern', () => {
    const result = marshalParams('query', ['mySymbol'], {}, FLAGS);
    expect(result).toEqual({ query: 'mySymbol' });
  });

  it('raw: returns the --params JSON as the whole body', () => {
    const raw = { command: 'x', arguments: [1] };
    expect(marshalParams('raw', [], { params: JSON.stringify(raw) }, FLAGS)).toEqual(raw);
  });

  it('throws for raw pattern without --params', () => {
    expect(() => marshalParams('raw', [], {}, FLAGS)).toThrow('--params');
  });
});

describe('deepMergeInto', () => {
  it('merges nested objects; arrays/scalars replace', () => {
    const dst = { context: { only: ['quickfix'], triggerKind: 1 }, a: 1 };
    deepMergeInto(dst, { context: { diagnostics: [{ x: 1 }] }, a: 2 });
    expect(dst).toEqual({
      context: { only: ['quickfix'], triggerKind: 1, diagnostics: [{ x: 1 }] },
      a: 2
    });
  });
});

// Minimal stub — zodToCommander only invokes session inside the action handler,
// which is never called during option-inspection tests.
const STUB_SESSION = {} as RefactorSession;

const CODE_ACTION = COMMAND_DESCRIPTORS['textDocument/codeAction']!;

describe('zodToCommander deepened flags', () => {
  it('codeAction surfaces --params fallback and an --*-only flag (enum array), not just raw JSON', () => {
    const cmd = zodToCommander('textDocument/codeAction', CODE_ACTION, STUB_SESSION, FLAGS);
    const flags = cmd.options.map((o) => o.flags).join(' ');

    // Fallback must always be present
    expect(flags).toContain('--params');

    // The `only` sub-field of CodeActionContext (an array of CodeActionKind enum values)
    // must be surfaced as a dedicated flag — any prefix is acceptable.
    expect(flags).toMatch(/--\S*only\b/);
  });

  it('codeAction trigger-kind flag has Commander choices (union of literals)', () => {
    const cmd = zodToCommander('textDocument/codeAction', CODE_ACTION, STUB_SESSION, FLAGS);
    const triggerOpt = cmd.options.find((o) => /trigger-kind/.test(o.flags));
    // triggerKind = z.union([z.literal(1), z.literal(2)]) → choices ['1','2']
    expect(triggerOpt).toBeDefined();
    expect(triggerOpt?.argChoices).toBeTruthy();
    expect(triggerOpt?.argChoices?.length).toBeGreaterThan(0);
  });
});

describe('extractFieldValue round-trip (deepened flags)', () => {
  // codeAction's `context` field is flattened by the generator into the leaf
  // descriptors code-action-only (context.only) and code-action-trigger-kind
  // (context.triggerKind); Commander stores those under the camelCased keys.
  const field = (cliKey: string) => CODE_ACTION.fields.find((f) => f.cliKey === cliKey)!;

  it('reads context.only (scalar array) from a comma-separated option value', () => {
    const result = extractFieldValue(
      { codeActionOnly: 'quickfix,refactor' },
      field('code-action-only')
    );
    expect(result).toEqual(['quickfix', 'refactor']);
  });

  it('reads context.triggerKind (union-of-literals) as a number via JSON.parse', () => {
    const result = extractFieldValue(
      { codeActionTriggerKind: '1' },
      field('code-action-trigger-kind')
    );
    expect(result).toBe(1);
  });

  it('returns undefined when the flag was not supplied', () => {
    expect(extractFieldValue({}, field('code-action-only'))).toBeUndefined();
  });
});

describe('setAtPath — rebuilds the nesting the flattened cliKeys lost', () => {
  it('writes a leaf at a dotted path, creating intermediate objects', () => {
    const target: Record<string, unknown> = {};
    setAtPath(target, 'context.only', ['quickfix']);
    expect(target).toEqual({ context: { only: ['quickfix'] } });
  });

  it('adds a sibling without clobbering what is already at the parent', () => {
    const target: Record<string, unknown> = { context: { diagnostics: [{ x: 1 }] } };
    setAtPath(target, 'context.only', ['quickfix']);
    setAtPath(target, 'context.triggerKind', 1);
    expect(target).toEqual({
      context: { diagnostics: [{ x: 1 }], only: ['quickfix'], triggerKind: 1 }
    });
  });

  it('refuses prototype-polluting segments at every level', () => {
    const target: Record<string, unknown> = {};
    setAtPath(target, '__proto__.polluted', true);
    setAtPath(target, 'context.__proto__', true);
    setAtPath(target, 'constructor.prototype.polluted', true);
    expect(({} as Record<string, unknown>)['polluted']).toBeUndefined();
    expect(Object.getPrototypeOf(target)).toBe(Object.prototype);
  });
});

describe('anchorFile support', () => {
  it('marshalParams prepends the anchor file for a file-position pattern', () => {
    const params = marshalParams(
      'file-position',
      ['12:7'], // no file — anchor supplies it
      {},
      { root: '/project', json: false, allowOutsideRoot: true } as GlobalFlags,
      '/project/src/foo.ts'
    ) as { textDocument: { uri: string }; position: { line: number; character: number } };
    expect(params.textDocument.uri).toContain('foo.ts');
    expect(params.position).toEqual({ line: 11, character: 6 });
  });

  it('marshalParams ignores the anchor file for a query pattern', () => {
    const params = marshalParams(
      'query',
      ['MyClass'],
      {},
      { root: '/project', json: false, allowOutsideRoot: true } as GlobalFlags,
      '/project/src/foo.ts'
    ) as { query: string };
    expect(params.query).toBe('MyClass');
  });

  it('zodToCommander omits the <file> argument when an anchor file is provided', () => {
    const cmd = zodToCommander(
      'textDocument/hover',
      COMMAND_DESCRIPTORS['textDocument/hover']!,
      {} as any,
      { root: '/project' } as GlobalFlags,
      '/project/src/foo.ts'
    );
    expect(cmd.registeredArguments.map((a) => a.name())).toEqual(['line:col']);
  });

  it('zodToCommander keeps the <file> argument when no anchor is provided', () => {
    const cmd = zodToCommander(
      'textDocument/hover',
      COMMAND_DESCRIPTORS['textDocument/hover']!,
      {} as any,
      { root: '/project' } as GlobalFlags
    );
    expect(cmd.registeredArguments.map((a) => a.name())).toEqual(['file', 'line:col']);
  });
});
