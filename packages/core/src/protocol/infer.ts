/**
 * Type inference utilities for extracting params/result types from LSP method names
 *
 * Uses mapped types and lookups instead of nested conditionals
 */

import type { LSPRequestMethod, ServerCapabilities } from '@/core';
import { LSPRequest, LSPNotification } from './namespaces.js';
import type { UnionToIntersection } from 'type-fest';

// Helper type to flatten nested method types into a flat map
type FlattenMethods<T> = {
  [K in keyof T]: T[K] extends { Method: infer M }
    ? { [P in M & string]: T[K] }
    : T[K] extends Record<string, any>
      ? FlattenMethods<T[K]>
      : never;
}[keyof T];

//@ts-ignore - TS bug workaround
type FlatRequestMap = UnionToIntersection<FlattenMethods<LSPRequest>>;
//@ts-ignore - TS bug workaround
type FlatNotificationMap = UnionToIntersection<FlattenMethods<LSPNotification>>;

/**
 * Union type of all valid LSP request method names
 */
export type M = keyof FlatRequestMap;

/**
 * Union type of all valid LSP notification method names
 */
export type LSPNotificationMethod = keyof FlatNotificationMap;

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

export type ServerCapabilityForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { ServerCapability: infer C }
    ? C
    : never
  : never;

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

export type ServerCapabilityForNotification<M extends string> = M extends LSPNotificationMethod
  ? FlatNotificationMap[M] extends { ServerCapability: infer C }
    ? C
    : never
  : never;

export type OptionsForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { Options: infer O }
    ? O
    : never
  : never;

export type RegistrationOptionsForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { RegistrationOptions: infer R }
    ? R
    : never
  : never;

export type DirectionForRequest<M extends string> = M extends LSPRequestMethod
  ? FlatRequestMap[M] extends { Direction: infer D }
    ? D
    : never
  : never;

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

type ValuesOf<T> = T[keyof T];

type RequestMethods = ValuesOf<typeof LSPRequest>;

const RequestMap: {
  Method: LSPRequestMethod;
  Direction: DirectionForRequest<LSPRequestMethod>;
  ServerCapability: ServerCapabilityForRequest<LSPRequestMethod>;
}[] = Object.values(LSPRequest).flatMap((ns) => Object.values(ns));

const NotificationMap: {
  Method: LSPNotificationMethod;
  Direction: DirectionForNotification<LSPNotificationMethod>;
  ServerCapability: ServerCapabilityForNotification<LSPNotificationMethod>;
}[] = Object.values(LSPNotification).flatMap((ns) => Object.values(ns));

export const RequestMethodMap: Map<
  LSPRequestMethod,
  {
    Direction: DirectionForRequest<LSPRequestMethod>;
    ServerCapability: ServerCapabilityForRequest<LSPRequestMethod>;
  }
> = new Map(RequestMap.map((p) => [p.Method, p]));

export const NotificationMethodMap: Map<
  LSPNotificationMethod,
  {
    Direction: DirectionForNotification<LSPNotificationMethod>;
    ServerCapability: ServerCapabilityForNotification<LSPNotificationMethod>;
  }
> = new Map(NotificationMap.map((p) => [p.Method, p]));

/**
 * Get the capability key for a given method at runtime
 */
export function getCapabilityForRequest(
  method: LSPRequestMethod
): keyof ServerCapabilities | 'alwaysOn' {
  const entry = RequestMethodMap.get(method);
  return entry?.ServerCapability ?? ('alwaysOn' as any); //TODO: fix namespaces.ts generation to actually align ServerCapability with ServerCapabilities keys
}

/**
 * Get the capability key for a given notification method at runtime
 */
export function getCapabilityForNotification(
  method: LSPNotificationMethod
): keyof ServerCapabilities | undefined {
  const entry = NotificationMethodMap.get(method);
  return entry?.ServerCapability;
}
