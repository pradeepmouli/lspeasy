[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / CodeLensWorkspaceClientCapabilities

# Interface: CodeLensWorkspaceClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2704

## Since

3.16.0

## Properties

### refreshSupport?

> `optional` **refreshSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:2714

Whether the client implementation supports a refresh request sent from the
server to the client.

Note that this event is global and will force the client to refresh all
code lenses currently shown. It should be used with absolute care and is
useful for situation where a server for example detect a project wide
change that requires such a calculation.
