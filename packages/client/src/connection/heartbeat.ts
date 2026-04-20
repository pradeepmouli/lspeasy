import type { HeartbeatConfig, HeartbeatStatus } from './types.js';

/**
 * Callback and configuration options for heartbeat monitoring.
 */
export interface HeartbeatMonitorOptions {
  config: HeartbeatConfig;
  onPing: () => void;
  onUnresponsive: () => void;
  onResponsive?: () => void;
}

/**
 * Runs interval-based heartbeat checks for active transports.
 *
 * @remarks
 * Created internally by `LSPClient` when `ClientOptions.heartbeat` is
 * configured. The monitor periodically sends a ping (via `onPing`) and checks
 * whether a pong was received within `timeout` ms. If not, `onUnresponsive`
 * is called so the client can close and attempt to reconnect.
 *
 * @useWhen
 * You need to detect silent transport failures — for example, when the server
 * process dies without closing the socket, leaving the client hanging
 * indefinitely on pending requests.
 *
 * @avoidWhen
 * The transport already provides its own keep-alive mechanism (e.g. WebSocket
 * ping frames) — adding a heartbeat on top creates redundant round-trips and
 * may interfere with the transport's own timeout logic.
 *
 * @never
 * NEVER set `interval` shorter than the typical round-trip latency for your
 * transport — doing so causes constant `onUnresponsive` callbacks on any
 * non-local transport, triggering spurious reconnects.
 *
 * NEVER rely on heartbeat for authentication or access control. The heartbeat
 * only confirms the transport is alive; it carries no identity information.
 *
 * @category Client
 */
export class HeartbeatMonitor {
  private timer: NodeJS.Timeout | undefined;
  private status: HeartbeatStatus;

  constructor(private readonly options: HeartbeatMonitorOptions) {
    this.status = {
      enabled: options.config.enabled ?? false,
      interval: options.config.interval,
      timeout: options.config.timeout,
      lastPing: null,
      lastPong: null,
      isResponsive: true
    };
  }

  /**
   * Starts heartbeat interval checks.
   */
  start(): void {
    if (!this.status.enabled || this.timer) {
      return;
    }

    this.timer = setInterval(() => {
      this.status = {
        ...this.status,
        lastPing: new Date()
      };

      this.options.onPing();

      const { lastPing, lastPong } = this.status;

      if (lastPing && lastPong && lastPing.getTime() - lastPong.getTime() > this.status.timeout) {
        this.status = {
          ...this.status,
          isResponsive: false
        };
        this.options.onUnresponsive();
      }
    }, this.status.interval);
  }

  /**
   * Stops heartbeat interval checks.
   */
  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  /**
   * Marks a successful heartbeat response.
   */
  markPong(): void {
    const wasUnresponsive = !this.status.isResponsive;
    this.status = {
      ...this.status,
      lastPong: new Date(),
      isResponsive: true
    };

    if (wasUnresponsive) {
      this.options.onResponsive?.();
    }
  }

  /**
   * Returns the latest heartbeat status snapshot.
   */
  getStatus(): HeartbeatStatus {
    return { ...this.status };
  }
}
