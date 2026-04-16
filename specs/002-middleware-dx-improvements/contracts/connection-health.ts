/**
 * Connection Health Monitoring Contracts
 *
 * Type definitions for tracking connection state, activity timestamps,
 * and optional WebSocket heartbeat monitoring.
 *
 * @package @lspeasy/client/connection
 */

/**
 * Connection state enumeration
 *
 * State transitions:
 * - disconnected → connecting → connected
 * - connected → disconnecting → disconnected
 * - Any state can transition to disconnected on error
 */
export enum ConnectionState {
  /**
   * Initial state when establishing connection
   */
  Connecting = 'connecting',

  /**
   * Active connection, ready to send/receive messages
   */
  Connected = 'connected',

  /**
   * Graceful shutdown in progress
   */
  Disconnecting = 'disconnecting',

  /**
   * Connection closed (may reconnect automatically)
   */
  Disconnected = 'disconnected'
}

/**
 * WebSocket heartbeat monitoring status (opt-in)
 *
 * Only available for WebSocket transports. For client-side WebSocket
 * (browser or Node.js native), this uses timestamp tracking instead
 * of native ping/pong frames.
 */
export interface HeartbeatStatus {
  /**
   * Whether heartbeat monitoring is active
   *
   * @default false (opt-in per user clarification)
   */
  enabled: boolean;

  /**
   * Milliseconds between ping messages
   *
   * @default 30000 (30 seconds)
   * @minimum 1000
   */
  interval: number;

  /**
   * Milliseconds to wait for pong before marking unhealthy
   *
   * @default 10000 (10 seconds)
   * @minimum 1000
   * @recommended timeout = interval / 3
   */
  timeout: number;

  /**
   * Timestamp of last ping sent
   */
  lastPing: Date | null;

  /**
   * Timestamp of last pong received
   */
  lastPong: Date | null;

  /**
   * Whether pong was received within timeout
   */
  isResponsive: boolean;
}

/**
 * Connection health aggregate
 *
 * Combines connection state, activity timestamps, and optional heartbeat status.
 */
export interface ConnectionHealth {
  /**
   * Current connection state
   */
  state: ConnectionState;

  /**
   * Timestamp of last outbound message
   *
   * Null if no messages have been sent yet.
   */
  lastMessageSent: Date | null;

  /**
   * Timestamp of last inbound message
   *
   * Null if no messages have been received yet.
   */
  lastMessageReceived: Date | null;

  /**
   * Optional heartbeat monitoring status (WebSocket only)
   *
   * Undefined if heartbeat is not enabled or transport is not WebSocket.
   */
  heartbeat?: HeartbeatStatus;
}

/**
 * Configuration for heartbeat monitoring
 *
 * Only applicable to WebSocket transports.
 */
export interface HeartbeatConfig {
  /**
   * Enable heartbeat monitoring
   *
   * @default false (opt-in)
   */
  enabled?: boolean;

  /**
   * Milliseconds between ping messages
   *
   * @default 30000 (30 seconds)
   */
  interval?: number;

  /**
   * Milliseconds to wait for pong before marking unhealthy
   *
   * @default 10000 (10 seconds)
   */
  timeout?: number;
}

/**
 * Event emitted when connection state changes
 */
export interface StateChangeEvent {
  /**
   * State before transition
   */
  previous: ConnectionState;

  /**
   * State after transition
   */
  current: ConnectionState;

  /**
   * When the transition occurred
   */
  timestamp: Date;

  /**
   * Optional reason for transition
   *
   * Examples: 'timeout', 'user-initiated', 'server-closed', 'heartbeat-failed'
   */
  reason?: string;
}

/**
 * Event emitted when connection health changes
 *
 * This is a superset of StateChangeEvent, including additional health metadata.
 */
export interface HealthChangeEvent {
  /**
   * Current connection state
   */
  state: ConnectionState;

  /**
   * Timestamp of last outbound message
   */
  lastMessageSent: Date | null;

  /**
   * Timestamp of last inbound message
   */
  lastMessageReceived: Date | null;

  /**
   * Optional heartbeat status (WebSocket only)
   */
  heartbeat?: HeartbeatStatus;

  /**
   * Reason for health change (if available)
   */
  reason?: string;
}

/**
 * Connection health monitoring API (mixin for LSPClient)
 */
export interface ConnectionHealthMonitoring {
  /**
   * Get current connection health
   */
  getHealth(): ConnectionHealth;

  /**
   * Register listener for state change events
   *
   * @param listener - Callback invoked on state transitions
   * @returns Disposable to remove listener
   *
   * @example
   * ```typescript
   * const disposable = client.onStateChange((event) => {
   *   console.log(`State changed: ${event.previous} → ${event.current}`);
   * });
   *
   * // Later: remove listener
   * disposable.dispose();
   * ```
   */
  onStateChange(listener: (event: StateChangeEvent) => void): Disposable;

  /**
   * Register listener for health change events
   *
   * @param listener - Callback invoked on health changes
   * @returns Disposable to remove listener
   */
  onHealthChange(listener: (event: HealthChangeEvent) => void): Disposable;
}

/**
 * Disposable interface for cleanup
 */
export interface Disposable {
  dispose(): void;
}
