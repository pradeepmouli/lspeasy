import { afterEach, describe, expect, it, vi } from 'vitest';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { buildFlags, runHelp, runDispatch, scanArgs } from './cli.js';
import type { GlobalFlags } from './io.js';

function withFailStubbed(body: () => void): string[] {
  const errs: string[] = [];
  vi.spyOn(process, 'exit').mockImplementation(((): never => {
    throw new Error('exit');
  }) as never);
  vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
    errs.push(s);
    return true;
  }) as never);
  body();
  return errs;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('buildFlags', () => {
  it('defaults --wait to 15000 and applies the documented defaults', () => {
    const flags = buildFlags({ root: '/repo' });
    expect(flags.waitMs).toBe(15000);
    expect(flags.dryRun).toBe(false);
    expect(flags.overwrite).toBe(false);
    expect(flags.allowOutsideRoot).toBe(false);
    expect(flags.server).toBe('');
  });

  it('parses a numeric --wait', () => {
    expect(buildFlags({ root: '/repo', wait: '2000' }).waitMs).toBe(2000);
    expect(buildFlags({ root: '/repo', wait: '0' }).waitMs).toBe(0);
  });

  it('rejects a non-numeric --wait (NaN would silently become 0ms)', () => {
    const errs = withFailStubbed(() => {
      expect(() => buildFlags({ root: '/repo', wait: 'abc' })).toThrow('exit');
    });
    expect(errs.join('')).toMatch(/--wait must be a non-negative number/);
  });

  it('rejects a negative --wait', () => {
    const errs = withFailStubbed(() => {
      expect(() => buildFlags({ root: '/repo', wait: '-5' })).toThrow('exit');
    });
    expect(errs.join('')).toMatch(/--wait must be a non-negative number/);
  });

  it('accepts --dry-run (dryRun true)', () => {
    expect(buildFlags({ root: '/repo', 'dry-run': true }).dryRun).toBe(true);
  });

  it('passes through --server override', () => {
    expect(buildFlags({ root: '/repo', server: 'rust-analyzer' }).server).toBe('rust-analyzer');
  });
});

// Regression coverage for the pass-1 flag-parsing bug: main() used to cast
// Commander's real `scan.opts()` output directly to `ParsedOptionValues`,
// but Commander camelCases long option names and, for `--no-x`-prefixed
// options, strips the `no-` prefix and inverts the boolean (`--no-proxy` ->
// `proxy: false`, not `noProxy: true`). `buildFlags` reads hyphenated keys
// (`values['dry-run']`, `values['allow-outside-root']`, `values['no-proxy']`)
// that never existed in that raw shape, so `--dry-run`, `--allow-outside-root`,
// and `--no-proxy` were silently ignored (always false) — the exact scenario
// where `--dry-run` failing open means writing to disk instead of previewing.
// These tests drive real argv through `scanArgs`'s actual
// `scan.parseOptions()`/`scan.opts()` call, not a hand-built options object,
// so they exercise the real Commander shape-mapping bug end to end.
describe('scanArgs -> buildFlags (real Commander opts() mapping)', () => {
  it('maps a real --dry-run --allow-outside-root --no-proxy argv onto GlobalFlags', () => {
    const { scanOpts } = scanArgs([
      'typescript',
      'textDocument',
      'hover',
      '--dry-run',
      '--allow-outside-root',
      '--no-proxy',
      '--root',
      '/x'
    ]);
    const flags = buildFlags(scanOpts);
    expect(flags.dryRun).toBe(true);
    expect(flags.allowOutsideRoot).toBe(true);
    expect(flags.noProxy).toBe(true);
  });

  it('defaults dryRun/allowOutsideRoot/noProxy to false when the flags are omitted from argv', () => {
    const { scanOpts } = scanArgs(['typescript', 'textDocument', 'hover', '--root', '/x']);
    const flags = buildFlags(scanOpts);
    expect(flags.dryRun).toBe(false);
    expect(flags.allowOutsideRoot).toBe(false);
    expect(flags.noProxy).toBe(false);
  });
});

// Minimal stdio LSP server used by tests that need a real (fast,
// deterministic) `initialize` handshake instead of a fictional command name
// like "tsls" — spawning a nonexistent binary either throws (direct session)
// or, when routed through the real proxy daemon, hangs forever (the daemon's
// backend pool doesn't propagate a spawn ENOENT into the pending `initialize`
// response — a pre-existing gap, out of scope for this task). This script
// answers `initialize` with a fixed capabilities object over standard LSP
// Content-Length framing, so `runHelp`/`runDispatch` tests that go through
// the language-or-file resolution path connect in milliseconds.
const FAKE_LSP_SERVER_SRC = `
let buf = Buffer.alloc(0);
process.stdin.on('data', (chunk) => {
  buf = Buffer.concat([buf, chunk]);
  for (;;) {
    const headerEnd = buf.indexOf('\\r\\n\\r\\n');
    if (headerEnd === -1) return;
    const header = buf.subarray(0, headerEnd).toString('utf8');
    const match = /Content-Length: (\\d+)/i.exec(header);
    if (!match) return;
    const length = Number(match[1]);
    const bodyStart = headerEnd + 4;
    if (buf.length < bodyStart + length) return;
    const body = buf.subarray(bodyStart, bodyStart + length).toString('utf8');
    buf = buf.subarray(bodyStart + length);
    try { handle(JSON.parse(body)); } catch { /* ignore */ }
  }
});
function send(msg) {
  const body = JSON.stringify(msg);
  process.stdout.write('Content-Length: ' + Buffer.byteLength(body, 'utf8') + '\\r\\n\\r\\n' + body);
}
function handle(msg) {
  if (msg.method === 'initialize') {
    send({ jsonrpc: '2.0', id: msg.id, result: { capabilities: { hoverProvider: true, definitionProvider: true, textDocumentSync: 1 } } });
  } else if (msg.method === 'shutdown') {
    send({ jsonrpc: '2.0', id: msg.id, result: null });
  } else if (msg.method === 'exit') {
    process.exit(0);
  } else if (msg.id !== undefined) {
    send({ jsonrpc: '2.0', id: msg.id, result: null });
  }
}
`;

function tmpRootWithConfig(): string {
  const dir = mkdtempSync(join(tmpdir(), 'lspeasy-help-'));
  const serverPath = join(dir, 'fake-lsp-server.mjs');
  writeFileSync(serverPath, FAKE_LSP_SERVER_SRC, 'utf8');
  writeFileSync(
    join(dir, 'lsp.json'),
    JSON.stringify({
      lspServers: {
        typescript: {
          command: process.execPath,
          args: [serverPath],
          fileExtensions: { '.ts': 'typescript' }
        }
      }
    }),
    'utf8'
  );
  return dir;
}

function baseFlags(root: string, json: boolean): GlobalFlags {
  return {
    server: '',
    root,
    dryRun: false,
    json,
    verbose: false,
    waitMs: 0,
    allowOutsideRoot: false,
    noProxy: false,
    overwrite: false
  };
}

function captureStdout(): { out: () => string; restore: () => void } {
  const chunks: string[] = [];
  const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
    chunks.push(s);
    return true;
  }) as never);
  return { out: () => chunks.join(''), restore: () => spy.mockRestore() };
}

describe('runHelp (daemon down)', () => {
  it('lists configured languages with the drill-down hint and no ANSI', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    try {
      await runHelp([], baseFlags(root, false));
    } finally {
      cap.restore();
    }
    const text = cap.out();
    expect(text).toContain('typescript');
    expect(text).toContain('lsproxy <language-or-file>');
    expect(text).not.toContain('\x1b');
  });

  it('--json emits a parseable status object with a languages array and no ANSI', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    try {
      await runHelp([], baseFlags(root, true));
    } finally {
      cap.restore();
    }
    const text = cap.out();
    expect(text).not.toContain('\x1b');
    const parsed = JSON.parse(text) as {
      daemon: unknown;
      languages: Array<{ languageId: string }>;
    };
    expect(parsed.daemon).toBeNull();
    expect(parsed.languages.map((l) => l.languageId)).toContain('typescript');
  });

  it('errors for an unconfigured language', async () => {
    const root = tmpRootWithConfig();
    const errs: string[] = [];
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);
    try {
      await expect(runHelp(['python'], baseFlags(root, false))).rejects.toThrow('exit');
      expect(errs.some((s) => s.includes('python'))).toBe(true);
    } finally {
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });

  it('emits structured JSON when the drill-down server fails to start (--json)', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    try {
      // server: '   ' tokenizes to no command, so RefactorSession.start() throws
      // synchronously — a deterministic stand-in for a missing/crashing server.
      await expect(
        runHelp(['typescript', 'textDocument'], { ...baseFlags(root, true), server: '   ' })
      ).rejects.toThrow('exit');
      const parsed = JSON.parse(cap.out()) as { ok: boolean; error: string };
      expect(parsed.ok).toBe(false);
      expect(parsed.error).toContain('typescript');
      expect(cap.out()).not.toContain('\x1b');
    } finally {
      cap.restore();
      exitSpy.mockRestore();
    }
  });
});

describe('runHelp — file-as-first-token (unified grammar)', () => {
  it('accepts a file path as the first token, same as a language id', async () => {
    const root = tmpRootWithConfig();
    writeFileSync(join(root, 'foo.ts'), 'const x = 1;\n', 'utf8');
    const cap = captureStdout();
    try {
      await runHelp(['foo.ts'], baseFlags(root, false));
    } finally {
      cap.restore();
    }
    expect(cap.out()).toContain('textDocument');
  });
});

describe('runDispatch — incomplete real call falls back to the drill-down view', () => {
  it('shows the same schema view as --help when a required arg is missing', async () => {
    const root = tmpRootWithConfig();
    const cap = captureStdout();
    // runDispatch's pass-2 Commander parse reconstructs its argv from the real
    // `process.argv` (minus the language-or-file token) rather than from the
    // `positionals` parameter, so that real CLI flag formatting/quoting
    // survives verbatim through main()'s two passes. Calling runDispatch
    // directly (bypassing main()) needs argv stubbed to match, or the
    // language token is never found and the test-runner's own argv gets fed
    // to Commander instead. cli.ts imports `argv` as a named binding from
    // `node:process` (`import { argv } from 'node:process'`), which captures
    // the array *reference* rather than re-reading `process.argv` on each
    // access — reassigning `process.argv = [...]` (a new array) would NOT be
    // visible through that binding, so the stub must mutate the existing
    // array in place.
    const originalArgv = [...process.argv];
    process.argv.splice(2, process.argv.length - 2, 'typescript', 'textDocument', 'hover');
    try {
      await runDispatch(['typescript', 'textDocument', 'hover'], baseFlags(root, false));
    } finally {
      process.argv.splice(0, process.argv.length, ...originalArgv);
      cap.restore();
    }
    const text = cap.out();
    expect(text).toMatch(/Usage:/);
    expect(text.toLowerCase()).toContain('hover');
  });

  it('an unresolvable first token fails with the configured-languages list', async () => {
    const root = tmpRootWithConfig();
    const errs: string[] = [];
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((): never => {
      throw new Error('exit');
    }) as never);
    const errSpy = vi.spyOn(process.stderr, 'write').mockImplementation(((s: string) => {
      errs.push(s);
      return true;
    }) as never);
    try {
      await expect(
        runDispatch(['nope', 'textDocument', 'hover'], baseFlags(root, false))
      ).rejects.toThrow('exit');
      expect(errs.some((s) => s.includes('nope'))).toBe(true);
    } finally {
      exitSpy.mockRestore();
      errSpy.mockRestore();
    }
  });
});
