#!/usr/bin/env node
/**
 * Advanced LSP Server Example
 *
 * Demonstrates:
 * - Workspace folder management
 * - Progress reporting
 * - File watching
 * - Multiple text document features
 */

import { LSPServer } from '@lspy/server';
import { StdioTransport, createProgressToken } from '@lspy/core';
import type {
  WorkspaceFolder,
  DidChangeWorkspaceFoldersParams,
  DidChangeWatchedFilesParams
} from '@lspy/core';

// Simulated workspace state
const workspaceFolders = new Map<string, WorkspaceFolder>();
const documents = new Map<string, string>();

// Create server instance
const server = new LSPServer({
  name: 'Advanced Example Server',
  version: '1.0.0'
});

// Set server capabilities
server.setCapabilities({
  textDocumentSync: 1, // Full sync
  hoverProvider: true,
  completionProvider: {
    triggerCharacters: ['.', ':', '@'],
    resolveProvider: false
  },
  definitionProvider: true,
  workspace: {
    workspaceFolders: {
      supported: true,
      changeNotifications: true
    },
    fileOperations: {
      didCreate: { filters: [{ pattern: { glob: '**/*.{ts,js}' } }] },
      didRename: { filters: [{ pattern: { glob: '**/*.{ts,js}' } }] },
      didDelete: { filters: [{ pattern: { glob: '**/*.{ts,js}' } }] }
    }
  }
});

// Handle workspace folder changes
server.onNotification(
  'workspace/didChangeWorkspaceFolders',
  async (params: DidChangeWorkspaceFoldersParams) => {
    // Remove deleted folders
    for (const removed of params.event.removed) {
      workspaceFolders.delete(removed.uri);
      console.error(`[Server] Removed workspace folder: ${removed.name}`);
    }

    // Add new folders
    for (const added of params.event.added) {
      workspaceFolders.set(added.uri, added);
      console.error(`[Server] Added workspace folder: ${added.name}`);
    }

    console.error(`[Server] Total workspace folders: ${workspaceFolders.size}`);
  }
);

// Handle file watching notifications
server.onNotification(
  'workspace/didChangeWatchedFiles',
  async (params: DidChangeWatchedFilesParams) => {
    for (const change of params.changes) {
      const types = ['', 'Created', 'Changed', 'Deleted'];
      console.error(`[Server] File ${types[change.type]}: ${change.uri}`);
    }
  }
);

// Handle text document open
server.onNotification('textDocument/didOpen', async (params) => {
  documents.set(params.textDocument.uri, params.textDocument.text);
  console.error(`[Server] Document opened: ${params.textDocument.uri}`);
});

// Handle text document change
server.onNotification('textDocument/didChange', async (params) => {
  if (params.contentChanges.length > 0) {
    const change = params.contentChanges[0];
    if ('text' in change) {
      documents.set(params.textDocument.uri, change.text);
      console.error(`[Server] Document changed: ${params.textDocument.uri}`);
    }
  }
});

// Handle hover with progress reporting
server.onRequest('textDocument/hover', async (params, token) => {
  // Create progress token
  const progressToken = createProgressToken();

  // Start progress (this would normally use window/workDoneProgress/create)
  console.error(`[Server] Starting hover computation with progress...`);

  // Simulate work with progress updates
  await new Promise((resolve) => setTimeout(resolve, 100));
  console.error(`[Server] Progress: 50% - Analyzing document...`);

  await new Promise((resolve) => setTimeout(resolve, 100));
  console.error(`[Server] Progress: 100% - Completed`);

  const content = documents.get(params.textDocument.uri);
  if (!content) {
    return null;
  }

  // Return hover information
  return {
    contents: {
      kind: 'markdown',
      value: `# Symbol Information\n\nPosition: Line ${params.position.line}, Character ${params.position.character}\n\n**Workspace Folders**: ${workspaceFolders.size}`
    },
    range: {
      start: params.position,
      end: { line: params.position.line, character: params.position.character + 10 }
    }
  };
});

// Handle completion with workspace context
server.onRequest('textDocument/completion', async (params) => {
  const content = documents.get(params.textDocument.uri);
  if (!content) {
    return [];
  }

  // Return workspace-aware completions
  const folderNames = Array.from(workspaceFolders.values()).map((f) => f.name);

  return {
    isIncomplete: false,
    items: [
      {
        label: 'workspace.folders',
        kind: 9, // Module
        detail: `${folderNames.length} folders`,
        documentation: `Available folders: ${folderNames.join(', ')}`
      },
      {
        label: 'workspace.documents',
        kind: 9,
        detail: `${documents.size} documents`,
        documentation: 'All open documents in workspace'
      },
      ...folderNames.map((name, index) => ({
        label: `folder.${name}`,
        kind: 19, // Folder
        detail: 'Workspace folder',
        documentation: `Path: ${Array.from(workspaceFolders.values())[index].uri}`
      }))
    ]
  };
});

// Handle definition lookup
server.onRequest('textDocument/definition', async (params) => {
  const content = documents.get(params.textDocument.uri);
  if (!content) {
    return null;
  }

  // Return a definition location in the current document
  return {
    uri: params.textDocument.uri,
    range: {
      start: { line: 0, character: 0 },
      end: { line: 0, character: 10 }
    }
  };
});

// Start server
const transport = new StdioTransport();
server
  .listen(transport)
  .then(() => {
    console.error('[Server] Advanced LSP Server is running on stdio');
    console.error('[Server] Supports: workspace folders, progress, file watching');
  })
  .catch((error) => {
    console.error('[Server] Failed to start:', error);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.error('[Server] Shutting down...');
  await server.shutdown();
  process.exit(0);
});
