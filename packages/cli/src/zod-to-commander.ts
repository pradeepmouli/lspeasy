import { Command } from 'commander';
import { z } from 'zod';
import { pathToFileURL } from 'node:url';

import { parseLineCol, toLspPosition, resolvePathArg } from './io.js';
import type { GlobalFlags } from './io.js';
import type { RefactorSession } from './session.js';

export type ArgPattern = 'file-position-newname' | 'file-position' | 'file-range' | 'file' | 'raw';

function isZodObjectLike(schema: z.ZodType<unknown>): schema is z.ZodObject<z.ZodRawShape> {
  return (
    schema != null &&
    typeof schema === 'object' &&
    'shape' in schema &&
    schema.shape != null &&
    typeof schema.shape === 'object'
  );
}

export function detectArgPattern(schema: z.ZodType<unknown>): ArgPattern {
  if (!isZodObjectLike(schema)) return 'raw';
  const shape = schema.shape as Record<string, z.ZodType<unknown>>;
  if ('textDocument' in shape && 'position' in shape && 'newName' in shape)
    return 'file-position-newname';
  if ('textDocument' in shape && 'position' in shape) return 'file-position';
  if ('textDocument' in shape && 'range' in shape) return 'file-range';
  if ('textDocument' in shape) return 'file';
  return 'raw';
}

export function marshalParams(
  pattern: ArgPattern,
  positional: string[],
  opts: Record<string, unknown>,
  flags: GlobalFlags
): unknown {
  if (typeof opts['params'] === 'string') return JSON.parse(opts['params']);

  switch (pattern) {
    case 'file-position-newname': {
      const file = resolvePathArg(positional[0]!, flags);
      const pos = parseLineCol(positional[1]!);
      return {
        textDocument: { uri: pathToFileURL(file).href },
        position: toLspPosition(pos),
        newName: positional[2]
      };
    }
    case 'file-position': {
      const file = resolvePathArg(positional[0]!, flags);
      const pos = parseLineCol(positional[1]!);
      return {
        textDocument: { uri: pathToFileURL(file).href },
        position: toLspPosition(pos)
      };
    }
    case 'file-range': {
      const file = resolvePathArg(positional[0]!, flags);
      const [startStr, endStr] = (positional[1] ?? '').split('-');
      const start = parseLineCol(startStr ?? '1:1');
      const end = parseLineCol(endStr ?? startStr ?? '1:1');
      return {
        textDocument: { uri: pathToFileURL(file).href },
        range: { start: toLspPosition(start), end: toLspPosition(end) }
      };
    }
    case 'file': {
      const file = resolvePathArg(positional[0]!, flags);
      return { textDocument: { uri: pathToFileURL(file).href } };
    }
    case 'raw':
      throw new Error('This method requires --params <json>');
  }
}

function injectRequiredDefaults(method: string, params: unknown): unknown {
  if (typeof params !== 'object' || params === null) return params;
  const p = params as Record<string, unknown>;
  if (method === 'textDocument/references' && !('context' in p)) {
    return { ...p, context: { includeDeclaration: true } };
  }
  if (method === 'textDocument/codeAction' && !('context' in p)) {
    return { ...p, context: { diagnostics: [] } };
  }
  if (
    (method === 'textDocument/formatting' || method === 'textDocument/rangeFormatting') &&
    !('options' in p)
  ) {
    return { ...p, options: { tabSize: 2, insertSpaces: true } };
  }
  return params;
}

export function zodToCommander(
  method: string,
  schema: z.ZodType<unknown>,
  session: RefactorSession,
  flags: GlobalFlags
): Command {
  const subcommand = method.split('/')[1] ?? method;
  const cmd = new Command(subcommand);
  const pattern = detectArgPattern(schema);

  switch (pattern) {
    case 'file-position-newname':
      cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<line:col>', '1-based position, e.g. 12:7');
      cmd.argument('<newName>', 'new symbol name');
      break;
    case 'file-position':
      cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<line:col>', '1-based position, e.g. 12:7');
      break;
    case 'file-range':
      cmd.argument('<file>', 'file path (relative to --root)');
      cmd.argument('<range>', 'range as startLine:col-endLine:col, e.g. 2:1-4:5');
      break;
    case 'file':
      cmd.argument('<file>', 'file path (relative to --root)');
      break;
    case 'raw':
      break;
  }

  cmd.option('--params <json>', 'raw LSP params as JSON, overrides positional args');

  cmd.action(async (...cmdArgs) => {
    const cmdOpts = cmdArgs.at(-1) as Record<string, unknown>;
    const positional = cmdArgs.slice(0, -1).map(String);

    try {
      const rawParams = marshalParams(pattern, positional, cmdOpts, flags);
      const params = injectRequiredDefaults(method, rawParams);
      const result = await (
        session.lsp.sendRequest as (method: string, params: unknown) => Promise<unknown>
      )(method, params);
      if (flags.json) {
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

  return cmd;
}
