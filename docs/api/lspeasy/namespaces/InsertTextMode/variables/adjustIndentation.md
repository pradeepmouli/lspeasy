[**lspeasy v1.0.0**](../../../../README.md)

***

[lspeasy](../../../../README.md) / [InsertTextMode](../README.md) / adjustIndentation

# Variable: adjustIndentation

> `const` **adjustIndentation**: `2`

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1309

The editor adjusts leading whitespace of new lines so that
they match the indentation up to the cursor of the line for
which the item is accepted.

Consider a line like this: <2tabs><cursor><3tabs>foo. Accepting a
multi line completion item is indented using 2 tabs and all
following lines inserted will be indented using 2 tabs as well.
