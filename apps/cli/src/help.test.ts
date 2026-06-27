import { describe, expect, it } from 'vitest';
import type { StatusReport } from '@lsproxy/proxy';
import { createFormatter } from './format.js';
import { renderTopLevel } from './help.js';

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
