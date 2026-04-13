[**lspeasy v1.0.0**](../README.md)

***

[lspeasy](../README.md) / MarkedString

# ~~Type Alias: MarkedString~~

> **MarkedString** = `string` \| \{ `language`: `string`; `value`: `string`; \}

Defined in: node\_modules/.pnpm/vscode-languageserver-types@3.17.5/node\_modules/vscode-languageserver-types/lib/esm/main.d.ts:1598

MarkedString can be used to render human readable text. It is either a markdown string
or a code-block that provides a language and a code snippet. The language identifier
is semantically equal to the optional language identifier in fenced code blocks in GitHub
issues. See https://help.github.com/articles/creating-and-highlighting-code-blocks/#syntax-highlighting

The pair of a language and a value is an equivalent to markdown:
```${language}
${value}
```

Note that markdown strings will be sanitized - that means html will be escaped.

## Deprecated

use MarkupContent instead.
