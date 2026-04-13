[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / WindowClientCapabilities

# Interface: WindowClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:544

## Properties

### showDocument?

> `optional` **showDocument?**: [`ShowDocumentClientCapabilities`](ShowDocumentClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:568

Capabilities specific to the showDocument request.

#### Since

3.16.0

***

### showMessage?

> `optional` **showMessage?**: [`ShowMessageRequestClientCapabilities`](ShowMessageRequestClientCapabilities.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:562

Capabilities specific to the showMessage request.

#### Since

3.16.0

***

### workDoneProgress?

> `optional` **workDoneProgress?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:556

It indicates whether the client supports server initiated
progress using the `window/workDoneProgress/create` request.

The capability also controls Whether client supports handling
of progress notifications. If set servers are allowed to report a
`workDoneProgress` property in the request specific server
capabilities.

#### Since

3.15.0
