import { EventEmitter } from 'node:events';
import type { ConnectionHealth, HeartbeatStatus, StateChangeEvent } from './types.js';
import { ConnectionState } from './types.js';

export class ConnectionHealthTracker {
  private readonly events = new EventEmitter();
  private health: ConnectionHealth = {
    state: ConnectionState.Disconnected,
    lastMessageSent: null,
    lastMessageReceived: null
  };

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

  markMessageSent(): void {
    this.health = {
      ...this.health,
      lastMessageSent: new Date()
    };
    this.events.emit('healthChanged', this.getHealth());
  }

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

  setHeartbeat(status: HeartbeatStatus): void {
    this.health = {
      ...this.health,
      heartbeat: status
    };
    this.events.emit('healthChanged', this.getHealth());
  }

  onStateChange(handler: (event: StateChangeEvent) => void): () => void {
    this.events.on('stateChanged', handler);
    return () => this.events.off('stateChanged', handler);
  }

  onHealthChange(handler: (health: ConnectionHealth) => void): () => void {
    this.events.on('healthChanged', handler);
    return () => this.events.off('healthChanged', handler);
  }
}
