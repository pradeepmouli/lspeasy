[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / ParameterInformation

# Interface: ParameterInformation

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1638

Represents a parameter of a callable-signature. A parameter can
have a label and a doc-comment.

## Properties

### documentation?

> `optional` **documentation?**: `string` \| [`MarkupContent`](MarkupContent.md)

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1654

The human-readable doc-comment of this parameter. Will be shown
in the UI but can be omitted.

***

### label

> **label**: `string` \| \[`number`, `number`\]

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1649

The label of this parameter information.

Either a string or an inclusive start and exclusive end offsets within its containing
signature label. (see SignatureInformation.label). The offsets are based on a UTF-16
string representation as `Position` and `Range` does.

*Note*: a label of type string should be a substring of its containing signature label.
Its intended use case is to highlight the parameter label part in the `SignatureInformation.label`.
