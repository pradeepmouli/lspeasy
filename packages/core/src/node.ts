/**
 * @lspeasy/core/node - Node.js-specific transports and utilities
 *
 * This module exports components that depend on Node.js built-in modules.
 * These are compatible with Node.js, Bun, and Deno but not browsers.
 *
 * For browser-compatible transports, use the main '@lspeasy/core' export.
 */

// JSON-RPC message reader/writer for Node.js streams
export { MessageReader } from './jsonrpc/reader.js';
export { MessageWriter } from './jsonrpc/writer.js';

// Node.js-specific transports
export { StdioTransport } from './transport/stdio.js';
export type { StdioTransportOptions } from './transport/stdio.js';
export { TcpTransport } from './transport/tcp.js';
export type { TcpTransportOptions, TcpReconnectOptions } from './transport/tcp.js';
export { IpcTransport } from './transport/ipc.js';
export type {
  IpcTransportOptions,
  IpcParentProcessLike,
  IpcChildProcessLike
} from './transport/ipc.js';
