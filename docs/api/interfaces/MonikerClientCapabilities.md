[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MonikerClientCapabilities

# Interface: MonikerClientCapabilities

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:81

Client capabilities specific to the moniker request.

## Since

3.16.0

## Properties

### dynamicRegistration?

> `optional` **dynamicRegistration?**: `boolean`

Defined in: node\_modules/.pnpm/vscode-languageserver-protocol@3.17.5/node\_modules/vscode-languageserver-protocol/lib/common/protocol.moniker.d.ts:87

Whether moniker supports dynamic registration. If this is set to `true`
the client supports the new `MonikerRegistrationOptions` return value
for the corresponding server capability as well.
