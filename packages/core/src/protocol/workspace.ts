/**
 * Workspace-related types for LSP protocol
 *
 * @module protocol/workspace
 */

import type {
  WorkspaceFolder,
  WorkspaceFoldersChangeEvent as LSPWorkspaceFoldersChangeEvent,
  WorkspaceEdit,
  ApplyWorkspaceEditParams,
  ApplyWorkspaceEditResult,
  ExecuteCommandParams,
  ExecuteCommandRegistrationOptions,
  DidChangeConfigurationParams,
  ConfigurationParams,
  ConfigurationItem,
  DidChangeWatchedFilesParams,
  FileEvent,
  FileChangeType,
  DidChangeWorkspaceFoldersParams
} from 'vscode-languageserver-protocol';

// Re-export workspace folder types
export type {
  WorkspaceFolder,
  LSPWorkspaceFoldersChangeEvent as WorkspaceFoldersChangeEvent,
  WorkspaceEdit,
  ApplyWorkspaceEditParams,
  ApplyWorkspaceEditResult,
  ExecuteCommandParams,
  ExecuteCommandRegistrationOptions,
  DidChangeConfigurationParams,
  ConfigurationParams,
  ConfigurationItem,
  DidChangeWatchedFilesParams,
  FileEvent,
  FileChangeType,
  DidChangeWorkspaceFoldersParams
};

/**
 * Helper to create a WorkspaceFolder.
 *
 * @param uri - The URI of the workspace folder (e.g. `'file:///home/user/project'`).
 * @param name - Human-readable name displayed in the editor.
 * @returns A `WorkspaceFolder` object.
 */
export function createWorkspaceFolder(uri: string, name: string): WorkspaceFolder {
  return { uri, name };
}

/**
 * Helper to create a WorkspaceFoldersChangeEvent.
 *
 * @param added - Workspace folders that were added.
 * @param removed - Workspace folders that were removed.
 * @returns A `WorkspaceFoldersChangeEvent` ready to send.
 */
export function createWorkspaceFoldersChangeEvent(
  added: WorkspaceFolder[],
  removed: WorkspaceFolder[]
): LSPWorkspaceFoldersChangeEvent {
  return { added, removed };
}

/**
 * File change types enum for convenience
 */
export const FileChangeTypes = {
  Created: 1 as FileChangeType,
  Changed: 2 as FileChangeType,
  Deleted: 3 as FileChangeType
} as const;
