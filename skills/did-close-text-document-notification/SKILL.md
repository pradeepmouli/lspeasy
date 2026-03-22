---
name: did-close-text-document-notification
description: "The document close notification is sent from the client to the server when
the document got closed in the client. The document's truth now exists where
the document's uri points to (e.g. if the document's uri is a file uri the
truth now exists on disk). As with the open notification the close notification
is about managing the document's content. Receiving a close notification
doesn't mean that the document was open in an editor before. A close
notification requires a previous open notification to be sent. Keywords: lsp, language-server-protocol, sdk, language-server, lsp-client, lsp-server."
license: MIT
---

# DidCloseTextDocumentNotification

The document close notification is sent from the client to the server when
the document got closed in the client. The document's truth now exists where
the document's uri points to (e.g. if the document's uri is a file uri the
truth now exists on disk). As with the open notification the close notification
is about managing the document's content. Receiving a close notification
doesn't mean that the document was open in an editor before. A close
notification requires a previous open notification to be sent.

## Links

- [Repository](https://github.com/pradeepmouli/lspeasy)
- Author: Pradeep Mouli