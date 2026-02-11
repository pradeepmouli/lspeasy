/**
 * Integration tests for progress reporting
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { LSPServer } from '@lspeasy/server';
import { LSPClient } from '@lspeasy/client';
import {
  createProgressToken,
  createProgressBegin,
  createProgressReport,
  createProgressEnd
} from '@lspeasy/core';
import type { ProgressToken, WorkDoneProgressValue } from '@lspeasy/core';
import { createConnectedStdioTransports } from './transport-utils.js';

describe('Progress Reporting Integration', () => {
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
        window: {
          workDoneProgress: true
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

  it('should report progress through begin -> report -> end sequence', async () => {
    const progressEvents: Array<{ token: ProgressToken; value: WorkDoneProgressValue }> = [];

    // Set up client to track progress
    client.onNotification('$/progress', (params: any) => {
      progressEvents.push({
        token: params.token,
        value: params.value
      });
    });

    // Start server and client
    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    // Simulate progress-reporting request handler
    const token = createProgressToken();

    // Send progress begin
    await server.sendNotification('$/progress', {
      token,
      value: createProgressBegin('Processing', true, 'Starting...', 0)
    });

    // Send progress report
    await server.sendNotification('$/progress', {
      token,
      value: createProgressReport('Working...', 50)
    });

    // Send progress report
    await server.sendNotification('$/progress', {
      token,
      value: createProgressReport('Almost done...', 90)
    });

    // Send progress end
    await server.sendNotification('$/progress', {
      token,
      value: createProgressEnd('Completed successfully')
    });

    // Wait for notifications to be processed
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify progress sequence
    expect(progressEvents).toHaveLength(4);

    // Check begin
    expect(progressEvents[0].token).toBe(token);
    expect(progressEvents[0].value.kind).toBe('begin');
    if (progressEvents[0].value.kind === 'begin') {
      expect(progressEvents[0].value.title).toBe('Processing');
      expect(progressEvents[0].value.message).toBe('Starting...');
      expect(progressEvents[0].value.percentage).toBe(0);
      expect(progressEvents[0].value.cancellable).toBe(true);
    }

    // Check first report
    expect(progressEvents[1].value.kind).toBe('report');
    if (progressEvents[1].value.kind === 'report') {
      expect(progressEvents[1].value.message).toBe('Working...');
      expect(progressEvents[1].value.percentage).toBe(50);
    }

    // Check second report
    expect(progressEvents[2].value.kind).toBe('report');
    if (progressEvents[2].value.kind === 'report') {
      expect(progressEvents[2].value.message).toBe('Almost done...');
      expect(progressEvents[2].value.percentage).toBe(90);
    }

    // Check end
    expect(progressEvents[3].value.kind).toBe('end');
    if (progressEvents[3].value.kind === 'end') {
      expect(progressEvents[3].value.message).toBe('Completed successfully');
    }
  });

  it('should handle multiple concurrent progress tokens', async () => {
    const progressByToken = new Map<ProgressToken, WorkDoneProgressValue[]>();

    // Track progress by token
    client.onNotification('$/progress', (params: any) => {
      const events = progressByToken.get(params.token) || [];
      events.push(params.value);
      progressByToken.set(params.token, events);
    });

    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    // Create multiple progress tokens
    const token1 = createProgressToken();
    const token2 = createProgressToken();

    // Start first progress
    await server.sendNotification('$/progress', {
      token: token1,
      value: createProgressBegin('Task 1', false)
    });

    // Start second progress
    await server.sendNotification('$/progress', {
      token: token2,
      value: createProgressBegin('Task 2', false)
    });

    // Update first progress
    await server.sendNotification('$/progress', {
      token: token1,
      value: createProgressReport('Task 1 working...', 50)
    });

    // Update second progress
    await server.sendNotification('$/progress', {
      token: token2,
      value: createProgressReport('Task 2 working...', 30)
    });

    // End first progress
    await server.sendNotification('$/progress', {
      token: token1,
      value: createProgressEnd('Task 1 done')
    });

    // End second progress
    await server.sendNotification('$/progress', {
      token: token2,
      value: createProgressEnd('Task 2 done')
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify both progress sequences
    expect(progressByToken.size).toBe(2);
    expect(progressByToken.get(token1)).toHaveLength(3); // begin, report, end
    expect(progressByToken.get(token2)).toHaveLength(3); // begin, report, end
  });

  it('should handle progress without percentage', async () => {
    const progressEvents: WorkDoneProgressValue[] = [];

    client.onNotification('$/progress', (params: any) => {
      progressEvents.push(params.value);
    });

    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    const token = createProgressToken();

    // Progress without percentages
    await server.sendNotification('$/progress', {
      token,
      value: createProgressBegin('Processing')
    });

    await server.sendNotification('$/progress', {
      token,
      value: createProgressReport('Working...')
    });

    await server.sendNotification('$/progress', {
      token,
      value: createProgressEnd()
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(progressEvents).toHaveLength(3);
    expect(progressEvents[0].kind).toBe('begin');
    expect(progressEvents[1].kind).toBe('report');
    expect(progressEvents[2].kind).toBe('end');

    // Verify no percentages
    if (progressEvents[0].kind === 'begin') {
      expect(progressEvents[0].percentage).toBeUndefined();
    }
    if (progressEvents[1].kind === 'report') {
      expect(progressEvents[1].percentage).toBeUndefined();
    }
  });

  it('should support cancellable progress', async () => {
    let cancellable = false;

    client.onNotification('$/progress', (params: any) => {
      if (params.value.kind === 'begin') {
        cancellable = params.value.cancellable ?? false;
      }
    });

    ({ serverTransport, clientTransport } = createConnectedStdioTransports());

    await server.listen(serverTransport);
    await client.connect(clientTransport);

    const token = createProgressToken();

    await server.sendNotification('$/progress', {
      token,
      value: createProgressBegin('Cancellable Task', true)
    });

    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(cancellable).toBe(true);
  });
});
