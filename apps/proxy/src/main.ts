#!/usr/bin/env node
// apps/proxy/src/main.ts
import { parseArgs } from 'node:util';
import { resolve } from 'node:path';
import { ProxyServer } from './proxy-server.js';

const { values } = parseArgs({
  options: {
    root: { type: 'string' },
    socket: { type: 'string' },
    'idle-timeout': { type: 'string', default: '1800000' },
    'backend-idle-timeout': { type: 'string', default: '600000' },
    'lazy-close-delay': { type: 'string', default: '300000' }
  },
  allowPositionals: false,
  strict: true
});

if (!values['root']) {
  process.stderr.write('[lsproxy] fatal: --root is required\n');
  process.exit(1);
}
const root = resolve(values['root']);
const server = new ProxyServer({
  root,
  ...(values['socket'] !== undefined && { socketOverride: values['socket'] }),
  idleTimeoutMs: Number(values['idle-timeout']),
  backendIdleMs: Number(values['backend-idle-timeout']),
  lazyCloseMs: Number(values['lazy-close-delay'])
});

server.start().catch((err: Error) => {
  process.stderr.write(`[lsproxy] fatal: ${err.message}\n`);
  process.exit(1);
});
