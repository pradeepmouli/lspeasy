import type { HeartbeatConfig, HeartbeatStatus } from './types.js';

export interface HeartbeatMonitorOptions {
  config: HeartbeatConfig;
  onPing: () => void;
  onUnresponsive: () => void;
  onResponsive?: () => void;
}

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

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

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

  getStatus(): HeartbeatStatus {
    return { ...this.status };
  }
}
