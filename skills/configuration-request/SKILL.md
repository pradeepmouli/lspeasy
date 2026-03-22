---
name: configuration-request
description: "The 'workspace/configuration' request is sent from the server to the client to fetch a certain
configuration setting.

This pull model replaces the old push model were the client signaled configuration change via an
event. If the server still needs to react to configuration changes (since the server caches the
result of `workspace/configuration` requests) the server should register for an empty configuration
change event and empty the cache if such an event is received. Keywords: lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server."
license: MIT
---

# ConfigurationRequest

The 'workspace/configuration' request is sent from the server to the client to fetch a certain
configuration setting.

This pull model replaces the old push model were the client signaled configuration change via an
event. If the server still needs to react to configuration changes (since the server caches the
result of `workspace/configuration` requests) the server should register for an empty configuration
change event and empty the cache if such an event is received.

## When to Use

- Typing with `HandlerSignature`, `MiddlewareSignature`

## Quick Reference

**2 types** — `HandlerSignature`, `MiddlewareSignature`

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli