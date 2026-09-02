#!/usr/bin/env tsx
/**
 * Precompute, at build time, the schema introspection `apps/cli/src/zod-to-commander.ts`
 * performs at startup. The walking logic below is a deliberate VERBATIM port of that
 * module — `isScalarMember`, `getChoices`, `getScalarArrayElement`, `toKebabCase`,
 * `fieldCliKey`, `STRIP_SUFFIXES`, `detectArgPattern`, `PATTERN_FIELDS` and the
 * `addFieldOptions` depth-1 recursion. Do not "improve" any of it: the runtime walker
 * is only deleted once the generated descriptors are proven equivalent to it, and any
 * cleverness here surfaces as a behavioural diff in that gate.
 *
 * See docs/superpowers/specs/2026-09-02-zod-off-the-runtime-path-design.md.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LSPSchemas, getSchemaForMethod, unwrapZodType } from '@lspeasy/core/schemas';
import { z } from 'zod';

export type ArgPattern =
  | 'file-position-newname'
  | 'file-position'
  | 'file-range'
  | 'file'
  | 'query'
  | 'raw';

export interface FieldDescriptor {
  readonly cliKey: string;
  readonly paramsPath: string;
  readonly kind: 'string' | 'number' | 'boolean' | 'enum';
  /**
   * True when the field sits behind an Optional/Nullable/Default wrapper. This is a
   * superset of "optional" in the strict `.optional()` sense — `unwrapZodType` peels
   * all three — which matches how the runtime walker treats them interchangeably.
   */
  readonly optional: boolean;
  readonly isArray: boolean;
  readonly choices?: readonly string[];
}

export interface MethodDescriptor {
  readonly method: string;
  readonly pattern: ArgPattern;
  readonly fields: readonly FieldDescriptor[];
  readonly residual: boolean;
}

const PATTERN_FIELDS: Readonly<Record<ArgPattern, ReadonlySet<string>>> = {
  'file-position-newname': new Set(['textDocument', 'position', 'newName']),
  'file-position': new Set(['textDocument', 'position']),
  'file-range': new Set(['textDocument', 'range']),
  file: new Set(['textDocument']),
  query: new Set(['query']),
  raw: new Set()
};

const STRIP_SUFFIXES = ['-options', '-context', '-params', '-config', '-settings'];

function isZodObjectLike(schema: z.ZodType): schema is z.ZodObject<z.ZodRawShape> {
  return schema instanceof z.ZodObject;
}

function unwrapOptional(schema: z.ZodType): z.ZodType {
  return unwrapZodType(schema);
}

function isScalarMember(schema: z.ZodType): boolean {
  return (
    schema instanceof z.ZodString ||
    schema instanceof z.ZodNumber ||
    schema instanceof z.ZodBoolean ||
    schema instanceof z.ZodLiteral ||
    schema instanceof z.ZodEnum
  );
}

function getChoices(schema: z.ZodType): string[] | null {
  if (schema instanceof z.ZodEnum) return (schema.options as unknown[]).map(String);
  if (schema instanceof z.ZodLiteral) return [...schema.values].map(String);
  if (schema instanceof z.ZodUnion) {
    const opts = schema.options as z.ZodType[];
    // Only enumerate choices when EVERY member is a literal — an open-ended arm
    // (e.g. CodeActionKind's z.string() tail) means any string is valid.
    if (opts.every((o) => o instanceof z.ZodLiteral)) {
      return opts.flatMap((o) =>
        [...(o as z.ZodLiteral<string | number | boolean>).values].map(String)
      );
    }
  }
  return null;
}

function getScalarArrayElement(schema: z.ZodType): z.ZodType | null {
  if (!(schema instanceof z.ZodArray)) return null;
  const inner = unwrapOptional(schema.element as z.ZodType);
  if (isScalarMember(inner)) return inner;
  if (inner instanceof z.ZodUnion) {
    const opts = inner.options as z.ZodType[];
    if (opts.every(isScalarMember)) return inner;
  }
  return null;
}

function toKebabCase(str: string): string {
  return str.replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`);
}

function fieldCliKey(subcommand: string, fieldName: string, isObject: boolean): string {
  if (!isObject) return toKebabCase(fieldName);
  const combined = `${toKebabCase(subcommand)}-${toKebabCase(fieldName)}`;
  for (const suffix of STRIP_SUFFIXES) {
    if (combined.endsWith(suffix)) return combined.slice(0, -suffix.length);
  }
  return combined;
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

function kindOf(schema: z.ZodType): FieldDescriptor['kind'] {
  if (schema instanceof z.ZodNumber) return 'number';
  if (schema instanceof z.ZodBoolean) return 'boolean';
  if (schema instanceof z.ZodEnum || schema instanceof z.ZodLiteral) return 'enum';
  return 'string';
}

/** Mirrors `addFieldOptions`' recursion, emitting descriptors instead of Commander Options. */
function collectFields(
  cliKey: string,
  paramsPath: string,
  schema: z.ZodType,
  out: FieldDescriptor[],
  depth = 0
): void {
  const inner = unwrapOptional(schema);
  const optional = inner !== schema;

  if (depth < 1 && isZodObjectLike(inner)) {
    for (const [sub, subSchema] of Object.entries(inner.shape as Record<string, z.ZodType>)) {
      collectFields(
        `${cliKey}-${toKebabCase(sub)}`,
        `${paramsPath}.${sub}`,
        subSchema as z.ZodType,
        out,
        depth + 1
      );
    }
    return;
  }

  // Arrays of objects, non-scalar unions and nested objects beyond depth 1 are
  // silently skipped — those go through `--params`.
  if (inner instanceof z.ZodObject) return;
  if (inner instanceof z.ZodArray && getScalarArrayElement(inner) === null) return;
  if (inner instanceof z.ZodUnion) {
    const opts = inner.options as z.ZodType[];
    if (!opts.every(isScalarMember)) return;
  }

  const scalarElem = getScalarArrayElement(inner);
  if (scalarElem !== null) {
    const choices = getChoices(scalarElem);
    out.push({
      cliKey,
      paramsPath,
      kind: kindOf(scalarElem),
      optional,
      isArray: true,
      ...(choices !== null && { choices })
    });
    return;
  }

  const choices = getChoices(inner);
  out.push({
    cliKey,
    paramsPath,
    kind: kindOf(inner),
    optional,
    isArray: false,
    ...(choices !== null && { choices })
  });
}

export function buildDescriptor(method: string, schema: z.ZodType): MethodDescriptor {
  const subcommand = method.split('/').slice(1).join('-') || method;
  const pattern = detectArgPattern(schema);
  const fields: FieldDescriptor[] = [];

  if (pattern !== 'raw' && isZodObjectLike(schema)) {
    const covered = PATTERN_FIELDS[pattern];
    for (const [field, fieldSchema] of Object.entries(schema.shape as Record<string, z.ZodType>)) {
      if (covered.has(field)) continue;
      const inner = unwrapOptional(fieldSchema);
      const cliKey = fieldCliKey(subcommand, field, isZodObjectLike(inner));
      collectFields(cliKey, field, fieldSchema, fields);
    }
  }

  return { method, pattern, fields, residual: pattern === 'raw' };
}

export function buildAll(): Record<string, MethodDescriptor> {
  const out: Record<string, MethodDescriptor> = {};
  for (const method of Object.keys(LSPSchemas)) {
    const schema = getSchemaForMethod(method);
    if (schema) out[method] = buildDescriptor(method, schema);
  }
  return out;
}

export function emit(outPath: string): void {
  const all = buildAll();
  const body = `// GENERATED by scripts/generate-cli-descriptors.ts — do not edit.
// Re-run: pnpm run generate:protocol

export type ArgPattern =
  | 'file-position-newname'
  | 'file-position'
  | 'file-range'
  | 'file'
  | 'query'
  | 'raw';

export interface FieldDescriptor {
  readonly cliKey: string;
  readonly paramsPath: string;
  readonly kind: 'string' | 'number' | 'boolean' | 'enum';
  readonly optional: boolean;
  readonly isArray: boolean;
  readonly choices?: readonly string[];
}

export interface MethodDescriptor {
  readonly method: string;
  readonly pattern: ArgPattern;
  readonly fields: readonly FieldDescriptor[];
  readonly residual: boolean;
}

export const COMMAND_DESCRIPTORS: Readonly<Record<string, MethodDescriptor>> =
${JSON.stringify(all, null, 2)} as const;
`;
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, body, 'utf8');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  emit(resolve(root, 'apps/cli/src/generated/command-descriptors.ts'));
}
