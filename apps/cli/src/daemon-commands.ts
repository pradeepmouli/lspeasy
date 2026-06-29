import { exit } from 'node:process';

import { startDaemon, stopDaemon, fetchDaemonStatus } from './connect.js';
import { daemonStatusLine } from './help.js';
import type { Formatter } from './format.js';
import type { GlobalFlags } from './io.js';

function emit(obj: unknown): void {
  process.stdout.write(JSON.stringify(obj) + '\n');
}

/**
 * `lsproxy daemon <start|stop|status>` — manage the per-root proxy daemon.
 *
 * The daemon otherwise starts lazily on the first real request; this gives an
 * explicit handle to warm it ahead of time, stop it, or inspect it. JSON output
 * (`--json`) stays ANSI-free for agents.
 */
export async function runDaemon(
  sub: string | undefined,
  flags: GlobalFlags,
  fmt: Formatter
): Promise<void> {
  if (sub === 'start') {
    const { started, pid } = await startDaemon(flags.root, flags.verbose);
    if (flags.json) {
      emit({ ok: true, daemon: started ? 'started' : 'already-running', pid, root: flags.root });
    } else {
      const label = started ? fmt.green('daemon started') : fmt.dim('daemon already running');
      process.stdout.write(`${label}${pid !== null ? fmt.dim(` · pid ${pid}`) : ''}\n`);
    }
    return;
  }
  if (sub === 'stop') {
    const { stopped, pid } = await stopDaemon(flags.root);
    if (flags.json) {
      emit({ ok: true, daemon: stopped ? 'stopped' : 'not-running', pid });
    } else {
      process.stdout.write(
        stopped
          ? `${fmt.yellow('daemon stopped')}${fmt.dim(` · pid ${pid}`)}\n`
          : fmt.dim('no daemon running\n')
      );
    }
    return;
  }
  if (sub === 'status') {
    const status = await fetchDaemonStatus(flags.root);
    if (flags.json) {
      emit({ ok: true, daemon: status?.daemon ?? null });
    } else {
      process.stdout.write(`${daemonStatusLine(status?.daemon ?? null, fmt)}\n`);
    }
    return;
  }
  process.stderr.write('usage: lsproxy daemon <start|stop|status> [--json]\n');
  exit(1);
}
