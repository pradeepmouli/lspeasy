/**
 * Tests for `tokenizeCommand` — the quote-aware server-command splitter that
 * replaced a naive `split(/\s+/)`, which shredded any launch command with a
 * quoted argument containing spaces.
 */
import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { tokenizeCommand } from '@lspeasy/core';
import { CapturedEdits, RefactorSession, CLI_VERSION } from './session.js';
import type { WorkspaceEdit } from './apply.js';

describe('tokenizeCommand', () => {
  it('splits a plain command on whitespace', () => {
    expect(tokenizeCommand('typescript-language-server --stdio')).toEqual([
      'typescript-language-server',
      '--stdio'
    ]);
  });

  it('collapses runs of whitespace and trims edges', () => {
    expect(tokenizeCommand('  node   server.js   --stdio  ')).toEqual([
      'node',
      'server.js',
      '--stdio'
    ]);
  });

  it('keeps a double-quoted argument with spaces as one token', () => {
    expect(tokenizeCommand('node "/path with spaces/server.js" --stdio')).toEqual([
      'node',
      '/path with spaces/server.js',
      '--stdio'
    ]);
  });

  it('keeps a single-quoted argument with spaces as one token', () => {
    expect(tokenizeCommand("node '/a b/srv.js' --x")).toEqual(['node', '/a b/srv.js', '--x']);
  });

  it('joins adjacent quoted and unquoted segments into one token', () => {
    expect(tokenizeCommand('cmd --flag="a b" tail')).toEqual(['cmd', '--flag=a b', 'tail']);
  });

  it('treats a backslash as a literal separator, escaping ONLY a following quote', () => {
    // `\"` escapes the quote (literal "); a bare `\` before a space stays literal
    // and the space still separates tokens.
    expect(tokenizeCommand('cmd \\"quoted\\" tail')).toEqual(['cmd', '"quoted"', 'tail']);
    expect(tokenizeCommand('node a\\b c')).toEqual(['node', 'a\\b', 'c']);
  });

  it('keeps Windows backslash path separators literal (quoted)', () => {
    // A quoted Windows exe path must survive intact — backslashes are NOT escapes.
    expect(tokenizeCommand('"C:\\Program Files\\typescript-language-server.exe" --stdio')).toEqual([
      'C:\\Program Files\\typescript-language-server.exe',
      '--stdio'
    ]);
  });

  it('keeps Windows backslash path separators literal (unquoted)', () => {
    expect(tokenizeCommand('C:\\tools\\tsserver.exe --stdio')).toEqual([
      'C:\\tools\\tsserver.exe',
      '--stdio'
    ]);
  });

  it('escapes an embedded quote inside a double-quoted span', () => {
    // \" inside "..." yields a literal quote in the token.
    expect(tokenizeCommand('node "a\\"b" --x')).toEqual(['node', 'a"b', '--x']);
  });

  it('returns an empty array for an empty/whitespace command', () => {
    expect(tokenizeCommand('')).toEqual([]);
    expect(tokenizeCommand('   ')).toEqual([]);
  });
});

describe('CapturedEdits', () => {
  const edit = (rel: string): WorkspaceEdit => ({ changes: { [`file:///${rel}`]: [] } });

  it('queues MULTIPLE pushed edits and drains them all in arrival order', () => {
    // Regression: a server sending several sequential workspace/applyEdit
    // requests must have every edit retained (the old single-field capture
    // overwrote earlier edits while acking each applied:true).
    const q = new CapturedEdits();
    const a = edit('a.ts');
    const b = edit('b.ts');
    const c = edit('c.ts');
    q.push(a);
    q.push(b);
    q.push(c);
    expect(q.drain()).toEqual([a, b, c]);
  });

  it('resets after a drain (second drain is empty)', () => {
    const q = new CapturedEdits();
    q.push(edit('x.ts'));
    q.drain();
    expect(q.drain()).toEqual([]);
  });
});

describe('RefactorSession.requestWithRetry — readiness retry (fix B)', () => {
  // Constructor does not spawn a server (start() does), so a bare session with a
  // short indexWaitMs is safe to exercise requestWithRetry in isolation.
  const makeSession = (indexWaitMs: number) => new RefactorSession({ root: '/tmp', indexWaitMs });

  it('returns a complete result on the first try (no extra latency)', async () => {
    const session = makeSession(2000);
    let calls = 0;
    const run = async () => {
      calls++;
      return ['decl', 'ref1', 'ref2'];
    };
    const res = await session.requestWithRetry(run, (r) => (r as unknown[]).length <= 1);
    expect(calls).toBe(1);
    expect(res).toEqual(['decl', 'ref1', 'ref2']);
  });

  it('retries while incomplete, then returns the first complete result', async () => {
    const session = makeSession(5000);
    let calls = 0;
    const run = async () => {
      calls++;
      return calls < 3 ? ['decl-only'] : ['decl', 'ref1', 'ref2'];
    };
    const res = await session.requestWithRetry(run, (r) => (r as unknown[]).length <= 1);
    expect(calls).toBe(3);
    expect(res).toEqual(['decl', 'ref1', 'ref2']);
  });

  it('returns the best-effort (incomplete) result on timeout — not null', async () => {
    const session = makeSession(80); // tiny budget → times out quickly
    const run = async () => ['decl-only'];
    const res = await session.requestWithRetry(run, (r) => (r as unknown[]).length <= 1);
    expect(res).toEqual(['decl-only']);
  });

  it('without a predicate, keeps the original null-retry contract', async () => {
    const session = makeSession(80);
    const run = async () => null;
    const res = await session.requestWithRetry(run);
    expect(res).toBeNull();
  });
});

describe('CLI_VERSION (--version source)', () => {
  it('reflects apps/cli/package.json (not the 0.0.0 fallback)', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')) as {
      version: string;
    };
    expect(CLI_VERSION).toBe(pkg.version);
    expect(CLI_VERSION).toMatch(/^\d+\.\d+\.\d+/);
    expect(CLI_VERSION).not.toBe('0.0.0');
  });
});
