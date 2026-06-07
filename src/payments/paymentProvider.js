import { createPlatformServices } from '../platform/platformServices.js';
import { getRuntimePlatformTarget } from '../platform/runtimeConfig.js';

export const PRODUCTS = [
  {
    id: 'premium_pack',
    entitlement: 'premium',
    type: 'non-consumable',
  },
];

export const paymentProvider = createPlatformServices(getRuntimePlatformTarget()).payments;

export function createPaymentProvider(target) {
  return createPlatformServices(target).payments;
}
