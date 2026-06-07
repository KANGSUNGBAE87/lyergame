import { describe, expect, it } from 'vitest';
import { AD_PLACEMENTS } from '../src/ads/adPlacements.js';
import { adsProvider } from '../src/ads/adsProvider.js';
import { authProvider } from '../src/auth/authProvider.js';
import { paymentProvider, PRODUCTS } from '../src/payments/paymentProvider.js';
import { PLATFORM_TARGETS, createPlatformServices } from '../src/platform/platformServices.js';

describe('platform adapter stubs', () => {
  it('declares web, Apps in Toss, and Google Play targets', () => {
    expect(PLATFORM_TARGETS).toEqual(['web', 'apps-in-toss', 'google-play']);
  });

  it('keeps login unavailable but non-crashing in the web stub', async () => {
    await expect(authProvider.getUser()).resolves.toBeNull();
    await expect(authProvider.login()).resolves.toMatchObject({ ok: false, reason: 'not-configured' });
  });

  it('keeps purchase operations behind a payment provider stub', async () => {
    expect(PRODUCTS).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'premium_pack' }),
    ]));
    await expect(paymentProvider.purchase('premium_pack')).resolves.toMatchObject({ ok: false, reason: 'not-configured' });
  });

  it('keeps ads behind an adapter stub', async () => {
    await expect(adsProvider.showRewarded('round_bonus')).resolves.toMatchObject({ ok: false, reason: 'not-configured' });
    await expect(adsProvider.preloadInterstitial(AD_PLACEMENTS.POST_GAME_INTERSTITIAL)).resolves.toMatchObject({ ok: false, reason: 'not-configured' });
    await expect(adsProvider.requestBanner(AD_PLACEMENTS.HISTORY_BANNER)).resolves.toMatchObject({ ok: false, reason: 'not-configured' });
  });

  it('creates platform-specific service bundles through one boundary', () => {
    const services = createPlatformServices('google-play');
    expect(services.target).toBe('google-play');
    expect(services.auth.kind).toBe('google-play-auth');
    expect(services.payments.kind).toBe('google-play-billing');
    expect(services.ads.kind).toBe('admob');
  });
});
