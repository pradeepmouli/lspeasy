import { describe, it, expect, vi } from 'vitest';
import { Command } from 'commander';
import { buildCommandTree } from './build-commands.js';
import type { GlobalFlags } from './io.js';

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: false,
  verbose: false,
  waitMs: 15000,
  allowOutsideRoot: false,
  overwrite: false
};

const fakeSession = {
  lsp: { sendRequest: vi.fn(async () => null) }
} as any;

describe('buildCommandTree', () => {
  it('registers textDocument/hover when hoverProvider is true', () => {
    const program = new Command();
    buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    expect(ns?.commands.find((c) => c.name() === 'hover')).toBeDefined();
  });

  it('does not register hover when hoverProvider is absent', () => {
    const program = new Command();
    buildCommandTree(program, {} as any, fakeSession, FLAGS);
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    expect(ns?.commands.find((c) => c.name() === 'hover')).toBeUndefined();
  });

  it('registers textDocument/rename when renameProvider is true', () => {
    const program = new Command();
    buildCommandTree(program, { renameProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    expect(ns?.commands.find((c) => c.name() === 'rename')).toBeDefined();
  });

  it('registers workspace/symbol when workspaceSymbolProvider is true', () => {
    const program = new Command();
    buildCommandTree(program, { workspaceSymbolProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find((c) => c.name() === 'workspace');
    expect(ns?.commands.find((c) => c.name() === 'symbol')).toBeDefined();
  });

  it('always registers the generic call command', () => {
    const program = new Command();
    buildCommandTree(program, {} as any, fakeSession, FLAGS);
    expect(program.commands.find((c) => c.name() === 'call')).toBeDefined();
  });

  it('shares one textDocument namespace across multiple capabilities', () => {
    const program = new Command();
    buildCommandTree(
      program,
      { hoverProvider: true, renameProvider: true } as any,
      fakeSession,
      FLAGS
    );
    const textDocCmds = program.commands.filter((c) => c.name() === 'textDocument');
    expect(textDocCmds).toHaveLength(1);
    expect(textDocCmds[0]!.commands.length).toBeGreaterThanOrEqual(2);
  });

  it('passes anchorFile through to zodToCommander (file argument omitted)', () => {
    const program = new Command();
    buildCommandTree(
      program,
      { hoverProvider: true } as any,
      fakeSession,
      FLAGS,
      '/project/src/foo.ts'
    );
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    const hover = ns?.commands.find((c) => c.name() === 'hover');
    expect(hover?.registeredArguments.map((a) => a.name())).toEqual(['line:col']);
  });

  it('every leaf command and the call command get the global-options help footer', () => {
    const program = new Command();
    buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    const hover = ns?.commands.find((c) => c.name() === 'hover');
    const call = program.commands.find((c) => c.name() === 'call');
    expect(hover?.helpInformation()).toMatch(/Global options:/);
    expect(call?.helpInformation()).toMatch(/Global options:/);
  });

  it('shows a "Capability options:" footer with the server-declared field values in direct helpInformation() output', () => {
    const program = new Command();
    buildCommandTree(
      program,
      { codeActionProvider: { codeActionKinds: ['quickfix', 'refactor'] } } as any,
      fakeSession,
      FLAGS
    );
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    const codeAction = ns?.commands.find((c) => c.name() === 'codeAction');
    const help = codeAction?.helpInformation() ?? '';
    expect(help).toMatch(/Capability options:/);
    expect(help).toContain('codeActionKinds');
    expect(help).toContain('"quickfix"');
    expect(help).toContain('"refactor"');
  });

  it('shows a "Discovering commands:" footer on workspace/executeCommand in direct helpInformation() output', () => {
    const program = new Command();
    buildCommandTree(
      program,
      { executeCommandProvider: { commands: ['foo.bar'] } } as any,
      fakeSession,
      FLAGS
    );
    const ns = program.commands.find((c) => c.name() === 'workspace');
    const executeCommand = ns?.commands.find((c) => c.name() === 'executeCommand');
    const help = executeCommand?.helpInformation() ?? '';
    expect(help).toMatch(/Discovering commands:/);
  });

  it('composes capability options, executeCommand note, and global options footers in the correct order', () => {
    const program = new Command();
    buildCommandTree(
      program,
      { executeCommandProvider: { commands: ['foo.bar'] } } as any,
      fakeSession,
      FLAGS
    );
    const ns = program.commands.find((c) => c.name() === 'workspace');
    const executeCommand = ns?.commands.find((c) => c.name() === 'executeCommand');
    const help = executeCommand?.helpInformation() ?? '';

    const capabilityIdx = help.indexOf('Capability options:');
    const discoveringIdx = help.indexOf('Discovering commands:');
    const globalIdx = help.indexOf('Global options:');

    expect(capabilityIdx).toBeGreaterThan(-1);
    expect(discoveringIdx).toBeGreaterThan(-1);
    expect(globalIdx).toBeGreaterThan(-1);
    expect(capabilityIdx).toBeLessThan(discoveringIdx);
    expect(discoveringIdx).toBeLessThan(globalIdx);
  });

  it('does not show a "Capability options:" footer when the capability is a plain boolean (no metadata)', () => {
    const program = new Command();
    buildCommandTree(program, { hoverProvider: true } as any, fakeSession, FLAGS);
    const ns = program.commands.find((c) => c.name() === 'textDocument');
    const hover = ns?.commands.find((c) => c.name() === 'hover');
    const help = hover?.helpInformation() ?? '';
    expect(help).not.toMatch(/Capability options:/);
  });
});
