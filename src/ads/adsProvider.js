import { createPlatformServices } from '../platform/platformServices.js';
import { getRuntimePlatformTarget } from '../platform/runtimeConfig.js';
export { AD_PLACEMENTS } from './adPlacements.js';

export const adsProvider = createPlatformServices(getRuntimePlatformTarget()).ads;

export function createAdsProvider(target) {
  return createPlatformServices(target).ads;
}
