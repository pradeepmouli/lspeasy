/**
 * Helpers for creating connected transports in tests.
 */

import { PassThrough } from 'node:stream';
import { StdioTransport } from '@lspeasy/core';

export function createConnectedStdioTransports(): {
  serverTransport: StdioTransport;
  clientTransport: StdioTransport;
} {
  const serverToClient = new PassThrough();
  const clientToServer = new PassThrough();

  return {
    serverTransport: new StdioTransport({
      input: clientToServer,
      output: serverToClient
    }),
    clientTransport: new StdioTransport({
      input: serverToClient,
      output: clientToServer
    })
  };
}
