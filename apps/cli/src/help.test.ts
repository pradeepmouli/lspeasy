import { describe, expect, it } from 'vitest';
import type { StatusReport } from '@lsproxy/proxy';
import { createFormatter } from './format.js';
import {
  renderTopLevel,
  renderDrillDownText,
  drillDownJson,
  daemonStatusLine,
  renderStatus
} from './help.js';
import { buildProgram } from './program.js';
import type { ServerGroupStatus } from './server-groups.js';

const fmt = createFormatter(false);

function group(overrides: Partial<ServerGroupStatus> = {}): ServerGroupStatus {
  return {
    name: 'typescript-language-server',
    command: '"tsls"',
    resolvedPath: '/usr/local/bin/tsls',
    source: 'lsp.json',
    status: 'running',
    healthy: true,
    mixed: false,
    pid: 9,
    uptimeMs: 4000,
    openDocuments: 2,
    requestsServed: 11,
    languages: [
      {
        languageId: 'typescript',
        extensions: ['.ts', '.tsx'],
        status: 'running',
        healthy: true,
        pid: 9
      }
    ],
    ...overrides
  };
}

describe('renderStatus', () => {
  it('shows name, location, source, uptime, and languages for a healthy running server', () => {
    const out = renderStatus([group()], null, fmt);
    expect(out).toContain('typescript-language-server');
    expect(out).toContain('/usr/local/bin/tsls');
    expect(out).toContain('lsp.json');
    expect(out).toMatch(/4s/);
    expect(out).toContain('typescript (.ts .tsx)');
  });

  it('flags a command that could not be resolved on $PATH', () => {
    const out = renderStatus(
      [group({ resolvedPath: undefined, status: 'cold', pid: undefined })],
      null,
      fmt
    );
    expect(out).toMatch(/not found on \$PATH/);
  });

  it('shows "not started" and no uptime line for a cold server', () => {
    const out = renderStatus(
      [group({ status: 'cold', pid: undefined, uptimeMs: undefined, healthy: undefined })],
      null,
      fmt
    );
    expect(out).toMatch(/not started/);
  });

  it('mixed status shows a per-language breakdown instead of the flat languages line', () => {
    const mixed = group({
      mixed: true,
      languages: [
        { languageId: 'typescript', extensions: ['.ts'], status: 'running', pid: 9 },
        { languageId: 'javascript', extensions: ['.js'], status: 'cold' }
      ]
    });
    const out = renderStatus([mixed], null, fmt);
    expect(out).toMatch(/mixed/);
    expect(out).toContain('typescript');
    expect(out).toContain('javascript');
  });

  it('includes the daemon status line', () => {
    const out = renderStatus(
      [group()],
      { pid: 123, uptimeMs: 12000, root: '/p', sessions: 1, backends: 2 },
      fmt
    );
    expect(out).toMatch(/daemon: up/);
    expect(out).toContain('pid 123');
  });
});

describe('renderTopLevel', () => {
  it('lists running and cold languages with the drill-down hint and no ANSI', () => {
    const report: StatusReport = {
      daemon: { pid: 1, uptimeMs: 5000, root: '/p', sessions: 1, backends: 1 },
      languages: [
        {
          languageId: 'typescript',
          name: 'typescript',
          extensions: ['.ts', '.tsx'],
          command: '"tsls"',
          status: 'running',
          healthy: true,
          pid: 9,
          uptimeMs: 4000,
          openDocuments: 2,
          requestsServed: 11
        },
        { languageId: 'rust', name: 'rust', extensions: ['.rs'], command: '"ra"', status: 'cold' }
      ]
    };
    const out = renderTopLevel(report, fmt);
    expect(out).toContain('typescript');
    expect(out).toContain('.ts');
    expect(out).toContain('rust');
    expect(out).toContain('lsproxy <language-or-file>');
    expect(out).not.toContain('\x1b');
  });

  it('shows a "not started" header (not "down") when daemon is null', () => {
    const report: StatusReport = {
      daemon: null,
      languages: [
        { languageId: 'rust', name: 'rust', extensions: ['.rs'], command: '"ra"', status: 'cold' }
      ]
    };
    const out = renderTopLevel(report, fmt);
    expect(out).toMatch(/daemon: not started/i);
    // The daemon status must not read "down" (alarming); "Drill down:" in the
    // footer is unrelated, so scope the check to the daemon line.
    expect(out).not.toMatch(/daemon:\s*down/i);
  });

  it('shows base usage + non-namespace commands (config/daemon/call) with descriptions', () => {
    const report: StatusReport = { daemon: null, languages: [] };
    const out = renderTopLevel(report, fmt);
    expect(out).toMatch(/Usage:/);
    expect(out).toMatch(/lsproxy <language-or-file> <namespace> <request>/);
    expect(out).toMatch(/Commands:/);
    expect(out).toMatch(/config .*read\/write LSP config/);
    expect(out).toMatch(/daemon .*manage the per-root proxy daemon/);
    expect(out).toMatch(/status .*grouped by process/);
    expect(out).toMatch(/call .*send any LSP request/);
    expect(out).toMatch(/Global options:/);
    expect(out).toMatch(/--dry-run/);
  });

  it('applies color when the formatter is enabled (polish)', () => {
    const color = createFormatter(true);
    const report: StatusReport = {
      daemon: null,
      languages: [
        { languageId: 'rust', name: 'rust', extensions: ['.rs'], command: '"ra"', status: 'cold' }
      ]
    };
    const out = renderTopLevel(report, color);
    expect(out).toContain('\x1b[38;2;'); // 24-bit truecolor present
    expect(out).toContain('\x1b[38;2;235;203;139mnot started\x1b[0m'); // nord yellow status
    expect(out).toContain('\x1b[38;2;136;192;208mrust\x1b[0m'); // nord cyan language name
    expect(out).toContain('\x1b[1mLanguages:\x1b[0m'); // bold section header
  });

  it('applies role colors consistently in the bare view (not all-cyan)', () => {
    const color = createFormatter(true);
    const report: StatusReport = { daemon: null, languages: [] };
    const out = renderTopLevel(report, color);
    // Same role → same color as the drill-down help: options magenta,
    // methods/requests blue, args teal, namespaces cyan.
    expect(out).toContain('\x1b[38;2;180;142;173m--version,\x1b[0m'); // option → magenta
    expect(out).toContain('\x1b[38;2;129;161;193m<request>\x1b[0m'); // method/request → blue
    expect(out).toContain('\x1b[38;2;143;188;187m<json>\x1b[0m'); // positional/value arg → teal
    expect(out).toContain('\x1b[38;2;136;192;208m<namespace>\x1b[0m'); // namespace → cyan
  });

  it('colorizes <language-or-file> with the namespace role', () => {
    const color = createFormatter(true);
    const report: StatusReport = { daemon: null, languages: [] };
    const out = renderTopLevel(report, color);
    expect(out).toContain('\x1b[38;2;136;192;208m<language-or-file>\x1b[0m'); // nord cyan
  });
});

describe('daemonStatusLine', () => {
  it('reports "not started" when daemon is null', () => {
    expect(daemonStatusLine(null, fmt)).toMatch(/daemon: not started/);
  });

  it('reports up with pid/backends/sessions when running', () => {
    const line = daemonStatusLine(
      { pid: 7, uptimeMs: 1000, root: '/p', sessions: 3, backends: 2 },
      fmt
    );
    expect(line).toMatch(/daemon: up/);
    expect(line).toContain('pid 7');
    expect(line).toContain('2 backend(s)');
    expect(line).toContain('3 session(s)');
  });
});

describe('drill-down navigation', () => {
  it('lists namespaces at the root', () => {
    const { ok, text } = renderDrillDownText(buildProgram(), []);
    expect(ok).toBe(true);
    expect(text).toContain('textDocument');
    expect(text).toContain('workspace');
  });

  it('shows a namespace help with its requests', () => {
    const { ok, text } = renderDrillDownText(buildProgram(), ['textDocument']);
    expect(ok).toBe(true);
    expect(text.toLowerCase()).toContain('hover');
  });

  it('errors with siblings for an unknown namespace', () => {
    const { ok, text } = renderDrillDownText(buildProgram(), ['nope']);
    expect(ok).toBe(false);
    expect(text).toContain('textDocument');
  });

  it('drillDownJson returns structured namespaces for a language', () => {
    const json = drillDownJson(buildProgram(), 'typescript', []) as {
      languageId: string;
      namespaces: Array<{ name: string }>;
    };
    expect(json.languageId).toBe('typescript');
    expect(json.namespaces.map((n) => n.name)).toContain('textDocument');
  });

  it('drillDownJson returns request options at depth 2', () => {
    const json = drillDownJson(buildProgram(), 'typescript', ['textDocument', 'hover']) as {
      request: string;
      options: Array<{ flags: string }>;
    };
    expect(json.request).toBe('hover');
    expect(Array.isArray(json.options)).toBe(true);
  });

  it('drillDownJson includes positional arguments at depth 2', () => {
    const json = drillDownJson(buildProgram(), 'typescript', ['textDocument', 'hover']) as {
      arguments: Array<{ name: string; required: boolean; variadic: boolean }>;
    };
    expect(Array.isArray(json.arguments)).toBe(true);
    // hover takes its inputs positionally (<file> <line:col>), not as options.
    expect(json.arguments.map((a) => a.name)).toContain('file');
  });

  it('drillDownJson depth-2 includes params and result JSON Schema', () => {
    const json = drillDownJson(buildProgram(), 'typescript', ['textDocument', 'hover']) as {
      paramsSchema?: unknown;
      resultSchema?: unknown;
    };
    expect(json.paramsSchema).toBeTypeOf('object');
    expect(json.resultSchema).toBeTypeOf('object'); // hover has a result
  });

  it('depth-2 shows the --params residual (only fields not exposed as args/flags)', () => {
    const { text } = renderDrillDownText(buildProgram(), ['textDocument', 'codeAction']);
    expect(text).toMatch(/Example --params/i);
    expect(text).toContain('diagnostics'); // array-of-objects → residual
    expect(text).not.toMatch(/"textDocument"/); // positional, excluded from --params
    expect(text).not.toContain('\x1b'); // pure function: no color unless a formatter is passed
  });

  it('depth-2 says "no --params needed" when every input is a positional arg/flag', () => {
    const { text } = renderDrillDownText(buildProgram(), ['textDocument', 'hover']);
    expect(text).toMatch(/no --params needed/i);
  });

  it('colorizes the example label when a color formatter is passed', () => {
    const colorFmt = createFormatter(true);
    const { text } = renderDrillDownText(buildProgram(), ['textDocument', 'codeAction'], colorFmt);
    expect(text).toMatch(/Example --params/);
    expect(text).toContain('\x1b'); // ANSI escape present when formatter is enabled
  });

  it("colorizes Commander's own help (title + option/command terms)", () => {
    const colorFmt = createFormatter(true);
    const { text } = renderDrillDownText(buildProgram(), ['config'], colorFmt);
    expect(text).toContain('\x1b[1mUsage:\x1b[0m'); // bold section title
    expect(text).toContain('\x1b[38;2;'); // cyan terms (truecolor)
  });

  it('drill-down help is ANSI-free without a formatter AND with a disabled one', () => {
    // The real CLI path always passes createFormatter(color) — including
    // createFormatter(false) for pipes/NO_COLOR. Neither may leak ANSI (e.g. via
    // Commander's own default styling when getOutHasColors is forced).
    expect(renderDrillDownText(buildProgram(), ['config']).text).not.toContain('\x1b');
    expect(
      renderDrillDownText(buildProgram(), ['config'], createFormatter(false)).text
    ).not.toContain('\x1b');
  });
});
