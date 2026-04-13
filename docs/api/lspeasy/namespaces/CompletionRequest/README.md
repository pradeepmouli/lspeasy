[**lspeasy v1.0.0**](../../../README.md)

***

[lspeasy](../../../README.md) / CompletionRequest

# CompletionRequest

Request to request completion at a given text document position. The request's
parameter is of type TextDocumentPosition the response
is of type [CompletionItem\[\]](../../../interfaces/CompletionItem.md) or [CompletionList](../../../interfaces/CompletionList.md)
or a Thenable that resolves to such.

The request can delay the computation of the [\`detail\`](../../../interfaces/CompletionItem.md#detail)
and [\`documentation\`](../../../interfaces/CompletionItem.md#documentation) properties to the `completionItem/resolve`
request. However, properties that are needed for the initial sorting and filtering, like `sortText`,
`filterText`, `insertText`, and `textEdit`, must not be changed during resolve.

## Variables

- [messageDirection](variables/messageDirection.md)
- [method](variables/method.md)
- [type](variables/type.md)
