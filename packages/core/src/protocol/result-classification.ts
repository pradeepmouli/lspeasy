import { z } from 'zod';

import { TextEditSchema, WorkspaceEditSchema } from './schemas.js';

/**
 * Schemas for classifying what a language server actually returned.
 *
 * These are compositions over the generated protocol schemas rather than
 * protocol types in their own right, so they live here instead of in
 * `schemas.ts` — that file is regenerated from metaModel.json and anything
 * added to it by hand is lost on the next `pnpm run generate:protocol`.
 */

/** `z.array(TextEditSchema)` — used to recognise a `TextEdit[]` result. */
export const TextEditArraySchema = z.array(TextEditSchema);

/**
 * WorkspaceEdit has all-optional fields, so a bare `safeParse` succeeds on any
 * plain object. Require at least one edit-bearing key so hover and completion
 * results are not misclassified as empty workspace edits.
 */
export const NonEmptyWorkspaceEditSchema = WorkspaceEditSchema.refine(
  (e) =>
    (e.changes != null && Object.keys(e.changes).length > 0) ||
    (e.documentChanges != null && e.documentChanges.length > 0),
  'not a workspace edit'
);
