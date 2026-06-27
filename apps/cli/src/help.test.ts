import { describe, expect, it } from 'vitest';
import type { StatusReport } from '@lsproxy/proxy';
import { createFormatter } from './format.js';
import { renderTopLevel, renderDrillDownText, drillDownJson } from './help.js';
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

  it('shows a daemon-down header when daemon is null', () => {
    const report: StatusReport = {
      daemon: null,
      languages: [
        { languageId: 'rust', name: 'rust', extensions: ['.rs'], command: '"ra"', status: 'cold' }
      ]
    };
    expect(renderTopLevel(report, fmt)).toMatch(/daemon.*down/i);
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
});
