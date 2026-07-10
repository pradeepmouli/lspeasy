import { Command } from 'commander';
import { LSPSchemas, getSchemaForMethod, getCapabilityForRequestMethod } from '@lspeasy/core';
import type { ServerCapabilities } from '@lspeasy/core';

import { zodToCommander, printAppliedChanges } from './zod-to-commander.js';
import { assessResultQuality } from './result-quality.js';
import { applyWorkspaceEdit, planWorkspaceEdit } from './apply.js';
import type { BoundaryGuard } from './apply.js';
import type { RefactorSession } from './session.js';
import type { GlobalFlags } from './io.js';
import { globalOptionsHelpText } from './global-options.js';

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
 * Resolves the server capability provider for the method, then scans its
 * string and string-array fields — booleans and nested objects are skipped.
 * Works generically for any LSP method; no per-method hardcoding required.
 */
function enrichCommandFromCapabilities(
  method: string,
  cmd: Command,
  capabilities: ServerCapabilities
): void {
  const capPath = getCapabilityForRequestMethod(method as any);
  if (capPath === 'alwaysOn') return;

  const obj = capabilityObject(getNestedValue(capabilities, capPath as string));
  if (!obj) return;

  const lines: string[] = [];
  for (const [key, val] of Object.entries(obj)) {
    const arr = stringArray(val);
    if (arr) {
      lines.push(`${key}: ${arr.map((v) => JSON.stringify(v)).join('  ')}`);
    } else if (typeof val === 'string' && val.length > 0) {
      lines.push(`${key}: ${JSON.stringify(val)}`);
    }
  }
  if (lines.length) cmd.addHelpText('after', `\nCapability options:\n  ${lines.join('\n  ')}`);
}

// Some methods share a top-level capability path with sibling methods, so the
// top-level check alone is insufficient. Map those methods to a more specific
// sub-path that must also be truthy before exposing the command.
// e.g. semanticTokens/full shares 'semanticTokensProvider' with range/delta,
// but requires 'semanticTokensProvider.full' to actually be supported.
const CAPABILITY_REFINEMENTS: Readonly<Partial<Record<string, string>>> = {
  'textDocument/semanticTokens/full': 'semanticTokensProvider.full'
};

// Commander's `addHelpText('after', ...)` only surfaces its text through
// `outputHelp()`'s emitted 'afterHelp' event — never through `helpInformation()`
// called directly (see help.ts's `renderDrillDownText`, this CLI's actual
// leaf-command help renderer, and note the CLI intercepts --help in cli.ts
// before Commander ever parses, so `outputHelp()` itself is unreachable in
// practice). Appending the footer here instead makes it part of the string
// `helpInformation()` returns, so it reaches real users and is testable
// directly without depending on Commander's event system.
function appendHelpFooter(cmd: Command, footer: string): void {
  const base = cmd.helpInformation.bind(cmd);
  cmd.helpInformation = (context) => `${base(context)}\n${footer}`;
}

export function buildCommandTree(
  program: Command,
  capabilities: ServerCapabilities,
  session: RefactorSession,
  flags: GlobalFlags,
  anchorFile?: string
): void {
  for (const method of Object.keys(LSPSchemas) as Array<keyof typeof LSPSchemas>) {
    const schema = getSchemaForMethod(method as string);
    if (!schema) continue;

    const capPath = getCapabilityForRequestMethod(method as any);
    if (capPath === 'alwaysOn') continue;
    if (!getNestedValue(capabilities, capPath as string)) continue;
    const refinedCapPath = CAPABILITY_REFINEMENTS[method as string];
    if (refinedCapPath && !getNestedValue(capabilities, refinedCapPath)) continue;

    const parts = (method as string).split('/');
    if (parts.length < 2) continue;
    const [namespace] = parts as [string, ...string[]];

    let nsCmd = program.commands.find((c) => c.name() === namespace);
    if (!nsCmd) {
      nsCmd = new Command(namespace).description(`${namespace} operations`);
      program.addCommand(nsCmd);
    }

    const subCmd = zodToCommander(method as string, schema, session, flags, anchorFile);
    enrichCommandFromCapabilities(method as string, subCmd, capabilities);
    // executeCommand args are server-defined (opaque LSPAny) and not in the
    // protocol — the reliable way to get a valid {command, arguments} is to
    // replay one from a codeAction/codeLens result.
    if (method === 'workspace/executeCommand') {
      subCmd.addHelpText(
        'after',
        '\nDiscovering commands: server command names (if advertised) appear above as\n' +
          'capability options. Argument shapes are server-specific — obtain a ready-to-run\n' +
          '{command, arguments} from a textDocument/codeAction or textDocument/codeLens result and replay it\n' +
          '(lsproxy auto-runs command-bearing code actions).'
      );
    }
    appendHelpFooter(subCmd, globalOptionsHelpText());
    nsCmd.addCommand(subCmd);
  }

  const callCmd = program
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
        } else {
          const quality = assessResultQuality(method, params, result);
          if (flags.json) {
            process.stdout.write(
              JSON.stringify({
                ok: true,
                method,
                result,
                ...(quality.partial ? { partial: true, warning: quality.warning } : {})
              }) + '\n'
            );
          } else {
            process.stdout.write(JSON.stringify(result, null, 2) + '\n');
          }
          if (quality.partial && quality.warning) {
            process.stderr.write(`warning: ${quality.warning}\n`);
          }
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
  appendHelpFooter(callCmd, globalOptionsHelpText());
}
