import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildDaemonCommand } from './daemon-commands.js';
import { createFormatter } from './format.js';
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

describe('buildDaemonCommand', () => {
  it('has real Commander help for start/stop/status', () => {
    const cmd = buildDaemonCommand(FLAGS, createFormatter(false));
    expect(cmd.commands.map((c) => c.name()).sort()).toEqual(['start', 'status', 'stop']);
  });

  it('status dispatches through to a parseable result (daemon not running)', async () => {
    const cmd = buildDaemonCommand(FLAGS, createFormatter(false));
    const chunks: string[] = [];
    const spy = vi.spyOn(process.stdout, 'write').mockImplementation(((s: string) => {
      chunks.push(s);
      return true;
    }) as never);
    try {
      await cmd.parseAsync(['status'], { from: 'user' });
    } finally {
      spy.mockRestore();
    }
    const parsed = JSON.parse(chunks.join('')) as { ok: boolean; daemon: unknown };
    expect(parsed.ok).toBe(true);
  });
});
