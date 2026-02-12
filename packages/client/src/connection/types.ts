/**
 * Lifecycle state for the client connection.
 */
export enum ConnectionState {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting',
  Disconnected = 'disconnected'
}

/**
 * Configuration for optional heartbeat monitoring.
 */
export interface HeartbeatConfig {
  enabled?: boolean;
  interval: number;
  timeout: number;
}

/**
 * Runtime heartbeat status snapshot.
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
 * Aggregated connection health details.
 */
export interface ConnectionHealth {
  state: ConnectionState;
  lastMessageSent: Date | null;
  lastMessageReceived: Date | null;
  heartbeat?: HeartbeatStatus;
}

/**
 * Event payload emitted when connection state changes.
 */
export interface StateChangeEvent {
  previous: ConnectionState;
  current: ConnectionState;
  timestamp: Date;
  reason?: string;
}
