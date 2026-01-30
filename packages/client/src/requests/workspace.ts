/**
 * High-level workspace.* method builders
 */

import type { LSPClient } from '../client.js';
import type {
  WorkspaceSymbolParams,
  SymbolInformation,
  DidChangeWorkspaceFoldersParams,
  DidChangeConfigurationParams,
  DidChangeWatchedFilesParams
} from 'vscode-languageserver-protocol';

/**
 * Workspace request methods
 */
export class WorkspaceRequests {
  constructor(private client: LSPClient) {}

  /**
   * Send workspace/symbol request
   */
  async symbol(params: WorkspaceSymbolParams): Promise<SymbolInformation[] | null> {
    return this.client.sendRequest<WorkspaceSymbolParams, SymbolInformation[] | null>(
      'workspace/symbol',
      params
    );
  }

  /**
   * Send workspace/didChangeWorkspaceFolders notification
   */
  async didChangeWorkspaceFolders(params: DidChangeWorkspaceFoldersParams): Promise<void> {
    return this.client.sendNotification('workspace/didChangeWorkspaceFolders', params);
  }

  /**
   * Send workspace/didChangeConfiguration notification
   */
  async didChangeConfiguration(params: DidChangeConfigurationParams): Promise<void> {
    return this.client.sendNotification('workspace/didChangeConfiguration', params);
  }

  /**
   * Send workspace/didChangeWatchedFiles notification
   */
  async didChangeWatchedFiles(params: DidChangeWatchedFilesParams): Promise<void> {
    return this.client.sendNotification('workspace/didChangeWatchedFiles', params);
  }
}
