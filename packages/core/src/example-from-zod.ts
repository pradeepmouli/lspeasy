import { z } from 'zod';

const MAX_DEPTH = 6;

/**
 * Build an illustrative, required-only example value from a Zod schema.
 * Strings → "example", numbers → 1, booleans → false, enum/literal → first value,
 * objects → required props (optionals omitted), arrays → one sample element.
 * Optionals/nullables are omitted; recursion is capped at MAX_DEPTH (returns null).
 * The lsproxy CLI uses this to show example request/response payloads.
 *
 * @remarks
 * Targets Zod 4: uses `_def.type` as the discriminator (Zod 4 removed `_def.typeName`).
 * Each branch narrows `_def` to only the properties it actually reads — no `any`.
 */
export function exampleFromZod(schema: z.ZodType, depth = 0): unknown {
  if (depth > MAX_DEPTH) return null;

  // Zod 4 uses _def.type as the string discriminator (not _def.typeName as in Zod 3).
  const def = schema._def as { type?: string };
  const t = def.type;

  // Unwrap optional/nullable/default — object branch handles omission for these wrappers.
  if (t === 'optional' || t === 'nullable' || t === 'default') {
    const inner = (def as { innerType?: z.ZodType }).innerType;
    return inner ? exampleFromZod(inner, depth) : null;
  }

  if (t === 'lazy') {
    const getter = (def as { getter?: () => z.ZodType }).getter;
    const inner = getter?.();
    return inner ? exampleFromZod(inner, depth + 1) : null;
  }

  if (t === 'string') return 'example';
  if (t === 'number') return 1;
  if (t === 'boolean') return false;

  if (t === 'literal') {
    // Zod 4 stores literal values as an array (_def.values), not a scalar _def.value.
    const vals = (def as { values?: unknown[] }).values;
    return Array.isArray(vals) && vals.length > 0 ? vals[0] : null;
  }

  if (t === 'enum') {
    // Zod 4 stores enum members as _def.entries: Record<string, string>.
    const entries = (def as { entries?: Record<string, unknown> }).entries;
    if (entries) {
      const first = Object.values(entries)[0];
      return first !== undefined ? first : null;
    }
    return null;
  }

  if (t === 'array') {
    // Zod 4 array inner schema is _def.element.
    const element = (def as { element?: z.ZodType }).element;
    return element ? [exampleFromZod(element, depth + 1)] : [];
  }

  if (t === 'union') {
    const options = (def as { options?: z.ZodType[] }).options ?? [];
    const first = options[0];
    return first !== undefined ? exampleFromZod(first, depth + 1) : null;
  }

  if (t === 'object') {
    const shape = (def as { shape?: Record<string, z.ZodType> }).shape ?? {};
    const out: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(shape)) {
      const fieldType = (field._def as { type?: string }).type;
      // Omit optional/default fields from the required-only example.
      if (fieldType === 'optional' || fieldType === 'default') continue;
      out[key] = exampleFromZod(field, depth + 1);
    }
    return out;
  }

  return null;
}
