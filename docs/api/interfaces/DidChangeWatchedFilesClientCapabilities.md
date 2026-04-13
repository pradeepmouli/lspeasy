[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DidChangeWatchedFilesClientCapabilities

# Interface: DidChangeWatchedFilesClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1610

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1616

Did change watched files notification supports dynamic registration. Please note
that the current protocol doesn't support static configuration for file changes
from the server side.

***

### relativePatternSupport?

> `optional` **relativePatternSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1623

Whether the client has support for [relative pattern](RelativePattern.md)
or not.

#### Since

3.17.0
