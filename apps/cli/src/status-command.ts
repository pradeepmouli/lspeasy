import { Command } from 'commander';
import { coldStatusReport } from '@lsproxy/proxy';
import { allConfiguredServersWithSource } from './resolve.js';
import { fetchDaemonStatus } from './connect.js';
import { groupServerStatus } from './server-groups.js';
import { renderStatus } from './help.js';
import { createFormatter } from './format.js';
import type { GlobalFlags } from './io.js';

/** Real Commander command for `lsproxy status` — every configured language
 * server grouped by process, with live status (if the daemon is up),
 * resolved binary location, and config source. Never connects an LSP
 * session. */
export function buildStatusCommand(flags: GlobalFlags): Command {
  return new Command('status')
    .description(
      'Show configured language servers grouped by process, with location and config source'
    )
    .action(async () => {
      const live = await fetchDaemonStatus(flags.root);
      const report = live ?? coldStatusReport(allConfiguredServersWithSource(flags.root));
      const sources = allConfiguredServersWithSource(flags.root);
      const servers = groupServerStatus(report.languages, sources);

      if (flags.json) {
        process.stdout.write(JSON.stringify({ daemon: report.daemon, servers }) + '\n');
      } else {
        const color = process.stdout.isTTY === true && !process.env['NO_COLOR'];
        process.stdout.write(renderStatus(servers, report.daemon, createFormatter(color)));
      }
    });
}
