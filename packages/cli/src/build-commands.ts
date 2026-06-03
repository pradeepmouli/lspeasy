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

function capabilityObject(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function stringArray(value: unknown): string[] | null {
  return Array.isArray(value) && value.length > 0 ? (value as string[]) : null;
}

/**
 * Enrich subcommand help text with runtime-discovered capability metadata.
 * Called after zodToCommander so the command exists but before it is added to
 * the namespace. Each case reads the relevant provider from ServerCapabilities
 * and appends an "after" help block listing discovered values.
 */
function enrichCommandFromCapabilities(
  method: string,
  cmd: Command,
  capabilities: ServerCapabilities
): void {
  switch (method) {
    case 'textDocument/codeAction': {
      const kinds = stringArray(
        capabilityObject(capabilities.codeActionProvider)?.['codeActionKinds']
      );
      if (kinds)
        cmd.addHelpText(
          'after',
          `\nServer-supported kinds (--code-action-only):\n  ${kinds.join(', ')}`
        );
      break;
    }
    case 'textDocument/completion': {
      const chars = stringArray(
        capabilityObject(capabilities.completionProvider)?.['triggerCharacters']
      );
      if (chars)
        cmd.addHelpText(
          'after',
          `\nTrigger characters: ${chars.map((c) => JSON.stringify(c)).join('  ')}`
        );
      break;
    }
    case 'textDocument/signatureHelp': {
      const provider = capabilityObject(capabilities.signatureHelpProvider);
      const trigger = stringArray(provider?.['triggerCharacters']);
      const retrigger = stringArray(provider?.['retriggerCharacters']);
      const lines: string[] = [];
      if (trigger)
        lines.push(`Trigger characters:   ${trigger.map((c) => JSON.stringify(c)).join('  ')}`);
      if (retrigger)
        lines.push(`Retrigger characters: ${retrigger.map((c) => JSON.stringify(c)).join('  ')}`);
      if (lines.length) cmd.addHelpText('after', `\n${lines.join('\n')}`);
      break;
    }
    case 'textDocument/onTypeFormatting': {
      const provider = capabilityObject(capabilities.documentOnTypeFormattingProvider);
      if (provider) {
        const first = provider['firstTriggerCharacter'];
        const more = stringArray(provider['moreTriggerCharacter']);
        const all = [first, ...(more ?? [])].filter(Boolean) as string[];
        if (all.length)
          cmd.addHelpText(
            'after',
            `\n--ch must be one of: ${all.map((c) => JSON.stringify(c)).join('  ')}`
          );
      }
      break;
    }
    case 'workspace/executeCommand': {
      const commands = stringArray(
        capabilityObject(capabilities.executeCommandProvider)?.['commands']
      );
      if (commands)
        cmd.addHelpText(
          'after',
          `\nServer-supported commands (--command):\n  ${commands.join('\n  ')}`
        );
      break;
    }
  }
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

    const subCmd = zodToCommander(method as string, schema, session, flags);
    enrichCommandFromCapabilities(method as string, subCmd, capabilities);
    nsCmd.addCommand(subCmd);
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
