# Request ID Contract

## Format
- Request IDs are strings (UUID-like) and must be unique per client/server instance.

## Behavior
- IDs are assigned when creating a pending request.
- IDs are used for request/response correlation and cancellation.
