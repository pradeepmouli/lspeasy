import { describe, expect, it } from 'vitest';
import type { StatusReport } from '@lsproxy/proxy';
import { createFormatter } from './format.js';
import { renderTopLevel, renderDrillDownText, drillDownJson, daemonStatusLine } from './help.js';
import { buildProgram } from './program.js';

const fmt = createFormatter(false);

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
    expect(out).toMatch(/lsproxy --help <language>/);
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
});
