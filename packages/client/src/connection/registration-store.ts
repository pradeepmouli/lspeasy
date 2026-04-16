import type { DynamicRegistration } from '@lspeasy/core';

/** In-memory registry for active dynamic capability registrations keyed by registration id. */
export class RegistrationStore {
  private readonly registrationsById = new Map<string, DynamicRegistration>();

  upsert(registration: DynamicRegistration): void {
    this.registrationsById.set(registration.id, registration);
  }

  remove(id: string): DynamicRegistration | undefined {
    const existing = this.registrationsById.get(id);
    this.registrationsById.delete(id);
    return existing;
  }

  getAll(): DynamicRegistration[] {
    return Array.from(this.registrationsById.values());
  }

  has(id: string): boolean {
    return this.registrationsById.has(id);
  }

  clear(): void {
    this.registrationsById.clear();
  }
}
