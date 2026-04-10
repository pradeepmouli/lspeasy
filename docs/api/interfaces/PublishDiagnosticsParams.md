[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / PublishDiagnosticsParams

# Interface: PublishDiagnosticsParams

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1796

The publish diagnostic notification's parameters.

## Properties

### diagnostics

> **diagnostics**: [`Diagnostic`](Diagnostic.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1810

An array of diagnostic information items.

***

### uri

> **uri**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1800

The URI for which diagnostic information is reported.

***

### version?

> `optional` **version?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:1806

Optional the version number of the document the diagnostics are published for.

#### Since

3.15.0
