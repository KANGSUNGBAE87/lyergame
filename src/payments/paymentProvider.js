import { createPlatformServices } from '../platform/platformServices.js';

export const PRODUCTS = [
  {
    id: 'premium_pack',
    entitlement: 'premium',
    type: 'non-consumable',
  },
];

export const paymentProvider = createPlatformServices('web').payments;

export function createPaymentProvider(target) {
  return createPlatformServices(target).payments;
}
