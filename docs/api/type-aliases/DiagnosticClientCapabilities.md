[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / DiagnosticClientCapabilities

# Type Alias: DiagnosticClientCapabilities

> **DiagnosticClientCapabilities** = `object`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:10

Client capabilities specific to diagnostic pull requests.

## Since

3.17.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:16

Whether implementation supports dynamic registration. If this is set to `true`
the client supports the new `(TextDocumentRegistrationOptions & StaticRegistrationOptions)`
return value for the corresponding server capability as well.

***

### relatedDocumentSupport?

> `optional` **relatedDocumentSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.diagnostic.d.ts:20

Whether the clients supports related documents for document diagnostic pulls.
