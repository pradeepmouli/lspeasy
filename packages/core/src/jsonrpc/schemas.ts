/**
 * Zod schemas for JSON-RPC message validation
 * Pattern: MCP SDK's z.discriminatedUnion for message types
 */

import { z } from 'zod';

/**
 * Schema for JSON-RPC 2.0 base message
 */
const baseMessageSchema = z.object({
  jsonrpc: z.literal('2.0')
});

/**
 * Schema for JSON-RPC 2.0 Request Message
 */
export const requestMessageSchema = baseMessageSchema.extend({
  id: z.union([z.string(), z.number()]),
  method: z.string(),
  params: z.unknown().optional()
});

/**
 * Schema for JSON-RPC 2.0 Notification Message
 */
export const notificationMessageSchema = baseMessageSchema.extend({
  method: z.string(),
  params: z.unknown().optional()
});

/**
 * Schema for JSON-RPC 2.0 Response Error
 */
export const responseErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
  data: z.unknown().optional()
});

/**
 * Schema for JSON-RPC 2.0 Success Response Message
 */
export const successResponseMessageSchema = baseMessageSchema.extend({
  id: z.union([z.string(), z.number()]),
  result: z.unknown()
});

/**
 * Schema for JSON-RPC 2.0 Error Response Message
 */
export const errorResponseMessageSchema = baseMessageSchema.extend({
  id: z.union([z.string(), z.number()]),
  error: responseErrorSchema
});

/**
 * Schema for JSON-RPC 2.0 Response Message (success or error)
 */
export const responseMessageSchema = z.union([
  successResponseMessageSchema,
  errorResponseMessageSchema
]);

/**
 * Schema for any JSON-RPC 2.0 Message
 * Uses discriminated union based on presence of 'method' and 'id'
 */
export const messageSchema = z.union([
  requestMessageSchema,
  notificationMessageSchema,
  successResponseMessageSchema,
  errorResponseMessageSchema
]);

/**
 * Type exports
 */
export type RequestMessage = z.infer<typeof requestMessageSchema>;
export type NotificationMessage = z.infer<typeof notificationMessageSchema>;
export type ResponseError = z.infer<typeof responseErrorSchema>;
export type SuccessResponseMessage = z.infer<typeof successResponseMessageSchema>;
export type ErrorResponseMessage = z.infer<typeof errorResponseMessageSchema>;
export type ResponseMessage = z.infer<typeof responseMessageSchema>;
export type Message = z.infer<typeof messageSchema>;
