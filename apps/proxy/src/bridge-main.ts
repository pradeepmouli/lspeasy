#!/usr/bin/env node
/** Opt-in daemon entrypoint for the experimental Rust stdio bridge. */
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { ProxyServer } from './proxy-server.js';

// The native bridge owns stdout exclusively. ConsoleLogger and any backend
// diagnostics must not interleave text with binary session frames.
console.log = (...args: unknown[]) => console.error(...args);
console.info = (...args: unknown[]) => console.error(...args);
console.debug = (...args: unknown[]) => console.error(...args);

const { values } = parseArgs({
  options: { root: { type: 'string' }, 'idle-timeout': { type: 'string' } },
  strict: true
});
if (!values.root) {
  process.stderr.write('[lsproxy] bridge daemon requires --root\n');
  process.exit(1);
}
const server = new ProxyServer({
  root: resolve(values.root),
  ...(values['idle-timeout'] !== undefined && { idleTimeoutMs: Number(values['idle-timeout']) })
});
server.startBridge();
