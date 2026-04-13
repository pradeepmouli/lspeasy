[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PublishDiagnosticsClientCapabilities

# Interface: PublishDiagnosticsClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1754

The publish diagnostic client capabilities.

## Properties

### codeDescriptionSupport?

> `optional` **codeDescriptionSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1783

Client supports a codeDescription property

#### Since

3.16.0

***

### dataSupport?

> `optional` **dataSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1791

Whether code action supports the `data` property which is
preserved between a `textDocument/publishDiagnostics` and
`textDocument/codeAction` request.

#### Since

3.16.0

***

### relatedInformation?

> `optional` **relatedInformation?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1758

Whether the clients accepts diagnostics with related information.

***

### tagSupport?

> `optional` **tagSupport?**: `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1765

Client supports the tag property to provide meta data about a diagnostic.
Clients supporting tags have to handle unknown tags gracefully.

#### valueSet

> **valueSet**: [`DiagnosticTag`](../type-aliases/DiagnosticTag.md)[]

The tags supported by the client.

#### Since

3.15.0

***

### versionSupport?

> `optional` **versionSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1777

Whether the client interprets the version property of the
`textDocument/publishDiagnostics` notification's parameter.

#### Since

3.15.0
