import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { fetchDaemonStatus } from './connect.js';

describe('fetchDaemonStatus', () => {
  it('returns null when no daemon socket is live', async () => {
    const root = mkdtempSync(join(tmpdir(), 'lspeasy-nostatus-'));
    expect(await fetchDaemonStatus(root)).toBeNull();
  });
});
