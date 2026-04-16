/**
 * Integration tests for workspace folder management
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LSPServer } from '@lspeasy/server';
import { LSPClient } from '@lspeasy/client';
import { createWorkspaceFolder, createWorkspaceFoldersChangeEvent } from '@lspeasy/core';
import type { WorkspaceFolder, DidChangeWorkspaceFoldersParams } from '@lspeasy/core';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('Workspace Folders Integration', () => {
  let server: LSPServer;
  let client: LSPClient;
  let serverTransport: StdioTransport;
  let clientTransport: StdioTransport;

  beforeEach(() => {
    server = new LSPServer({
      name: 'Test Server',
      version: '1.0.0'
    });

    client = new LSPClient({
      name: 'Test Client',
      version: '1.0.0',
      capabilities: {
        workspace: {
          workspaceFolders: true,
          didChangeWorkspaceFolders: { dynamicRegistration: true }
        }
      }
    });
  });

  afterEach(async () => {
    try {
      await client.disconnect();
    } catch {
      // Ignore errors
    }
    try {
      await server.shutdown();
    } catch {
      // Ignore errors
    }
  });

  it('should handle workspace folder changes', async () => {
    // Track workspace folders on server
    const folders = new Map<string, WorkspaceFolder>();

    // Set server capabilities
    server.setCapabilities({
      workspace: {
        workspaceFolders: {
          supported: true,
          changeNotifications: true
        }
      }
    });

    // Handle workspace folder changes
    let changedFolders: DidChangeWorkspaceFoldersParams | null = null;
    server.onNotification(
      'workspace/didChangeWorkspaceFolders',
      async (params: DidChangeWorkspaceFoldersParams) => {
        changedFolders = params;
        // Update tracking
        for (const removed of params.event.removed) {
          folders.delete(removed.uri);
        }
        for (const added of params.event.added) {
          folders.set(added.uri, added);
        }
      }
    );

    // Start server and connect client
    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    // Send initial workspace folders
    const folder1 = createWorkspaceFolder('file:///workspace1', 'Project 1');
    const folder2 = createWorkspaceFolder('file:///workspace2', 'Project 2');

    await client.sendNotification('workspace/didChangeWorkspaceFolders', {
      event: createWorkspaceFoldersChangeEvent([folder1, folder2], [])
    });

    // Wait for notification processing
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify folders were added
    expect(changedFolders).not.toBeNull();
    expect(changedFolders?.event.added).toHaveLength(2);
    expect(folders.size).toBe(2);
    expect(folders.has('file:///workspace1')).toBe(true);
    expect(folders.has('file:///workspace2')).toBe(true);

    // Remove a folder
    await client.sendNotification('workspace/didChangeWorkspaceFolders', {
      event: createWorkspaceFoldersChangeEvent([], [folder1])
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify folder was removed
    expect(folders.size).toBe(1);
    expect(folders.has('file:///workspace1')).toBe(false);
    expect(folders.has('file:///workspace2')).toBe(true);

    // Add a new folder
    const folder3 = createWorkspaceFolder('file:///workspace3', 'Project 3');
    await client.sendNotification('workspace/didChangeWorkspaceFolders', {
      event: createWorkspaceFoldersChangeEvent([folder3], [])
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify new folder was added
    expect(folders.size).toBe(2);
    expect(folders.has('file:///workspace2')).toBe(true);
    expect(folders.has('file:///workspace3')).toBe(true);
  });

  it('should report workspace folder capabilities', async () => {
    server.setCapabilities({
      workspace: {
        workspaceFolders: {
          supported: true,
          changeNotifications: true
        }
      }
    });

    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    const initResult = await client.connect(clientTransport);

    // Verify server capabilities
    expect(initResult.capabilities.workspace?.workspaceFolders?.supported).toBe(true);
    expect(initResult.capabilities.workspace?.workspaceFolders?.changeNotifications).toBe(true);
  });

  it('should handle empty workspace folder changes', async () => {
    const folders = new Map<string, WorkspaceFolder>();
    let notificationReceived = false;

    server.onNotification(
      'workspace/didChangeWorkspaceFolders',
      async (params: DidChangeWorkspaceFoldersParams) => {
        notificationReceived = true;
        for (const added of params.event.added) {
          folders.set(added.uri, added);
        }
      }
    );

    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    // Send empty change
    await client.sendNotification('workspace/didChangeWorkspaceFolders', {
      event: createWorkspaceFoldersChangeEvent([], [])
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(notificationReceived).toBe(true);
    expect(folders.size).toBe(0);
  });
});
