# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Middleware pipeline in core with composable, scoped, and typed middleware support
- Client/server middleware integration across request, response, notification, and error paths
- Native WebSocket client support in core transport (Node.js >= 22.4 and browser native APIs)
- Promise-based client `waitForNotification()` API with required timeout and optional filtering
- Connection health APIs in client (`onConnectionStateChange`, `onConnectionHealthChange`, `getConnectionHealth`)
- Optional heartbeat monitor for client connections
- Document sync helper utilities (`DocumentVersionTracker`, incremental/full didChange payload builders)
- `@lspeasy/middleware-pino` package with pino-compatible logging middleware
- Unit and e2e tests for middleware, websocket behavior, notification waiting, and connection health
- Dynamic capability registration/unregistration support (`client/registerCapability`, `client/unregisterCapability`) with strict-by-default behavior
- New transports: TCP, IPC, Dedicated Worker, and Shared Worker
- Client/server partial-result ergonomics (`sendRequestWithPartialResults`, `PartialResultSender`) and notebook namespace helpers

### Changed
- `@lspeasy/core` now treats `ws` as an optional peer dependency for client-native usage
- Package documentation updated for middleware APIs, native WebSocket requirements, and helper utilities

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- None

## [0.1.0] - 2025-12-19

### Added
- Initial release
- TypeScript project template
- Basic project structure
