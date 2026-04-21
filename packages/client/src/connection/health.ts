import { DisposableEventEmitter } from '@lspeasy/core';
import type { ConnectionHealth, HeartbeatStatus, StateChangeEvent } from './types.js';
import { ConnectionState } from './types.js';

type HealthEventMap = {
  stateChanged: [StateChangeEvent];
  healthChanged: [ConnectionHealth];
};

/**
 * Tracks connection state transitions and message activity timestamps.
 *
 * @remarks
 * `ConnectionHealthTracker` is created internally by `LSPClient` and exposed
 * via `client.connectionHealth`. Subscribe to `stateChanged` and
 * `healthChanged` events to react to disconnections or transport failures.
 *
 * @useWhen
 * You need to monitor connection liveness — for example, to show a status
 * indicator, trigger reconnection logic, or surface transport errors to users.
 *
 * @see {@link HeartbeatMonitor} for detecting silent transport failures with
 * periodic ping/pong checks.
 *
 * @never
 * NEVER mutate the object returned by `getHealth()` — it is a defensive copy
 * but consumers that store a reference and then modify it will see stale state.
 *
 * NEVER call `setState` from outside `LSPClient` internals. External callers
 * have no knowledge of the full state-transition graph; setting state directly
 * can desync the client's internal bookkeeping from the tracker's reported state.
 *
 * @category Client
 */
export class ConnectionHealthTracker extends DisposableEventEmitter<HealthEventMap> {
  private health: ConnectionHealth = {
    state: ConnectionState.Disconnected,
    lastMessageSent: null,
    lastMessageReceived: null
  };

  /**
   * Returns a defensive copy of the current health snapshot.
   *
   * @returns A shallow copy of the current {@link ConnectionHealth} object,
   *   including a nested copy of `heartbeat` when present.
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
   *
   * @param next - The new {@link ConnectionState} to transition to.
   * @param reason - Optional human-readable reason for the state transition
   *   (e.g. `'Transport error'`). Included in the emitted `StateChangeEvent`.
   *
   * @see {@link ConnectionState} for valid state values.
   * @see {@link ConnectionHealthTracker} for the full class contract.
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

    this.emit('stateChanged', event);
    this.emit('healthChanged', this.getHealth());
  }

  /**
   * Records outbound message activity.
   */
  markMessageSent(): void {
    this.health = {
      ...this.health,
      lastMessageSent: new Date()
    };
    this.emit('healthChanged', this.getHealth());
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

    this.emit('healthChanged', this.getHealth());
  }

  /**
   * Updates the heartbeat subsection of the current health snapshot.
   */
  setHeartbeat(status: HeartbeatStatus): void {
    this.health = {
      ...this.health,
      heartbeat: status
    };
    this.emit('healthChanged', this.getHealth());
  }

  /**
   * Subscribes to connection state transitions.
   *
   * @param handler - Callback invoked with a {@link StateChangeEvent} each time
   *   the connection state changes.
   * @returns An unsubscribe function — call it to remove the listener.
   */
  onStateChange(handler: (event: StateChangeEvent) => void): () => void {
    const disposable = this.on('stateChanged', handler);
    return () => disposable.dispose();
  }

  /**
   * Subscribes to health snapshot updates.
   *
   * @param handler - Callback invoked with the latest {@link ConnectionHealth}
   *   snapshot after any state or activity change.
   * @returns An unsubscribe function — call it to remove the listener.
   */
  onHealthChange(handler: (health: ConnectionHealth) => void): () => void {
    const disposable = this.on('healthChanged', handler);
    return () => disposable.dispose();
  }
}
