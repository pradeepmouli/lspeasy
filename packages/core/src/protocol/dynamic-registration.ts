import { z } from 'zod';

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

export const dynamicRegistrationSchema = z.object({
  id: z.string().min(1),
  method: z.string().min(1),
  registerOptions: z.unknown().optional()
});

export const registerCapabilityParamsSchema = z.object({
  registrations: z.array(dynamicRegistrationSchema)
});

export const unregisterCapabilitySchema = z.object({
  id: z.string().min(1),
  method: z.string().min(1)
});

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
