/**
 * Tests for the pure seams of `move-symbol` — `toLspCommand` (raw-Command
 * argument preservation) and `resolveMoveEdits` (the LSP `edit` + `command`
 * ordering contract and multi-applyEdit draining). These exercise the response
 * shapes no live tsserver reliably produces, so they are tested synthetically.
 */
import { describe, expect, it, vi } from 'vitest';

import { resolveMoveEdits, toLspCommand } from './move-symbol.js';
import type { WorkspaceEdit } from '../apply.js';

const editFor = (rel: string): WorkspaceEdit => ({
  changes: { [`file:///${rel}`]: [] }
});

describe('toLspCommand', () => {
  it('retains top-level arguments of a raw command-only action', () => {
    // Raw `Command` shape: `command` is a string and `arguments` sit at the top
    // level. Dropping them left command-only refactors with an empty arg list.
    const cmd = toLspCommand({
      title: 'Move to file',
      command: '_typescript.applyRefactoring',
      arguments: [{ file: 'a.ts', refactor: 'Move to file' }]
    });
    expect(cmd).toEqual({
      title: 'Move to file',
      command: '_typescript.applyRefactoring',
      arguments: [{ file: 'a.ts', refactor: 'Move to file' }]
    });
  });

  it('uses a nested object command as-is (CodeAction shape)', () => {
    const nested = { title: 'X', command: 'foo', arguments: [1, 2] };
    expect(toLspCommand({ title: 'outer', command: nested })).toBe(nested);
  });

  it('returns undefined when the action carries no command', () => {
    expect(toLspCommand({ title: 'edit-only', edit: { changes: {} } })).toBeUndefined();
  });
});

describe('resolveMoveEdits', () => {
  it('applies the inline edit FIRST, then runs the attached command (both)', async () => {
    // CodeAction with BOTH edit and command: the edit must be collected first,
    // then the command executed and its pushed edit appended (not either/or).
    const inline = editFor('inline.ts');
    const pushed = editFor('pushed.ts');
    const order: string[] = [];
    const execute = vi.fn(async () => {
      order.push('command');
    });
    const drain = () => {
      order.push('drain');
      return [pushed];
    };

    const edits = await resolveMoveEdits(
      {
        title: 'm',
        kind: 'refactor.move',
        edit: inline,
        command: { title: 'c', command: 'doMove' }
      },
      '/dest.ts',
      execute,
      drain
    );

    expect(execute).toHaveBeenCalledTimes(1);
    expect(edits).toEqual([inline, pushed]);
    // edit captured before the command ran; command before its drain.
    expect(order).toEqual(['command', 'drain']);
  });

  it('drains MULTIPLE server-pushed applyEdits in order (none dropped)', async () => {
    const e1 = editFor('one.ts');
    const e2 = editFor('two.ts');
    const e3 = editFor('three.ts');
    const edits = await resolveMoveEdits(
      { title: 'm', command: { title: 'c', command: 'doMove' } },
      '/dest.ts',
      async () => {},
      () => [e1, e2, e3]
    );
    expect(edits).toEqual([e1, e2, e3]);
  });

  it('handles an edit-only action with no command (command not executed)', async () => {
    const inline = editFor('inline.ts');
    const execute = vi.fn(async () => {});
    const edits = await resolveMoveEdits(
      { title: 'm', edit: inline },
      '/dest.ts',
      execute,
      () => []
    );
    expect(execute).not.toHaveBeenCalled();
    expect(edits).toEqual([inline]);
  });

  it('forwards a raw command-only action with arguments to execute', async () => {
    const execute = vi.fn(async () => {});
    await resolveMoveEdits(
      { title: 'm', command: 'rawCmd', arguments: [{ k: 'v' }] },
      '/dest.ts',
      execute,
      () => [editFor('x.ts')]
    );
    // The wrapped command retains the raw arguments (injectTargetFile only
    // rewrites _typescript.applyRefactoring, so a generic command passes through).
    expect(execute).toHaveBeenCalledWith({
      title: 'm',
      command: 'rawCmd',
      arguments: [{ k: 'v' }]
    });
  });
});
