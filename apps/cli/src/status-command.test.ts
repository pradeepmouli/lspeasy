import { describe, it, expect, vi, afterEach } from 'vitest';

vi.mock('./connect.js', () => ({ fetchDaemonStatus: vi.fn(async () => null) }));
vi.mock('./resolve.js', () => ({
  allConfiguredServersWithSource: () => [
    {
      name: 'typescript',
      command: '"tsls"',
      fileExtensions: { '.ts': 'typescript' },
      source: 'lsp.json'
    }
  ]
}));
vi.mock('@lsproxy/proxy', () => ({
  coldStatusReport: (
    servers: Array<{ name: string; command: string; fileExtensions: Record<string, string> }>
  ) => ({
    daemon: null,
    languages: servers.flatMap((s) =>
      Object.entries(s.fileExtensions).map(([ext, languageId]) => ({
        languageId,
        name: s.name,
        extensions: [ext],
        command: s.command,
        status: 'cold' as const
      }))
    )
  })
}));

import { buildStatusCommand } from './status-command.js';
import type { GlobalFlags } from './io.js';

afterEach(() => vi.restoreAllMocks());

const FLAGS: GlobalFlags = {
  server: '',
  root: '/project',
  dryRun: false,
  json: true,
  verbose: false,
  waitMs: 0,
  allowOutsideRoot: false,
  noProxy: false,
  overwrite: false
};

describe('buildStatusCommand', () => {
  it('--json output is grouped by server, with source and a languages array', async () => {
    const cmd = buildStatusCommand(FLAGS);
    const chunks: string[] = [];
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
      chunks.push(s);
      return true;
    }) as never);
    try {
      await cmd.parseAsync([], { from: 'user' });
    } finally {
      spy.mockRestore();
    }
    const parsed = JSON.parse(chunks.join('')) as {
      daemon: unknown;
      servers: Array<{ name: string; source: string; languages: Array<{ languageId: string }> }>;
    };
    expect(parsed.servers).toHaveLength(1);
    expect(parsed.servers[0]!.source).toBe('lsp.json');
    expect(parsed.servers[0]!.languages.map((l) => l.languageId)).toContain('typescript');
    expect(parsed.daemon).toBeNull();
  });
});
