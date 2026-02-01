#!/usr/bin/env node
/**
 * Progress Client Example
 *
 * Demonstrates:
 * - Connecting to an LSP server
 * - Handling progress notifications
 * - Tracking long-running operations
 */

import { LSPClient } from '@lspeasy/client';
import { StdioTransport } from '@lspeasy/core';
import type {
  WorkDoneProgressBegin,
  WorkDoneProgressReport,
  WorkDoneProgressEnd
} from '@lspeasy/core';

// Create client instance
const client = new LSPClient({
  name: 'Progress Example Client',
  version: '1.0.0',
  capabilities: {
    textDocument: {
      hover: { dynamicRegistration: false, contentFormat: ['markdown', 'plaintext'] },
      completion: { dynamicRegistration: false }
    },
    workspace: {
      workspaceFolders: true,
      didChangeWatchedFiles: { dynamicRegistration: true }
    },
    window: {
      workDoneProgress: true // Enable work done progress support
    }
  }
});

// Track progress notifications
const activeProgress = new Map<string, { title: string; percentage?: number }>();

// Handle progress notifications from server
client.onNotification('$/progress', (params: any) => {
  const { token, value } = params;

  if (value.kind === 'begin') {
    const begin = value as WorkDoneProgressBegin;
    activeProgress.set(token, {
      title: begin.title,
      percentage: begin.percentage
    });
    console.log(`\n[Progress ${token}] Started: ${begin.title}`);
    if (begin.message) {
      console.log(`  ${begin.message}`);
    }
    if (begin.percentage !== undefined) {
      console.log(`  ${begin.percentage}% complete`);
    }
  } else if (value.kind === 'report') {
    const report = value as WorkDoneProgressReport;
    const progress = activeProgress.get(token);
    if (progress) {
      if (report.percentage !== undefined) {
        progress.percentage = report.percentage;
      }
      if (report.message) {
        console.log(`[Progress ${token}] ${report.message}`);
      }
      if (report.percentage !== undefined) {
        console.log(`  ${report.percentage}% complete`);
      }
    }
  } else if (value.kind === 'end') {
    const end = value as WorkDoneProgressEnd;
    const progress = activeProgress.get(token);
    if (progress) {
      console.log(`[Progress ${token}] Completed: ${progress.title}`);
      if (end.message) {
        console.log(`  ${end.message}`);
      }
      activeProgress.delete(token);
    }
  }
});

// Example function to test progress
async function demonstrateProgress(): Promise<void> {
  console.log('\n=== Progress Demonstration ===\n');

  // Open a text document
  await client.sendNotification('textDocument/didOpen', {
    textDocument: {
      uri: 'file:///example.ts',
      languageId: 'typescript',
      version: 1,
      text: 'const x = 42;\nfunction hello() { return "world"; }'
    }
  });

  console.log('Requesting hover (with progress)...');

  // Request hover - server might report progress
  const hover = await client.textDocument.hover({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 0, character: 6 }
  });

  if (hover) {
    console.log('\nHover result:');
    if (typeof hover.contents === 'string') {
      console.log(hover.contents);
    } else if ('value' in hover.contents) {
      console.log(hover.contents.value);
    }
  }

  // Wait a bit for any pending progress notifications
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Request completion
  console.log('\n\nRequesting completion (with progress)...');
  const completion = await client.textDocument.completion({
    textDocument: { uri: 'file:///example.ts' },
    position: { line: 1, character: 15 }
  });

  if (completion) {
    const items = Array.isArray(completion) ? completion : completion.items;
    console.log(`\nCompletion items: ${items.length}`);
    items.slice(0, 5).forEach((item) => {
      console.log(`  - ${item.label}${item.detail ? ` (${item.detail})` : ''}`);
    });
  }

  // Check for any remaining active progress
  if (activeProgress.size > 0) {
    console.log('\n\nWarning: Some progress notifications did not complete:');
    activeProgress.forEach((progress, token) => {
      console.log(`  ${token}: ${progress.title} (${progress.percentage ?? '?'}%)`);
    });
  }
}

// Main execution
async function main(): Promise<void> {
  try {
    console.log('Starting Progress Client Example...\n');

    // Create transport (assumes server is running)
    const transport = new StdioTransport();

    // Connect to server
    console.log('Connecting to LSP server...');
    const initResult = await client.connect(transport);

    console.log('Connected successfully!');
    console.log('Server:', initResult.serverInfo?.name ?? 'Unknown');
    console.log('Version:', initResult.serverInfo?.version ?? 'Unknown');

    // Check if server supports progress
    const supportsProgress = initResult.capabilities.window?.workDoneProgress === true;
    console.log('Progress support:', supportsProgress ? 'Yes' : 'No');

    // Demonstrate progress handling
    await demonstrateProgress();

    // Disconnect
    console.log('\n\nDisconnecting...');
    await client.disconnect();
    console.log('Disconnected successfully');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down...');
  try {
    await client.disconnect();
  } catch {
    // Ignore errors during shutdown
  }
  process.exit(0);
});

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
