[**lspeasy v1.0.0**](../../../README.md)

***

[lspeasy](../../../README.md) / DidCloseTextDocumentNotification

# DidCloseTextDocumentNotification

The document close notification is sent from the client to the server when
the document got closed in the client. The document's truth now exists where
the document's uri points to (e.g. if the document's uri is a file uri the
truth now exists on disk). As with the open notification the close notification
is about managing the document's content. Receiving a close notification
doesn't mean that the document was open in an editor before. A close
notification requires a previous open notification to be sent.

## Variables

- [messageDirection](variables/messageDirection.md)
- [method](variables/method.md)
- [type](variables/type.md)
