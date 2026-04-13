[**lspeasy v1.0.0**](../../../README.md)

***

[lspeasy](../../../README.md) / DidOpenTextDocumentNotification

# DidOpenTextDocumentNotification

The document open notification is sent from the client to the server to signal
newly opened text documents. The document's truth is now managed by the client
and the server must not try to read the document's truth using the document's
uri. Open in this sense means it is managed by the client. It doesn't necessarily
mean that its content is presented in an editor. An open notification must not
be sent more than once without a corresponding close notification send before.
This means open and close notification must be balanced and the max open count
is one.

## Variables

- [messageDirection](variables/messageDirection.md)
- [method](variables/method.md)
- [type](variables/type.md)
