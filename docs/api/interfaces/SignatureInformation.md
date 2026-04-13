[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / SignatureInformation

# Interface: SignatureInformation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1674

Represents the signature of something callable. A signature
can have a label, like a function-name, a doc-comment, and
a set of parameters.

## Properties

### activeParameter?

> `optional` **activeParameter?**: `number`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1696

The index of the active parameter.

If provided, this is used in place of `SignatureHelp.activeParameter`.

#### Since

3.16.0

***

### documentation?

> `optional` **documentation?**: `string` \| [`MarkupContent`](MarkupContent.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1684

The human-readable doc-comment of this signature. Will be shown
in the UI but can be omitted.

***

### label

> **label**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1679

The label of this signature. Will be shown in
the UI.

***

### parameters?

> `optional` **parameters?**: [`ParameterInformation`](ParameterInformation.md)[]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1688

The parameters of this signature.
