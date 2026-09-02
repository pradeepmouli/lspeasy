import { Command } from 'commander';

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
  // Honor the --json contract for errors too: {ok:false,error} on stdout.
  const fail = (msg: string): void => {
    if (flags.json) emit({ ok: false, error: msg });
    else process.stderr.write(`error: ${msg}\n`);
    process.exit(1);
  };

  if (sub !== 'start' && sub !== 'stop' && sub !== 'status') {
    fail('usage: lsproxy daemon <start|stop|status> [--json]');
    return;
  }

  try {
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
      const { stopped, pid, pending } = await stopDaemon(flags.root);
      const state = stopped ? 'stopped' : pending ? 'stopping' : 'not-running';
      if (flags.json) {
        emit({ ok: true, daemon: state, pid });
      } else {
        process.stdout.write(
          stopped
            ? `${fmt.yellow('daemon stopped')}${fmt.dim(` · pid ${pid}`)}\n`
            : pending
              ? `${fmt.yellow('daemon stopping')}${fmt.dim(` · pid ${pid} (still shutting down)`)}\n`
              : fmt.dim('no daemon running\n')
        );
      }
      return;
    }
    // status
    const status = await fetchDaemonStatus(flags.root);
    if (flags.json) emit({ ok: true, daemon: status?.daemon ?? null });
    else process.stdout.write(`${daemonStatusLine(status?.daemon ?? null, fmt)}\n`);
  } catch (err) {
    // e.g. startDaemon spawn/poll timeout — keep the --json contract instead of
    // bubbling to main()'s plain-text `fatal:`.
    fail(err instanceof Error ? err.message : String(err));
  }
}

/** Real Commander command tree for `lsproxy daemon <start|stop|status>`,
 * wrapping the existing `runDaemon` dispatch. */
export function buildDaemonCommand(flags: GlobalFlags, fmt: Formatter): Command {
  const daemon = new Command('daemon').description(
    'Manage the per-root proxy daemon (otherwise starts lazily on first request)'
  );
  daemon
    .command('start')
    .description('Start the proxy daemon for --root (no-op if already running)')
    .action(() => runDaemon('start', flags, fmt));
  daemon
    .command('stop')
    .description('Stop the proxy daemon for --root')
    .action(() => runDaemon('stop', flags, fmt));
  daemon
    .command('status')
    .description('Show daemon status for --root')
    .action(() => runDaemon('status', flags, fmt));
  return daemon;
}
