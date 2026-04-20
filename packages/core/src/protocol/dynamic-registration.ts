import { z } from 'zod';

/**
 * A single LSP dynamic capability registration entry.
 *
 * @remarks
 * Sent by the server in a `client/registerCapability` request. The `id` is used
 * later to unregister the capability via `client/unregisterCapability`.
 */
export interface DynamicRegistration {
  /** Unique identifier for this registration, used to unregister it later. */
  id: string;
  /** The LSP method this registration applies to. */
  method: string;
  /** Optional method-specific registration options. */
  registerOptions?: unknown;
}

/** Controls compatibility behavior for dynamic registrations not declared by client capabilities. */
export interface DynamicRegistrationBehavior {
  /**
   * When `true`, the client accepts dynamic registrations for capabilities it did not declare
   * in the `initialize` request. Useful for compatibility with servers that over-register.
   */
  allowUndeclaredDynamicRegistration?: boolean;
}

/** Params payload for `client/registerCapability`. */
export interface RegisterCapabilityParams {
  /** The capability registrations to apply. */
  registrations: DynamicRegistration[];
}

/** Entry used by `client/unregisterCapability`. */
export interface UnregisterCapability {
  /** The registration `id` returned by the original `client/registerCapability` request. */
  id: string;
  /** The LSP method to unregister. */
  method: string;
}

/** Params payload for `client/unregisterCapability`. */
export interface UnregisterCapabilityParams {
  /** The capability unregistration entries to apply. */
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

/**
 * Runtime guard for register-capability params.
 *
 * @param value - The unknown value to test.
 * @returns `true` when `value` is a valid `RegisterCapabilityParams` object.
 */
export function isRegisterCapabilityParams(value: unknown): value is RegisterCapabilityParams {
  return registerCapabilityParamsSchema.safeParse(value).success;
}

/**
 * Runtime guard for unregister-capability params.
 *
 * @param value - The unknown value to test.
 * @returns `true` when `value` is a valid `UnregisterCapabilityParams` object.
 */
export function isUnregisterCapabilityParams(value: unknown): value is UnregisterCapabilityParams {
  return unregisterCapabilityParamsSchema.safeParse(value).success;
}
