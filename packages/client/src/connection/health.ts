import { EventEmitter } from 'node:events';
import type { ConnectionHealth, HeartbeatStatus, StateChangeEvent } from './types.js';
import { ConnectionState } from './types.js';

/**
 * Tracks connection state transitions and message activity timestamps.
 */
export class ConnectionHealthTracker {
  private readonly events = new EventEmitter();
  private health: ConnectionHealth = {
    state: ConnectionState.Disconnected,
    lastMessageSent: null,
    lastMessageReceived: null
  };

  /**
   * Returns a defensive copy of the current health snapshot.
   */
  getHealth(): ConnectionHealth {
    const baseHealth: ConnectionHealth = {
      ...this.health
    };

    if (this.health.heartbeat) {
      return {
        ...baseHealth,
        heartbeat: { ...this.health.heartbeat }
      };
    }

    return baseHealth;
  }

  /**
   * Updates connection state and emits state/health change events.
   */
  setState(next: ConnectionState, reason?: string): void {
    if (this.health.state === next) {
      return;
    }

    const previous = this.health.state;
    this.health = { ...this.health, state: next };

    const baseEvent = {
      previous,
      current: next,
      timestamp: new Date()
    };

    const event: StateChangeEvent = reason ? { ...baseEvent, reason } : baseEvent;

    this.events.emit('stateChanged', event);
    this.events.emit('healthChanged', this.getHealth());
  }

  /**
   * Records outbound message activity.
   */
  markMessageSent(): void {
    this.health = {
      ...this.health,
      lastMessageSent: new Date()
    };
    this.events.emit('healthChanged', this.getHealth());
  }

  /**
   * Records inbound message activity.
   */
  markMessageReceived(): void {
    this.health = {
      ...this.health,
      lastMessageReceived: new Date()
    };

    if (this.health.heartbeat) {
      this.health = {
        ...this.health,
        heartbeat: {
          ...this.health.heartbeat,
          lastPong: new Date(),
          isResponsive: true
        }
      };
    }

    this.events.emit('healthChanged', this.getHealth());
  }

  /**
   * Updates the heartbeat subsection of the current health snapshot.
   */
  setHeartbeat(status: HeartbeatStatus): void {
    this.health = {
      ...this.health,
      heartbeat: status
    };
    this.events.emit('healthChanged', this.getHealth());
  }

  /**
   * Subscribes to connection state transitions.
   */
  onStateChange(handler: (event: StateChangeEvent) => void): () => void {
    this.events.on('stateChanged', handler);
    return () => this.events.off('stateChanged', handler);
  }

  /**
   * Subscribes to health snapshot updates.
   */
  onHealthChange(handler: (health: ConnectionHealth) => void): () => void {
    this.events.on('healthChanged', handler);
    return () => this.events.off('healthChanged', handler);
  }
}
