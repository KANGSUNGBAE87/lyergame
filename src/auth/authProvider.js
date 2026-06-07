import { createPlatformServices } from '../platform/platformServices.js';
import { getRuntimePlatformTarget } from '../platform/runtimeConfig.js';

export const authProvider = createPlatformServices(getRuntimePlatformTarget()).auth;

export function createAuthProvider(target) {
  return createPlatformServices(target).auth;
}
