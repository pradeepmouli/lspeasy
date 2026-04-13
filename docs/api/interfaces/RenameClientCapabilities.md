[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / RenameClientCapabilities

# Interface: RenameClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3019

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3023

Whether rename supports dynamic registration.

***

### honorsChangeAnnotations?

> `optional` **honorsChangeAnnotations?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3049

Whether the client honors the change annotations in
text edits and resource operations returned via the
rename request's workspace edit by for example presenting
the workspace edit in the user interface and asking
for confirmation.

#### Since

3.16.0

***

### prepareSupport?

> `optional` **prepareSupport?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3030

Client supports testing for validity of rename operations
before execution.

#### Since

3.12.0

***

### prepareSupportDefaultBehavior?

> `optional` **prepareSupportDefaultBehavior?**: `1`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.d.ts:3039

Client supports the default behavior result.

The value indicates the default behavior used by the
client.

#### Since

3.16.0
