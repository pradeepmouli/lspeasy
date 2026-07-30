// apps/proxy/src/pass-through.ts
import {
  ClientRequestMethodToCapabilityMap,
  ClientNotificationMethodToCapabilityMap
} from '@lspeasy/core';
import type { LSPClient } from '@lspeasy/client';
import type { LSPServer } from '@lspeasy/server';

/** Resolve the backend LSPClient a given request/notification's params should
 *  be routed to (e.g. by document URI). */
export type BackendResolver = (params: unknown) => LSPClient;

// Handled internally by LSPServer's own lifecycle machinery — must never be
// overwritten by a blind pass-through, or the handshake/shutdown/cancellation
// protocol breaks.
const LIFECYCLE_METHODS = new Set([
  'initialize',
  'shutdown',
  'initialized',
  'exit',
  '$/cancelRequest'
]);

/** Register a forward-everything-verbatim handler for every LSP method this
 *  proxy doesn't special-case, so ProxySession transparently mirrors whatever
 *  the resolved backend supports — matching today's ClientSession behavior. */
export function registerPassThrough(server: LSPServer, resolveBackend: BackendResolver): void {
  for (const method of ClientRequestMethodToCapabilityMap.keys()) {
    if (LIFECYCLE_METHODS.has(method)) continue;
    server.onRequest(method, async (params: unknown) => {
      const backend = resolveBackend(params);
      return (backend.sendRequest as (m: string, p: unknown) => Promise<unknown>)(method, params);
    });
  }

  for (const method of ClientNotificationMethodToCapabilityMap.keys()) {
    if (LIFECYCLE_METHODS.has(method)) continue;
    server.onNotification(method, async (params: unknown) => {
      const backend = resolveBackend(params);
      await (backend.sendNotification as (m: string, p: unknown) => Promise<void>)(method, params);
    });
  }
}
