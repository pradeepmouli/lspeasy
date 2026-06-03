import { Command } from 'commander';
import { z } from 'zod';
import { pathToFileURL } from 'node:url';

import { parseLineCol, toLspPosition, resolvePathArg } from './io.js';
import type { GlobalFlags } from './io.js';
import type { RefactorSession } from './session.js';
import { WorkspaceEditSchema, TextEditSchema } from '@lspeasy/core';
import {
  applyWorkspaceEdit,
  planWorkspaceEdit,
  type WorkspaceEdit,
  type AppliedChange,
  type BoundaryGuard
} from './apply.js';

export type ArgPattern =
  | 'file-position-newname'
  | 'file-position'
  | 'file-range'
  | 'file'
  | 'query'
  | 'raw';

const PATTERN_FIELDS: Readonly<Record<ArgPattern, ReadonlySet<string>>> = {
  'file-position-newname': new Set(['textDocument', 'position', 'newName']),
  'file-position': new Set(['textDocument', 'position']),
  'file-range': new Set(['textDocument', 'range']),
  file: new Set(['textDocument']),
  query: new Set(['query']),
  raw: new Set()
};

function isZodObjectLike(schema: z.ZodType<unknown>): schema is z.ZodObject<z.ZodRawShape> {
  return (
    schema != null &&
    typeof schema === 'object' &&
    'shape' in schema &&
    schema.shape != null &&
    typeof schema.shape === 'object'
  );
}

function unwrapOptional(schema: z.ZodType<unknown>): z.ZodType<unknown> {
  const def = (schema as { _def?: { typeName?: string; innerType?: z.ZodType<unknown> } })._def;
  if (def?.typeName === 'ZodOptional' && def.innerType) return unwrapOptional(def.innerType);
  return schema;
}

function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

/**
 * Register Commander options for a schema field not covered by the positional
 * pattern. Object-typed fields are always transparent: their sub-fields are
 * promoted directly to the CLI namespace without a prefix. This is driven
 * entirely by the runtime schema type — no name-based whitelist needed.
 * e.g. `ch` → `--ch <value>`, `options.tabSize` → `--tab-size <value>`,
 * `context.only` → `--only <value>`.
 */
function addFieldOptions(
  cmd: Command,
  fieldName: string,
  schema: z.ZodType<unknown>,
  depth = 0
): void {
  const inner = unwrapOptional(schema);
  if (depth < 1 && isZodObjectLike(inner)) {
    for (const [sub, subSchema] of Object.entries(
      inner.shape as Record<string, z.ZodType<unknown>>
    )) {
      addFieldOptions(cmd, toKebabCase(sub), subSchema, depth + 1);
    }
    return;
  }
  cmd.option(`--${toKebabCase(fieldName)} <value>`, fieldName);
}

/**
 * Read back all field options registered by `addFieldOptions` and reconstruct
 * the original nested value. Returns `undefined` when none of the sub-options
 * were provided.
 */
function extractFieldValue(
  opts: Record<string, unknown>,
  fieldName: string,
  schema: z.ZodType<unknown>,
  depth = 0
): unknown {
  const inner = unwrapOptional(schema);
  if (depth < 1 && isZodObjectLike(inner)) {
    const result: Record<string, unknown> = {};
    let hasAny = false;
    for (const [sub, subSchema] of Object.entries(
      inner.shape as Record<string, z.ZodType<unknown>>
    )) {
      const val = extractFieldValue(opts, toKebabCase(sub), subSchema, depth + 1);
      if (val !== undefined) {
        result[sub] = val;
        hasAny = true;
      }
    }
    return hasAny ? result : undefined;
  }
  const raw = opts[toCamelCase(fieldName)];
  if (raw === undefined) return undefined;
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

export function detectArgPattern(schema: z.ZodType<unknown>): ArgPattern {
  if (!isZodObjectLike(schema)) return 'raw';
  const shape = schema.shape as Record<string, z.ZodType<unknown>>;
  if ('textDocument' in shape && 'position' in shape && 'newName' in shape)
    return 'file-position-newname';
  if ('textDocument' in shape && 'position' in shape) return 'file-position';
  if ('textDocument' in shape && 'range' in shape) return 'file-range';
  if ('textDocument' in shape) return 'file';
  if ('query' in shape) return 'query';
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
    case 'query':
      return { query: positional[0] ?? '' };
    case 'raw':
      throw new Error('This method requires --params <json>');
  }
}

const TextEditArraySchema = z.array(TextEditSchema);

/**
 * Wrap a TextEdit[] result as a single-file WorkspaceEdit using the
 * `textDocument.uri` already present in the marshaled params. Returns null
 * when the params don't carry a recognizable URI (raw-pattern calls).
 */
function textEditsToWorkspaceEdit(
  edits: z.infer<typeof TextEditArraySchema>,
  params: unknown
): WorkspaceEdit | null {
  if (typeof params !== 'object' || params === null) return null;
  const td = (params as Record<string, unknown>)['textDocument'];
  const uri = typeof td === 'object' && td !== null ? (td as Record<string, unknown>)['uri'] : null;
  if (typeof uri !== 'string') return null;
  return { changes: { [uri]: edits } };
}

export function printAppliedChanges(
  changes: AppliedChange[],
  method: string,
  dryRun: boolean,
  json: boolean
): void {
  if (json) {
    process.stdout.write(JSON.stringify({ ok: true, method, dryRun, changes }) + '\n');
  } else {
    const label = dryRun ? '[dry-run]' : '[applied]';
    for (const c of changes) {
      const detail =
        c.kind === 'rename'
          ? `${c.path} → ${c.toPath}`
          : c.kind === 'edit'
            ? `${c.path} (${c.editCount} edit${c.editCount !== 1 ? 's' : ''})`
            : c.path;
      process.stdout.write(`${label} ${c.kind} ${detail}\n`);
    }
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
    case 'query':
      cmd.argument('<query>', 'search query string');
      break;
    case 'raw':
      break;
  }

  cmd.option('--params <json>', 'raw LSP params as JSON, overrides positional args');

  // Add Commander options for schema fields not covered by the positional pattern.
  // Object-typed fields are transparent: sub-fields are promoted without prefix.
  if (pattern !== 'raw' && isZodObjectLike(schema)) {
    const covered = PATTERN_FIELDS[pattern];
    for (const [field, fieldSchema] of Object.entries(
      schema.shape as Record<string, z.ZodType<unknown>>
    )) {
      if (!covered.has(field)) addFieldOptions(cmd, field, fieldSchema);
    }
  }

  cmd.action(async (...cmdArgs) => {
    const cmdOpts = cmdArgs.at(-1) as Record<string, unknown>;
    const positional = cmdArgs.slice(0, -1).map(String);

    try {
      const rawParams = marshalParams(pattern, positional, cmdOpts, flags);

      // Overlay extra field options onto the pattern-derived base params.
      if (
        pattern !== 'raw' &&
        isZodObjectLike(schema) &&
        typeof rawParams === 'object' &&
        rawParams !== null
      ) {
        const covered = PATTERN_FIELDS[pattern];
        for (const [field, fieldSchema] of Object.entries(
          schema.shape as Record<string, z.ZodType<unknown>>
        )) {
          if (covered.has(field)) continue;
          const val = extractFieldValue(cmdOpts, field, fieldSchema);
          if (val !== undefined) (rawParams as Record<string, unknown>)[field] = val;
        }
      }

      const params = injectRequiredDefaults(method, rawParams);
      const result = await (
        session.lsp.sendRequest as (method: string, params: unknown) => Promise<unknown>
      )(method, params);

      // Collect workspace edits from up to three sources:
      // 1. Direct WorkspaceEdit result (e.g. textDocument/rename)
      // 2. TextEdit[] result (e.g. textDocument/formatting) — wrapped using the
      //    textDocument.uri already in rawParams
      // 3. Server-pushed edits via workspace/applyEdit (e.g. workspace/executeCommand)
      const capturedEdits = session.takeCapturedEdits();
      const weResult = WorkspaceEditSchema.safeParse(result);
      const teResult = TextEditArraySchema.safeParse(result);
      const directEdit: WorkspaceEdit | null = weResult.success
        ? (weResult.data as unknown as WorkspaceEdit)
        : teResult.success && teResult.data.length > 0
          ? textEditsToWorkspaceEdit(teResult.data, rawParams)
          : null;

      if (directEdit || capturedEdits.length > 0) {
        const guard: BoundaryGuard = {
          root: flags.root,
          allowOutsideRoot: flags.allowOutsideRoot
        };
        const allChanges: AppliedChange[] = [];
        const edits = directEdit ? [directEdit, ...capturedEdits] : capturedEdits;
        for (const edit of edits) {
          const changes = flags.dryRun
            ? planWorkspaceEdit(edit, guard)
            : applyWorkspaceEdit(edit, guard);
          allChanges.push(...changes);
        }
        printAppliedChanges(allChanges, method, flags.dryRun, flags.json);
      } else {
        if (flags.json) {
          process.stdout.write(JSON.stringify({ ok: true, method, result }) + '\n');
        } else {
          process.stdout.write(JSON.stringify(result, null, 2) + '\n');
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

  return cmd;
}
