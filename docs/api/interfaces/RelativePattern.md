[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RelativePattern

# Interface: RelativePattern

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1702

A relative pattern is a helper to construct glob patterns that are matched
relatively to a base URI. The common value for a `baseUri` is a workspace
folder root, but it can be another absolute URI as well.

## Since

3.17.0

## Properties

### baseUri

> **baseUri**: `string` \| [`WorkspaceFolder`](WorkspaceFolder.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1707

A workspace folder or a base URI to which this pattern will be matched
against relatively.

***

### pattern

> **pattern**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1711

The actual glob pattern;
