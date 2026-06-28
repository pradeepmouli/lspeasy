import { z } from 'zod';

/**
 * Peel Zod 4 Optional/Nullable/Default wrappers to the underlying type (recursively).
 *
 * @remarks
 * Uses Zod 4 public `instanceof` checks and `.unwrap()` — no internal `_def` reads.
 * The cast to `z.ZodType` is safe at runtime: `.unwrap()` is typed as returning
 * `core.$ZodType` (the internal base class) but always yields a classic ZodType instance.
 */
export function unwrapZodType(schema: z.ZodType): z.ZodType {
  if (
    schema instanceof z.ZodOptional ||
    schema instanceof z.ZodNullable ||
    schema instanceof z.ZodDefault
  ) {
    return unwrapZodType(schema.unwrap() as z.ZodType);
  }
  return schema;
}
