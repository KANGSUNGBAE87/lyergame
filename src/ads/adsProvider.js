import { createPlatformServices } from '../platform/platformServices.js';
export { AD_PLACEMENTS } from './adPlacements.js';

export const adsProvider = createPlatformServices('web').ads;

export function createAdsProvider(target) {
  return createPlatformServices(target).ads;
}
