import { createPlatformServices } from '../platform/platformServices.js';

export const authProvider = createPlatformServices('web').auth;

export function createAuthProvider(target) {
  return createPlatformServices(target).auth;
}
