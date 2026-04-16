/**
 * Document Change Helper Contracts
 *
 * Type definitions for constructing `DidChangeTextDocumentParams` with
 * automatic version tracking.
 *
 * @package @lspeasy/client/document
 */

export interface Position {
  line: number;
  character: number;
}

export interface Range {
  start: Position;
  end: Position;
}

export interface VersionedTextDocumentIdentifier {
  uri: string;
  version: number;
}

export interface TextDocumentContentChangeEvent {
  range?: Range;
  rangeLength?: number;
  text: string;
}

export interface DidChangeTextDocumentParams {
  textDocument: VersionedTextDocumentIdentifier;
  contentChanges: TextDocumentContentChangeEvent[];
}

export interface DidOpenTextDocumentParams {
  textDocument: {
    uri: string;
    languageId: string;
    version: number;
    text: string;
  };
}

export interface DidCloseTextDocumentParams {
  textDocument: {
    uri: string;
  };
}

/**
 * Document version tracker utility
 *
 * Maintains a map of document URIs to their current version numbers,
 * automatically incrementing on each change.
 *
 * @example
 * ```typescript
 * const tracker = new DocumentVersionTracker();
 *
 * // Open document
 * tracker.open('file:///path/to/file.ts', 0);
 *
 * // Apply incremental change (version auto-increments to 1)
 * const params = createIncrementalChange(
 *   'file:///path/to/file.ts',
 *   tracker,  // Or explicit version: 1
 *   { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } },
 *   'import '
 * );
 * await client.notify('textDocument/didChange', params);
 *
 * // Close document (cleanup)
 * tracker.close('file:///path/to/file.ts');
 * ```
 */
export declare class DocumentVersionTracker {
  /**
   * Initialize tracking for a document
   *
   * @param uri - Document URI
   * @param initialVersion - Starting version number (default: 0)
   */
  open(uri: string, initialVersion?: number): void;

  /**
   * Increment and return next version for a document
   *
   * @param uri - Document URI
   * @returns Next version number
   * @throws If document not opened yet
   */
  nextVersion(uri: string): number;

  /**
   * Get current version without incrementing
   *
   * @param uri - Document URI
   * @returns Current version, or undefined if not tracked
   */
  currentVersion(uri: string): number | undefined;

  /**
   * Stop tracking and remove from internal map
   *
   * @param uri - Document URI
   */
  close(uri: string): void;

  /**
   * Check if a document is currently tracked
   *
   * @param uri - Document URI
   */
  has(uri: string): boolean;

  /**
   * Clear all tracked documents
   */
  clear(): void;
}

/**
 * Options for notification waiting
 */
export interface WaitForNotificationOptions<TParams = unknown> {
  /**
   * Optional filter function to match specific notifications
   *
   * @param params - Notification parameters
   * @returns True if this is the desired notification
   *
   * @example
   * ```typescript
   * // Wait for diagnostics for a specific file
   * const diagnostics = await client.waitForNotification(
   *   'textDocument/publishDiagnostics',
   *   {
   *     filter: (params) => params.uri === 'file:///path/to/file.ts',
   *     timeout: 5000
   *   }
   * );
   * ```
   */
  filter?: (params: TParams) => boolean;

  /**
   * Timeout in milliseconds
   *
   * REQUIRED per user clarification (no default timeout).
   *
   * @throws TimeoutError if notification not received within timeout
   */
  timeout: number;
}

/**
 * Create incremental change notification parameters
 *
 * Constructs `DidChangeTextDocumentParams` with `TextDocumentSyncKind.Incremental`
 * semantics (range-based change).
 *
 * @param uri - Document URI
 * @param versionOrTracker - Explicit version number, or DocumentVersionTracker (auto-increments)
 * @param range - Text range to replace
 * @param text - New text for the range
 * @returns Parameters ready to send via `client.notify('textDocument/didChange', ...)`
 *
 * @example
 * ```typescript
 * // Explicit version
 * const params = createIncrementalChange(
 *   'file:///path/to/file.ts',
 *   1,
 *   { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } },
 *   'const'
 * );
 *
 * // With tracker (version auto-increments)
 * const tracker = new DocumentVersionTracker();
 * tracker.open('file:///path/to/file.ts', 0);
 * const params = createIncrementalChange(
 *   'file:///path/to/file.ts',
 *   tracker,
 *   { start: { line: 0, character: 0 }, end: { line: 0, character: 5 } },
 *   'const'
 * );
 * ```
 */
export declare function createIncrementalChange(
  uri: string,
  versionOrTracker: number | DocumentVersionTracker,
  range: Range,
  text: string
): DidChangeTextDocumentParams;

/**
 * Create full document change notification parameters
 *
 * Constructs `DidChangeTextDocumentParams` with `TextDocumentSyncKind.Full`
 * semantics (entire document replaced).
 *
 * @param uri - Document URI
 * @param versionOrTracker - Explicit version number, or DocumentVersionTracker (auto-increments)
 * @param text - Full document text
 * @returns Parameters ready to send via `client.notify('textDocument/didChange', ...)`
 *
 * @example
 * ```typescript
 * const params = createFullChange(
 *   'file:///path/to/file.ts',
 *   tracker,
 *   'const x = 42;\n'
 * );
 * await client.notify('textDocument/didChange', params);
 * ```
 */
export declare function createFullChange(
  uri: string,
  versionOrTracker: number | DocumentVersionTracker,
  text: string
): DidChangeTextDocumentParams;

/**
 * Create `textDocument/didOpen` notification parameters
 *
 * @param uri - Document URI
 * @param languageId - Language identifier (e.g., 'typescript', 'python')
 * @param version - Initial version (typically 0)
 * @param text - Initial document text
 *
 * @example
 * ```typescript
 * const params = createDidOpen(
 *   'file:///path/to/file.ts',
 *   'typescript',
 *   0,
 *   'const x = 42;\n'
 * );
 * await client.notify('textDocument/didOpen', params);
 * ```
 */
export declare function createDidOpen(
  uri: string,
  languageId: string,
  version: number,
  text: string
): DidOpenTextDocumentParams;

/**
 * Create `textDocument/didClose` notification parameters
 *
 * @param uri - Document URI
 *
 * @example
 * ```typescript
 * const params = createDidClose('file:///path/to/file.ts');
 * await client.notify('textDocument/didClose', params);
 * tracker.close('file:///path/to/file.ts');  // Also cleanup tracker
 * ```
 */
export declare function createDidClose(uri: string): DidCloseTextDocumentParams;
