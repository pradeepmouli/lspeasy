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
  /** Whether heartbeat monitoring is active. */
  enabled: boolean;
  /** Interval between pings in milliseconds. */
  interval: number;
  /** Timeout in milliseconds before a ping is considered unanswered. */
  timeout: number;
  /** Timestamp of the last outgoing ping, or `null` if no ping has been sent. */
  lastPing: Date | null;
  /** Timestamp of the last received pong, or `null` if no pong has been received. */
  lastPong: Date | null;
  /** Whether the server responded to the most recent ping within the timeout window. */
  isResponsive: boolean;
}

/**
 * Aggregated connection health snapshot returned by
 * `LSPClient.getConnectionHealth()`.
 *
 * @category Client
 */
export interface ConnectionHealth {
  /** Current lifecycle state of the connection. */
  state: ConnectionState;
  /** Timestamp of the last outgoing message, or `null` if none has been sent. */
  lastMessageSent: Date | null;
  /** Timestamp of the last incoming message, or `null` if none has been received. */
  lastMessageReceived: Date | null;
  /** Heartbeat monitoring snapshot, present only when heartbeat is configured. */
  heartbeat?: HeartbeatStatus;
}

/**
 * Payload emitted when the connection state changes.
 * Subscribe via `LSPClient.onConnectionStateChange()`.
 *
 * @category Client
 */
export interface StateChangeEvent {
  /** The state the connection was in before this transition. */
  previous: ConnectionState;
  /** The state the connection has transitioned into. */
  current: ConnectionState;
  /** Wall-clock time at which the state transition occurred. */
  timestamp: Date;
  /** Optional human-readable description of why the state changed. */
  reason?: string;
}
