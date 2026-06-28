import { z } from 'zod';

const MAX_DEPTH = 6;

/**
 * Build an illustrative, required-only example value from a Zod schema.
 * Strings → "example", numbers → 1, booleans → false, enum/literal → first value,
 * objects → required props (optionals/nullables/defaults omitted), arrays → one sample element.
 * Recursion is capped at MAX_DEPTH (returns null).
 * The lsproxy CLI uses this to show example request/response payloads.
 *
 * @remarks
 * Uses Zod 4 public `instanceof` checks and typed accessors — no internal `_def` reads.
 */
export function exampleFromZod(schema: z.ZodType, depth = 0): unknown {
  if (depth > MAX_DEPTH) return null;

  // Unwrap wrapper types at the same depth (unwrapping doesn't add nesting).
  // Cast to z.ZodType: .unwrap() is typed as returning core.$ZodType (the internal base),
  // but at runtime the value is always a classic ZodType instance.
  if (schema instanceof z.ZodOptional) return exampleFromZod(schema.unwrap() as z.ZodType, depth);
  if (schema instanceof z.ZodNullable) return exampleFromZod(schema.unwrap() as z.ZodType, depth);
  if (schema instanceof z.ZodDefault) return exampleFromZod(schema.unwrap() as z.ZodType, depth);

  // ZodLazy: .unwrap() calls the getter and returns the resolved inner schema.
  if (schema instanceof z.ZodLazy) return exampleFromZod(schema.unwrap() as z.ZodType, depth + 1);

  if (schema instanceof z.ZodString) return 'example';
  if (schema instanceof z.ZodNumber) return 1;
  if (schema instanceof z.ZodBoolean) return false;

  if (schema instanceof z.ZodLiteral) {
    // .values is the Zod 4 public Set-based accessor (replaces legacy .value).
    const first = [...schema.values][0];
    return first !== undefined ? first : null;
  }

  if (schema instanceof z.ZodEnum) {
    const first = schema.options[0];
    return first !== undefined ? first : null;
  }

  if (schema instanceof z.ZodArray) {
    // schema.element is typed as core.$ZodType; cast to z.ZodType (safe at runtime).
    return [exampleFromZod(schema.element as z.ZodType, depth + 1)];
  }

  if (schema instanceof z.ZodUnion) {
    const first = schema.options[0];
    return first !== undefined ? exampleFromZod(first as z.ZodType, depth + 1) : null;
  }

  if (schema instanceof z.ZodObject) {
    const out: Record<string, unknown> = {};
    for (const [key, field] of Object.entries(schema.shape) as [string, z.ZodType][]) {
      // Omit optional, nullable, and default fields from the required-only example.
      if (
        field instanceof z.ZodOptional ||
        field instanceof z.ZodNullable ||
        field instanceof z.ZodDefault
      )
        continue;
      out[key] = exampleFromZod(field, depth + 1);
    }
    return out;
  }

  return null;
}
