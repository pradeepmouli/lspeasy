# Request Timeout Contract

## Configuration
- Default request timeout is configurable via client/server options.
- If no timeout is configured, requests do not time out by default.

## Behavior
- When a timeout is set, pending requests reject with a timeout error after expiration.
- Timeouts are cleared on request resolution or rejection.
