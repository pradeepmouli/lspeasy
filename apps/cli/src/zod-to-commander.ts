import { Command, Option } from 'commander';
import { z } from 'zod';
import { pathToFileURL } from 'node:url';

import { parseLineCol, toLspPosition, resolvePathArg } from './io.js';
import type { GlobalFlags } from './io.js';
import type { RefactorSession } from './session.js';
import {
  WorkspaceEditSchema,
  TextEditSchema,
  CodeActionSchema,
  unwrapZodType
} from '@lspeasy/core';
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

function isZodObjectLike(schema: z.ZodType): schema is z.ZodObject<z.ZodRawShape> {
  return schema instanceof z.ZodObject;
}

// Delegate to the shared core helper — peels Optional/Nullable/Default wrappers recursively.
function unwrapOptional(schema: z.ZodType): z.ZodType {
  return unwrapZodType(schema);
}

/**
 * Return true when a ZodType represents a single-value or open-ended scalar,
 * i.e. ZodString / ZodNumber / ZodBoolean / ZodLiteral / ZodEnum.
 * Used to decide whether a union member is "scalar enough" to surface as a flag.
 */
function isScalarMember(schema: z.ZodType): boolean {
  return (
    schema instanceof z.ZodString ||
    schema instanceof z.ZodNumber ||
    schema instanceof z.ZodBoolean ||
    schema instanceof z.ZodLiteral ||
    schema instanceof z.ZodEnum
  );
}

/**
 * Return Commander choices (as strings) when the schema is an enum, a literal,
 * or a union whose members are ALL literals (i.e. every value is known).
 * Mixed unions that include open-ended scalars (ZodString etc.) return null —
 * the open-ended member means any string is valid, so we can't enumerate choices.
 */
function getChoices(schema: z.ZodType): string[] | null {
  if (schema instanceof z.ZodEnum) {
    // ZodEnum.options is Array<T[keyof T]> — always strings for string enums.
    return (schema.options as unknown[]).map(String);
  }
  if (schema instanceof z.ZodLiteral) {
    // ZodLiteral.values is Set<T> in Zod 4 (replaces legacy .value).
    return [...schema.values].map(String);
  }
  if (schema instanceof z.ZodUnion) {
    const opts = schema.options as z.ZodType[];
    // Only attach Commander choices when ALL members are literals — if the union
    // also includes an open-ended type (e.g. z.string()) any string is valid,
    // so we can't enumerate a finite choices list.
    if (opts.every((o) => o instanceof z.ZodLiteral)) {
      return opts.flatMap((o) =>
        [...(o as z.ZodLiteral<string | number | boolean>).values].map(String)
      );
    }
  }
  return null;
}

/**
 * If the schema is a ZodArray whose element type is a scalar / enum / scalar-union,
 * return the (unwrapped) element schema.  Returns null for arrays of objects or
 * unions that contain non-scalar members (objects, nested arrays, etc.).
 *
 * Note: CodeActionKindSchema is z.union([z.literal('quickfix'), ..., z.string()])
 * — the open-ended z.string() tail is still scalar, so we accept mixed
 * literal+string unions here; Commander choices for the description are derived
 * separately via getChoices() which only enumerates pure-literal unions.
 */
function getScalarArrayElement(schema: z.ZodType): z.ZodType | null {
  if (!(schema instanceof z.ZodArray)) return null;
  const elem = schema.element as z.ZodType;
  const inner = unwrapOptional(elem);
  if (isScalarMember(inner)) return inner;
  if (inner instanceof z.ZodUnion) {
    const opts = inner.options as z.ZodType[];
    // Accept any union whose members are all scalars (literals, strings, numbers, booleans).
    if (opts.every(isScalarMember)) return inner;
  }
  return null;
}

function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
}

// Suffixes stripped when deriving the CLI prefix for an object-typed field.
// e.g. "formatting" + "options" → "formatting-options" → strip "-options" → "formatting"
// so sub-fields become --formatting-tab-size, --formatting-insert-spaces.
const STRIP_SUFFIXES = ['-options', '-context', '-params', '-config', '-settings'];

/**
 * Derive the CLI key prefix for an object-typed schema field.
 * Concatenates the command name and field name (both kebab-cased), then strips
 * any known generic suffix so users see --formatting-tab-size rather than
 * --formatting-options-tab-size or a bare --tab-size.
 * For non-object (primitive) fields the field name is used directly.
 */
function fieldCliKey(subcommand: string, fieldName: string, isObject: boolean): string {
  if (!isObject) return toKebabCase(fieldName);
  const combined = `${toKebabCase(subcommand)}-${toKebabCase(fieldName)}`;
  for (const suffix of STRIP_SUFFIXES) {
    if (combined.endsWith(suffix)) return combined.slice(0, -suffix.length);
  }
  return combined;
}

/**
 * Register Commander options for a schema field not covered by the positional
 * pattern. `cliKey` is the pre-computed kebab-case prefix (see `fieldCliKey`).
 * Object-typed fields are expanded one level deep: sub-fields become
 * `--<cliKey>-<sub-field>`. Leaf fields are emitted as:
 *   - ZodEnum / union-of-literals → `--<key> <value>` with `.choices([...])`
 *   - ZodArray of scalars/enums  → `--<key> <items>` (comma-separated, in description)
 *   - Other scalars              → `--<key> <value>`
 * Arrays of objects, non-literal unions, and nested objects beyond depth 1 are
 * silently skipped — users must supply them via `--params`.
 */
function addFieldOptions(cmd: Command, cliKey: string, schema: z.ZodType, depth = 0): void {
  const inner = unwrapOptional(schema);
  if (depth < 1 && isZodObjectLike(inner)) {
    for (const [sub, subSchema] of Object.entries(inner.shape as Record<string, z.ZodType>)) {
      addFieldOptions(cmd, `${cliKey}-${toKebabCase(sub)}`, subSchema as z.ZodType, depth + 1);
    }
    return;
  }

  // Arrays of objects or unions with non-scalar members → leave to --params fallback.
  if (inner instanceof z.ZodObject) return;
  if (inner instanceof z.ZodArray && getScalarArrayElement(inner) === null) return;
  if (inner instanceof z.ZodUnion) {
    const opts = inner.options as z.ZodType[];
    if (!opts.every(isScalarMember)) return;
  }

  const scalarElem = getScalarArrayElement(inner);
  if (scalarElem !== null) {
    // Scalar / enum array → expose as comma-separated string; list valid values in description.
    const elemChoices = getChoices(scalarElem);
    const desc = elemChoices
      ? `${cliKey} — comma-separated (${elemChoices.join('|')})`
      : `${cliKey} (comma-separated)`;
    cmd.addOption(new Option(`--${cliKey} <items>`, desc));
    return;
  }

  const choices = getChoices(inner);
  if (choices !== null) {
    cmd.addOption(new Option(`--${cliKey} <value>`, cliKey).choices(choices));
    return;
  }

  cmd.option(`--${cliKey} <value>`, cliKey);
}

/**
 * Read back all field options registered by `addFieldOptions` and reconstruct
 * the original nested value. Returns `undefined` when none of the sub-options
 * were provided.
 * Scalar arrays are stored as comma-separated strings and split here.
 */
export function extractFieldValue(
  opts: Record<string, unknown>,
  cliKey: string,
  schema: z.ZodType,
  depth = 0
): unknown {
  const inner = unwrapOptional(schema);
  if (depth < 1 && isZodObjectLike(inner)) {
    const result: Record<string, unknown> = {};
    let hasAny = false;
    for (const [sub, subSchema] of Object.entries(inner.shape as Record<string, z.ZodType>)) {
      const val = extractFieldValue(
        opts,
        `${cliKey}-${toKebabCase(sub)}`,
        subSchema as z.ZodType,
        depth + 1
      );
      if (val !== undefined) {
        result[sub] = val;
        hasAny = true;
      }
    }
    return hasAny ? result : undefined;
  }
  const raw = opts[toCamelCase(cliKey)];
  if (raw === undefined) return undefined;
  // Scalar array: comma-separated → split and parse each item.
  const scalarElem = getScalarArrayElement(inner);
  if (scalarElem !== null && typeof raw === 'string') {
    return raw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((item) => {
        try {
          return JSON.parse(item);
        } catch {
          return item;
        }
      });
  }
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}

export function detectArgPattern(schema: z.ZodType): ArgPattern {
  if (!isZodObjectLike(schema)) return 'raw';
  const shape = schema.shape as Record<string, z.ZodType>;
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

// WorkspaceEdit has all optional fields, so safeParse succeeds on any plain
// object. Require at least one edit-bearing key so hover/completion results
// don't get misclassified as empty workspace edits.
const NonEmptyWorkspaceEditSchema = WorkspaceEditSchema.refine(
  (e) =>
    (e.changes != null && Object.keys(e.changes).length > 0) ||
    (e.documentChanges != null && e.documentChanges.length > 0),
  'not a workspace edit'
);

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
  schema: z.ZodType,
  session: RefactorSession,
  flags: GlobalFlags
): Command {
  const subcommand = method.split('/').slice(1).join('-') || method;
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
  // Object-typed fields are expanded one level deep via hyphenation.
  if (pattern !== 'raw' && isZodObjectLike(schema)) {
    const covered = PATTERN_FIELDS[pattern];
    for (const [field, fieldSchema] of Object.entries(schema.shape as Record<string, z.ZodType>)) {
      if (!covered.has(field)) {
        const inner = unwrapOptional(fieldSchema);
        const cliKey = fieldCliKey(subcommand, field, isZodObjectLike(inner));
        addFieldOptions(cmd, cliKey, fieldSchema);
      }
    }
  }

  cmd.action(async (...cmdArgs) => {
    // Commander passes (...declaredArgs, options, command): the Command instance
    // is LAST and the parsed options object is second-to-last. This previously
    // read `at(-1)` as the options — but that's the Command, so `--params` (and
    // every other option) never reached marshalParams. For raw-pattern methods
    // (e.g. workspace/willRenameFiles) that made `--params` look absent and threw
    // "requires --params". Read options off the Command via `.opts()`.
    const command = cmdArgs.at(-1) as { opts(): Record<string, unknown> };
    const cmdOpts = command.opts();
    const positional = cmdArgs.slice(0, -2).map(String);

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
          schema.shape as Record<string, z.ZodType>
        )) {
          if (covered.has(field)) continue;
          const inner = unwrapOptional(fieldSchema);
          const cliKey = fieldCliKey(subcommand, field, isZodObjectLike(inner));
          const val = extractFieldValue(cmdOpts, cliKey, fieldSchema);
          if (val !== undefined) (rawParams as Record<string, unknown>)[field] = val;
        }
      }

      const params = injectRequiredDefaults(method, rawParams);
      const result = await session.requestWithRetry(() =>
        (session.lsp.sendRequest as (method: string, params: unknown) => Promise<unknown>)(
          method,
          params
        )
      );

      // Collect workspace edits from up to four sources:
      // 1. Direct WorkspaceEdit result (e.g. textDocument/rename)
      // 2. TextEdit[] result (e.g. textDocument/formatting) — wrapped using the
      //    textDocument.uri already in rawParams
      // 3. CodeAction[].edit — inline edits embedded in code action results
      // 4. Server-pushed edits via workspace/applyEdit (e.g. workspace/executeCommand)
      const capturedEdits = session.takeCapturedEdits();
      const weResult = NonEmptyWorkspaceEditSchema.safeParse(result);
      const teResult = TextEditArraySchema.safeParse(result);
      // LSP allows codeAction results to be (Command | CodeAction)[]. Parse each
      // item individually so Command entries don't cause the whole parse to fail.
      const codeActionItems = Array.isArray(result)
        ? result.flatMap((item) => {
            const parsed = CodeActionSchema.safeParse(item);
            return parsed.success ? [parsed.data] : [];
          })
        : [];
      // Only auto-apply when exactly one code action carries an edit; if multiple
      // edit-bearing actions are returned, fall through to JSON printing so the
      // caller can choose rather than silently applying the wrong quick-fix.
      const inlineCodeActionEdits = codeActionItems
        .map((a) => a.edit)
        .filter((e) => e != null && NonEmptyWorkspaceEditSchema.safeParse(e).success);
      const inlineCodeActionEdit: WorkspaceEdit | null =
        inlineCodeActionEdits.length === 1
          ? (inlineCodeActionEdits[0] as unknown as WorkspaceEdit)
          : null;
      const directEdit: WorkspaceEdit | null = weResult.success
        ? (weResult.data as unknown as WorkspaceEdit)
        : teResult.success && teResult.data.length > 0
          ? textEditsToWorkspaceEdit(teResult.data, rawParams)
          : inlineCodeActionEdit;

      // For methods that produce edits (rename, formatting, codeAction), a null
      // result means the server could not fulfil the request — treat as an error.
      const isEditMethod =
        method === 'textDocument/rename' ||
        method === 'textDocument/formatting' ||
        method === 'textDocument/rangeFormatting' ||
        method === 'textDocument/codeAction';
      if (isEditMethod && result === null && capturedEdits.length === 0) {
        throw new Error(`${method} returned null — server could not fulfil the request`);
      }

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
