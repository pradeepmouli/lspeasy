# Data Model: LSP Protocol Compliance Gaps

**Date**: 2026-02-12
**Spec**: [spec.md](./spec.md)

## 1) DynamicRegistration

- **Fields**:
  - `id: string`
  - `method: string`
  - `registerOptions?: unknown`
  - `source: 'static' | 'dynamic'`
  - `createdAt: number`
- **Validation rules**:
  - `id` must be unique in active dynamic registrations.
  - `method` must map to known LSP request/notification capability shape.
- **State transitions**:
  - `created -> active -> removed`

## 2) RegistrationStore

- **Fields**:
  - `dynamicById: Map<string, DynamicRegistration>`
  - `staticCapabilities: ServerCapabilities`
  - `compatibilityMode: boolean`
- **Behavior**:
  - Merge static + dynamic capability view.
  - Resolve by method and optional document selector.
  - Reject unsupported dynamic registration in strict mode.

## 3) TransportSession

- **Fields**:
  - `transportType: 'tcp' | 'ipc' | 'dedicated-worker' | 'shared-worker'`
  - `state: 'connecting' | 'connected' | 'closing' | 'closed'`
  - `supportsReconnect: boolean`
  - `lastError?: Error`
- **Validation rules**:
  - Message send allowed only in `connected`.
  - Close is idempotent.

## 4) SharedWorkerClientChannel

- **Fields**:
  - `clientId: string`
  - `port: MessagePort`
  - `activeRequests: Set<string | number>`
- **Validation rules**:
  - Responses and notifications are scoped to originating `clientId/port`.
  - No cross-client event leakage.

## 5) PartialResultCollector

- **Fields**:
  - `requestId: string | number`
  - `token: string | number`
  - `partials: unknown[]`
  - `completed: boolean`
  - `cancelled: boolean`
  - `finalResult?: unknown`
- **State transitions**:
  - `collecting -> completed`
  - `collecting -> cancelled`
- **Rules**:
  - Preserve arrival order.
  - Ignore partials after completion.

## 6) CancelledPartialResult

- **Fields**:
  - `cancelled: true`
  - `partialResults: unknown[]`
  - `finalResult?: undefined`
- **Usage**:
  - Return shape for cancelled operations with collected partials.

## 7) NotebookSyncBinding

- **Fields**:
  - `notebookUri: string`
  - `notebookType: string`
  - `cells: Array<{ uri: string; languageId: string }>`
  - `open: boolean`
- **Rules**:
  - Structural + content updates may be processed in one change event.
  - Handlers exposed through `notebookDocument` namespace.

## Relationship Overview

- `RegistrationStore` owns many `DynamicRegistration` entries.
- `TransportSession` may reference one or more `SharedWorkerClientChannel` entries in shared-worker mode.
- `PartialResultCollector` is indexed by request token/request id and tied to a live `TransportSession`.
- `NotebookSyncBinding` is maintained by server runtime and updated by notebook document notifications.
