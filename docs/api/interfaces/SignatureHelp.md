[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SignatureHelp

# Interface: SignatureHelp

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1710

Signature help represents the signature of something
callable. There can be multiple signature but only one
active and only one active parameter.

## Properties

### activeParameter?

> `optional` **activeParameter?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1736

The active parameter of the active signature. If omitted or the value
lies outside the range of `signatures[activeSignature].parameters`
defaults to 0 if the active signature has parameters. If
the active signature has no parameters it is ignored.
In future version of the protocol this property might become
mandatory to better express the active parameter if the
active signature does have any.

***

### activeSignature?

> `optional` **activeSignature?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1726

The active signature. If omitted or the value lies outside the
range of `signatures` the value defaults to zero or is ignored if
the `SignatureHelp` has no signatures.

Whenever possible implementors should make an active decision about
the active signature and shouldn't rely on a default value.

In future version of the protocol this property might become
mandatory to better express this.

***

### signatures

> **signatures**: [`SignatureInformation`](SignatureInformation.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1714

One or more signatures.
