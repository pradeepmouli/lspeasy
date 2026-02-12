export enum ConnectionState {
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting',
  Disconnected = 'disconnected'
}

export interface HeartbeatConfig {
  enabled?: boolean;
  interval: number;
  timeout: number;
}

export interface HeartbeatStatus {
  enabled: boolean;
  interval: number;
  timeout: number;
  lastPing: Date | null;
  lastPong: Date | null;
  isResponsive: boolean;
}

export interface ConnectionHealth {
  state: ConnectionState;
  lastMessageSent: Date | null;
  lastMessageReceived: Date | null;
  heartbeat?: HeartbeatStatus;
}

export interface StateChangeEvent {
  previous: ConnectionState;
  current: ConnectionState;
  timestamp: Date;
  reason?: string;
}
