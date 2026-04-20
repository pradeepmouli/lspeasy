/**
 * Type inference utilities for extracting params/result types from LSP method names
 *
 * Uses mapped types and lookups instead of nested conditionals
 */

import type { ClientCapabilities, ServerCapabilities } from 'vscode-languageserver-protocol';
import { LSPRequest, LSPNotification } from './namespaces.js';
import type { Paths, UnionToIntersection, ConditionalKeys, KeyAsString } from 'type-fest';

// Helper type to flatten nested method types into a flat map
type FlattenMethods<T, IncludeProposed> = {
  [K in keyof T]: T[K] extends { Method: infer M }
    ? T[K] extends { Proposed: true }
      ? IncludeProposed extends true
        ? { [P in M & string]: T[K] }
        : never
      : { [P in M & string]: T[K] }
    : T[K] extends Record<string, any>
      ? FlattenMethods<T[K], IncludeProposed>
      : never;
}[keyof T];

//@ts-ignore - TS bug workaround
type FlatRequestMap = UnionToIntersection<FlattenMethods<LSPRequest, false>>;
//@ts-ignore - TS bug workaround
type FlatNotificationMap = UnionToIntersection<FlattenMethods<LSPNotification, false>>;

/**
 * Union type of all valid LSP request method names
 */
export type LSPRequestMethod<
  Direction extends 'clientToServer' | 'serverToClient' | 'both' = 'both'
> = Direction extends 'both'
  ? KeyAsString<FlatRequestMap>
  : ConditionalKeys<FlatRequestMap, { Direction: Direction | 'both' }> & string;

/**
 * Union type of all valid LSP notification method names
 */
export type LSPNotificationMethod<
  Direction extends 'clientToServer' | 'serverToClient' | 'both' = 'both'
> = Direction extends 'both'
  ? KeyAsString<FlatNotificationMap>
  : ConditionalKeys<FlatNotificationMap, { Direction: Direction | 'both' }> & string;

/**
 * Infer request parameters from method name
 *
 * @example
 * type HoverParams = InferRequestParams<'textDocument/hover'>
 * // Resolves to: HoverParams from vscode-languageserver-protocol
 */
export type ParamsForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M]['Params']
  : never;

/**
 * Infer request result from method name
 *
 * @example
 * type HoverResult = InferRequestResult<'textDocument/hover'>
 * // Resolves to: Hover | null
 */
export type ResultForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M]['Result']
  : never;

/**
 * Resolves the `ServerCapabilities` path key required to enable a given LSP request method.
 *
 * @typeParam M - An LSP request method string.
 */
export type ServerCapabilityForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { ServerCapability: infer C }
    ? C
    : never
  : never;

/**
 * Resolves the `ClientCapabilities` path key required for a client to send a given LSP request.
 *
 * @typeParam M - An LSP request method string.
 */
export type ClientCapabilityForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { ClientCapability: infer C }
    ? C
    : never
  : never;

/**
 * Infer notification parameters from method name
 *
 * @example
 * type DidOpenParams = InferNotificationParams<'textDocument/didOpen'>
 * // Resolves to: DidOpenTextDocumentParams from vscode-languageserver-protocol
 */
export type ParamsForNotification<M extends string> = M extends LSPNotificationMethod
  ? FlatNotificationMap[M]['Params']
  : never;

/**
 * Resolves the `ServerCapabilities` path key required to enable a given LSP notification method.
 *
 * @typeParam M - An LSP notification method string.
 */
export type ServerCapabilityForNotification<M extends string> = M extends LSPNotificationMethod
  ? FlatNotificationMap[M] extends { ServerCapability: infer C }
    ? C
    : never
  : never;

/**
 * Resolves the `ClientCapabilities` path key required for a client to handle a given LSP notification.
 *
 * @typeParam M - An LSP notification method string.
 */
export type ClientCapabilityForNotification<M extends string> = M extends LSPNotificationMethod
  ? FlatNotificationMap[M] extends { ClientCapability: infer C }
    ? C
    : never
  : never;

/**
 * Resolves the registration options type for a given LSP request method.
 *
 * @typeParam M - An LSP request method string.
 */
export type OptionsForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { Options: infer O }
    ? O
    : never
  : never;

/**
 * Resolves the dynamic registration options type for a given LSP request method.
 *
 * @typeParam M - An LSP request method string.
 */
export type RegistrationOptionsForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { RegistrationOptions: infer R }
    ? R
    : never
  : never;

/**
 * Resolves the message direction (`'clientToServer'` | `'serverToClient'` | `'both'`)
 * for a given LSP request method.
 *
 * @typeParam M - An LSP request method string.
 */
export type DirectionForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { Direction: infer D }
    ? D
    : never
  : never;

/**
 * Resolves the message direction for a given LSP notification method.
 *
 * @typeParam M - An LSP notification method string.
 */
export type DirectionForNotification<M extends string> = M extends LSPNotificationMethod
  ? FlatNotificationMap[M] extends { Direction: infer D }
    ? D
    : never
  : never;

/**
 * Type inference benefits:
 *
 * 1. Zero manual mapping - types inferred directly from type definitions
 * 2. Single source of truth - add a type, get automatic type support
 * 3. Automatic flattening - no need to manually update conditionals
 * 4. Compile-time validation - invalid method names caught by union types
 *
 * Adding new methods:
 * 1. Define type (e.g., LSPRequest['TextDocument']['NewFeature'])
 * 2. Types automatically available through lookup
 * → Automatically works in onRequest/sendRequest signatures
 */

const RequestMap = Object.values(LSPRequest).flatMap((ns) => Object.values(ns));

const NotificationMap = Object.values(LSPNotification).flatMap((ns) => Object.values(ns));

/**
 * Runtime map from every LSP request method string to its metadata
 * (direction, server capability, client capability).
 */
export const RequestMethodMap: Map<
  LSPRequestMethod,
  {
    Direction: DirectionForRequest<LSPRequestMethod>;
    ServerCapability?: ServerCapabilityForRequest<LSPRequestMethod>;
    ClientCapability?: ClientCapabilityForRequest<LSPRequestMethod>;
  }
> = new Map(RequestMap.map((p) => [p.Method, p]));

/**
 * Runtime map from every LSP notification method string to its metadata
 * (direction, server capability, client capability).
 */
export const NotificationMethodMap: Map<
  LSPNotificationMethod,
  {
    Direction: DirectionForNotification<LSPNotificationMethod>;
    ServerCapability?: ServerCapabilityForNotification<LSPNotificationMethod>;
    ClientCapability?: ClientCapabilityForNotification<LSPNotificationMethod>;
  }
> = new Map(NotificationMap.map((p) => [p.Method, p]));

/**
 * Get the capability key for a given method at runtime
 */
export function getCapabilityForRequestMethod<
  M extends LSPRequestMethod<D>,
  D extends 'clientToServer' | 'serverToClient' | 'both' = 'both'
>(method: M, _direction: D = 'both' as D): Paths<ServerCapabilities> | 'alwaysOn' {
  const entry = RequestMethodMap.get(method);
  return entry?.ServerCapability ?? 'alwaysOn'; //TODO: fix namespaces.ts generation to actually align ServerCapability with ServerCapabilities keys
}

/**
 * Get the client capability key for a given request method at runtime
 */
export function getClientCapabilityForRequestMethod<
  M extends LSPRequestMethod<D>,
  D extends 'clientToServer' | 'serverToClient' | 'both' = 'both'
>(method: M, _direction: D = 'both' as D): Paths<ClientCapabilities> | 'alwaysOn' {
  const entry = RequestMethodMap.get(method);
  return (entry?.ClientCapability as Paths<ClientCapabilities> | undefined) ?? 'alwaysOn';
}

/**
 * Get the capability key for a given notification method at runtime
 */
export function getCapabilityForNotificationMethod<
  M extends LSPNotificationMethod<D>,
  D extends 'clientToServer' | 'serverToClient' | 'both' = 'both'
>(method: M, _direction: D = 'both' as D): Paths<ServerCapabilities> | 'alwaysOn' {
  const entry = NotificationMethodMap.get(method);
  return entry?.ServerCapability ?? 'alwaysOn';
}

/**
 * Get the client capability key for a given notification method at runtime
 */
export function getClientCapabilityForNotificationMethod<
  M extends LSPNotificationMethod<D>,
  D extends 'clientToServer' | 'serverToClient' | 'both' = 'both'
>(method: M, _direction: D = 'both' as D): Paths<ClientCapabilities> | 'alwaysOn' {
  const entry = NotificationMethodMap.get(method);
  return (entry?.ClientCapability as Paths<ClientCapabilities> | undefined) ?? 'alwaysOn';
}

/**
 * The shape of a single LSP request definition entry (method, params, result,
 * direction, capability keys). Represents the structure of entries in the
 * `LSPRequest` namespace objects.
 */
export type RequestDefinition = typeof LSPRequest.CallHierarchy.IncomingCalls;

/**
 * Retrieves the full definition object for a given LSP request method by
 * namespace and method key.
 *
 * @param namespace - A top-level key of `LSPRequest` (e.g. `'TextDocument'`).
 * @param methodKey - A method key within that namespace (e.g. `'Hover'`).
 * @returns The definition object containing `Method`, `Params`, `Result`,
 *   `Direction`, and optional capability keys.
 */
export function getDefinitionForRequest<
  N extends keyof typeof LSPRequest,
  M extends keyof (typeof LSPRequest)[N]
>(namespace: N, methodKey: M): (typeof LSPRequest)[N][M] {
  return (LSPRequest[namespace] as any)[methodKey];
}

/**
 * Retrieves the full definition object for a given LSP notification method by
 * namespace and method key.
 *
 * @param namespace - A top-level key of `LSPNotification` (e.g. `'TextDocument'`).
 * @param methodKey - A method key within that namespace (e.g. `'DidOpen'`).
 * @returns The definition object containing `Method`, `Params`, `Direction`,
 *   and optional capability keys.
 */
export function getDefinitionForNotification<
  N extends keyof typeof LSPNotification,
  M extends keyof (typeof LSPNotification)[N]
>(namespace: N, methodKey: M): (typeof LSPNotification)[N][M] {
  return (LSPNotification[namespace] as any)[methodKey];
}
