import { describe, expect, it } from 'vitest';
import type { ConfiguredServer } from '@lspeasy/core';
import { buildStatusReport, coldStatusReport } from './status.js';

const tsServer: ConfiguredServer = {
  name: 'typescript',
  command: '"typescript-language-server" "--stdio"',
  fileExtensions: { '.ts': 'typescript', '.tsx': 'typescript' }
};
const rustServer: ConfiguredServer = {
  name: 'rust',
  command: '"rust-analyzer"',
  fileExtensions: { '.rs': 'rust' }
};

describe('buildStatusReport', () => {
  it('marks languages with a live backend as running with stats, others cold', () => {
    const report = buildStatusReport({
      now: 10_000,
      daemonPid: 100,
      daemonStartedAt: 1_000,
      root: '/proj',
      sessions: 2,
      configured: [tsServer, rustServer],
      backends: [
        { languageId: 'typescript', pid: 200, startedAt: 4_000, requestCount: 7, healthy: true }
      ],
      openDocsByLanguage: { typescript: 3 }
    });

    expect(report.daemon).toEqual({
      pid: 100,
      uptimeMs: 9_000,
      root: '/proj',
      sessions: 2,
      backends: 1
    });

    const ts = report.languages.find((l) => l.languageId === 'typescript')!;
    expect(ts).toMatchObject({
      languageId: 'typescript',
      name: 'typescript',
      status: 'running',
      healthy: true,
      pid: 200,
      uptimeMs: 6_000,
      openDocuments: 3,
      requestsServed: 7
    });
    expect(ts.extensions.sort()).toEqual(['.ts', '.tsx']);

    const rust = report.languages.find((l) => l.languageId === 'rust')!;
    expect(rust.status).toBe('cold');
    expect(rust.pid).toBeUndefined();
  });
});

describe('coldStatusReport', () => {
  it('reports null daemon and every language cold', () => {
    const report = coldStatusReport([tsServer, rustServer]);
    expect(report.daemon).toBeNull();
    expect(report.languages.map((l) => l.status)).toEqual(['typescript', 'rust'].map(() => 'cold'));
    expect(report.languages.map((l) => l.languageId).sort()).toEqual(['rust', 'typescript']);
  });
});
