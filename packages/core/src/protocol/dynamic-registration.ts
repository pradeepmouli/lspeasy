import { z } from 'zod';

/**
 * A single LSP dynamic capability registration entry.
 *
 * @remarks
 * Sent by the server in a `client/registerCapability` request. The `id` is used
 * later to unregister the capability via `client/unregisterCapability`.
 */
export interface DynamicRegistration {
  id: string;
  method: string;
  registerOptions?: unknown;
}

/** Controls compatibility behavior for dynamic registrations not declared by client capabilities. */
export interface DynamicRegistrationBehavior {
  allowUndeclaredDynamicRegistration?: boolean;
}

/** Params payload for `client/registerCapability`. */
export interface RegisterCapabilityParams {
  registrations: DynamicRegistration[];
}

/** Entry used by `client/unregisterCapability`. */
export interface UnregisterCapability {
  id: string;
  method: string;
}

/** Params payload for `client/unregisterCapability`. */
export interface UnregisterCapabilityParams {
  unregisterations: UnregisterCapability[];
}

/** Zod schema for validating a single dynamic-registration entry. */
export const dynamicRegistrationSchema = z.object({
  id: z.string().min(1),
  method: z.string().min(1),
  registerOptions: z.unknown().optional()
});

/** Zod schema for validating `client/registerCapability` params. */
export const registerCapabilityParamsSchema = z.object({
  registrations: z.array(dynamicRegistrationSchema)
});

/** Zod schema for validating a single capability unregistration entry. */
export const unregisterCapabilitySchema = z.object({
  id: z.string().min(1),
  method: z.string().min(1)
});

/** Zod schema for validating `client/unregisterCapability` params. */
export const unregisterCapabilityParamsSchema = z.object({
  unregisterations: z.array(unregisterCapabilitySchema)
});

/** Runtime guard for register-capability params. */
export function isRegisterCapabilityParams(value: unknown): value is RegisterCapabilityParams {
  return registerCapabilityParamsSchema.safeParse(value).success;
}

/** Runtime guard for unregister-capability params. */
export function isUnregisterCapabilityParams(value: unknown): value is UnregisterCapabilityParams {
  return unregisterCapabilityParamsSchema.safeParse(value).success;
}
