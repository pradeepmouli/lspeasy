[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / InlayHintWorkspaceClientCapabilities

# Type Alias: InlayHintWorkspaceClientCapabilities

> **InlayHintWorkspaceClientCapabilities** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.d.ts:31

Client workspace capabilities specific to inlay hints.

## Since

3.17.0

## Properties

### refreshSupport?

> `optional` **refreshSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.inlayHint.d.ts:41

Whether the client implementation supports a refresh request sent from
the server to the client.

Note that this event is global and will force the client to refresh all
inlay hints currently shown. It should be used with absolute care and
is useful for situation where a server for example detects a project wide
change that requires such a calculation.
