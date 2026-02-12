import { describe, expect, it } from 'vitest';
import { ConnectionHealthTracker } from '../../../src/connection/health.js';
import { ConnectionState } from '../../../src/connection/types.js';

describe('ConnectionHealthTracker', () => {
  it('tracks state transitions and timestamps', () => {
    const tracker = new ConnectionHealthTracker();
    const states: string[] = [];

    const dispose = tracker.onStateChange((event) => {
      states.push(`${event.previous}->${event.current}`);
    });

    tracker.setState(ConnectionState.Connecting);
    tracker.setState(ConnectionState.Connected);
    tracker.markMessageSent();
    tracker.markMessageReceived();

    const health = tracker.getHealth();

    expect(states).toEqual(['disconnected->connecting', 'connecting->connected']);
    expect(health.lastMessageSent).not.toBeNull();
    expect(health.lastMessageReceived).not.toBeNull();

    dispose();
  });

  it('tracks heartbeat status and responsive transitions', () => {
    const tracker = new ConnectionHealthTracker();

    tracker.setHeartbeat({
      enabled: true,
      interval: 1000,
      timeout: 250,
      lastPing: new Date(),
      lastPong: null,
      isResponsive: false
    });

    tracker.markMessageReceived();
    const health = tracker.getHealth();

    expect(health.heartbeat?.enabled).toBe(true);
    expect(health.heartbeat?.isResponsive).toBe(true);
    expect(health.heartbeat?.lastPong).not.toBeNull();
  });

  it('emits detailed state change events', () => {
    const tracker = new ConnectionHealthTracker();
    const events: Array<{ previous: ConnectionState; current: ConnectionState; reason?: string }> =
      [];

    const dispose = tracker.onStateChange((event) => {
      events.push({
        previous: event.previous,
        current: event.current,
        reason: event.reason
      });
    });

    tracker.setState(ConnectionState.Connecting, 'startup');
    tracker.setState(ConnectionState.Connected, 'initialize-complete');

    expect(events).toEqual([
      {
        previous: ConnectionState.Disconnected,
        current: ConnectionState.Connecting,
        reason: 'startup'
      },
      {
        previous: ConnectionState.Connecting,
        current: ConnectionState.Connected,
        reason: 'initialize-complete'
      }
    ]);

    dispose();
  });
});
