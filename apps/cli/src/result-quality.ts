/**
 * Post-hoc quality check for read-only LSP results.
 *
 * Some servers return a *non-null but incomplete* result when their workspace
 * project is not fully loaded — most notably `textDocument/references` on
 * tsserver, which yields only the declaration's own range (or nothing) before
 * the configured project's program is built. Because the result is a non-null
 * array, the request reports success and the partial answer is accepted as
 * authoritative — a silent false-empty that can green-light an unsafe deletion
 * or a move that misses importers. This module turns that into an explicit
 * caveat callers can surface.
 */

interface Position {
  line: number;
  character: number;
}

interface Range {
  start: Position;
  end: Position;
}

interface Location {
  uri: string;
  range: Range;
}

export interface ResultQuality {
  /** True when the result looks suspiciously incomplete for the method. */
  partial: boolean;
  /** Human-facing caveat to surface (stderr in text mode, `warning` in JSON). */
  warning?: string;
}

const OK: ResultQuality = { partial: false };

function isLocation(value: unknown): value is Location {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v['uri'] === 'string' && typeof v['range'] === 'object' && v['range'] !== null;
}

function getRequestUri(params: unknown): string | undefined {
  if (typeof params !== 'object' || params === null) return undefined;
  const td = (params as Record<string, unknown>)['textDocument'];
  if (typeof td !== 'object' || td === null) return undefined;
  const uri = (td as Record<string, unknown>)['uri'];
  return typeof uri === 'string' ? uri : undefined;
}

function getRequestPosition(params: unknown): Position | undefined {
  if (typeof params !== 'object' || params === null) return undefined;
  const pos = (params as Record<string, unknown>)['position'];
  if (typeof pos !== 'object' || pos === null) return undefined;
  const { line, character } = pos as Record<string, unknown>;
  if (typeof line !== 'number' || typeof character !== 'number') return undefined;
  return { line, character };
}

/** True when `pos` falls within `range` (inclusive). */
function rangeContains(range: Range, pos: Position): boolean {
  const afterStart =
    pos.line > range.start.line ||
    (pos.line === range.start.line && pos.character >= range.start.character);
  const beforeEnd =
    pos.line < range.end.line ||
    (pos.line === range.end.line && pos.character <= range.end.character);
  return afterStart && beforeEnd;
}

const NOT_INDEXED =
  'the language server may not have the full workspace project loaded — do not treat this as authoritative for deletions or moves; verify with a build/type-check';

function assessReferences(params: unknown, result: unknown): ResultQuality {
  // null or empty: the symbol's own declaration should have come back (the
  // caller asked at a real symbol position), so nothing-at-all is suspect.
  if (result === null || result === undefined) {
    return { partial: true, warning: `no references returned — ${NOT_INDEXED}` };
  }
  if (!Array.isArray(result)) return OK;
  if (result.length === 0) {
    return { partial: true, warning: `no references returned — ${NOT_INDEXED}` };
  }
  if (result.length === 1 && isLocation(result[0])) {
    const only = result[0];
    const uri = getRequestUri(params);
    const pos = getRequestPosition(params);
    // A single hit in the queried file that covers the queried position is the
    // declaration itself — i.e. no cross-file callers were found.
    if (
      uri !== undefined &&
      pos !== undefined &&
      only.uri === uri &&
      rangeContains(only.range, pos)
    ) {
      return {
        partial: true,
        warning: `references returned only the declaration's own range (no cross-file results) — ${NOT_INDEXED}`
      };
    }
  }
  return OK;
}

/**
 * Assess whether a read-only LSP result looks suspiciously incomplete. Returns
 * `{ partial: false }` for everything it has no opinion on.
 *
 * @never NEVER treat a non-null `textDocument/references` result as authoritative
 * for destructive operations (file move, dead-code deletion) without checking
 * {@link assessResultQuality}: tsserver returns only the declaration's own range
 * (or an empty array) when its workspace project is not fully loaded, so a
 * false-empty result reads as "zero callers" and can green-light an unsafe edit.
 */
export function assessResultQuality(
  method: string,
  params: unknown,
  result: unknown
): ResultQuality {
  if (method === 'textDocument/references') return assessReferences(params, result);
  return OK;
}
