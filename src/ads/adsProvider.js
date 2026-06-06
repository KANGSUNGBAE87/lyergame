import { createPlatformServices } from '../platform/platformServices.js';

export const adsProvider = createPlatformServices('web').ads;

export function createAdsProvider(target) {
  return createPlatformServices(target).ads;
}
