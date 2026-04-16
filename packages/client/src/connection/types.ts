/**
 * Lifecycle state of an `LSPClient` connection.
 *
 * @remarks
 * Transitions: `Disconnected` → `Connecting` (on `connect()`) → `Connected`
 * (after `initialized`) → `Disconnecting` (on `disconnect()`) →
 * `Disconnected`.
 *
 * Listen for state changes via `LSPClient.onConnectionStateChange`.
 *
 * @category Client
 */
export enum ConnectionState {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting',
  Disconnected = 'disconnected'
}

/**
 * Configuration for optional heartbeat monitoring.
 *
 * @remarks
 * When `enabled` is `true`, the client sends a `$/ping` request at each
 * `interval` milliseconds. If no response arrives within `timeout`
 * milliseconds, the connection is marked unresponsive.
 *
 * @config
 * @category Client
 */
export interface HeartbeatConfig {
  /** Whether heartbeat monitoring is active. */
  enabled?: boolean;
  /** Interval between pings in milliseconds. */
  interval: number;
  /** Time to wait for a pong response in milliseconds. */
  timeout: number;
}

/**
 * Snapshot of the current heartbeat monitoring status.
 *
 * @category Client
 */
export interface HeartbeatStatus {
  enabled: boolean;
  interval: number;
  timeout: number;
  lastPing: Date | null;
  lastPong: Date | null;
  isResponsive: boolean;
}

/**
 * Aggregated connection health snapshot returned by
 * `LSPClient.getConnectionHealth()`.
 *
 * @category Client
 */
export interface ConnectionHealth {
  state: ConnectionState;
  lastMessageSent: Date | null;
  lastMessageReceived: Date | null;
  heartbeat?: HeartbeatStatus;
}

/**
 * Payload emitted when the connection state changes.
 * Subscribe via `LSPClient.onConnectionStateChange()`.
 *
 * @category Client
 */
export interface StateChangeEvent {
  previous: ConnectionState;
  current: ConnectionState;
  timestamp: Date;
  reason?: string;
}
