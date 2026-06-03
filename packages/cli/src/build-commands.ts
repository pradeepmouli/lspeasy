import { Command } from 'commander';
import { LSPSchemas, getSchemaForMethod, getCapabilityForRequestMethod } from '@lspeasy/core';
import type { ServerCapabilities } from '@lspeasy/core';

import { zodToCommander, printAppliedChanges } from './zod-to-commander.js';
import { applyWorkspaceEdit, planWorkspaceEdit } from './apply.js';
import type { BoundaryGuard } from './apply.js';
import type { RefactorSession } from './session.js';
import type { GlobalFlags } from './io.js';

function getNestedValue(obj: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc != null && typeof acc === 'object' ? (acc as Record<string, unknown>)[key] : undefined,
      obj
    );
}

export function buildCommandTree(
  program: Command,
  capabilities: ServerCapabilities,
  session: RefactorSession,
  flags: GlobalFlags
): void {
  for (const method of Object.keys(LSPSchemas) as Array<keyof typeof LSPSchemas>) {
    const schema = getSchemaForMethod(method as string);
    if (!schema) continue;

    const capPath = getCapabilityForRequestMethod(method as any);
    if (capPath === 'alwaysOn') continue;
    if (!getNestedValue(capabilities, capPath as string)) continue;

    const parts = (method as string).split('/');
    if (parts.length !== 2) continue;
    const [namespace] = parts as [string, string];

    let nsCmd = program.commands.find((c) => c.name() === namespace);
    if (!nsCmd) {
      nsCmd = new Command(namespace).description(`${namespace} operations`);
      program.addCommand(nsCmd);
    }

    nsCmd.addCommand(zodToCommander(method as string, schema, session, flags));
  }

  program
    .command('call <method>')
    .description('Send any LSP request by method name with raw JSON params')
    .option('--params <json>', 'LSP params as JSON')
    .action(async (method: string, opts: { params?: string }) => {
      try {
        const params = opts.params ? JSON.parse(opts.params) : {};
        const result = await (
          session.lsp.sendRequest as (method: string, params: unknown) => Promise<unknown>
        )(method, params);
        const capturedEdits = session.takeCapturedEdits();
        if (capturedEdits.length > 0) {
          const guard: BoundaryGuard = {
            root: flags.root,
            allowOutsideRoot: flags.allowOutsideRoot
          };
          const allChanges = capturedEdits.flatMap((edit) =>
            flags.dryRun ? planWorkspaceEdit(edit, guard) : applyWorkspaceEdit(edit, guard)
          );
          printAppliedChanges(allChanges, method, flags.dryRun, flags.json);
        } else if (flags.json) {
          process.stdout.write(JSON.stringify({ ok: true, method, result }) + '\n');
        } else {
          process.stdout.write(JSON.stringify(result, null, 2) + '\n');
        }
      } catch (err) {
        if (flags.json) {
          process.stdout.write(JSON.stringify({ ok: false, error: String(err) }) + '\n');
        } else {
          process.stderr.write(`error: ${String(err)}\n`);
        }
        process.exit(1);
      }
    });
}
