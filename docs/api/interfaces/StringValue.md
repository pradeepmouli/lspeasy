[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / StringValue

# Interface: StringValue

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2927

A string value used as a snippet is a template which allows to insert text
and to control the editor cursor when insertion happens.

A snippet can define tab stops and placeholders with `$1`, `$2`
and `${3:foo}`. `$0` defines the final tab stop, it defaults to
the end of the snippet. Variables are defined with `$name` and
`${name:default value}`.

## Since

3.18.0

## Proposed

## Properties

### kind

> **kind**: `"snippet"`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2931

The kind of string value.

***

### value

> **value**: `string`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:2935

The snippet string.
